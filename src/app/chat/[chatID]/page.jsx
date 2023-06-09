"use client";

import { Fragment, useEffect, useState } from "react";
import chatStyle from "@/styles/chat.module.css";
import { useAuthContext } from "@/context/AuthContext";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { collection, doc, getFirestore, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import firebase_app from "@/firebase/config";
import getDocument from "@/firebase/firestore/getData";
import Link from "next/link";
import { addData, updateDocData } from "@/firebase/firestore/addData";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import * as commands from "@uiw/react-md-editor/esm/commands";
import "@uiw/react-md-editor/markdown-editor.css";
import remarkGfm from "remark-gfm";
import removeDoc from "@/firebase/firestore/removeData";
import { useRef } from "react";
import { useCallback } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const db = getFirestore(firebase_app);

export default function Page({ params }) {
  const { user } = useAuthContext();
  const [chat, setChat] = useState();
  const [messages, setMessages] = useState([]);
  const [img, setImg] = useState(chat?.about?.image);
  const [newMessage, setNewMessage] = useState("");
  const ref = useCallback(node => {
    if (node !== null) {
      node.scrollIntoView();
      console.log("scrolled into view:" , node)
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "chats", params.chatID), (doc) => {
      setChat(doc.data());
    });

    return () => unsubscribe();
  }, [params.chatID]);

  useEffect(() => {
    const q = query(collection(db, "messages"), where("channel", "==", params.chatID), orderBy("date", "desc"), limit(45));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setMessages((m) => {
          if (m.length === 0) {
            return [{ data: doc.data(), id: doc.id }];
          }
          if (m.some((d) => d.id === doc.id)) {
            var index = m.findIndex((d) => d.id === doc.id);
            var arr = m;
            if (m[index].data.content !== doc.data().content) {
              arr[index].data.content = doc.data().content;
              arr[index].data.previousMessages = doc.data().previousMessages;
              if (m[index].data.type !== doc.data().type) {
                arr[index].data.type = doc.data().type;
                return arr;
              } else {
                return arr;
              }
            }
          }
          return m.some((d) => d.id === doc.id) ? [...m] : [...m, { data: doc.data(), id: doc.id }];
        });
      });
    });

    return () => {
      unsubscribe();
      setMessages([]);
    };
  }, [params.chatID]);

  useEffect(() => {
    if (!chat || chat.about.images || !(chat.users.from || chat.users.to)) return;

    if (chat.users.from === user.uid) {
      getDocument("users", chat.users.to).then((res) => {
        setImg(res.result.images.photoURL);
      });
    } else if (chat.users.to === user.uid) {
      getDocument("users", chat.users.from).then((res) => {
        setImg(res.result.images.photoURL);
      });
    }

    return () => {
      setImg(chat?.about?.image);
    };
  }, [chat, user]);

  const handleNewMessage = () => {
    const date = new Date().toJSON();

    const promise = addData("messages", {
      channel: params.chatID,
      content: newMessage,
      user: user.uid,
      date: date,
    });

    updateDocData("chats", params.chatID, {
      "about.latest": date,
    });

    promise.then((res) => {
      setNewMessage("");
    });

    toast.promise(promise, {
      loading: "Sending Message",
      success: "Sent Message",
      error: "Error Sending Message",
    });
  };

  const handleKeyUp = (e) => {
    if (e.ctrlKey && e.keyCode == 13) {
      e.preventDefault();
      handleNewMessage();
    }
  };

  return (
    <>
      {chat && (
        <>
          <div className={chatStyle.info}>
            <Link href={"/chat/" + params.chatID + "/settings"}>
              {img && <img src={img} alt="" className={chatStyle.chatPicture} />}
              {!img && <span className={chatStyle.icon + " material-symbols-outlined"}>chat</span>}
              <div className={chatStyle.content}>
                <span className={chatStyle.title}>{chat.about.name}</span>
                <span className={chatStyle.subTitle}>Select For Settings</span>
              </div>
            </Link>
          </div>
          {(chat.users.from || chat.users.to) && (
            <div className={chatStyle.messages}>
              <div className={chatStyle.wrapper}>
                <ol>
                  {messages &&
                    messages
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((message, index) => {
                        return (
                          <li key={index} className={message.user === user.uid ? chatStyle.user : chatStyle.otherUser}>
                            <ReactMarkdown
                              className={chatStyle.container}
                              disallowedElements={["h1", "h2", "h3", "h4", "h5", "h6", "code", "table"]}
                              remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </li>
                        );
                      })}
                </ol>
              </div>
              {/* <div id={chatStyle.anchor} /> */}
            </div>
          )}
          {!(chat.users.from || chat.users.to) && (
            <div className={chatStyle.groupMessages}>
              <ol>
                {messages &&
                  messages
                    .sort((a, b) => a.data.date.localeCompare(b.data.date))
                    .map((message, index) => {
                      var messageDate = new Date(message.data.date);
                      var className = message.data.type ? chatStyle[message.data.type] : "";
                      if (
                        messages[index + 1] &&
                        messages[index + 1].data.user === message.data.user &&
                        messages[index + 1].data.type !== "system" &&
                        message.data.type !== "system" &&
                        (new Date(messages[index + 1].data.date) - messageDate) / (1000 * 60 * 60 * 24) < 0.5 &&
                        messageDate.getDate() === new Date(messages[index + 1].data.date).getDate()
                      ) {
                        className = className + " " + chatStyle.before;
                      }
                      if (
                        messages[index - 1] &&
                        messages[index - 1].data.user === message.data.user &&
                        messages[index - 1].data.type !== "system" &&
                        message.data.type !== "system" &&
                        (messageDate - new Date(messages[index - 1].data.date)) / (1000 * 60 * 60 * 24) < 0.5 &&
                        messageDate.getDate() === new Date(messages[index - 1].data.date).getDate()
                      ) {
                        className = className + " " + chatStyle.following;
                      }

                      if (
                        !messages[index - 1] ||
                        messageDate.getDate() !== new Date(messages[index - 1].data.date).getDate() ||
                        messageDate.getMonth() !== new Date(messages[index - 1].data.date).getMonth() ||
                        messageDate.getFullYear() !== new Date(messages[index - 1].data.date).getFullYear()
                      ) {
                        return (
                          <Fragment key={index}>
                            <div className={chatStyle.divider}>
                              <span className={chatStyle.date}>
                                {new Intl.DateTimeFormat("en-US", { month: "long" }).format(messageDate)} {messageDate.getDate()}
                                {messageDate.getFullYear() !== new Date().getFullYear() && <span className="year"> {messageDate.getFullYear()}</span>}
                              </span>
                            </div>
                            <li className={className}>
                              <GroupChatMessage message={message} messages={messages} index={index} currentUser={user} />
                            </li>
                          </Fragment>
                        );
                      }
                      return (
                        <li key={index} className={className}>
                          <GroupChatMessage message={message} messages={messages} index={index} currentUser={user} />
                        </li>
                      );
                    })}
                <div id={chatStyle.anchor} ref={ref} />
              </ol>
            </div>
          )}
          <div className={chatStyle.sender}>
            <MDEditor
              name=""
              id=""
              value={newMessage}
              onChange={setNewMessage}
              commands={[
                commands.bold,
                commands.italic,
                commands.strikethrough,
                commands.divider,
                commands.link,
                commands.quote,
                commands.divider,
                commands.unorderedListCommand,
                commands.orderedListCommand,
                commands.checkedListCommand,
              ]}
              visibleDragbar={false}
              extraCommands={[]}
              preview={"edit"}
              className={chatStyle.editor}
              textareaProps={{
                placeholder: "Send a message",
              }}
              autoFocus={true}
              autoCorrect={"true"}
              onKeyDownCapture={handleKeyUp}
            />
            <button onClick={handleNewMessage} className={chatStyle.send}>
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </>
      )}
    </>
  );
}

function GroupChatMessage(props) {
  const [user, setUser] = useState();
  const [placeholder, setPlaceholder] = useState(false);
  var lastMessageUser = props.messages && props.index - 1 >= 0 ? props.messages[props.index - 1].data.user : "";
  var lastMessageDate = props.messages && props.index - 1 >= 0 ? props.messages[props.index - 1].data.date : "";
  var lastMessageType = props.messages && props.index - 1 >= 0 && props.messages[props.index - 1].data.type ? props.messages[props.index - 1].data.type : "";

  useEffect(() => {
    if (
      !(
        props.message.data.user &&
        props.message.data.type !== "system" &&
        (props.index - 1 < 0 ||
          (props.index - 1 >= 0 && lastMessageUser !== props.message.data.user) ||
          (props.index - 1 >= 0 &&
            lastMessageUser === props.message.data.user &&
            lastMessageType !== "system" &&
            (new Date(props.message.data.date) - new Date(lastMessageDate)) / (1000 * 60 * 60 * 24) >= 0.5) ||
          lastMessageType === "system" ||
          (props.index - 1 >= 0 && new Date(props.message.data.date).getDate() !== new Date(lastMessageDate).getDate()))
      )
    ) {
      return;
    }

    setPlaceholder(true);

    getDocument("users", props.message.data.user).then((res) => {
      setUser(res.result);
    });

    return () => {
      setUser();
      setPlaceholder(false);
    };
  }, [props.message.data.user, props.message.data.date, props.message.data.type, lastMessageUser, lastMessageDate, lastMessageType, props.index]);

  const handleMessageDelete = () => {
    const date = new Date().toJSON();
    const previousMessages = props.message.previousMessages ? props.message.previousMessages : [];
    console.log(previousMessages);

    const promise = updateDocData("messages", props.message.id, {
      content: "Message Deleted",
      type: "system",
      previousMessages: [...previousMessages, { content: props.message.data.content, date: date }],
    }).then((res) => {
      console.log;
    });
  };

  return (
    <>
      {user && (
        <Link href={"/@" + user.about.username} className={chatStyle.left}>
          <img src={user.images.photoURL} alt="" className={chatStyle.profilePicture} />
        </Link>
      )}
      {placeholder && !user && <div className={chatStyle.placeholder} />}
      {!user && (
        <span className={chatStyle.time}>
          {"("}
          {new Intl.DateTimeFormat("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }).format(new Date(props.message.data.date))}
          {")"}
        </span>
      )}
      <div className={chatStyle.right}>
        {user && (
          <div className={chatStyle.top}>
            <Link href={"/@" + user.about.username} className={chatStyle.name}>
              <span className={chatStyle.displayname}>{user.about.displayname}</span>
              <span className={chatStyle.username}>@{user.about.username}</span>
            </Link>
            <span className={chatStyle.time}>
              {"("}
              {new Intl.DateTimeFormat("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }).format(new Date(props.message.data.date))}
              {")"}
            </span>
          </div>
        )}
        {placeholder && !user && <div className={chatStyle.textPlaceholder} />}
        <ReactMarkdown
          disallowedElements={["h1", "h2", "h3", "h4", "h5", "h6"]}
          className={chatStyle.messageContent}
          remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        >
          {props.message.data.content}
        </ReactMarkdown>
      </div>
      {props.message.data.type !== "system" && (
        <div className={chatStyle.controls}>
          <button onClick={() => {}} className={chatStyle.edit}>
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
          {props.currentUser.uid === props.message.data.user && (
            <>
              <button onClick={() => {}} className={chatStyle.edit}>
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button onClick={handleMessageDelete} className={chatStyle.delete}>
                <span className="material-symbols-outlined">delete</span>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

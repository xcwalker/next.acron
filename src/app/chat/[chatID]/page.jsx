'use client'

import { useEffect, useState } from "react";
import chatStyle from "@/styles/chat.module.css"
import { useAuthContext } from "@/context/AuthContext";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { collection, doc, getFirestore, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import firebase_app from "@/firebase/config";
import getDocument from "@/firebase/firestore/getData";
import Link from "next/link";
import { addData } from "@/firebase/firestore/addData";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import * as commands from '@uiw/react-md-editor/esm/commands';
import "@uiw/react-md-editor/markdown-editor.css";


const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);


const db = getFirestore(firebase_app)

export default function Page({ params }) {
    const { user } = useAuthContext()
    const [chat, setChat] = useState();
    const [messages, setMessages] = useState([]);
    const [img, setImg] = useState(chat?.about?.image);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "chats", params.chatID), (doc) => {
            setChat(doc.data());
        });

        return () => unsubscribe();
    }, [params.chatID])

    useEffect(() => {
        const q = query(collection(db, "messages"), where("channel", "==", params.chatID), orderBy("date", "desc"), limit(30));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (!messages.some(e => e.id === doc.id)) {
                    setMessages([...messages, { data: doc.data(), id: doc.id }])
                }
            });
        });

        return () => unsubscribe();
    }, [params.chatID, messages])

    useEffect(() => {
        if (!chat || chat.about.images || !(chat.users.from || chat.users.to)) return

        if (chat.users.from === user.uid) {
            getDocument("users", chat.users.to).then(res => {
                setImg(res.result.images.photoURL);
            })
        } else if (chat.users.to === user.uid) {
            getDocument("users", chat.users.from).then(res => {
                setImg(res.result.images.photoURL);
            })
        }
    }, [chat, user])

    const handleNewMessage = () => {
        const date = new Date().toJSON();

        const promise = addData("messages", {
            channel: params.chatID,
            content: newMessage,
            user: user.uid,
            date: date,
        })

        promise.then(res => {
            setNewMessage("")
        })

        toast.promise(promise, {
            loading: "Sending Message",
            success: "Sent Message",
            error: "Error Sending Message"
        })
    }

    return <>
        {chat && <>
            <div className={chatStyle.info}>
                <Link href={"/chat/" + params.chatID + "/settings"}>
                    {img && <img src={img} alt="" className={chatStyle.chatPicture} />}
                    {!img && <span class={chatStyle.icon + " material-symbols-outlined"}>chat</span>}
                    <div className={chatStyle.content}>
                        <span className={chatStyle.title}>{chat.about.name}</span>
                        <span className={chatStyle.subTitle}>Select For Settings</span>
                    </div>
                </Link>
            </div>
            {(chat.users.from || chat.users.to) && <div className={chatStyle.messages}>
                <div className={chatStyle.wrapper}>
                    <ol>
                        {messages && messages.sort((a, b) => a.date.localeCompare(b.date)).map((message, index) => {
                            return <li key={index} className={message.user === user.uid ? chatStyle.user : chatStyle.otherUser}>
                                <ReactMarkdown className={chatStyle.container} disallowedElements={["h1", "h2", "h3", "h4", "h5", "h6", "code", "table"]}>
                                    {message.content}
                                </ReactMarkdown>
                            </li>
                        })}
                    </ol>
                </div>
                <div id={chatStyle.anchor} />
            </div>}
            {!(chat.users.from || chat.users.to) && <div className={chatStyle.groupMessages}>
                <div className={chatStyle.wrapper}>
                    <ol>
                        {messages && messages.sort((a, b) => a.data.date.localeCompare(b.data.date)).map((message, index) => {
                            var className = "";
                            if (messages[index + 1] && messages[index + 1].data.user === message.data.user) {
                                className = className + " " + chatStyle.before
                            }
                            if (messages[index - 1] && messages[index - 1].data.user === message.data.user) {
                                className = className + " " + chatStyle.following
                            }
                            return <li key={index} className={className}>
                                <GroupChatMessage message={message} messages={messages} index={index} />
                            </li>
                        })}
                    </ol>
                </div>
            </div>}
            <div className={chatStyle.sender}>
                <MDEditor name="" id="" 
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
                  placeholder: "Send a message"
                }}
                />
                <button onClick={handleNewMessage} className={chatStyle.send}>
                    <span className="material-symbols-outlined">send</span>
                </button>
            </div>
        </>}
    </>;
}

function GroupChatMessage(props) {
    const [user, setUser] = useState();

    useEffect(() => {
        getDocument("users", props.message.data.user).then(res => {
            setUser(res.result)
        })

        return () => setUser();
    }, [props.message.data])

    return <>
        {user && <>
            <Link href={"/@" + user.about.username} className={chatStyle.left}>
                {!(props.message.data.user[props.index - 1] && props.message.data.user[props.index - 1].user === props.message.data.user) && <img src={user.images.photoURL} alt="" className={chatStyle.profilePicture} />}
            </Link>
            <div className={chatStyle.right}>
                {!(props.message.data.user[props.index - 1] && props.message.data.user[props.index - 1].user === props.message.data.user) && <Link href={"/@" + user.about.username} className={chatStyle.name}>
                    <span className={chatStyle.displayname}>{user.about.displayname}</span>
                    <span className={chatStyle.username}>@{user.about.username}</span>
                </Link>}
                <ReactMarkdown disallowedElements={["h1", "h2", "h3", "h4", "h5", "h6"]} className={chatStyle.messageContent}>
                    {props.message.data.content}
                </ReactMarkdown>
            </div>
        </>}
    </>
}
'use client'

import { useEffect, useState } from "react";
import chatStyle from "@/styles/chat.module.css"
import { useAuthContext } from "@/context/AuthContext";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import firebase_app from "@/firebase/config";
import getDocument from "@/firebase/firestore/getData";
import Link from "next/link";

const db = getFirestore(firebase_app)

export default function Page({ params }) {
    const { user } = useAuthContext()
    const [chat, setChat] = useState();
    const [img, setImg] = useState(chat?.about?.image);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "chats", params.chatID), (doc) => {
            setChat(doc.data());
        });

        return () => unsubscribe();
    }, [params.chatID])

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
                        {chat.messages && chat.messages.sort((a, b) => a.date.localeCompare(b.date)).map((message, index) => {
                            return <li key={index} className={message.user === user.uid ? chatStyle.user : chatStyle.otherUser}>
                                <ReactMarkdown className={chatStyle.container}>
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
                        {chat.messages && chat.messages.sort((a, b) => a.date.localeCompare(b.date)).map((message, index) => {
                            var className = "";
                            if (chat.messages[index + 1] && chat.messages[index + 1].user === message.user) {
                                className = className + " " + chatStyle.before
                            }
                            if (chat.messages[index - 1] && chat.messages[index - 1].user === message.user) {
                                className = className + " " + chatStyle.following
                            }
                            return <li key={index} className={className}>
                                <GroupChatMessage message={message} messages={chat.messages} index={index} />
                            </li>
                        })}
                    </ol>
                </div>
            </div>}
            <div className={chatStyle.sender}>

            </div>
        </>}
    </>;
}

function GroupChatMessage(props) {
    const [user, setUser] = useState();

    useEffect(() => {
        getDocument("users", props.message.user).then(res => {
            setUser(res.result)
        })

        return () => setUser();
    }, [props.message])

    return <>
        {user && <>
            <Link href={"/@" + user.about.username} className={chatStyle.left}>
                {!(props.messages[props.index - 1] && props.messages[props.index - 1].user === props.message.user) && <img src={user.images.photoURL} alt="" className={chatStyle.profilePicture} />}
            </Link>
            <div className={chatStyle.right}>
                {!(props.messages[props.index - 1] && props.messages[props.index - 1].user === props.message.user) && <Link href={"/@" + user.about.username} className={chatStyle.name}>
                    <span className={chatStyle.displayname}>{user.about.displayname}</span>
                    <span className={chatStyle.username}>(@{user.about.username})</span>
                </Link>}
                <ReactMarkdown disallowedElements={["h1", "h2", "h3", "h4", "h5", "h6"]} className={chatStyle.messageContent}>
                    {props.message.content}
                </ReactMarkdown>
            </div>
        </>}
    </>
}
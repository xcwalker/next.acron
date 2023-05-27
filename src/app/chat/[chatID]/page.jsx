'use client'

import { useEffect, useState } from "react";
import chatStyle from "@/styles/chat.module.css"
import { useAuthContext } from "@/context/AuthContext";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)

export default function Page({ params }) {
    const { user } = useAuthContext()
    const [chat, setChat] = useState();

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "chats", params.chatID), (doc) => {
            setChat(doc.data());
        });

        return () => unsubscribe();
    }, [params.chatID])

    return <>
        {chat && <>
            <div className={chatStyle.info}>
            </div>
            {(chat.users.from || chat.users.to) && <div className={chatStyle.messages}>
                <ol>
                    {chat.messages && chat.messages.sort((a, b) => a.date.localeCompare(b.date)).map((message, index) => {
                        return <li key={index} className={message.user === user.uid ? chatStyle.user : chatStyle.otherUser}>
                            <ReactMarkdown>
                                {message.content}
                            </ReactMarkdown>
                        </li>
                    })}
                </ol>
                <div id={chatStyle.anchor} />
            </div>}
            {!(chat.users.from || chat.users.to) && <div className={chatStyle.group_messages}>
                <ol>
                    {chat.messages && chat.messages.sort((a, b) => a.date.localeCompare(b.date)).map((message, index) => {
                        return <li key={index}>
                            <ReactMarkdown disallowedElements={"h1, h2, h3, h4, h5, h6"}>
                                {message.content}
                            </ReactMarkdown>
                        </li>
                    })}
                </ol>
            </div>}
            <div className={chatStyle.sender}>
            </div>
        </>}
    </>;
}
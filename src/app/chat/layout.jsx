"use client"

import { useAuthContext } from "@/context/AuthContext";
import firebase_app from "@/firebase/config";
import { collection, getFirestore, onSnapshot, or, orderBy, query, where } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react"
import chatStyle from "@/styles/chat.module.css"
import Link from "next/link";
import getDocument from "@/firebase/firestore/getData";

const db = getFirestore(firebase_app)

export const metadata = {
    title: 'Chat | Acron',
    description: 'Chat with people on Acron',
};


export default function UserLayout({ children, params }) {
    const { user } = useAuthContext()
    const [chats, setChats] = useState()
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (!user) return

        const q = query(collection(db, "chats"), or(where("users", "array-contains", user.uid), where("users.from", "==", user.uid), where("users.to", "==", user.uid)), orderBy("about.latest", "desc"));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const chatsTemp = [];
            querySnapshot.forEach((doc) => {
                chatsTemp.push({ data: doc.data(), id: doc.id });
            });
            setChats(chatsTemp)
        });

        return () => unsubscribe();
    }, [user, params])

    return <>
        <section className={chatStyle.chatSection}>
            <div className={chatStyle.container}>
                <div className={chatStyle.sidebar}>
                    <div className={chatStyle.search}>
                        <input type="search" name="" id="chat-search" value={search} placeholder="Search Chats" onChange={(e) => { setSearch(e.target.value) }} />
                        <button className={chatStyle.clear} onClick={() => {
                            if (search !== "") {
                                setSearch("")
                            } else {
                                document.querySelector("#chat-search").focus()
                            }
                        }}>
                            {search !== "" && <span className="material-symbols-outlined">close</span>}
                            {search === "" && <span className="material-symbols-outlined">search</span>}
                        </button>
                    </div>
                    <ul>
                        {chats && chats.map((chat, index) => {
                            var hidden = false;

                            if (search !== "" && !chat.data.about.name.includes(search)) {
                                hidden = true;
                            }
                            return <Fragment key={index}>
                                <ChatItem chat={chat} user={user} hidden={hidden} />
                            </Fragment>
                        })}
                    </ul>
                    <Link href={"/chat/new"} className={chatStyle.new}>New Chat</Link>
                </div>
                <div className={chatStyle.main}>
                    {children}
                </div>
            </div>
        </section>
    </>
}

function ChatItem(props) {
    const [otherUser, setOtherUser] = useState();
    const [otherUserId, setOtherUserId] = useState();
    const [latestChatUsername, setLatestChatUsername] = useState();
    const [img, setImg] = useState(props.chat.data.about?.image);

    useEffect(() => {
        if (props.chat.data.users.from === props.user.uid) {
            setOtherUserId(props.chat.data.users.to);
            getDocument("users", props.chat.data.users.to).then(res => {
                setOtherUser(res.result);

                if (!res.result.about.image) {
                    setImg(res.result.images.photoURL);
                }
            })
        } else if (props.chat.data.users.to === props.user.uid) {
            setOtherUserId(props.chat.data.users.from);
            getDocument("users", props.chat.data.users.from).then(res => {
                setOtherUser(res.result);

                if (!res.result.about.image) {
                    setImg(res.result.images.photoURL);
                }
            })
        }
    }, [props.chat.data.users.from, props.chat.data.users.to, props.chat.data.about.image, props.user])

    useEffect(() => {
        props.chat.data.messages.sort((a, b) => a.date.localeCompare(b.date))

        if (props.chat.data.messages[0].user === otherUserId && otherUser) {
            setLatestChatUsername(otherUser.about.displayname);
        } else if (props.chat.data.messages[0].user === props.user.uid) {
            setLatestChatUsername("You");
        } else {
            getDocument("users", props.chat.data.messages[0].user).then(res => {
                setLatestChatUsername(res.result.about.displayname);
            })
        }
    }, [props.chat.data.messages, otherUser, otherUserId, props.user.uid])


    return <Link href={"/chat/" + props.chat.id} className={props.hidden ? chatStyle.hidden : ""}>
        <div className={chatStyle.left}>
            {img && <img src={img} alt="" className={chatStyle.chatPicture} />}
            {!img && <span class={chatStyle.icon + " material-symbols-outlined"}>chat</span>}
        </div>
        <div className={chatStyle.right}>
            {props.chat.data.about.name !== "" && <span className={chatStyle.title}>{props.chat.data.about.name}</span>}
            {props.chat.data.about.name === "" && otherUser && <span className={chatStyle.title}>{otherUser.about.displayname}</span>}
            {props.chat.data.messages[0] && <div className={chatStyle.latest}>
                {latestChatUsername && <span className={chatStyle.name}>{latestChatUsername}: </span>}
                <p>{props.chat.data.messages[0].content}</p>
            </div>}
        </div>
    </Link>
}
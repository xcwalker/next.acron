import { toTitleCase } from "@/String";
import getDocument, { getDocumentFromSimpleQuery } from "@/firebase/firestore/getData";
import userStyle from "@/styles/user.module.css"
import { CurrentUser } from "./currentUser";
import { UserNavigation } from "./navigation";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Fragment } from "react";

export async function getServerSideProps(params) {
    let userData;

    if (params.userID.startsWith("%40")) {
        await getDocumentFromSimpleQuery("users", {
            fieldPath: "about.username",
            operator: "==",
            value: params.userID.slice(3),
        }).then(res => {
            userData = res.result
        })
    } else {
        await getDocument("users", params.userID).then(res => {
            userData = res.result
        })
    }

    return userData
}

export default async function UserLayout({ children, params }) {
    const userData = await getServerSideProps(params)
    var userID = params.userID
    var userUID = userData.docID;

    if (params.userID.startsWith("%40")) {
        userID = params.userID.slice(3);
    }

    return <>
        <section className={userStyle.userSection}>
            <div className={userStyle.container}>
                <div className={userStyle.sidebar}>
                    <div className={userStyle.user}>
                        <div className={userStyle.banner}>
                            <img src={userData.images.headerURL} alt="" />
                        </div>
                        <div className={userStyle.info}>
                            <div className={userStyle.profilePicture + " " + userStyle[userData.about.status]}>
                                <img src={userData.images.photoURL} alt="" title={"Status: " + toTitleCase(userData.about.status)} />
                            </div>
                            <div className={userStyle.names}>
                                <span className={userStyle.displayname}>{userData.about.displayname}</span>
                                <span className={userStyle.username}>@{userData.about.username}</span>
                            </div>
                        </div>
                    </div>
                    {userData.about.statement && <div className={userStyle.markdown}>
                        <ReactMarkdown className={userStyle.container}>
                            {userData.about.statement}
                        </ReactMarkdown>
                    </div>}
                    {userData.links && userData.links.length > 0 && <div className={userStyle.links}>
                        <ul>
                            {userData.links.map((link, index) => {
                                if (link.includes("https://") || link.includes("http://")) {
                                    return <li key={index}>
                                        <a href={link}>
                                            <img src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + link + "/post&size=24"} alt="" />
                                        </a>
                                    </li>
                                }
                                if (!link.includes("https://") && !link.includes("http://")) {
                                    return <li key={index}>
                                        <a href={"https://" + link}>
                                            <img src={"https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://" + link + "/post&size=24"} alt="" />
                                        </a>
                                    </li>
                                }
                                return <Fragment key={index} />
                            })}
                        </ul>
                    </div>}
                    <CurrentUser userID={userID} userUID={userUID} />
                </div>
                <div className={userStyle.main}>
                    <UserNavigation userID={userID} />
                    <div className={userStyle.container}>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    </>;
}

export async function generateMetadata({ params }) {
    const userData = await getServerSideProps(params)

    return {
        title: userData.about.displayname + " (@" + userData.about.username + ") | Acron",
    };
}
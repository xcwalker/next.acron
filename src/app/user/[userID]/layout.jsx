import { toTitleCase } from "@/String";
import getDocument from "@/firebase/firestore/getData";
import userStyle from "@/styles/user.module.css"
import { CurrentUser } from "./currentUser";
import { UserNavigation } from "./navigation";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export async function getServerSideProps(params) {
    let userData;

    await getDocument("users", params.userID).then(res => {
        userData = res.result
    })

    return userData
}

export default async function UserLayout({ children, params }) {
    const userData = await getServerSideProps(params)
    return <>
        userPage: {params.userID}
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
                    <ReactMarkdown>
                        {userData.about.statement}
                    </ReactMarkdown>
                    <CurrentUser userID={params.userID} />
                </div>
                <div className={userStyle.main}>
                    <UserNavigation userID={params.userID} />
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
        title: userData.about.displayname + " | @" + userData.about.username + " | Acron",
    };
}
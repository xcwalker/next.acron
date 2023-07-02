import style from "@/styles/account.handler.module.css";
import Image from "next/image";

export default function Layout({ children }) {
  return (
    <section className={style.accountHandler}>
      <div className={style.container}>
        {children}
        <Image src="/accountHandler.background.jpeg" fill={true} alt="" />
        <div className={style.info}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z" />
          </svg>
          <a href="https://unsplash.com/@goyache">Juan Goyache</a>
        </div>
      </div>
    </section>
  );
}

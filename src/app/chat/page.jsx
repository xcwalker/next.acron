import chatStyle from "@/styles/chat.module.css"

export const metadata = {
  title: 'Chat | Acron',
  description: 'Chat with people on Acron',
};

export default function Page() {
  return <div className={chatStyle.centre}>
    <span className={chatStyle.text}>Select a chat and let&#39;s get talking.</span>
  </div>;
}
import { useState } from "react";
import styles from "./ChatBox.module.scss";
import axios from "axios";

const ChatBox = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, `🧑 ${input}`]);
    console.log(`🧑 ${input}`);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/chat/botChat",
        {
          message: input,
        }
      );
      const reply = res.data.reply;
      setMessages((prev) => [...prev, `🤖 ${reply}`]);
    } catch (err) {
      setMessages((prev) => [...prev, `❌ Lỗi kết nối`]);
    }

    setInput("");
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          value={input}
          placeholder="Nhập tin nhắn..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Gửi</button>
      </div>
    </div>
  );
};

export default ChatBox;

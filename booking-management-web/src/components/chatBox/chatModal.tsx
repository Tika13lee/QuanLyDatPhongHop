import styles from "./ChatModal.module.scss";
import ChatBox from "./chatBox";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ChatModal = ({ open, onClose }: Props) => {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <h2>💬 Trợ lý đặt phòng</h2>
        <ChatBox />
      </div>
    </div>
  );
};

export default ChatModal;

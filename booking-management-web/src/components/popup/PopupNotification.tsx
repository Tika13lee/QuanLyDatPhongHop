import React from "react";
import classNames from "classnames/bind";
import styles from "./PopupNotification.module.scss";

const cx = classNames.bind(styles);

type PopupNotificationProps = {
  message: string;
  type: "success" | "error" | "info" | "warning";
  isOpen: boolean;
  onClose: () => void;
};

const PopupNotification: React.FC<PopupNotificationProps> = ({
  message,
  type,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className={cx("popup-overlay")}>
      <div className={cx("popup-container", type)}>
        <div className={cx("popup-header")}>
          <h3>Thông báo</h3>
          <button className={cx("close-btn")} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={cx("popup-message")}>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default PopupNotification;

import React, { forwardRef } from "react";
import classNames from "classnames/bind";
import styles from "./NotificationDropdown.module.scss";

const cx = classNames.bind(styles);

type Notification = {
  id: number;
  title: string;
  content: string;
  read: boolean;
};

const dummyNotifications: Notification[] = [
  { id: 1, title: "Thông báo 1", content: "Nội dung thông báo 1", read: false },
  { id: 2, title: "Thông báo 2", content: "Nội dung thông báo 2", read: true },
  { id: 3, title: "Thông báo 3", content: "Nội dung thông báo 3", read: false },
];

const NotificationDropdown = forwardRef<HTMLDivElement>((_props, ref) => {
  NotificationDropdown.displayName = "NotificationDropdown";

  return (
    <div ref={ref} className={cx("dropdown")}>
      <h4 className={cx("header")}>Thông báo</h4>
      <ul className={cx("list")}>
        {dummyNotifications.map((notification) => (
          <li
            key={notification.id}
            className={cx("item", { read: notification.read })}
          >
            <strong>{notification.title}</strong>
            <p>{notification.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default NotificationDropdown;

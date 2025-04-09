import classNames from "classnames/bind";
import styles from "./Notification.module.scss";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

type NotificationDTO = {
  id: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  targetId: number;
  targetType: string;
};

const Notification: React.FC = () => {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);

  useEffect(() => {
    axios
      .get<NotificationDTO[]>(
        `http://localhost:8080/api/v1/notification/getAllNotification?employeeId=${user.employeeId}`
      )
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
      });
  }, []);

  console.log(notifications);

  return (
    <div className={cx("page-container")}>
      <h1 className={cx("page-title")}>🔔 Tất cả thông báo</h1>
      <div className={cx("notification-wrapper")}>
        <ul className={cx("notification-list")}>
          {notifications.map((n) => (
            <li
              key={n.id}
              className={cx("notification-item", {
                read: n.read,
              })}
            >
              <div className={cx("notification-time")}>
                📅 {new Date(n.createdAt).toLocaleString()}
              </div>
              <div className={cx("notification-message")}>{n.message}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Notification;

import { use, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
import UserAvatarWithMenu from "../UserAvatar/UserAvatarWithMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

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

const Navbar = () => {
  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem("currentUser")!);

  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Lấy danh sách thông báo ban đầu
  useEffect(() => {
    if (!user?.employeeId) return;
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

  // Lắng nghe WebSocket khi có thông báo mới
  useEffect(() => {
    if (!user?.employeeId) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000, // Kiểm tra kết nối từ server
      heartbeatOutgoing: 4000, // Ping để giữ kết nối
      debug: (str) => console.log("📡", str),
    });

    stompClient.onConnect = () => {
      console.log("✅ STOMP connected");

      // Subscribe theo employeeId
      stompClient.subscribe(
        `/topic/notifications/${user.employeeId}`,
        (message) => {
          if (message.body) {
            const newNotification: NotificationDTO = JSON.parse(message.body);
            console.log("📩 Nhận thông báo:", newNotification);
            setNotifications((prev) => [newNotification, ...prev]);
          }
        }
      );
    };

    stompClient.onStompError = (frame) => {
      console.error("❌ STOMP error:", frame);
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [user?.employeeId]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cập nhật UI khi nhấn vào chuông thông báo
  const handleBellClick = () => {
    setIsOpen(!isOpen);

    if (!isOpen && unreadCount > 0 && user?.employeeId) {
      // Cập nhật UI đã đọc
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      // Gọi API đánh dấu đã đọc
      axios
        .post("http://localhost:8080/api/v1/notification/markAllAsRead", null, {
          params: { employeeId: user.employeeId },
        })
        .then((res) => {
          if (res.data === 1) {
            console.log("✔️ Đánh dấu tất cả là đã đọc");
          } else {
            console.warn("❌ Đánh dấu thất bại");
          }
        })
        .catch((err) => {
          console.error("Lỗi khi đánh dấu đã đọc:", err);
        });
    }
  };

  return (
    <div className={cx("navbar-container")}>
      <div className={cx("navbar")}>
        <div className={cx("brand")}>
          <p>
            <strong>HỆ THỐNG QUẢN LÝ PHÒNG HỌP TRỰC TUYẾN</strong>
          </p>
        </div>

        <div className={cx("user")}>
          <div ref={bellRef} className={cx("notification")}>
            <button onClick={handleBellClick} className={cx("bell-button")}>
              <Bell className={cx("bell-icon")} />
              {unreadCount > 0 && !isOpen && (
                <span className={cx("badge")}>{unreadCount}</span>
              )}
            </button>

            {isOpen && (
              <div className={cx("dropdown")} ref={dropdownRef}>
                <div className={cx("dropdown-header")}>Thông báo</div>
                <div className={cx("dropdown-list")}>
                  {notifications.length === 0 ? (
                    <div className={cx("empty-message")}>
                      Không có thông báo nào
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cx("notification-item", {
                          read: n.read,
                        })}
                      >
                        {n.message}
                      </div>
                    ))
                  )}
                </div>
                <div className={cx("dropdown-footer")}>
                  <button
                    onClick={() => {
                      navigate("/user/notification");
                      setIsOpen(false);
                    }}
                    className={cx("view-all-button")}
                  >
                    Xem tất cả thông báo →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={cx("divider")} />
          <UserAvatarWithMenu imgUrl={user?.avatar ?? ""} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

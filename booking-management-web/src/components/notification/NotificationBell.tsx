import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface NotificationDTO {
  id: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  targetId: number;
  targetType: string;
}

const NotificationBell = () => {
  const user = useSelector((state: RootState) => state.user);
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;
  // Lấy danh sách thông báo ban đầu
  useEffect(() => {
    axios
      .get<NotificationDTO[]>(
        `http://localhost:8080/api/v1/notification/getAllNotification?employeeId=${user?.employeeId}`
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
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    console.log(user);

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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleBellClick}
        className="relative p-2 rounded-full hover:bg-blue-100 transition"
      >
        <Bell className="w-7 h-7 text-blue-600" />
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg z-10">
          <div className="p-3 font-semibold border-b text-blue-700">
            Thông báo
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                Không có thông báo nào
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-2 text-sm border-b cursor-pointer hover:bg-blue-50 transition ${
                    n.read ? "text-gray-500" : "text-gray-800 font-medium"
                  }`}
                >
                  {n.message}
                </div>
              ))
            )}
          </div>
          <div className="p-2 text-center border-t">
            <button
              onClick={() => navigate("/notifications")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Xem tất cả thông báo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

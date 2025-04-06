import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface NotificationDTO {
  id: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  targetId: number;
  targetType: string;
}

const Notification: React.FC = () => {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const navigate = useNavigate();

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
        🔔 Tất cả thông báo
      </h1>
      <div className="max-w-6xl mx-auto">
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`transition-all duration-300 p-4 rounded-lg cursor-pointer shadow-sm hover:shadow-lg border-l-4 ${
                n.read
                  ? "bg-white border-gray-300 hover:border-gray-400 opacity-70"
                  : "bg-blue-50 border-blue-500 hover:border-blue-600"
              }`}
            >
              <div className="text-base text-gray-500 mb-2">
                📅 {new Date(n.createdAt).toLocaleString()}
              </div>
              <div
                className={`text-xl font-medium ${
                  n.read ? "text-gray-500" : "text-gray-800"
                }`}
              >
                {n.message}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Notification;

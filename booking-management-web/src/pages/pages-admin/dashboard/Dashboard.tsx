import classNames from "classnames/bind";
import styles from "./Dashboard.module.scss";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const cx = classNames.bind(styles);

interface Meeting {
  title: string;
  time: string;
  participants: string[];
  room: string;
}
const meetingStats = [
  { day: "Thứ 2", count: 3 },
  { day: "Thứ 3", count: 5 },
  { day: "Thứ 4", count: 2 },
  { day: "Thứ 5", count: 6 },
  { day: "Thứ 6", count: 4 },
  { day: "Thứ 7", count: 1 },
];

const Dashboard = () => {
  const [meetingsToday, setMeetingsToday] = useState<number>(0);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [popularRoom, setPopularRoom] = useState<string>("");

  useEffect(() => {
    // Mock dữ liệu
    setMeetingsToday(8);
    setActiveUsers(23);
    setPopularRoom("Phòng họp A");

    setUpcomingMeetings([
      {
        title: "Họp dự án Alpha",
        time: "10:30 - 11:30",
        participants: ["Minh", "Anh", "Trang"],
        room: "Phòng họp A",
      },
      {
        title: "Họp phòng Nhân sự",
        time: "14:00 - 15:00",
        participants: ["Loan", "Tú"],
        room: "Phòng họp B",
      },
    ]);
  }, []);

  return (
    <div className={cx("dashboard")}>
      <h1 className={cx("title")}>Bảng điều khiển</h1>
      <div className={cx("stats")}>
        <div className={cx("card")}>
          <h3>Cuộc họp hôm nay</h3>
          <p>{meetingsToday}</p>
        </div>
        <div className={cx("card")}>
          <h3>Người dùng hoạt động</h3>
          <p>{activeUsers}</p>
        </div>
        <div className={cx("card")}>
          <h3>Phòng phổ biến</h3>
          <p>{popularRoom}</p>
        </div>
        <div className={cx("card")}>
          <h3>Phòng phổ biến</h3>
          <p>{popularRoom}</p>
        </div>
        <div className={cx("card")}>
          <h3>Phòng phổ biến</h3>
          <p>{popularRoom}</p>
        </div>
        <div className={cx("card")}>
          <h3>Phòng phổ biến</h3>
          <p>{popularRoom}</p>
        </div>
        <div className={cx("card")}>
          <h3>Phòng phổ biến</h3>
          <p>{popularRoom}</p>
        </div>
        <div className={cx("card")}>
          <h3>Phòng phổ biến</h3>
          <p>{popularRoom}</p>
        </div>
      </div>

      <div className={cx("chartContainer")}>
        <h2>Thống kê cuộc họp trong tuần</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={meetingStats}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0070f3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

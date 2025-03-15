import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Schedule.module.scss";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  differenceInWeeks,
  parseISO,
} from "date-fns";
import { vi } from "date-fns/locale";

const cx = classNames.bind(styles);

// Danh sách sự kiện mẫu
const events = [
  {
    id: 1,
    title: "Họp dự án",
    room: {
      roomName: "Phòng họp 1",
      location: "Tầng 2",
    },
    timeStart: "2025-03-15T08:30:00.000+07:00",
    timeEnd: "2025-03-15T10:00:00.000+07:00",
  },
  {
    id: 2,
    title: "Họp dự án",
    room: {
      roomName: "Phòng họp 1",
      location: "Tầng 2",
    },
    timeStart: "2025-03-15T14:30:00.000+07:00",
    timeEnd: "2025-03-15T16:00:00.000+07:00",
  },
  {
    id: 3,
    title: "Họp dự án",
    room: {
      roomName: "Phòng họp 1",
      location: "Tầng 2",
    },
    timeStart: "2025-03-15T14:30:00.000+07:00",
    timeEnd: "2025-03-15T16:00:00.000+07:00",
  },
  {
    id: 5,
    title: "Họp dự án",
    room: {
      roomName: "Phòng họp 1",
      location: "Tầng 2",
    },
    timeStart: "2025-03-13T14:30:00.000+07:00",
    timeEnd: "2025-03-13T16:00:00.000+07:00",
  },
];

// Chuyển đổi dữ liệu sự kiện
const formattedEvents = events.map((event) => ({
  ...event,
  date: format(parseISO(event.timeStart), "yyyy-MM-dd"),
  time: `${format(parseISO(event.timeStart), "HH:mm")} - ${format(
    parseISO(event.timeEnd),
    "HH:mm"
  )}`,
}));

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  // Cập nhật danh sách ngày trong tuần
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Chuyển tuần
  const changeWeek = (direction: "prev" | "current" | "next") => {
    let newStart;
    if (direction === "prev") {
      newStart = addWeeks(weekStart, -1);
    } else if (direction === "next") {
      newStart = addWeeks(weekStart, 1);
    } else {
      newStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    }
    setWeekStart(newStart);
    setSelectedDate(newStart);
  };

  // Khi chọn ngày từ input
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);

    // Cập nhật `weekStart` để lịch nhảy đến tuần chứa ngày được chọn
    const newWeekStart = startOfWeek(newDate, { weekStartsOn: 1 });
    setWeekStart(newWeekStart);
  };

  return (
    <div className={cx("schedule")}>
      <div className={cx("header")}>
        <h3>Lịch theo tuần</h3>
        {/* Chọn ngày */}
        <div>
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={handleDateChange}
            className={cx("date-picker")}
          />
        </div>
        {/* Nút chuyển tuần */}
        <div className={cx("week-navigation")}>
          <button onClick={() => changeWeek("prev")}>Tuần trước</button>
          <button onClick={() => changeWeek("current")}>Hiện tại</button>
          <button onClick={() => changeWeek("next")}>Tuần sau</button>
        </div>
      </div>

      {/* Hiển thị lịch hàng tuần */}
      <div className={cx("calendar")}>
        {daysOfWeek.map((day, index) => {
          const dayFormatted = format(day, "yyyy-MM-dd");

          // Lọc và sắp xếp sự kiện theo ngày
          const dayEvents = formattedEvents
            .filter((event) => event.date === dayFormatted)
            .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

          return (
            <div key={index} className={cx("day")}>
              <strong>{format(day, "EEEE", { locale: vi })}</strong> <br />
              {format(day, "dd/MM")}
              {/* Hiển thị sự kiện nếu có */}
              {dayEvents.length > 0 && (
                <ul className={cx("event-list")}>
                  {dayEvents.map((event) => (
                    <li key={event.id} className={cx("event-item")}>
                      <small>{event.time}</small> <br />
                      {event.title} <br />
                      {event.room.roomName} <br />
                      {event.room.location}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;

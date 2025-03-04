import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./WeeklySchedule.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const cx = classNames.bind(styles);

const daysOfWeek = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

const WeeklySchedule = () => {
  const roomDetail = useSelector((state: RootState) => state.room.selectedRoom);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // hàm tạo mảng thời gian
  const timeSlots = Array.from({ length: 23 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${String(hour).padStart(2, "0")}:${minute}`;
  });

  // Hàm chuyển đổi tuần
  const changeWeek = (direction: "previous" | "next") => {
    const currentDate = new Date(selectedDate);
    if (direction === "previous") {
      currentDate.setDate(currentDate.getDate() - 7); // Lùi về tuần trước
    } else {
      currentDate.setDate(currentDate.getDate() + 7); // Tiến lên tuần sau
    }
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  // Tính toán ngày của từng thứ dựa trên selectedDate
  const getWeekDates = (dateStr: string) => {
    const selected = new Date(dateStr);
    const startOfWeek = new Date(selected);
    startOfWeek.setDate(selected.getDate() - ((selected.getDay() + 6) % 7));

    return daysOfWeek.map((_, index) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + index);
      return currentDate.toISOString().split("T")[0];
    });
  };

  const weekDates = getWeekDates(selectedDate);

  // Chuyển đổi từ yyyy-mm-dd sang dd/mm/yyyy
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  if (!roomDetail) return <p>Không có dữ liệu lịch đặt phòng</p>;

  return (
    <div className={cx("scheduleContainer")}>
      <div className={cx("header")}>
        <h2>Lịch đặt phòng theo tuần</h2>

        {/* Chọn ngày */}
        <div className={cx("filterContainer")}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={cx("datePicker")}
          />
        </div>

        {/* Nút điều hướng */}
        <div className={cx("actionButtons")}>
          <button
            onClick={() =>
              setSelectedDate(new Date().toISOString().split("T")[0])
            }
          >
            Hiện tại
          </button>
          <button onClick={() => changeWeek("previous")}>Trở về</button>
          <button onClick={() => changeWeek("next")}>Tiếp</button>
        </div>
      </div>

      {/* Bảng lịch */}
      <div className={cx("tableWrapper")}>
        <div className={cx("tableContainer")}>
          <table className={cx("scheduleTable")}>
            <thead>
              <tr>
                <th>Giờ</th>
                {daysOfWeek.map((day, index) => (
                  <th key={index}>
                    {day}
                    <br />
                    <span className={cx("date")}>
                      {formatDate(weekDates[index])}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {timeSlots.map((time, index) => (
                <tr key={index}>
                  <td className={cx("timeColumn")}>{time}</td>
                  {daysOfWeek.map((day, i) => {
                    const bookedSchedule = roomDetail.schedules.find(
                      (schedule) =>
                        schedule.date === weekDates[i] &&
                        schedule.timeStart <= time &&
                        schedule.timeEnd > time
                    );

                    const isStartTime = bookedSchedule?.timeStart === time;

                    return (
                      <td
                        key={i}
                        className={cx("schedule-cell", {
                          booked: !!bookedSchedule,
                        })}
                        colSpan={isStartTime ? 1 : 0}
                      >
                        {isStartTime ? (
                          <div className={cx("booked-title")}>
                            {bookedSchedule.title}
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;

import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./WeeklySchedule.module.scss";

const cx = classNames.bind(styles);

const WeeklySchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>("2024-05-09");
  const [selectedType, setSelectedType] = useState<number>(0);

  const timeSlots = Array.from({ length: 11 }, (_, i) => `${7 + i}:00`);
  const daysOfWeek = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  return (
    <div className={cx("scheduleContainer")}>
      {/* Tiêu đề */}
      <div className={cx("header")}>
        <h2>Lịch đặt phòng theo tuần</h2>

        <div className={cx("filterContainer")}>
          {/* Chọn ngày */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={cx("datePicker")}
          />
        </div>
        
        {/* Nút điều hướng */}
        <div className={cx("actionButtons")}>
          <button onClick={() => setSelectedDate("2024-05-09")}>
            Hiện tại
          </button>
          <button>Trở về</button>
          <button>Tiếp</button>
        </div>
      </div>

      {/* Bảng lịch theo tuần */}
      <div className={cx("tableWrapper")}>
        <div className={cx("tableContainer")}>
          <table className={cx("scheduleTable")}>
            <thead>
              <tr>
                <th>Giờ</th>
                {daysOfWeek.map((day, index) => (
                  <th key={index}>{day}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {timeSlots.map((time, index) => (
                <tr key={index}>
                  <td className={cx("timeColumn")}>{time}</td>
                  {daysOfWeek.map((_, i) => (
                    <td key={i}></td>
                  ))}
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

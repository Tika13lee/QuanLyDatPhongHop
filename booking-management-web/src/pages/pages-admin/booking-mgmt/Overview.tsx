import classNames from "classnames/bind";
import styles from "./Overview.module.scss";

const cx = classNames.bind(styles);

const rooms = [
  "Phòng A",
  "Phòng B",
  "Phòng C",
  "Phòng D",
  "Phòng D",
  "Phòng D",
  "Phòng D",
  "Phòng D",
  "Phòng D",
  "Phòng L",
  "Phòng D",
  "Phòng D",
  "Phòng D",
  "Phòng D",
];
const times = Array.from({ length: 21 }, (_, i) => {
  const hour = Math.floor((480 + i * 30) / 60);
  const minute = (480 + i * 30) % 60;
  return `${hour}:${minute.toString().padStart(2, "0")}`;
});

function Overview() {
  return (
    <div className={cx("overview-container")}>
      <div className={cx("header-container")}>
        <h2>Lịch đặt phòng trong 1 ngày</h2>

        {/* Chọn ngày */}
        <div className={cx("filterContainer")}>
          <input type="date" className={cx("datePicker")} />
        </div>

        {/* Nút điều hướng */}
        <div className={cx("actionButtons")}>
          <button>Hiện tại</button>
          <button>Trở về</button>
          <button>Tiếp</button>
        </div>
      </div>
      <div className={cx("schedule-container")}>
        <table className={cx("schedule-table")}>
          <thead>
            <tr>
              <th>Thời gian</th>
              {rooms.map((room) => (
                <th key={room}>{room}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr key={time}>
                <td className={cx("time-cell")}>{time}</td>
                {rooms.map((room) => (
                  <td key={`${room}-${time}`} className={cx("cell")}></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Overview;

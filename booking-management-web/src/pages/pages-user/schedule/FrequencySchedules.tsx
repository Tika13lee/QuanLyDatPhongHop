import classNames from "classnames/bind";
import styles from "./FrequencySchedules.module.scss";
import IconWrapper from "../../../components/icons/IconWrapper";
import { FiRefreshCw } from "../../../components/icons/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { RequestFormProps } from "../../../data/data";
import { formatDate } from "react-datepicker/dist/date_utils";
import {
  formatDateDate,
  formatDateString,
  getHourMinute,
} from "../../../utilities";

const cx = classNames.bind(styles);

function FrequencySchedules() {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");
  const [eventsByDay, setEventsByDay] = useState<RequestFormProps[]>([]);

  // Lấy ds requestForm
  useEffect(() => {
    axios
      .get<RequestFormProps[]>(
        `http://localhost:8080/api/v1/requestForm/getRequestFormByBookerId?bookerId=${user.employeeId}`
      )
      .then((res) => {
        const filteredData = res.data.filter(
          (item) => item.typeRequestForm === "RESERVATION_RECURRING"
        );
        setEventsByDay(filteredData);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
      });
  }, []);

  console.log("eventsByDay:", eventsByDay);

  return (
    <div className={cx("frequency-schedules")}>
      <div className={cx("filter-bar")}>
        <div className={cx("filter-month")}>
          {/* tháng */}
          <label>Chọn tháng:</label>
          <select>
            <option value={0}>Tất cả</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        </div>
        {/* ngày */}
        <div className={cx("filter-date")}>
          <label>Chọn ngày:</label>
          <input type="date" />
        </div>
        {/* tên phòng */}
        <div className={cx("filter-room")}>
          <label>Chọn phòng:</label>
          <select>
            <option value="all">Tất cả</option>
            <option value="1">Phòng 1</option>
            <option value="2">Phòng 2</option>
            <option value="3">Phòng 3</option>
          </select>
        </div>
        <div className={cx("refresh-btn")}>
          <IconWrapper icon={FiRefreshCw} color="#000" size={24} />
        </div>
      </div>

      <div className={cx("schedule-list")}>
        {eventsByDay.map((event, index) => (
          <div className={cx("event-item")} key={index}>
            <div className={cx("event-info")}>
              <div className={cx("event-time")}>
                <span style={{ color: "red" }}>●</span>{" "}
                {getHourMinute(event.reservations[0].timeStart)} -{" "}
                {getHourMinute(event.reservations[0].timeEnd)}{" "}
                {""}
                <span className={cx("event-repeat")}>
                  ⏰{formatDateString(event.reservations[0].timeStart)} đến{" "}
                  {formatDateString(
                    event.reservations[event.reservations.length - 1].timeStart
                  )}
                </span>
              </div>
              <div className={cx("event-title")}>
                {event.reservations[0].title}
              </div>
            </div>

            <div className={cx("event-info")}>
              <div className={cx("event-room")}>
                Phòng {""}
                {event.reservations[0].room.roomName}
              </div>
              <div className={cx("event-location")}>
                {event.reservations[0].room.location.building.branch.branchName}{" "}
                {event.reservations[0].room.location.building.buildingName}-{" "}
                {event.reservations[0].room.location.floor}
              </div>
            </div>

            <div className={cx("event-participants")}>
              {event.reservations[0].attendants.slice(0, 5).map((avatar, i) => (
                <img
                  key={i}
                  src={avatar.avatar}
                  alt="avatar"
                  className={cx("avatar")}
                />
              ))}
              {event.reservations[0].attendants.length > 5 && (
                <span className={cx("more-participants")}>
                  +{event.reservations[0].attendants.length - 5}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FrequencySchedules;

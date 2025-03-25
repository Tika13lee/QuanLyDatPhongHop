// ScheduleList.tsx
import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./ScheduleList.module.scss";
import { format } from "date-fns";
import axios from "axios";
import IconWrapper from "../../../components/icons/IconWrapper";
import { FiRefreshCw } from "react-icons/fi";

const cx = classNames.bind(styles);

type Attendant = {
  employeeName: string;
  avatar: string;
};

type Reservation = {
  reservationId: number;
  title: string;
  timeStart: string;
  timeEnd: string;
  room: {
    roomName: string;
    location: {
      floor: string;
      building: {
        buildingName: string;
        branch: {
          branchName: string;
        };
      };
    };
  };
  attendants: Attendant[];
  [key: string]: any;
};

type RequestForm = {
  requestFormId: number;
  timeRequest: string;
  timeResponse: string | null;
  statusRequestForm: string;
  reasonReject: string | null;
  typeRequestForm: string | null;
  reservations: Reservation[];
  requestReservation?: unknown;
};

type EventItem = {
  requestFormId: number;
  time: string;
  title: string;
  room: string;
  location: string;
  participants: string[];
};

type DayEvents = {
  date: string;
  events: EventItem[];
};

// chuyển đổi dữ liệu ban đầu thành nhóm theo ngày bắt đầu họp
const transformData = (rawData: RequestForm[]): DayEvents[] => {
  const dayMap: Record<string, EventItem[]> = {};

  rawData.forEach((form) => {
    const firstRes = form.reservations[0];
    if (!firstRes) return;

    const date = format(new Date(firstRes.timeStart), "yyyy-MM-dd");

    const eventItem: EventItem = {
      requestFormId: form.requestFormId,
      title: firstRes.title,
      time: `${format(new Date(firstRes.timeStart), "HH:mm")} - ${format(
        new Date(firstRes.timeEnd),
        "HH:mm"
      )}`,
      room: `Phòng ${firstRes.room?.roomName}` || "Không rõ",
      location: `${firstRes.room?.location.building?.branch?.branchName} Tòa ${
        firstRes.room?.location?.building?.buildingName || ""
      } - Tầng ${firstRes.room?.location?.floor || ""}`,
      participants: firstRes.attendants.map((a) => a.avatar),
    };
    if (!dayMap[date]) dayMap[date] = [];
    dayMap[date].push(eventItem);
  });

  return Object.entries(dayMap)
    .map(([date, events]) => ({ date, events }))
    .sort((a, b) => b.date.localeCompare(a.date));
};

const ScheduleList = () => {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  const [eventsByDay, setEventsByDay] = useState<DayEvents[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);

  // Lấy ds requestForm
  useEffect(() => {
    axios
      .get<RequestForm[]>(
        `http://localhost:8080/api/v1/requestForm/getRequestFormByBookerId?bookerId=${user.employeeId}`
      )
      .then((res) => {
        const filteredData = res.data.filter(
          (item) => item.typeRequestForm !== "UPDATE_RESERVATION"
        );

        const transformed = transformData(filteredData);
        setEventsByDay(transformed);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
      });
  }, []);

  // Hàm mở rộng hoặc thu gọn ngày
  const toggleDay = (date: string) => {
    setExpandedDays((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  // Hàm xem chi tiết
  const handleViewDetail = (requestFormId: number) => {
    console.log("Xem chi tiết requestFormId:", requestFormId);
  };

  const filteredEvents =
    selectedMonth === 0
      ? eventsByDay
      : eventsByDay.filter(
          (day) => new Date(day.date).getMonth() + 1 === selectedMonth
        );

  return (
    <div className={cx("schedule-list")}>
      <div className={cx("filter-bar")}>
        <div className={cx("filter-month")}>
          {/* tháng */}
          <label>Chọn tháng:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
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
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
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

      <div className={cx("schedule-content")}>
        {eventsByDay.map((day, index) => {
          const isExpanded = expandedDays.includes(day.date);
          return (
            <div className={cx("day-card")} key={index}>
              <div
                className={cx("day-header", { expanded: isExpanded })}
                onClick={() => toggleDay(day.date)}
              >
                <span>
                  {day.date === selectedDate ? "Hôm nay - " : ""}
                  {format(new Date(day.date), "dd/MM/yyyy")}
                </span>
                <span className={cx("toggle-icon")}>
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>

              {isExpanded &&
                day.events.map((event, index2) => (
                  <div
                    className={cx("event-item")}
                    key={index2}
                    onClick={() => handleViewDetail(event.requestFormId)}
                  >
                    <div className={cx("event-info")}>
                      <div className={cx("event-time")}>
                        <span style={{ color: "red" }}>●</span> {event.time}
                      </div>
                      <div className={cx("event-title")}>{event.title}</div>
                    </div>
                    <div className={cx("event-info")}>
                      <div className={cx("event-room")}>{event.room}</div>
                      <div className={cx("event-location")}>
                        {event.location}
                      </div>
                    </div>
                    <div className={cx("event-participants")}>
                      {event.participants.slice(0, 5).map((avatar, i) => (
                        <img
                          key={i}
                          src={avatar}
                          alt="avatar"
                          className={cx("avatar")}
                        />
                      ))}
                      {event.participants.length > 5 && (
                        <span className={cx("more-participants")}>
                          +{event.participants.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleList;

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
import useFetch from "../../../hooks/useFetch";
import { ReservationDetailProps } from "../../../data/data";
import { formatCurrencyVND } from "../../../utilities";

const cx = classNames.bind(styles);

const Schedule = () => {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedSchedule, setSelectedSchedule] =
    useState<ReservationDetailProps | null>(null);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
  // Cập nhật danh sách ngày trong tuần
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Lấy danh sách lịch đặt phòng theo tuần
  const {
    data: reservations,
    loading,
    error,
  } = useFetch<ReservationDetailProps[]>(
    `http://localhost:8080/api/v1/reservation/getAllReservationByBooker?phone=${
      user.phone
    }&dayStart=${new Date(daysOfWeek[0]).toISOString()}&dayEnd=${new Date(
      daysOfWeek[6]
    ).toISOString()}`
  );

  // Chuyển đổi dữ liệu lịch để hiển thị
  const formattedEvents = reservations?.map((event) => ({
    ...event,
    date: format(parseISO(event.timeStart), "yyyy-MM-dd"),
    time: `${format(parseISO(event.timeStart), "HH:mm")} - ${format(
      parseISO(event.timeEnd),
      "HH:mm"
    )}`,
  }));

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

  // Xử lý sự kiện chọn ngày
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    const newWeekStart = startOfWeek(newDate, { weekStartsOn: 1 });
    setWeekStart(newWeekStart);
  };

  // xử lý đóng mở modal chi tiết
  const handleOpenDetail = (reservation: ReservationDetailProps) => {
    setSelectedSchedule(reservation);
    setIsModalOpenDetail(true);
    console.log(reservation);
  };
  const handleCloseDetail = () => {
    setSelectedSchedule(null);
    setIsModalOpenDetail(false);
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
          <button onClick={() => changeWeek("current")}>Hiện tại</button>
          <button onClick={() => changeWeek("prev")}>Tuần trước</button>
          <button onClick={() => changeWeek("next")}>Tuần sau</button>
        </div>
      </div>

      {/* Hiển thị lịch hàng tuần */}
      <div className={cx("calendar")}>
        <table className={cx("week-table")}>
          <thead>
            <tr>
              <th></th>
              {daysOfWeek.map((day, index) => (
                <th key={index} className={cx("day")}>
                  {format(day, "EEEE", { locale: vi })} <br />
                  {format(day, "dd/MM")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Hàng buổi sáng */}
            <tr>
              <td className={cx("time-label")}>🌅 Sáng</td>
              {daysOfWeek.map((day, index) => {
                const dayFormatted = format(day, "yyyy-MM-dd");

                // sắp xếp theo thời gian bắt đầu
                const dayEvents = (formattedEvents ?? [])
                  .filter((event) => event.date === dayFormatted)
                  .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

                // Lọc sự kiện buổi sáng
                const morningEvents = dayEvents.filter((event) => {
                  const hour = parseInt(event.time.split(":")[0], 10);
                  return hour < 12;
                });

                return (
                  <td key={index} style={{ verticalAlign: "top" }}>
                    {morningEvents.map((event) => (
                      <div
                        className={cx("event-item")}
                        key={event.reservationId}
                        onClick={() => handleOpenDetail(event)}
                      >
                        <small>{event.time}</small> <br />
                        {event.title} <br />
                        <small>Phòng {event.room.roomName} </small> <br />
                        <small>
                          Tầng {event.room.location.floor} - Tòa{" "}
                          {event.room.location.building.buildingName}
                        </small>
                        <br />
                        <small>
                          {event.room.location.building.branch.branchName}
                        </small>
                        <br />
                        <small className={cx("status")}>
                          {event.statusReservation === "PENDING" &&
                            "Đang chờ phê duyệt"}
                          {event.statusReservation === "CHECKED_IN" &&
                            "Đã nhận phòng"}
                          {event.statusReservation === "COMPLETED" &&
                            "Hoàn thành"}
                        </small>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>

            {/* Hàng buổi chiều */}
            <tr>
              <td className={cx("time-label")}>🌇 Chiều</td>
              {daysOfWeek.map((day, index) => {
                const dayFormatted = format(day, "yyyy-MM-dd");

                const dayEvents = (formattedEvents ?? [])
                  .filter((event) => event.date === dayFormatted)
                  .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

                const afternoonEvents = dayEvents.filter((event) => {
                  const hour = parseInt(event.time.split(":")[0], 10);
                  return hour >= 12;
                });

                return (
                  <td key={index} style={{ verticalAlign: "top" }}>
                    {afternoonEvents.map((event) => (
                      <div
                        key={event.reservationId}
                        className={cx("event-item")}
                        onClick={() => handleOpenDetail(event)}
                      >
                        <small>{event.time}</small> <br />
                        {event.title} <br />
                        <small>Phòng {event.room.roomName} </small> <br />
                        <small>
                          Tầng {event.room.location.floor} - Tòa{" "}
                          {event.room.location.building.buildingName}
                        </small>
                        <br />
                        <small>
                          {event.room.location.building.branch.branchName}
                        </small>
                        <br />
                        <small className={cx("status")}>
                          {event.statusReservation === "PENDING" &&
                            "Đang chờ phê duyệt"}
                          {event.statusReservation === "CHECKED_IN" &&
                            "Đã nhận phòng"}
                          {event.statusReservation === "COMPLETED" &&
                            "Hoàn thành"}
                        </small>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* modal xem chi tiết */}
      {isModalOpenDetail && selectedSchedule && (
        <div className={cx("modal-overlay")}>
          <div className={cx("modal")}>
            <button className={cx("close-btn")} onClick={handleCloseDetail}>
              ✖
            </button>
            <h3>Chi tiết lịch</h3>

            <div className={cx("modal-content")}>
              <div className={cx("info-left")}>
                <p>
                  <strong>Tiêu đề:</strong> {selectedSchedule.title}
                </p>
                <p>
                  <strong>Mô tả:</strong> {selectedSchedule.description}
                </p>
                <p>
                  <strong>Ghi chú:</strong> {selectedSchedule.note}
                </p>
                <p>
                  <strong>Thời gian:</strong> {selectedSchedule.time}
                </p>
                <div className={cx("info-row")}>
                  <p>
                    <strong>Phòng:</strong> {selectedSchedule.room.roomName}
                  </p>
                  <p>
                    <strong>Sức chứa:</strong> {selectedSchedule.room.capacity}
                  </p>
                  <p>
                    <strong>Loại phòng:</strong>{" "}
                    {selectedSchedule.room.typeRoom === "VIP"
                      ? "VIP"
                      : selectedSchedule.room.typeRoom === "DEFAULT"
                      ? "Mặc định"
                      : "Hội nghị"}
                  </p>
                </div>
                <p>
                  <strong>Vị trí:</strong> Tầng{" "}
                  {selectedSchedule.room.location.floor} - tòa {""}
                  {selectedSchedule.room.location.building.buildingName} - chi
                  nhánh{" "}
                  {selectedSchedule.room.location.building.branch.branchName}
                </p>
                <p>
                  <strong>Thời gian nhận phòng:</strong>{" "}
                  {selectedSchedule.timeCheckIn ?? "Chưa nhận phòng"}
                </p>
                <p>
                  <strong>Thời gian trả phòng:</strong>{" "}
                  {selectedSchedule.timeCheckOut ?? "Chưa trả phòng"}
                </p>
                <p>
                  <strong>Thời gian hủy:</strong>{" "}
                  {selectedSchedule.timeCancel ?? "Không có"}
                </p>
                <p>
                  <strong>Chi phí:</strong>{" "}
                  {formatCurrencyVND(selectedSchedule.total)} VNĐ
                </p>
              </div>

              <div className={cx("info-right")}>
                <ul className={cx("container-list")}>
                  <strong>Tài liệu</strong>
                  {selectedSchedule.filePaths.map((file, index) => (
                    <li key={index}>
                      <a href={file} target="_blank" rel="noreferrer">
                        {file}
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className={cx("container-list")}>
                  <strong>Dịch vụ</strong>
                  {selectedSchedule.services?.map((service) => (
                    <li key={service.serviceId}>
                      {service.serviceName} -{" "}
                      {formatCurrencyVND(service.price.value)} VNĐ
                    </li>
                  ))}
                </ul>
                <ul className={cx("container-list")}>
                  <strong>Người tham gia</strong>
                  {selectedSchedule.attendants?.map((p) => (
                    <li key={p.employeeId}>
                      <div className={cx("info-row")}>
                        <p>{p.employeeName}</p>
                        <p>{p.phone}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;

import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./WeeklySchedule.module.scss";
import { toast, ToastContainer } from "react-toastify";
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

const WeeklySchedule = ({ roomId }: { roomId?: string }) => {
  const roomDetail = useSelector((state: RootState) => state.room.selectedRoom);

  console.log(roomDetail);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const reservations = roomDetail?.reservationDTOS || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);

  const handleCellClick = (date: string, time: string) => {
    const today = new Date().toISOString().split("T")[0];

    if (date < today) {
      toast.warning("Bạn không thể đặt lịch cho ngày trong quá khứ!");
      return;
    }
    setSelectedSlot({ date, time });
    setIsModalOpen(true);
  };

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
      currentDate.setDate(currentDate.getDate() - 7);
    } else {
      currentDate.setDate(currentDate.getDate() + 7);
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

  // Hàm chuyển đổi từ định dạng ISO thành giờ và phút
  const formatTime = (isoString: string) => {
    const time = new Date(isoString);
    return `${String(time.getHours()).padStart(2, "0")}:${String(
      time.getMinutes()
    ).padStart(2, "0")}`;
  };

  return (
    <div className={cx("scheduleContainer")}>
      <ToastContainer />
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
                    const bookedSchedule = reservations?.find((reservation) => {
                      // Tách thời gian giờ và phút từ timeStart và timeEnd
                      const startTime = formatTime(reservation.timeStart);
                      const endTime = formatTime(reservation.timeEnd);

                      // So sánh thời gian với thời gian trong bảng
                      return (
                        reservation.timeStart.split("T")[0] === weekDates[i] &&
                        startTime <= time &&
                        endTime > time
                      );
                    });

                    console.log(bookedSchedule?.timeStart);

                    return (
                      <td
                        key={i}
                        className={cx("schedule-cell", {
                          booked: !!bookedSchedule,
                        })}
                        onClick={() => {
                          if (bookedSchedule) {
                            toast.warning("Khung giờ này đã được đặt!");
                          } else {
                            handleCellClick(weekDates[i], time);
                          }
                        }}
                      >
                        {bookedSchedule ? (
                          <div className={cx("booked-title")}>
                            {bookedSchedule?.title}
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

          {/* Modal */}
          {isModalOpen && selectedSlot && (
            <div className={cx("modal-overlay")}>
              <div className={cx("modal")}>
                <button
                  className={cx("close-btn")}
                  onClick={() => setIsModalOpen(false)}
                >
                  ✖
                </button>
                <h3>Đặt lịch phòng "{roomDetail?.roomName}"</h3>

                <div className={cx("form-row")}>
                  {/* chọn ngày */}
                  <div className={cx("form-group")}>
                    <label>Ngày</label>
                    <input
                      type="date"
                      value={selectedSlot?.date || ""}
                      onChange={(e) =>
                        setSelectedSlot((prev) => ({
                          ...prev!,
                          date: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {/* bắt đầu */}
                  <div className={cx("form-group")}>
                    <label>Giờ bắt đầu</label>
                    <select
                      value={selectedSlot?.time || ""}
                      onChange={(e) =>
                        setSelectedSlot((prev) => ({
                          ...prev!,
                          time: e.target.value,
                        }))
                      }
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* kết thúc */}
                  <div className={cx("form-group")}>
                    <label>Giờ kết thúc</label>
                    <select>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tiêu đề cuộc họp */}
                <div className={cx("form-group")}>
                  <label>Tiêu đề</label>
                  <input type="text" placeholder="Nhập tiêu đề cuộc họp" />
                </div>

                {/* Ghi chú */}
                <div className={cx("form-group")}>
                  <label>Ghi chú</label>
                  <input type="text" placeholder="Nhập ghi chú" />
                </div>

                {/* Mô tả */}
                <div className={cx("form-group")}>
                  <label>Mô tả</label>
                  <input type="text" placeholder="Nhập mô tả" />
                </div>

                <div className={cx("form-row")}>
                  {/* Chọn tần suất */}
                  <div className={cx("form-group")}>
                    <label>Tần suất</label>
                    <select>
                      <option value="none">Không lặp lại</option>
                      <option value="daily">Mỗi ngày</option>
                      <option value="weekly">Mỗi tuần</option>
                    </select>
                  </div>

                  {/* Chọn dịch vụ */}
                  <div className={cx("form-group")}>
                    <label>Dịch vụ</label>
                    <div className={cx("checkbox-group")}>
                      <select>
                        <option value="none">Không chọn</option>
                        <option value="coffee">Cà phê</option>
                        <option value="tea">Trà</option>
                        <option value="water">Nước</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Người tham gia */}
                <div className={cx("form-group")}>
                  <label>Người tham gia</label>
                  <input type="text" placeholder="Nhập email người tham gia" />
                </div>

                {/* Nút gửi phê duyệt */}
                <button className={cx("submit-btn")}>Gửi phê duyệt</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;

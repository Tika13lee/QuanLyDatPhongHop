import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./WeeklySchedule.module.scss";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { RoomProps } from "../../data/data";
import PopupNotification from "../popup/PopupNotification";
import { times, validateBookingTime } from "../../utilities";
import ModalBooking from "../Modal/ModalBooking";

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

type typeMessage = "error" | "success" | "info" | "warning";

type typeInfoPopup = {
  message: string;
  type: typeMessage;
  close: boolean;
};

const WeeklySchedule = ({ roomId }: { roomId?: string }) => {
  const roomRedux = useSelector((state: RootState) => state.room.selectedRoom);
  const [roomDetail, setRoomDetail] = useState<RoomProps | null>(null);
  const reservations = roomDetail?.reservationDTOS || [];

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);

  // thông báo popup
  const [infoPopup, setInfoPopup] = useState<typeInfoPopup>({
    message: "",
    type: "success",
    close: false,
  });

  // xử lý mở popup
  const handleOpenPopup = (
    message: string,
    type: typeMessage,
    close: boolean
  ) => {
    setInfoPopup({ message, type, close: true });
  };

  useEffect(() => {
    setRoomDetail(roomRedux);
  }, [roomRedux]);

  // lấy danh sách mới sau khi đã phê duyệt thành công
  useEffect(() => {
    console.log(roomDetail?.roomId);
    if (infoPopup.close === true && roomDetail?.roomId) {
      console.log("reload");
      fetch(
        `http://localhost:8080/api/v1/room/getRoomById?roomId=${roomDetail.roomId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setRoomDetail(data);
        })
        .catch((error) =>
          console.error("Lỗi khi reload dữ liệu phòng:", error)
        );
    }
  }, [infoPopup.close]);

  // xử lý khi click vào ô
  const handleCellClick = (date: string, time: string) => {
    console.log(date, time);

    const isValidTime = validateBookingTime(date, time, toast.warning);
    if (!isValidTime) return;
    setSelectedSlot({ date, time });
    setIsModalOpen(true);
  };

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

  // đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
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
              {(() => {
                const skipMap: { [day: string]: { [time: string]: boolean } } =
                  {};

                return times
                  .filter((time) => time <= "17:30")
                  .map((time, index) => (
                    <tr key={index}>
                      <td className={cx("timeColumn")}>{time}</td>

                      {daysOfWeek.map((day, i) => {
                        const dayKey = weekDates[i]; // ví dụ: "2025-04-13"
                        if (!skipMap[dayKey]) skipMap[dayKey] = {};
                        if (skipMap[dayKey][time]) return null;

                        const bookedSchedule = reservations?.find(
                          (reservation) => {
                            const startTime = formatTime(reservation.timeStart);
                            return (
                              reservation.timeStart.split("T")[0] === dayKey &&
                              startTime === time
                            );
                          }
                        );

                        if (bookedSchedule) {
                          const startTime = formatTime(
                            bookedSchedule.timeStart
                          );
                          const endTime = formatTime(bookedSchedule.timeEnd);
                          const startIndex = times.indexOf(startTime);
                          const endIndex = times.indexOf(endTime);

                          if (
                            startIndex === -1 ||
                            endIndex === -1 ||
                            endIndex <= startIndex
                          )
                            return null;

                          const rowSpan = endIndex - startIndex;

                          for (let j = 1; j < rowSpan; j++) {
                            const nextTime = times[startIndex + j];
                            skipMap[dayKey][nextTime] = true;
                          }

                          const editBackground = {
                            normal: "normal",
                            pending: "pending",
                            waiting: "waiting",
                            checked_in: "checked_in",
                            completed: "completed",
                          };
                          const statusKey =
                            bookedSchedule.statusReservation.toLowerCase() as keyof typeof editBackground;

                          return (
                            <td
                              key={i}
                              rowSpan={rowSpan}
                              className={cx("schedule-cell", {
                                booked: true,
                                [editBackground[statusKey]]:
                                  editBackground[statusKey],
                              })}
                              onClick={() => {
                                toast.warning("Khung giờ này đã được đặt!");
                              }}
                            >
                              <div className={cx("booked-title")}>
                                <p>{bookedSchedule.title}</p>
                                <p className={cx("status")}>
                                  {bookedSchedule.statusReservation ===
                                  "PENDING"
                                    ? "Chờ phê duyệt"
                                    : bookedSchedule.statusReservation ===
                                      "WAITING"
                                    ? "Chờ nhận phòng"
                                    : bookedSchedule.statusReservation ===
                                      "CHECKED_IN"
                                    ? "Đã nhận phòng"
                                    : bookedSchedule.statusReservation ===
                                      "COMPLETED"
                                    ? "Đã hoàn thành"
                                    : ""}
                                </p>
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td
                            key={i}
                            className={cx("schedule-cell")}
                            onClick={() => handleCellClick(dayKey, time)}
                          ></td>
                        );
                      })}
                    </tr>
                  ));
              })()}
            </tbody>
          </table>

          {/* Modal */}
          {isModalOpen && (
            <ModalBooking
              isModalOpen={isModalOpen}
              setIsModalClose={handleCloseModal}
              roomInfo={
                {
                  roomId: roomDetail?.roomId,
                  roomName: roomDetail?.roomName,
                } as any
              }
              dateSelected={selectedSlot?.date}
              timeStart={selectedSlot?.time}
              setIsPopupOpen={handleOpenPopup}
            />
          )}

          {/* Popup thông báo */}
          {infoPopup.close && (
            <PopupNotification
              message={infoPopup.message}
              type={infoPopup.type}
              isOpen={infoPopup.close}
              onClose={() =>
                setInfoPopup({ message: "", type: "success", close: false })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;

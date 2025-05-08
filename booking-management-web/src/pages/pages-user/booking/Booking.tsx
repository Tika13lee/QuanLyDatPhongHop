import classNames from "classnames/bind";
import styles from "./Booking.module.scss";
import { useEffect, useState } from "react";
import { BranchProps, RoomViewProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import ModalBooking from "../../../components/Modal/ModalBooking";
import {
  formatDateString,
  times,
  validateBookingTime,
} from "../../../utilities";
import PopupNotification from "../../../components/popup/PopupNotification";
import { toast, ToastContainer } from "react-toastify";

const cx = classNames.bind(styles);

type RoomInfo = {
  roomName: string;
  roomId: string;
};

type InfoCellRoom = {
  roomInfo: RoomInfo;
  timeStart: string;
  listRoomInfo: RoomInfo[];
};

type typeMessage = "error" | "success" | "info" | "warning";

type typeInfoPopup = {
  message: string;
  type: typeMessage;
  close: boolean;
};

function Booking() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedBranch, setSelectedBranch] =
    useState<string>("TP. Hồ Chí Minh");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<boolean>(false);
  const [infoCellRoom, setInfoCellRoom] = useState<InfoCellRoom>({
    roomInfo: {
      roomName: "",
      roomId: "",
    },
    timeStart: "",
    listRoomInfo: [],
  });
  const [rooms, setRooms] = useState<RoomViewProps[]>([]);

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

  // lấy chi nhánh
  const {
    data: branchs,
    loading: branchsLoading,
    error: branchsError,
  } = useFetch<BranchProps[]>(
    "http://localhost:8080/api/v1/location/getAllBranch"
  );

  // Hàm chuyển đổi ngày
  const changeDay = (direction: "previous" | "next") => {
    const currentDate = new Date(selectedDate);
    if (direction === "previous") {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  // ngày bắt đầu, kết thúc
  const getStartOfDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0);
    return date.toISOString();
  };
  const getEndOfDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setUTCHours(23, 59, 59, 999);
    return date.toISOString();
  };

  // lấy danh sách phòng
  const fetchRooms = async () => {
    const res = await fetch(
      `http://localhost:8080/api/v1/room/getRoomOverView?branch=${selectedBranch}&dayStart=${getStartOfDay(
        selectedDate
      )}&dayEnd=${getEndOfDay(selectedDate)}`
    );
    const data = await res.json();
    setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, [selectedBranch, selectedDate]);

  // lấy danh sách mới sau khi đã phê duyệt thành công
  useEffect(() => {
    if (infoPopup.close == true) {
      fetchRooms();
    }
  }, [infoPopup.close]);

  // đổ lại dữ liệu listroom lên modal khi chọn đặt phòng
  useEffect(() => {
    if (selectedCell == false) {
      const roomInfos =
        rooms?.map((room) => ({
          roomId: room.roomId + "",
          roomName: room.roomName,
        })) || [];
      setInfoCellRoom({
        roomInfo: {
          roomName: "",
          roomId: "",
        },
        timeStart: "",
        listRoomInfo: roomInfos,
      });
    }
  }, [selectedCell]);

  // mở modal
  const handleOpenModal = () => {
    const now = new Date();
    const selected = new Date(selectedDate);
    const isToday = now.toDateString() === selected.toDateString();
    if (isToday) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const limitMinutes = 17 * 60 + 30;

      if (currentMinutes > limitMinutes) {
        toast.warning("Không thể đặt lịch cho hôm nay sau 17:30!");
        return;
      }
    } else if (selected < now) {
      toast.warning(
        "Ngày " +
          formatDateString(selectedDate) +
          " đã qua. " +
          "Vui lòng chọn ngày khác! "
      );
      return;
    }

    const roomInfos =
      rooms?.map((room) => ({
        roomId: room.roomId + "",
        roomName: room.roomName,
      })) || [];
    setInfoCellRoom({
      roomInfo: {
        roomName: "",
        roomId: "",
      },
      timeStart: "",
      listRoomInfo: roomInfos,
    });
    setIsModalOpen(true);
  };

  // đóng modal
  const handleCloseModal = () => {
    setInfoCellRoom({
      roomInfo: {
        roomName: "",
        roomId: "",
      },
      timeStart: "",
      listRoomInfo: [],
    });
    setSelectedCell(false);
    setIsModalOpen(false);
  };

  // xử lý khi click vào ô
  const handleCellClick = (
    roomId: string,
    roomName: string,
    timeStart: string
  ) => {
    const isValidTime = validateBookingTime(
      selectedDate,
      timeStart,
      toast.warning
    );
    if (!isValidTime) return;

    setSelectedCell(() => {
      setInfoCellRoom({
        roomInfo: {
          roomName: roomName,
          roomId: roomId,
        },
        timeStart,
        listRoomInfo: [],
      });
      return true;
    });
    setIsModalOpen(true);
  };

  return (
    <div className={cx("overview-container")}>
      <ToastContainer />
      <div className={cx("header-container")}>
        {/* Chọn chi nhánh */}
        <div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            style={{ cursor: "pointer" }}
          >
            {branchs?.map((branch) => (
              <option key={branch.branchId}>{branch.branchName}</option>
            ))}
          </select>
        </div>

        <div className={cx("row-container")}>
          {/* Chọn ngày */}
          <div className={cx("filterContainer")}>
            <input
              type="date"
              className={cx("datePicker")}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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
            <button onClick={() => changeDay("previous")}>Trở về</button>
            <button onClick={() => changeDay("next")}>Tiếp</button>
          </div>
        </div>

        {/* nút đặt phòng */}
        <div className={cx("row-container")}>
          <div className={cx("actionButtons")}>
            <button onClick={handleOpenModal}>Đặt phòng</button>
          </div>
        </div>
      </div>

      {/* Bảng lịch */}
      <div className={cx("schedule-container")}>
        {rooms.length == 0 ? (
          <div className={cx("no-rooms")}>
            <p>Chi nhánh này chưa có phòng</p>
          </div>
        ) : rooms && rooms.length > 0 ? (
          <table className={cx("schedule-table")}>
            <thead>
              <tr>
                <th className={cx("time-column")}>Thời gian</th>
                {rooms.map((room) => (
                  <th key={room.roomId}>{room.roomName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const skipMap: {
                  [roomId: string]: { [time: string]: boolean };
                } = {};

                return times
                  .filter((time) => time <= "17:30")
                  .map((time) => (
                    <tr key={time}>
                      <td className={cx("time-column")}>{time}</td>

                      {rooms.map((room) => {
                        if (!skipMap[room.roomId]) skipMap[room.roomId] = {};

                        if (skipMap[room.roomId][time]) return null;

                        const reservation = room.reservationViewDTOS.find(
                          (res) => {
                            const startTime = res.timeStart
                              .split("T")[1]
                              .substring(0, 5);
                            return startTime === time;
                          }
                        );

                        if (reservation) {
                          const start = reservation.timeStart
                            .split("T")[1]
                            .substring(0, 5);
                          const end = reservation.timeEnd
                            .split("T")[1]
                            .substring(0, 5);
                          const startIndex = times.indexOf(start);
                          const endIndex = times.indexOf(end);

                          // Bảo vệ khi index không tồn tại
                          if (
                            startIndex === -1 ||
                            endIndex === -1 ||
                            endIndex <= startIndex
                          )
                            return null;

                          const rowSpan = endIndex - startIndex;

                          for (let i = 1; i < rowSpan; i++) {
                            const nextTime = times[startIndex + i];
                            skipMap[room.roomId][nextTime] = true;
                          }

                          const editBackground: { [key: string]: string } = {
                            normal: "normal",
                            pending: "pending",
                            waiting: "waiting",
                            checked_in: "checked_in",
                            completed: "completed",
                          };
                          const statusKey =
                            reservation.statusReservation.toLowerCase() ||
                            "normal";

                          return (
                            <td
                              key={`${room.roomId}-${time}`}
                              rowSpan={rowSpan}
                              className={cx({
                                booked: true,
                                [editBackground[statusKey]]:
                                  editBackground[statusKey],
                              })}
                              onClick={() =>
                                toast.warning("Khung giờ này đã được đặt!", {
                                  autoClose: 2000,
                                })
                              }
                            >
                              <div className={cx("booked-title")}>
                                <p>{reservation.title}</p>
                                <p className={cx("status")}>
                                  {reservation.statusReservation === "PENDING"
                                    ? "Chờ phê duyệt"
                                    : reservation.statusReservation ===
                                      "WAITING"
                                    ? "Chờ nhận phòng"
                                    : reservation.statusReservation ===
                                      "CHECKED_IN"
                                    ? "Đã nhận phòng"
                                    : reservation.statusReservation ===
                                      "COMPLETED"
                                    ? "Đã hoàn thành"
                                    : "Không nhận phòng"}
                                </p>
                              </div>
                            </td>
                          );
                        }

                        // Render ô trống nếu không có reservation
                        return (
                          <td
                            key={`${room.roomId}-${time}`}
                            onClick={() =>
                              handleCellClick(
                                room.roomId + "",
                                room.roomName,
                                time
                              )
                            }
                          ></td>
                        );
                      })}
                    </tr>
                  ));
              })()}
            </tbody>
          </table>
        ) : (
          <p className={cx("no-rooms")}>
            Không có phòng nào cho chi nhánh này.
          </p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ModalBooking
          isModalOpen={isModalOpen}
          setIsModalClose={handleCloseModal}
          roomInfo={
            isModalOpen == true
              ? infoCellRoom.roomInfo
              : { roomName: "", roomId: "" }
          }
          dateSelected={selectedDate}
          timeStart={isModalOpen == true ? infoCellRoom.timeStart : ""}
          dataRoomByBranch={
            isModalOpen == true && selectedCell == false
              ? infoCellRoom.listRoomInfo
              : []
          }
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
  );
}

export default Booking;

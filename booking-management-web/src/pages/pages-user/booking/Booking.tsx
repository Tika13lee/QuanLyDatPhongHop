import classNames from "classnames/bind";
import styles from "./Booking.module.scss";
import { useEffect, useState } from "react";
import { BranchProps, RoomViewProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import ModalBooking from "../../../components/Modal/ModalBooking";
import { times } from "../../../utilities";
import PopupNotification from "../../../components/popup/PopupNotification";
import { set } from "react-datepicker/dist/date_utils";
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

  console.log(rooms);

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
    // kiểm tra ngày đã chọn có hợp lệ hay không
    // hợp lê thì chạy đoạn dưới
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
    // không hợp lệ thì thông báo
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
        <div className={cx("")}>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
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
              Hôm nay
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
          <p>Đang tải danh sách phòng...</p>
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
              {times.map((time) => (
                <tr key={time}>
                  <td className={cx("time-column")}>{time}</td>

                  {/* Duyệt qua từng phòng */}
                  {rooms.map((room, index) => {
                    const reservations = room.reservationViewDTOS.filter(
                      (res) => {
                        const startTime = res.timeStart
                          .split("T")[1]
                          .substring(0, 5);
                        const endTime = res.timeEnd
                          .split("T")[1]
                          .substring(0, 5);

                        // Kiểm tra `time` có nằm trong khoảng đặt phòng không
                        return startTime <= time && time < endTime;
                      }
                    );

                    // Màu nền cho từng trạng thái đặt phòng
                    const editBackground: { [key: string]: string } = {
                      normal: "normal",
                      pending: "pending",
                      waiting_payment: "waiting_payment",
                      waiting: "waiting",
                      checked_in: "checked_in",
                      completed: "completed",
                      waiting_cancel: "waiting_cancel",
                    };
                    let statusKey =
                      reservations[0]?.statusReservation.toLocaleLowerCase() ||
                      "normal";

                    return (
                      <td
                        key={`${room.roomId}-${time}`}
                        className={cx({
                          booked: reservations.length > 0,
                          [editBackground[statusKey]]:
                            editBackground[statusKey],
                        })}
                        onClick={() => {
                          if (reservations[0]) {
                            toast.warning("Khung giờ này đã được đặt!", {
                              autoClose: 2000,
                            });
                          } else {
                            handleCellClick(
                              room.roomId + "",
                              room.roomName,
                              time
                            );
                          }
                        }}
                      >
                        {/* Hiển thị tất cả đặt phòng trùng với `time` */}
                        {reservations.map((res) => (
                          <div className={cx("booked-title")}>
                            <p>{res?.title}</p>
                            <p className={cx("status")}>
                              {res.statusReservation === "PENDING"
                                ? "Chờ phê duyệt"
                                : res.statusReservation === "WAITING"
                                ? "Chờ nhận phòng"
                                : res.statusReservation === "CHECKED_IN"
                                ? "Đã nhận phòng"
                                : res.statusReservation === "COMPLETED"
                                ? "Đã hoàn thành"
                                : ""}
                            </p>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
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

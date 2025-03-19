import classNames from "classnames/bind";
import styles from "./Booking.module.scss";
import { useEffect, useState } from "react";
import { BranchProps, RoomViewProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import ModalBooking from "../../../components/Modal/ModalBooking";
import { times } from "../../../utilities";

const cx = classNames.bind(styles);

type InfoCellRoom = {
  roomName: string;
  timeStart: string;
  listRoomName: string[];
};

function General() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedBranch, setSelectedBranch] =
    useState<string>("TP. Hồ Chí Minh");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<boolean>(false);
  const [infoCellRoom, setInfoCellRoom] = useState<InfoCellRoom>({
    roomName: "",
    timeStart: "",
    listRoomName: [],
  });

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

  // lấy danh sách đặt phòng theo ngày và chi nhánh
  const {
    data: rooms,
    loading,
    error,
  } = useFetch<RoomViewProps[]>(
    `http://localhost:8080/api/v1/room/getRoomOverView?branch=${selectedBranch}&dayStart=${getStartOfDay(
      selectedDate
    )}&dayEnd=${getEndOfDay(selectedDate)}`
  );

  // đổ lại dữ liệu listroom lên modal khi chọn đặt phòng
  useEffect(() => {
    if (selectedCell == false) {
      const roomNames = rooms?.map((room) => room.roomName) || [];
      setInfoCellRoom({ roomName: "", timeStart: "", listRoomName: roomNames });
    }
  }, [selectedCell]);

  // mở modal
  const handleOpenModal = () => {
    // kiểm tra ngày đã chọn có hợp lệ hay không
    // hợp lê thì chạy đoạn dưới
    const roomNames = rooms?.map((room) => room.roomName) || [];
    console.log(roomNames);
    setInfoCellRoom({ roomName: "", timeStart: "", listRoomName: roomNames });
    setIsModalOpen(true);
    // không hợp lệ thì thông báo
  };

  // đóng modal
  const handleCloseModal = () => {
    setInfoCellRoom({ roomName: "", timeStart: "", listRoomName: [] });
    setSelectedCell(false);
    setIsModalOpen(false);
  };

  // xử lý khi click vào ô
  const handleCellClick = (roomName: string, timeStart: string) => {
    setSelectedCell(() => {
      setInfoCellRoom({ roomName, timeStart, listRoomName: [] });
      return true;
    });
    setIsModalOpen(true);
  };

  return (
    <div className={cx("overview-container")}>
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
        {loading ? (
          <p>Đang tải danh sách phòng...</p>
        ) : error ? (
          <p className={cx("error")}>{error.message}</p>
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
                        onClick={() => handleCellClick(room.roomName, time)}
                      >
                        {/* Hiển thị tất cả đặt phòng trùng với `time` */}
                        {reservations.map((res) => (
                          <div className={cx("booked-title")}>
                            <p>{res?.title}</p>
                            <p className={cx("status")}>
                              {res.statusReservation === "PENDING"
                                ? "Chờ phê duyệt"
                                : res.statusReservation === "WAITING_PAYMENT"
                                ? "Chờ thanh toán"
                                : res.statusReservation === "WAITING"
                                ? "Chờ nhận phòng"
                                : res.statusReservation === "CHECKED_IN"
                                ? "Đã nhận phòng"
                                : res.statusReservation === "COMPLETED"
                                ? "Đã hoàn thành"
                                : res.statusReservation === "WAITING_CANCELED"
                                ? "Chờ hủy"
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
          roomName={isModalOpen == true ? infoCellRoom.roomName : ""}
          dateSelected={selectedDate}
          timeStart={isModalOpen == true ? infoCellRoom.timeStart : ""}
          dataRoomByBranch={
            isModalOpen == true && selectedCell == false
              ? infoCellRoom.listRoomName
              : []
          }
        />
      )}
    </div>
  );
}

export default General;

import classNames from "classnames/bind";
import styles from "./Overview.module.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import useFetch from "../../../hooks/useFetch";
import { ReservationDetailProps, RoomViewProps } from "../../../data/data";
import { set } from "react-datepicker/dist/date_utils";
import axios from "axios";
import { cp } from "fs";

const cx = classNames.bind(styles);

// hàm tạo ds thời gian
const times = Array.from({ length: 23 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const minute = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

function Overview() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [reservationDetail, setReservationDetail] =
    useState<ReservationDetailProps | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  // Lấy dữ liệu locations từ Redux Store
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state: RootState) => state.location);

  const [selectedBranch, setSelectedBranch] =
    useState<string>("TP. Hồ Chí Minh");

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

  // Fetch danh sách đặt phòng theo ngày
  const {
    data: rooms,
    loading,
    error,
  } = useFetch<RoomViewProps[]>(
    `http://localhost:8080/api/v1/room/getRoomOverView?branch=${selectedBranch}&dayStart=${getStartOfDay(
      selectedDate
    )}&dayEnd=${getEndOfDay(selectedDate)}`
  );

  // Gọi API lấy chi tiết đặt phòng dựa trên ID đã chọn
  useEffect(() => {
    if (!selectedReservationId) return;
    setLoadingDetail(true);
    setErrorDetail(null);

    axios
      .get(
        `http://localhost:8080/api/v1/reservation/getReservationById?reservationId=${selectedReservationId}`
      )
      .then((response) => {
        setReservationDetail(response.data);
      })
      .catch((error) => {
        setErrorDetail(error.message);
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  }, [selectedReservationId]);

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

  const handleOpenModal = (id: number) => {
    setSelectedReservationId(id);
    setOpenModal(true);
  };
  console.log(selectedReservationId);
  console.log(openModal);

  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }

  return (
    <div className={cx("overview-container")}>
      <div className={cx("header-container")}>
        <h2>Lịch đặt phòng trong 1 ngày</h2>

        {/* Chọn chi nhánh */}
        <div className={cx("form-group")}>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            {/* <option value="">Chọn chi nhánh</option> */}
            {[
              ...new Set(locations?.map((location) => location.branch) || []),
            ].map((branch, index) => (
              <option key={index} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

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
                  {/* Cột hiển thị thời gian */}
                  <td className={cx("time-column")}>{time}</td>

                  {/* Duyệt qua từng phòng */}
                  {rooms.map((room) => {
                    // Tìm tất cả đặt phòng phù hợp với `time`
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
                    return (
                      <td
                        key={`${room.roomId}-${time}`}
                        className={cx({ booked: reservations.length > 0 })}
                      >
                        {/* Hiển thị tất cả đặt phòng trùng với `time` */}
                        {reservations.map((res) => (
                          <div
                            onClick={() => handleOpenModal(res.reservationId)}
                          >
                            <div key={res.reservationId}>{res.title}</div>
                            <div key={res.reservationId}>{res.nameBooker}</div>
                            <div key={res.reservationId}>
                              Trạng thái: {res.statusReservation}
                            </div>
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
      {openModal && (
        <div className={cx("modal")}>
          <div className={cx("modal-content")}>
            <span className={cx("close")} onClick={() => setOpenModal(false)}>
              &times;
            </span>
            {selectedReservationId ? (
              loadingDetail ? (
                <p>Đang tải chi tiết...</p>
              ) : errorDetail ? (
                <p className={cx("error")}>Lỗi: Không thể tải chi tiết</p>
              ) : reservationDetail ? (
                <div className={cx("approval-detail")}>
                  <h2>{reservationDetail.title}</h2>
                  <p>
                    <strong>Người đặt:</strong>{" "}
                    {reservationDetail.booker.employeeName}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong>{" "}
                    {reservationDetail.booker.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {reservationDetail.booker.email}
                  </p>
                  <p>
                    <strong>Thời gian đặt:</strong>{" "}
                    {formatDateTime(reservationDetail.time)}
                  </p>
                  <p>
                    <strong>Thời gian lịch: </strong>
                    {reservationDetail.timeStart
                      .split("T")[1]
                      .substring(0, 5)}{" "}
                    - {formatDateTime(reservationDetail.timeEnd)}
                  </p>
                  <p>
                    <strong>Phòng:</strong> {reservationDetail.room.roomName}
                  </p>
                  <p className="room-location">
                    <strong>Vị trí:</strong>{" "}
                    {reservationDetail.room.location.building.branch.branchName}{" "}
                    - {reservationDetail.room.location.building.buildingName} -{" "}
                    {reservationDetail.room.location.floor}
                  </p>
                  <p>
                    <strong>Loại phòng:</strong>{" "}
                    {reservationDetail.room.typeRoom}
                  </p>
                  <p>
                    <strong>Trạng thái phòng:</strong>
                    <span
                      className={cx("room-status", {
                        available:
                          reservationDetail.room.statusRoom === "AVAILABLE",
                        occupied:
                          reservationDetail.room.statusRoom === "OCCUPIED",
                        maintenance:
                          reservationDetail.room.statusRoom === "MAINTENANCE",
                      })}
                    >
                      {reservationDetail.room.statusRoom}
                    </span>
                  </p>

                  <p>
                    <strong>Ghi chú:</strong> {reservationDetail.note}
                  </p>
                  <p>
                    <strong>Mô tả:</strong> {reservationDetail.description}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    {reservationDetail.statusReservation}
                  </p>
                  <div>
                    {reservationDetail.services?.map((service) => (
                      <div key={service.serviceId}>
                        <span>
                          <strong>Dịch vụ:</strong> {service.serviceName}
                        </span>
                        <span>
                          <strong>Giá:</strong> {service.price.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>Không có dữ liệu chi tiết</p>
              )
            ) : (
              <p>Chọn một mục để xem chi tiết</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Overview;

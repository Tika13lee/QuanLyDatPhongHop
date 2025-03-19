import classNames from "classnames/bind";
import styles from "./BookingList.module.scss";
import { useEffect, useState } from "react";
import { ReservationDetailProps, ReservationProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import DetailModal from "../approve/DetailModal";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";

const cx = classNames.bind(styles);

function BookingList() {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDetailProps | null>(null);

  const [status, setStatus] = useState<string>("");

  const { data, loading, error } = useFetch<ReservationDetailProps>(
    selectedReservationId
      ? `http://localhost:8080/api/v1/reservation/getReservationById?reservationId=${selectedReservationId}`
      : ""
  );

  // Hàm format ngày giờ
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("vi-VN"),
      time: date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // Lấy danh sách lịch đặt phòng
  const {
    data: bookedList,
    loading: loadingBookedList,
    error: errorBookedList,
  } = useFetch<ReservationProps[]>(
    status
      ? `http://localhost:8080/api/v1/reservation/getReservationsByBookerPhone?phone=${user.phone}&statusReservation=${status}`
      : `http://localhost:8080/api/v1/reservation/getReservationsByBookerPhone?phone=${user.phone}`
  );

  // Cập nhật state khi API trả về dữ liệu
  useEffect(() => {
    if (data) {
      setSelectedReservation(data);
      setIsModalOpen(true);
    }
  }, [data]);

  // Mở modal
  const handleShowDetails = (reservationId: number) => {
    setSelectedReservationId(reservationId);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservationId(null);
    setSelectedReservation(null);
  };

  return (
    <div className={cx("booking-list")}>
      <div className={cx("booking-search")}>
        <div className={cx("search-row")}>
          <label>Tìm kiếm</label>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên cuộc họp, tên người đặt"
            className={cx("search-input")}
          />
        </div>
        <div className={cx("search-row")}>
          <label>Ngày gửi</label>
          <input type="date" className={cx("search-input")} />
        </div>
        <div className={cx("search-row")}>
          <label>Trạng thái</label>
          <select
            className={cx("search-input")}
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="WAITING">Chờ nhận phòng</option>
            <option value="CHECKED_IN">Đã nhận phòng</option>
            <option value="COMPLETED">Đã hoàn thành</option>
            <option value="WAITING_PAYMENT">Chờ thanh toán</option>
            <option value="CANCELED">Đã hủy</option>
            <option value="PENDING">Đang chờ phê duyệt</option>
            <option value="NO_APPROVED">Không được phê duyệt</option>
            <option value="WAITING_CANCEL">Đang chờ hủy</option>
          </select>
        </div>
      </div>

      {Array.isArray(bookedList) && bookedList.length === 0 ? (
        <p className={cx("no-schedule-message")}>
          Bạn không có lịch đặt phòng nào
        </p>
      ) : (
        <div className={cx("schedule-list")}>
          {bookedList?.map((schedule) => {
            const meetingStart = formatDateTime(schedule.timeStart);
            const meetingEnd = formatDateTime(schedule.timeEnd);
            const bookingTime = formatDateTime(schedule.time);

            return (
              <div key={schedule.reservationId} className={cx("schedule-card")}>
                <div className={cx("card-content")}>
                  <div className={cx("schedule-layout")}>
                    <div className={cx("left-info")}>
                      <h3>{schedule.title}</h3>
                    </div>

                    <div className={cx("left-info")}>
                      <p>
                        <strong>Ngày:</strong> {meetingStart.date} từ {""}
                        {meetingStart.time} - {meetingEnd.time}
                      </p>
                    </div>

                    <div className={cx("center-info")}>
                      <p>
                        <strong>Trạng thái:</strong>{" "}
                        {schedule.statusReservation === "CHECKED_IN"
                          ? "Đã nhận phòng"
                          : schedule.statusReservation === "COMPLETED"
                          ? "Đã hoàn thành"
                          : schedule.statusReservation === "WAITING"
                          ? "Chờ nhận phòng"
                          : schedule.statusReservation === "WAITING_PAYMENT"
                          ? "Chờ thanh toán"
                          : schedule.statusReservation === "CANCELLED"
                          ? "Đã hủy"
                          : schedule.statusReservation === "PENDING"
                          ? "Đang chờ phê duyệt"
                          : schedule.statusReservation === "NO_APPROVED"
                          ? "Không được phê duyệt"
                          : "Đang chờ hủy"}
                      </p>
                      {/* <p>
                        <strong>Thời gian phê duyệt:</strong>{" "}
                        {schedule.timeApprove === null
                          ? "Chưa phê duyệt"
                          : new Date(schedule.timeApprove).toLocaleString()}
                      </p> */}
                    </div>

                    <div className={cx("center-info")}>
                      <p>
                        <strong>Thời gian gửi:</strong>{" "}
                        {new Date(schedule.time).toLocaleString()}
                      </p>
                    </div>

                    <div className={cx("right-info")}>
                      <div
                        className={cx("actions")}
                        onClick={() =>
                          handleShowDetails(schedule.reservationId)
                        }
                      >
                        <label>Chi tiết</label>
                        <IconWrapper icon={MdOutlineInfo} color="#FFBB49" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        reservation={selectedReservation}
      />
    </div>
  );
}

export default BookingList;

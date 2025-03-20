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
          <table className={cx("schedule-table")}>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Ngày</th>
                <th>Giờ bắt đầu - kết thúc</th>
                <th>Trạng thái</th>
                <th>Thời gian gửi</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {bookedList?.map((schedule) => {
                const meetingStart = formatDateTime(schedule.timeStart);
                const meetingEnd = formatDateTime(schedule.timeEnd);
                const statusText = getStatusText(schedule.statusReservation);

                return (
                  <tr key={schedule.reservationId}>
                    <td>{schedule.title}</td>
                    <td>{meetingStart.date}</td>
                    <td>
                      {meetingStart.time} - {meetingEnd.time}
                    </td>

                    <td>{statusText}</td>
                    <td>{new Date(schedule.time).toLocaleString()}</td>
                    <td>
                      <div
                        className={cx("actions")}
                        onClick={() =>
                          handleShowDetails(schedule.reservationId)
                        }
                      >
                        <IconWrapper icon={MdOutlineInfo} color="#FFBB49" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

const getStatusText = (status: string) => {
  switch (status) {
    case "CHECKED_IN":
      return "Đã nhận phòng";
    case "COMPLETED":
      return "Đã hoàn thành";
    case "WAITING":
      return "Chờ nhận phòng";
    case "CANCELLED":
      return "Đã hủy";
    case "PENDING":
      return "Đang chờ phê duyệt";
    case "NO_APPROVED":
      return "Không được phê duyệt";
    default:
      return "Đang chờ hủy";
  }
};

export default BookingList;

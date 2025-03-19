import classNames from "classnames/bind";
import styles from "./RejectedList.module.scss";
import { ReservationDetailProps, ReservationProps } from "../../../data/data";
import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import DetailModal from "./DetailModal";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";

const cx = classNames.bind(styles);

function RejectedList() {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDetailProps | null>(null);

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

  // Lấy chi tiết lịch đặt phòng
  const { data, loading, error } = useFetch<ReservationDetailProps>(
    selectedReservationId
      ? `http://localhost:8080/api/v1/reservation/getReservationById?reservationId=${selectedReservationId}`
      : ""
  );

  // Lấy danh sách lịch đặt phòng đã từ chối
  const {
    data: rejectedList,
    loading: loadingRejectedList,
    error: errorRejectedList,
  } = useFetch<ReservationProps[]>(
    `http://localhost:8080/api/v1/reservation/getReservationsNoApproved?approverId=${user.employeeId}`
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
    <div className={cx("rejected-list")}>
      <div className={cx("rejected-search")}>
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
      </div>

      {Array.isArray(rejectedList) && rejectedList.length === 0 ? (
        <p className={cx("no-schedule-message")}>
          Bạn không có lịch cần phê duyệt
        </p>
      ) : (
        <div className={cx("schedule-list")}>
          {rejectedList?.map((schedule) => {
            const meetingStart = formatDateTime(schedule.timeStart);
            const meetingEnd = formatDateTime(schedule.timeEnd);
            const bookingTime = formatDateTime(schedule.time);

            return (
              <div key={schedule.reservationId} className={cx("schedule-card")}>
                <div className={cx("card-content")}>
                  <div className={cx("schedule-layout")}>
                    <div className={cx("left-info")}>
                      <h3>{schedule.title}</h3>
                      <p>
                        <strong>Ngày:</strong> {meetingStart.date} từ{" "}
                        {meetingStart.time} - {meetingEnd.time}
                      </p>
                    </div>

                    <div className={cx("left-info")}>
                      <p>
                        <strong>Người đặt:</strong> {schedule.nameBooker}
                      </p>
                      <p>
                        <strong>Thời gian gửi:</strong> {bookingTime.date} -{" "}
                        {""}
                        {bookingTime.time}
                      </p>
                    </div>

                    <div className={cx("left-info")}>
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
                          : "Đang chờ hủy"}
                      </p>
                      <p>
                        <strong>Thời gian phê duyệt:</strong>{" "}
                        {new Date(schedule.timeApprove).toLocaleString()}
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

export default RejectedList;

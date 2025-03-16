import classNames from "classnames/bind";
import styles from "./RejectedList.module.scss";
import { ReservationDetailProps, ReservationProps } from "../../../data/data";
import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import DetailModal from "./DetailModal";

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

  const { data, loading, error } = useFetch<ReservationDetailProps>(
    selectedReservationId
      ? `http://localhost:8080/api/v1/reservation/getReservationById?reservationId=${selectedReservationId}`
      : ""
  );

  const {
    data: rejectedList,
    loading: loadingRejectedList,
    error: errorRejectedList,
  } = useFetch<ReservationProps[]>(
    `http://localhost:8080/api/v1/reservation/getReservationsNoApproved?approverId=${user.employeeId}`
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

  // Cập nhật state khi API trả về dữ liệu
  useEffect(() => {
    if (data) {
      setSelectedReservation(data);
      setIsModalOpen(true);
    }
  }, [data]);

  const handleShowDetails = (reservationId: number) => {
    setSelectedReservationId(reservationId);
  };

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
          <label>Thời gian gửi</label>
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
                  <h3>{schedule.title}</h3>
                  <div className={cx("schedule-layout")}>
                    <div className={cx("left-info")}>
                      <p>
                        <strong>Người đặt:</strong> {schedule.nameBooker}
                      </p>
                      <p>
                        <strong>Thời gian gửi:</strong>{" "}
                        {new Date(schedule.time).toLocaleString()}
                      </p>
                    </div>
                    <div className={cx("center-info")}>
                      <p>
                        <strong>Ngày:</strong> {meetingStart.date}
                      </p>
                      <p>
                        <strong>Thời gian:</strong> {meetingStart.time} -{" "}
                        {meetingEnd.time}
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
                      <div className={cx("actions")}>
                        <button
                          className={cx("btn-action", "details-btn")}
                          onClick={() =>
                            handleShowDetails(schedule.reservationId)
                          }
                        >
                          Xem Chi Tiết
                        </button>
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

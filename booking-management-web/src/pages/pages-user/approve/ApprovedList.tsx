import classNames from "classnames/bind";
import styles from "./ApprovedList.module.scss";
import { useEffect, useState } from "react";
import { ReservationDetailProps, ReservationProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import DetailModal from "./DetailModal";

const cx = classNames.bind(styles);

const mockApprovedSchedules: ReservationProps[] = [
  {
    reservationId: 1,
    title: "Cuộc họp chiến lược",
    timeStart: "2025-03-01T08:30:00.000+07:00",
    timeEnd: "2025-03-01T10:00:00.000+07:00",
    statusReservation: "approved",
    time: "2025-02-28T01:35:28.000+07:00",
    img: "",
    nameBooker: "Nguyễn Văn A",
  },
  {
    reservationId: 2,
    title: "Họp dự án phần mềm",
    timeStart: "2025-03-02T14:00:00.000+07:00",
    timeEnd: "2025-03-02T16:00:00.000+07:00",
    statusReservation: "approved",
    time: "2025-02-28T09:15:00.000+07:00",
    img: "",
    nameBooker: "Trần Thị B",
  },
  {
    reservationId: 3,
    title: "Thảo luận kế hoạch marketing",
    timeStart: "2025-03-03T10:00:00.000+07:00",
    timeEnd: "2025-03-03T12:00:00.000+07:00",
    statusReservation: "approved",
    time: "2025-02-28T15:45:00.000+07:00",
    img: "",
    nameBooker: "Phạm Văn C",
  },
];

function ApprovedList() {
  const [approvedSchedules, setApprovedSchedules] = useState<
    ReservationProps[]
  >(mockApprovedSchedules);

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
    <div className={cx("approved-list")}>
      <div className={cx("approve-search")}>
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

      {Array.isArray(approvedSchedules) && approvedSchedules.length === 0 ? (
        <p className={cx("no-schedule-message")}>
          Bạn không có lịch cần phê duyệt
        </p>
      ) : (
        <div className={cx("schedule-list")}>
          {approvedSchedules.map((schedule) => {
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

export default ApprovedList;

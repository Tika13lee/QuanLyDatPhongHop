import classNames from "classnames/bind";
import styles from "./ApprovedList.module.scss";
import { useEffect, useState } from "react";
import { ReservationDetailProps, ReservationProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import DetailModal from "./DetailModal";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";

const cx = classNames.bind(styles);

function ApprovedList() {
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

  // Lấy danh sách lịch đặt phòng đã phê duyệt
  const {
    data: approvedList,
    loading: loadingApprovedList,
    error: errorApprovedList,
  } = useFetch<ReservationProps[]>(
    `http://localhost:8080/api/v1/reservation/getReservationsNoPending?approverId=${user.employeeId}`
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
          <label>Ngày gửi</label>
          <input type="date" className={cx("search-input")} />
        </div>
      </div>

      {Array.isArray(approvedList) && approvedList.length === 0 ? (
        <p className={cx("no-schedule-message")}>
          Bạn không có lịch cần phê duyệt
        </p>
      ) : (
        <div className={cx("schedule-list")}>
          <table className={cx("schedule-table")}>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Ngày</th>
                <th>Người đặt</th>
                <th>Thời gian gửi</th>
                <th>Trạng thái</th>
                <th>Thời gian phê duyệt</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {approvedList?.map((schedule) => {
                const meetingStart = formatDateTime(schedule.timeStart);
                const meetingEnd = formatDateTime(schedule.timeEnd);
                const statusText = getStatusText(schedule.statusReservation);
                const approvedTime = schedule.timeApprove
                  ? new Date(schedule.timeApprove).toLocaleString()
                  : "Chưa phê duyệt";

                return (
                  <tr key={schedule.reservationId}>
                    <td>{schedule.title}</td>
                    <td>
                      {meetingStart.date} từ {meetingStart.time} -{" "}
                      {meetingEnd.time}
                    </td>
                    <td>{schedule.nameBooker}</td>
                    <td>{new Date(schedule.time).toLocaleString()}</td>
                    <td>{statusText}</td>
                    <td>{approvedTime}</td>
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

export default ApprovedList;

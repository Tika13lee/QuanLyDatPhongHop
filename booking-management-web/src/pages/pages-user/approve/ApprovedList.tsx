import classNames from "classnames/bind";
import styles from "./ApprovedList.module.scss";
import { useEffect, useState } from "react";
import { RequestFormProps, ReservationDetailProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import DetailModal from "../../../components/Modal/DetailModal";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";
import { set } from "react-datepicker/dist/date_utils";

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
  const [selectedRequestForm, setSelectedRequestForm] =
    useState<RequestFormProps | null>(null);

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


  // Lấy danh sách lịch đặt phòng đã phê duyệt
  const {
    data: approvedList,
    loading: loadingApprovedList,
    error: errorApprovedList,
  } = useFetch<RequestFormProps[]>(
    `http://localhost:8080/api/v1/requestForm/getRequestFormByApproverId?approverId=${user.employeeId}&statusRequestForm=APPROVED`
  );

  // Mở modal
  const handleShowDetails = (requestForm: RequestFormProps) => {
    setSelectedRequestForm(requestForm);
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequestForm(null);
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
                <th>Thời gian phê duyệt</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {approvedList?.map((schedule) => {
                const meetingStart = formatDateTime(
                  schedule.requestReservation.timeStart
                );
                const meetingEnd = formatDateTime(
                  schedule.requestReservation.timeEnd
                );

                return (
                  <tr key={schedule.requestFormId}>
                    <td>{schedule.requestReservation.title}</td>
                    <td>
                      {meetingStart.date} từ {meetingStart.time} -{" "}
                      {meetingEnd.time}
                    </td>
                    <td>{schedule.reservations[0].booker.employeeName}</td>
                    <td>{new Date(schedule.timeRequest).toLocaleString()}</td>
                    <td>{new Date(schedule.timeResponse).toLocaleString()}</td>
                    <td>
                      <div
                        className={cx("actions")}
                        onClick={() =>
                          handleShowDetails(schedule)
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
        requestForm={selectedRequestForm}
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

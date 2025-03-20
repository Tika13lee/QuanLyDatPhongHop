import classNames from "classnames/bind";
import styles from "./RejectedList.module.scss";
import {
  RequestFormProps,
  ReservationDetailProps,
  ReservationProps,
} from "../../../data/data";
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
  } = useFetch<RequestFormProps[]>(
    `http://localhost:8080/api/v1/requestForm/getRequestFormByApproverId?approverId=${user.employeeId}&statusRequestForm=REJECTED`
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
          <table className={cx("schedule-table")}>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Ngày</th>
                <th>Người đặt</th>
                <th>Thời gian gửi</th>
                <th>Thời gian phê duyệt</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {rejectedList?.map((schedule) => {
                const meetingStart = formatDateTime(
                  schedule.requestReservation.timeStart
                );
                const meetingEnd = formatDateTime(
                  schedule.requestReservation.timeEnd
                );
                const bookingTime = formatDateTime(
                  schedule.timeRequest
                );

                return (
                  <tr key={schedule.requestFormId}>
                    <td>{schedule.requestReservation.title}</td>
                    <td>
                      {meetingStart.date} từ {meetingStart.time} -{" "}
                      {meetingEnd.time}
                    </td>
                    <td>{schedule.reservations[0].booker.employeeName}</td>
                    <td>
                      {bookingTime.date} - {bookingTime.time}
                    </td>
                    <td>
                      <div
                        className={cx("actions")}
                        onClick={() =>
                          handleShowDetails(schedule.requestFormId)
                        }
                      >
                        <label>Chi tiết</label>
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
      {/* <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        reservation={selectedReservation}
      /> */}
    </div>
  );
}

export default RejectedList;

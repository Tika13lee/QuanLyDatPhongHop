import classNames from "classnames/bind";
import styles from "./RequestList.module.scss";
import { useState } from "react";
import { RequestFormProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import DetailModal from "../../../components/Modal/DetailModal";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";

const cx = classNames.bind(styles);

function RequestList() {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestForm, setSelectedRequestForm] =
    useState<RequestFormProps | null>(null);
  const [statusRequestForm, setStatusRequestForm] = useState<string>("");

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
    data: requestList,
    loading: loadingRequestList,
    error: errorRequestList,
  } = useFetch<RequestFormProps[]>(
    statusRequestForm
      ? `http://localhost:8080/api/v1/requestForm/getRequestFormByBookerId?bookerId=${user.employeeId}&statusRequestForm=${statusRequestForm}`
      : `http://localhost:8080/api/v1/requestForm/getRequestFormByBookerId?bookerId=${user.employeeId}`
  );

  // Mở modal
  const handleShowDetails = (requestFormDetail: RequestFormProps) => {
    setSelectedRequestForm(requestFormDetail);
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    selectedRequestForm && setSelectedRequestForm(null);
  };

  console.log("selectedRequestForm", selectedRequestForm);

  return (
    <div className={cx("booking-list")}>
      <div className={cx("booking-search")}>
        <div className={cx("search-group")}>
          <label>Tìm kiếm</label>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên cuộc họp"
            className={cx("search-input")}
          />
        </div>
        <div className={cx("search-group")}>
          <label>Ngày gửi</label>
          <input type="date" className={cx("search-input")} />
        </div>
        <div className={cx("search-group")}>
          <label>Ngày bắt đầu</label>
          <input type="date" className={cx("search-input")} />
        </div>
        <div className={cx("search-group")}>
          <label>Trạng thái</label>
          <select
            className={cx("search-input")}
            name="status"
            value={statusRequestForm}
            onChange={(e) => setStatusRequestForm(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="APPROVED">Đã phê duyệt</option>
            <option value="PENDING">Đang chờ phê duyệt</option>
            <option value="REJECTED">Từ chối phê duyệt</option>
          </select>
        </div>
      </div>

      {Array.isArray(requestList) && requestList.length === 0 ? (
        <p className={cx("no-schedule-message")}>Không có form yêu cầu nào</p>
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
              {requestList?.map((schedule) => {
                const meetingStart = formatDateTime(
                  schedule.requestReservation.timeStart
                );
                const meetingEnd = formatDateTime(
                  schedule.requestReservation.timeEnd
                );
                const statusText = getStatusText(schedule.statusRequestForm);

                return (
                  <tr key={schedule.requestFormId}>
                    <td>{schedule.requestReservation.title}</td>
                    <td>{meetingStart.date}</td>
                    <td>
                      {meetingStart.time} - {meetingEnd.time}
                    </td>

                    <td>{statusText}</td>
                    <td>{new Date(schedule.timeRequest).toLocaleString()}</td>
                    <td>
                      <div
                        className={cx("actions")}
                        onClick={() => handleShowDetails(schedule)}
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
    case "APPROVED":
      return "Đã phê duyệt";
    case "REJECTED":
      return "Từ chối phê duyệt";
    default:
      return "Đang chờ phê duyệt";
  }
};

export default RequestList;

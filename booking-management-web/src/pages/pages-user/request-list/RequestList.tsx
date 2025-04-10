import classNames from "classnames/bind";
import styles from "./RequestList.module.scss";
import { useState } from "react";
import { RequestFormProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import DetailModal from "../../../components/Modal/DetailRequestModal";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";
import { formatDateString, getHourMinute } from "../../../utilities";
import LoadingSpinner from "../../../components/spinner/LoadingSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const cx = classNames.bind(styles);

function RequestList() {
  const user = useSelector((state: RootState) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestForm, setSelectedRequestForm] =
    useState<RequestFormProps | null>(null);
  const [statusRequestForm, setStatusRequestForm] = useState<string>("");

  // Lấy danh sách lịch đặt phòng
  const {
    data: requestList,
    loading: loadingRequestList,
    error: errorRequestList,
  } = useFetch<RequestFormProps[]>(
    statusRequestForm
      ? `http://localhost:8080/api/v1/requestForm/getRequestFormByBookerId?bookerId=${user?.employeeId}&statusRequestForm=${statusRequestForm}`
      : `http://localhost:8080/api/v1/requestForm/getRequestFormByBookerId?bookerId=${user?.employeeId}`
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
            placeholder="Nhập tiêu đề cuộc họp"
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
          <label>Loại yêu cầu</label>
          <select
            className={cx("search-input")}
            name="status"
            value={statusRequestForm}
            onChange={(e) => setStatusRequestForm(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="">Đặt lịch</option>
            <option value="">Cập nhật</option>
          </select>
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
            <option value="PENDING">Chờ phê duyệt</option>
            <option value="REJECTED">Từ chối phê duyệt</option>
          </select>
        </div>
      </div>

      {loadingRequestList ? (
        <LoadingSpinner />
      ) : Array.isArray(requestList) && requestList.length === 0 ? (
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
                <th>Loại yêu cầu</th>
                <th>Thời gian gửi</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {requestList?.map((schedule) => {
                const statusText = getStatusText(schedule.statusRequestForm);

                return (
                  <tr key={schedule.requestFormId}>
                    <td>{schedule.requestReservation.title}</td>
                    <td>
                      {formatDateString(schedule.requestReservation.timeStart)}
                    </td>
                    <td>
                      {getHourMinute(schedule.requestReservation.timeStart)} -{" "}
                      {getHourMinute(schedule.requestReservation.timeEnd)}
                    </td>

                    <td>{statusText}</td>
                    <td>
                      {schedule.typeRequestForm === "UPDATE_RESERVATION"
                        ? "Cập nhật"
                        : "Đặt lịch"}
                    </td>
                    <td>
                      {formatDateString(schedule.timeRequest)} -{" "}
                      {getHourMinute(schedule.timeRequest)}
                    </td>
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
      return "Chờ phê duyệt";
  }
};

export default RequestList;

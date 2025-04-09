import classNames from "classnames/bind";
import styles from "./RejectedList.module.scss";
import { RequestFormProps } from "../../../data/data";
import { useState } from "react";
import useFetch from "../../../hooks/useFetch";
import DetailModal from "../../../components/Modal/DetailRequestModal";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";
import { formatDateString, getHourMinute } from "../../../utilities";
import LoadingSpinner from "../../../components/spinner/LoadingSpinner";

const cx = classNames.bind(styles);

function RejectedList() {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedRequestForm, setSelectedRequestForm] =
    useState<RequestFormProps | null>(null);

  // Lấy danh sách lịch đặt phòng đã từ chối
  const {
    data: rejectedList,
    loading: loadingRejectedList,
    error: errorRejectedList,
  } = useFetch<RequestFormProps[]>(
    `http://localhost:8080/api/v1/requestForm/getRequestFormByApproverId?approverId=${user.employeeId}&statusRequestForm=REJECTED`
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
    <div className={cx("rejected-list")}>
      <div className={cx("rejected-search")}>
        <div className={cx("search-row")}>
          <label>Tìm kiếm</label>
          <input
            type="text"
            placeholder="Tên phòng, tiêu đề cuộc họp, tên người đặt"
            className={cx("search-input")}
          />
        </div>
        <div className={cx("search-row")}>
          <label>Ngày bắt đầu</label>
          <input type="date" className={cx("search-input")} />
        </div>
        <div className={cx("search-row")}>
          <label>Ngày gửi</label>
          <input type="date" className={cx("search-input")} />
        </div>
      </div>

      {loadingRejectedList ? (
        <LoadingSpinner />
      ) : Array.isArray(rejectedList) && rejectedList.length === 0 ? (
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
                <th>Thời gian</th>
                <th>Người đặt</th>
                <th>Thời gian gửi</th>
                <th>Thời gian phê duyệt</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {rejectedList &&
                [...rejectedList]
                  .sort(
                    (a, b) =>
                      new Date(b.timeResponse).getTime() -
                      new Date(a.timeResponse).getTime()
                  )
                  .map((schedule) => {
                    return (
                      <tr key={schedule.requestFormId}>
                        <td>{schedule.requestReservation.title}</td>
                        <td>
                          {formatDateString(
                            schedule.requestReservation.timeStart
                          )}
                        </td>
                        <td>
                          {getHourMinute(schedule.requestReservation.timeStart)}{" "}
                          - {getHourMinute(schedule.requestReservation.timeEnd)}
                        </td>
                        <td>{schedule.reservations[0].booker.employeeName}</td>
                        <td>{formatDateString(schedule.timeRequest)}</td>
                        <td>{formatDateString(schedule.timeResponse)}</td>
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

export default RejectedList;

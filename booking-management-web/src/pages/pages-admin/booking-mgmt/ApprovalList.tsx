import classNames from "classnames/bind";
import styles from "./ApprovalList.module.scss";
import { useEffect, useState } from "react";
import { RequestFormProps, RoomProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import usePost from "../../../hooks/usePost";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";
import DetailModal from "../../../components/Modal/DetailRequestModal";
import { formatDateString, getHourMinute } from "../../../utilities";
import LoadingSpinner from "../../../components/spinner/LoadingSpinner";

const cx = classNames.bind(styles);

function ApprovalList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedRequestForm, setSelectedRequestForm] =
    useState<RequestFormProps | null>(null);
  const [reasonReject, setReasonReject] = useState<string>("");
  const [openModalReject, setOpenModalReject] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  // Lấy danh sách lịch đặt phòng cần phê duyệt
  let {
    data: requestForm,
    loading: loadingReservation,
    error: errorReservation,
  } = useFetch<RequestFormProps[]>(
    `http://localhost:8080/api/v1/requestForm/getRequestFormByStatus?statusRequestForm=PENDING`
  );

  const [schedulesApprove, setSchedulesApprove] = useState<RequestFormProps[]>(
    requestForm ?? []
  );

  useEffect(() => {
    setSchedulesApprove(requestForm ?? []);
  }, [requestForm]);

  // Xử lý chọn/bỏ chọn item
  const handleCheckboxChange = (id: number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  // Phê duyệt
  const {
    data: deActiveDataRe,
    loading: deActiveLoading,
    error: deActiveError,
    postData: approvalForm,
  } = usePost<string[]>(
    "http://localhost:8080/api/v1/requestForm/approveRequestForm"
  );

  // Hàm phê duyệt
  const handleApprove = async () => {
    console.log(selectedItems);

    const resp = await approvalForm(selectedItems, { method: "POST" });

    if (resp) {
      setPopupMessage("Lịch đã được phê duyệt thành công!");
      setPopupType("success");
      setIsPopupOpen(true);

      setSchedulesApprove(
        schedulesApprove.filter(
          (res) => !selectedItems.includes(res.requestFormId)
        )
      );

      requestForm = [];
    } else {
      setPopupMessage("Phê duyệt thất bại!");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // Từ chối
  const {
    data: nonActiveDataRes,
    loading: nonActiveLoading,
    error: nonActiveError,
    postData: nonActiveData,
  } = usePost<string[]>(
    `http://localhost:8080/api/v1/requestForm/rejectRequestForm?reasonReject=${reasonReject}`
  );

  // Hàm từ chối
  const handleRejected = async (reasonReject: string) => {
    console.log(reasonReject);

    if (!reasonReject) {
      setPopupMessage("Vui lòng nhập lý do từ chối!");
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    const resp = await nonActiveData(selectedItems, { method: "POST" });

    if (resp) {
      setPopupMessage("Lịch đã bị từ chối thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      setOpenModalReject(false);

      setSchedulesApprove(
        schedulesApprove.filter(
          (res) => !selectedItems.includes(res.requestFormId)
        )
      );

      requestForm = [];
    } else {
      setPopupMessage("Từ chối thất bại!");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // đóng mở modal từ chối
  const handleOpenModalReject = () => {
    setReasonReject("");
    setOpenModalReject(true);
  };
  const handleCloseModalReject = () => {
    setOpenModalReject(false);
  };

  // đóng mở modal
  const handleShowDetails = (requestForm: RequestFormProps) => {
    setSelectedRequestForm(requestForm);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequestForm(null);
  };

  // Lọc danh sách yêu cầu theo từ khóa tìm kiếm
  const filteredRequestList = schedulesApprove?.filter((form) => {
    const titleMatch = form.requestReservation.title
      .toLowerCase()
      .includes(searchQuery);
    const nameBookerMatch = form.reservations[0].booker.employeeName
      .toLowerCase()
      .includes(searchQuery);
    return titleMatch || nameBookerMatch;
  });
  return (
    <div className={cx("approve-list")}>
      <div className={cx("approve-search")}>
        <div className={cx("search-row")}>
          <div className={cx("search-group")}>
            <label>Tìm kiếm</label>
            <input
              type="text"
              placeholder="Tiêu đề cuộc họp, tên người đặt"
              className={cx("search-input")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            />
          </div>
          <div className={cx("search-group")}>
            <label>Thời gian </label>
            <input type="date" className={cx("search-input")} />
          </div>
          <div className={cx("search-group")}>
            <label>Chọn phòng</label>
            <select className={cx("search-input")}>
              <option value="all">Tất cả</option>
            </select>
          </div>
          <button className={cx("btn-action", "search-btn")}>Tìm kiếm</button>
        </div>

        <div className={cx("device")}></div>

        <div className={cx("actions")}>
          <button
            className={cx("btn-action", "approve-btn")}
            onClick={handleApprove}
            disabled={selectedItems.length === 0}
          >
            ✔ Phê Duyệt
          </button>
          <button
            className={cx("btn-action", "reject-btn")}
            onClick={handleOpenModalReject}
            disabled={selectedItems.length === 0}
          >
            ✖ Từ Chối
          </button>
        </div>
      </div>

      {/* Modal từ chối */}
      {openModalReject && (
        <div className={cx("modal-reject")}>
          <div className={cx("modal-content")}>
            <h3>Lý do từ chối</h3>
            <input
              type="text"
              className={cx("reason-input")}
              value={reasonReject}
              onChange={(e) => setReasonReject(e.target.value)}
            />
            <div className={cx("actions")}>
              <button
                className={cx("btn-action", "reject-btn")}
                onClick={() => handleRejected(reasonReject)}
              >
                Xác nhận
              </button>
              <button
                className={cx("btn-action", "search-btn")}
                onClick={handleCloseModalReject}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {loadingReservation ? (
        <LoadingSpinner />
      ) : Array.isArray(filteredRequestList) &&
        filteredRequestList.length === 0 ? (
        <p className={cx("no-schedule-message")}>
          Bạn không có lịch cần phê duyệt
        </p>
      ) : (
        <div className={cx("schedule-list")}>
          <table className={cx("schedule-table")}>
            <thead>
              <tr>
                <th>Chọn</th>
                <th>Tiêu đề</th>
                <th>Ngày</th>
                <th>Giờ bắt đầu - Kết thúc</th>
                <th>Người đặt</th>
                <th>Loại yêu cầu</th>
                <th>Thời gian gửi</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequestList?.map((schedule) => {
                return (
                  <tr key={schedule.requestFormId}>
                    <td className={cx("checkbox")}>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(schedule.requestFormId)}
                        onChange={() =>
                          handleCheckboxChange(schedule.requestFormId)
                        }
                      />
                    </td>
                    <td>{schedule.requestReservation.title}</td>
                    <td>
                      {formatDateString(schedule.requestReservation.timeStart)}
                    </td>
                    <td>
                      {getHourMinute(schedule.requestReservation.timeStart)} -{" "}
                      {getHourMinute(schedule.reservations[0].timeEnd)}
                    </td>
                    <td>{schedule.reservations[0]?.booker.employeeName}</td>
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

export default ApprovalList;

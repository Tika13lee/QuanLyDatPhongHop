import classNames from "classnames/bind";
import styles from "./Approve.module.scss";
import { useEffect, useState } from "react";
import {
  RequestFormProps,
  ReservationDetailProps,
  ReservationProps,
} from "../../../data/data";
import DetailModal from "./DetailModal";
import useFetch from "../../../hooks/useFetch";
import usePost from "../../../hooks/usePost";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";

const cx = classNames.bind(styles);

function Approve() {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationDetailProps | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  // Lấy chi tiết lịch đặt phòng
  const {
    data: reservationDetail,
    loading,
    error,
  } = useFetch<ReservationDetailProps>(
    selectedReservationId
      ? `http://localhost:8080/api/v1/reservation/getReservationById?reservationId=${selectedReservationId}`
      : ""
  );

  // Lấy danh sách lịch đặt phòng cần phê duyệt
  let {
    data: reservation,
    loading: loadingReservation,
    error: errorReservation,
  } = useFetch<RequestFormProps[]>(
    `http://localhost:8080/api/v1/requestForm/getRequestFormByApproverId?approverId=${user.employeeId}&statusRequestForm=PENDING`
  );

  const [schedulesApprove, setSchedulesApprove] = useState<RequestFormProps[]>(
    reservation ?? []
  );

  useEffect(() => {
    setSchedulesApprove(reservation ?? []);
    fetch(
      `http://localhost:8080/api/v1/requestForm/getRequestFormByApproverId?approverId=${user.employeeId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSchedulesApprove(data);
      });
  }, [reservation]);

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
    data: deActiveDataRes,
    loading: deActiveLoading,
    error: deActiveError,
    postData: deActiveData,
  } = usePost<string[]>(
    "http://localhost:8080/api/v1/reservation/approveReservation"
  );

  // Hàm phê duyệt
  const handleApprove = async () => {
    console.log(selectedItems);
    const resp = await deActiveData(selectedItems, { method: "PUT" });

    if (resp) {
      setPopupMessage("Lịch đã được phê duyệt!");
      setPopupType("success");
      setIsPopupOpen(true);

      setSchedulesApprove(
        schedulesApprove.filter(
          (res) => !selectedItems.includes(res.requestFormId)
        )
      );

      reservation = [];
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
    "http://localhost:8080/api/v1/reservation/disApproveReservation"
  );

  // Hàm từ chối
  const handleRejected = async () => {
    console.log(selectedItems);
    const resp = await nonActiveData(selectedItems, { method: "PUT" });

    if (resp) {
      setPopupMessage("Lịch đã bị từ chối!");
      setPopupType("success");
      setIsPopupOpen(true);

      setSchedulesApprove(
        schedulesApprove.filter(
          (res) => !selectedItems.includes(res.requestFormId)
        )
      );

      reservation = [];
    } else {
      setPopupMessage("Từ chối thất bại!");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // Cập nhật state khi API trả về dữ liệu
  useEffect(() => {
    if (reservationDetail) {
      setSelectedReservation(reservationDetail);
      setIsModalOpen(true);
    }
  }, [reservationDetail]);

  const handleShowDetails = (reservationId: number) => {
    setSelectedReservationId(reservationId);
  };

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservationId(null);
    setSelectedReservation(null);
  };

  return (
    <div className={cx("approve")}>
      <div className={cx("approve-search")}>
        <div className={cx("search-row")}>
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
          <button className={cx("btn-action", "search-btn")}>Tìm kiếm</button>
        </div>

        <div className={cx("device")}></div>
        <div className={cx("actions")}>
          <button
            className={cx("btn-action", "approve-btn")}
            onClick={handleApprove}
          >
            ✔ Phê Duyệt
          </button>
          <button
            className={cx("btn-action", "reject-btn")}
            onClick={handleRejected}
          >
            ✖ Từ Chối
          </button>
        </div>
      </div>

      {Array.isArray(schedulesApprove) && schedulesApprove.length === 0 ? (
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
                <th>Thời gian gửi</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {schedulesApprove?.map((schedule) => {
                const meetingStart = formatDateTime(
                  schedule.requestReservation.timeStart
                );
                const meetingEnd = formatDateTime(
                  schedule.requestReservation.timeEnd
                );

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
                    <td>{meetingStart.date}</td>
                    <td>
                      {meetingStart.time} - {meetingEnd.time}
                    </td>
                    <td>{schedule.reservations[0]?.booker.employeeName}</td>
                    <td>{new Date(schedule.timeRequest).toLocaleString()}</td>
                    <td>
                      <div
                        className={cx("actions")}
                        // onClick={() =>
                        //   handleShowDetails(schedule.reservationId)
                        // }
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
      {/* <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        reservation={selectedReservation}
      /> */}
    </div>
  );
}

export default Approve;

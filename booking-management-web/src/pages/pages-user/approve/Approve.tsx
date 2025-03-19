import classNames from "classnames/bind";
import styles from "./Approve.module.scss";
import { useEffect, useState } from "react";
import { ReservationDetailProps, ReservationProps } from "../../../data/data";
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
  } = useFetch<ReservationProps[]>(
    `http://localhost:8080/api/v1/reservation/getReservationsPending?approverId=${user.employeeId}`
  );

  const [schedulesApprove, setSchedulesApprove] = useState<ReservationProps[]>(
    reservation ?? []
  );

  useEffect(() => {
    setSchedulesApprove(reservation ?? []);

    fetch(
      `http://localhost:8080/api/v1/reservation/getReservationsPending?approverId=${user.employeeId}`
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
          (res) => !selectedItems.includes(res.reservationId)
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
          (res) => !selectedItems.includes(res.reservationId)
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
          <button className={cx("btn-action", "details-btn")}>Tìm kiếm</button>
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
          {schedulesApprove?.map((schedule) => {
            const meetingStart = formatDateTime(schedule.timeStart);
            const meetingEnd = formatDateTime(schedule.timeEnd);
            const bookingTime = formatDateTime(schedule.time);

            return (
              <div key={schedule.reservationId} className={cx("schedule-card")}>
                <div className={cx("card-content")}>
                  <div className={cx("schedule-layout")}>
                    <div className={cx("checkbox-container")}>
                      {/* check */}
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(schedule.reservationId)}
                        onChange={() =>
                          handleCheckboxChange(schedule.reservationId)
                        }
                      />
                      <h3>{schedule.title}</h3>
                    </div>
                    <div className={cx("left-info")}>
                      <p>
                        <strong>Ngày:</strong> {meetingStart.date}
                      </p>
                      <p>
                        từ {meetingStart.time} - {meetingEnd.time}
                      </p>
                    </div>
                    <div className={cx("center-info")}>
                      <p>
                        <strong>Người đặt:</strong> {schedule.nameBooker}
                      </p>
                    </div>
                    <div className={cx("center-info")}>
                      <p>
                        <strong>Thời gian gửi:</strong>{" "}
                        {new Date(schedule.time).toLocaleString()}
                      </p>
                    </div>

                    <div className={cx("right-info")}>
                      <div
                        className={cx("actions")}
                        onClick={() =>
                          handleShowDetails(schedule.reservationId)
                        }
                      >
                        <label>Chi tiết</label>
                        <IconWrapper icon={MdOutlineInfo} color="#FFBB49" />
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

export default Approve;

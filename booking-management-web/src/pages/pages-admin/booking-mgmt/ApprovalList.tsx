import classNames from "classnames/bind";
import styles from "./ApprovalList.module.scss";
import CardApproval from "../../../components/cardApproval/CardApproval";
import { useEffect, useState } from "react";
import { ReservationDetailProps, ReservationProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import axios from "axios";

const cx = classNames.bind(styles);

function ApprovalList() {
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [selectedTab, setSelectedTab] = useState<"booking" | "cancel">(
    "booking"
  );
  const [reservationDetail, setReservationDetail] =
    useState<ReservationDetailProps | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  console.log(selectedReservationId);

  // Gọi API danh sách đặt phòng chờ duyệt
  const {
    data: bookingList,
    loading: loadingBooking,
    error: errorBooking,
  } = useFetch<ReservationProps[]>(
    "http://localhost:8080/api/v1/reservation/getReservationsPending"
  );

  // Gọi API danh sách chờ hủy phòng
  const {
    data: cancelList,
    loading: loadingCancel,
    error: errorCancel,
  } = useFetch<ReservationProps[]>(
    "http://localhost:8080/api/v1/reservation/getReservationsWaitingCancel"
  );

  // Gọi API lấy chi tiết đặt phòng dựa trên ID đã chọn
  useEffect(() => {
    if (!selectedReservationId) return;

    setLoadingDetail(true);
    setErrorDetail(null);

    axios
      .get(
        `http://localhost:8080/api/v1/reservation/getReservationById?reservationId=${selectedReservationId}`
      )
      .then((response) => {
        setReservationDetail(response.data);
      })
      .catch((error) => {
        setErrorDetail(error.message);
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  }, [selectedReservationId]);

  const reservations =
    selectedTab === "booking" ? bookingList ?? [] : cancelList ?? [];

  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }
  return (
    <div className={cx("approval-list-container")}>
      {/* Danh sách các phòng */}
      <div className={cx("approval-list")}>
        <div className={cx("approval-list__header")}>
          <p>Danh sách phê duyệt</p>
          <div className={cx("header-actions")}>
            <div
              className={cx({ active: selectedTab === "booking" })}
              onClick={() => setSelectedTab("booking")}
            >
              Đặt phòng
            </div>
            <div
              className={cx({ active: selectedTab === "cancel" })}
              onClick={() => setSelectedTab("cancel")}
            >
              Hủy phòng
            </div>
          </div>
        </div>

        {loadingBooking || loadingCancel ? (
          <p>Đang tải danh sách...</p>
        ) : errorBooking || errorCancel ? (
          <p className={cx("error")}>Lỗi: Không thể tải dữ liệu</p>
        ) : reservations.length === 0 ? (
          <p className={cx("empty-message")}>Không có yêu cầu nào</p>
        ) : (
          reservations.map((reservation) => (
            <CardApproval
              key={reservation.reservationId}
              reservation={reservation}
              isActive={selectedReservationId === reservation.reservationId}
              onClick={() =>
                setSelectedReservationId(reservation.reservationId)
              }
            />
          ))
        )}
      </div>

      {/* Chi tiết phòng đã chọn */}
      <div className={cx("")}>
        {selectedReservationId ? (
          loadingDetail ? (
            <p>Đang tải chi tiết...</p>
          ) : errorDetail ? (
            <p className={cx("error")}>Lỗi: Không thể tải chi tiết</p>
          ) : reservationDetail ? (
            <div className={cx("approval-detail")}>
              <h2>{reservationDetail.title}</h2>
              <p>
                <strong>Người đặt:</strong>{" "}
                {reservationDetail.booker.employeeName}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {reservationDetail.booker.phone}
              </p>
              <p>
                <strong>Email:</strong> {reservationDetail.booker.email}
              </p>
              <p>
                <strong>Thời gian đặt:</strong>{" "}
                {formatDateTime(reservationDetail.time)}
              </p>
              <p>
                <strong>Thời gian lịch: </strong>
                {reservationDetail.timeStart
                  .split("T")[1]
                  .substring(0, 5)} -{" "}
                {formatDateTime(reservationDetail.timeEnd)}
              </p>
              <p>
                <strong>Phòng:</strong> {reservationDetail.room.roomName}
              </p>
              <p className="room-location">
                <strong>Vị trí:</strong>{" "}
                {reservationDetail.room.location.building.branch.branchName} -{" "}
                {reservationDetail.room.location.building.buildingName} -{" "}
                {reservationDetail.room.location.floor}
              </p>
              <p>
                <strong>Loại phòng:</strong> {reservationDetail.room.typeRoom}
              </p>
              <p>
                <strong>Trạng thái phòng:</strong>
                <span
                  className={cx("room-status", {
                    available:
                      reservationDetail.room.statusRoom === "AVAILABLE",
                    occupied: reservationDetail.room.statusRoom === "OCCUPIED",
                    maintenance:
                      reservationDetail.room.statusRoom === "MAINTENANCE",
                  })}
                >
                  {reservationDetail.room.statusRoom}
                </span>
              </p>

              <p>
                <strong>Ghi chú:</strong> {reservationDetail.note}
              </p>
              <p>
                <strong>Mô tả:</strong> {reservationDetail.description}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {reservationDetail.statusReservation}
              </p>
              <div>
                {reservationDetail.services?.map((service) => (
                  <div key={service.serviceId}>
                    <span>
                      <strong>Dịch vụ:</strong> {service.serviceName}
                    </span>
                    <span>
                      <strong>Giá:</strong> {service.price.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Không có dữ liệu chi tiết</p>
          )
        ) : (
          <p>Chọn một mục để xem chi tiết</p>
        )}
      </div>
    </div>
  );
}

export default ApprovalList;

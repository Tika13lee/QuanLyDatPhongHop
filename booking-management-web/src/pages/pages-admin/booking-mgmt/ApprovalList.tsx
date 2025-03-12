import classNames from "classnames/bind";
import styles from "./ApprovalList.module.scss";
import CardApproval from "../../../components/cardApproval/CardApproval";
import { useState } from "react";
import { ReservationProps, reservations } from "../../../data/data";

const cx = classNames.bind(styles);

function ApprovalList() {
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationProps | null>(null);

  return (
    <div className={cx("approval-list-container")}>
      <div className={cx("approval-list")}>
        <div className={cx("approval-list__header")}>
          <p>Danh sách phê duyệt</p>
        </div>
        {reservations.map((reservation) => (
          <CardApproval
            key={reservation.id}
            reservation={reservation}
            isActive={selectedReservation?.id === reservation.id}
            onClick={() => setSelectedReservation(reservation)}
          />
        ))}
      </div>
      <div className={cx("approval-detail")}>
        {selectedReservation ? (
          <div className={cx("approval-detail")}>
          <h2>{selectedReservation.title}</h2>
          <p>
            <strong>Người đặt:</strong> {selectedReservation.booker.name}
          </p>
          <p>
            <strong>Thời gian:</strong> Ngày {selectedReservation.time} từ{" "}
            {selectedReservation.timeStart} - {selectedReservation.timeEnd}
          </p>
          <p>
            <strong>Phòng:</strong> {selectedReservation.room.roomName}
          </p>
          <p className="room-location">
            <strong>Vị trí:</strong> {selectedReservation.room.location.branch} -{" "}
            {selectedReservation.room.location.building} -{" "}
            {selectedReservation.room.location.floor} -{" "}
            {selectedReservation.room.location.number}
          </p>
          <p>
            <strong>Loại phòng:</strong> {selectedReservation.room.typeRoom}
          </p>
          <p>
            <strong>Trạng thái phòng:</strong>{" "}
            <span className={cx("room-status", {
              available: selectedReservation.room.statusRoom === "Sẵn sàng",
              occupied: selectedReservation.room.statusRoom === "Đang sử dụng",
              maintenance: selectedReservation.room.statusRoom === "Bảo trì"
            })}>
              {selectedReservation.room.statusRoom}
            </span>
          </p>
        
          {selectedReservation.room.devices.length > 0 && (
            <div>
              <strong>Thiết bị:</strong>
              <ul>
                {selectedReservation.room.devices.map((device, index) => (
                  <li key={index}>
                    <span>{device.deviceName}</span>
                    <span>{device.quantity} cái</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        
          <p>
            <strong>Ghi chú:</strong> {selectedReservation.note}
          </p>
          <p>
            <strong>Mô tả:</strong> {selectedReservation.description}
          </p>
        </div>
        
        ) : (
          <p>Chọn một mục để xem chi tiết</p>
        )}
      </div>
    </div>
  );
}

export default ApprovalList;

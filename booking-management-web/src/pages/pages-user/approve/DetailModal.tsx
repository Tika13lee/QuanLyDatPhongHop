import React from "react";
import classNames from "classnames/bind";
import styles from "./DetailModal.module.scss";
import { ReservationDetailProps } from "../../../data/data";

const cx = classNames.bind(styles);

type DetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationDetailProps | null;
};

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  reservation,
}) => {
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
  if (!isOpen || !reservation) return null;

  const meetingStart = formatDateTime(reservation.timeStart);
  const meetingEnd = formatDateTime(reservation.timeEnd);
  const bookingTime = formatDateTime(reservation.time);

  return (
    <div className={cx("modal-overlay")} onClick={onClose}>
      <div className={cx("modal-content")} onClick={(e) => e.stopPropagation()}>
        <button className={cx("close-btn")} onClick={onClose}>
          ✖
        </button>
        <h3>Thông tin chi tiết lịch đặt</h3>
        <div className={cx("modal-body")}>
          <div className={cx("modal-info")}>
            <div className={cx("left-column")}>
              <p>
                <strong>Tiêu đề cuộc họp:</strong> {reservation.title}
              </p>
              <p>
                <strong>Ngày họp:</strong> {meetingStart.date}
              </p>
              <p>
                <strong>Thời gian:</strong> {meetingStart.time} -{" "}
                {meetingEnd.time}
              </p>
              <p>
                <strong>Phòng:</strong> {reservation.room.roomName}
              </p>
              <p>
                <strong>Địa điểm:</strong>{" "}
                {reservation.room.location.building.branch.branchName} - tòa nhà{" "}
                {reservation.room.location.building.buildingName} - tầng{" "}
                {reservation.room.location.floor}
              </p>
              <p>
                <strong>Tổng chi phí:</strong> {reservation.total} VNĐ
              </p>
            </div>

            <div className={cx("right-column")}>
              <p>
                <strong>Người đặt:</strong> {reservation.booker.employeeName}
              </p>
              <p>
                <strong>Mô tả:</strong>{" "}
                {reservation.description || "Không có mô tả"}
              </p>
              <div>
                <strong>Người tham gia:</strong>
                <ul>
                  {reservation.attendants?.map((attendant: any) => (
                    <li key={attendant.employeeId}>{attendant.employeeName}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Tài liệu cuộc họp:</strong>
                <ul>
                  {reservation.filePaths?.map((file: string, index: number) => (
                    <li key={index}>
                      <a href={file} target="_blank" rel="noopener noreferrer">
                        {file}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailModal;

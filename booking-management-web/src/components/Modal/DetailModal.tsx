import React from "react";
import classNames from "classnames/bind";
import styles from "./DetailModal.module.scss";
import { RequestFormProps, ReservationDetailProps } from "../../data/data";
import { formatCurrencyVND } from "../../utilities";

const cx = classNames.bind(styles);

type DetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  requestForm: RequestFormProps | null;
};

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  requestForm,
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

  if (!isOpen || !requestForm) return null;

  const meetingStart = formatDateTime(requestForm.requestReservation.timeStart);
  const meetingEnd = formatDateTime(requestForm.requestReservation.timeEnd);
  const timeEndFrequency = formatDateTime(
    requestForm.requestReservation.timeFinishFrequency[
      requestForm.requestReservation.timeFinishFrequency.length - 1
    ]
  );
  
  return (
    <div className={cx("modal-overlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        <button className={cx("close-btn")} onClick={onClose}>
          ✖
        </button>
        <h3>Thông tin chi tiết lịch đặt</h3>
        <div className={cx("modal-content")}>
          <div className={cx("info-left")}>
            <p>
              <strong>Tiêu đề:</strong> {requestForm.requestReservation.title}
            </p>
            <p>
              <strong>Mô tả:</strong>{" "}
              {requestForm.requestReservation.description}
            </p>
            <p>
              <strong>Ghi chú:</strong> {requestForm.requestReservation.note}
            </p>
            <div className={cx("info-row")}>
              <p>
                <strong>Ngày:</strong> {meetingStart.date}
              </p>
              <p>
                <strong>Giờ:</strong> {meetingStart.time} - {meetingEnd.time}
              </p>
            </div>
            <div className={cx("info-row")}>
              <p>
                <strong>Phòng:</strong>{" "}
                {requestForm.reservations[0].room.roomName}
              </p>
              <p>
                <strong>Sức chứa:</strong>{" "}
                {requestForm.reservations[0].room.capacity}
              </p>
              <p>
                <strong>Loại phòng:</strong>{" "}
                {requestForm.reservations[0].room.typeRoom === "VIP"
                  ? "VIP"
                  : requestForm.reservations[0].room.typeRoom === "DEFAULT"
                  ? "Mặc định"
                  : "Hội nghị"}
              </p>
            </div>
            <p>
              <strong>Tần suất:</strong>{" "}
              {requestForm.requestReservation.frequency === "ONE_TIME"
                ? "Một lần"
                : requestForm.requestReservation.frequency === "DAILY"
                ? "Hàng ngày"
                : "Hàng tuần"}
            </p>
            <p>
              <strong>Thời gian kết thúc tần suất:</strong>{" "}
              {requestForm.requestReservation.frequency === "WEEKLY"
                ? timeEndFrequency.date
                : "Không có"}
            </p>
            <p>
              <strong>Vị trí:</strong> Tầng{" "}
              {requestForm.reservations[0].room.location.floor} - tòa {""}
              {
                requestForm.reservations[0].room.location.building.buildingName
              }{" "}
              - chi nhánh{" "}
              {
                requestForm.reservations[0].room.location.building.branch
                  .branchName
              }
            </p>

            <p>
              <strong>Chi phí:</strong>{" "}
              {formatCurrencyVND(requestForm.reservations[0].total)}
            </p>
          </div>

          <div className={cx("info-right")}>
            <ul className={cx("container-list")}>
              <strong>Tài liệu</strong>
              {requestForm.reservations[0].filePaths.map((file, index) => (
                <li key={index}>
                  <a href={file} target="_blank" rel="noreferrer">
                    {file}
                  </a>
                </li>
              ))}
            </ul>
            <ul className={cx("container-list")}>
              <strong>Dịch vụ</strong>
              {requestForm.reservations[0].services?.map((service) => (
                <li key={service.serviceId}>
                  {service.serviceName} -{" "}
                  {/* {formatCurrencyVND(service.price.value)} */}
                </li>
              ))}
            </ul>
            <ul className={cx("container-list")}>
              <strong>Người tham gia</strong>
              {requestForm.reservations[0].attendants?.map((p) => (
                <li key={p.employeeId}>
                  <div className={cx("info-row")}>
                    <p>{p.employeeName}</p>
                    <p>{p.phone}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;

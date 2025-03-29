import React from "react";
import classNames from "classnames/bind";
import styles from "./DetailRequestModal.module.scss";
import { RequestFormProps } from "../../data/data";
import { formatCurrencyVND } from "../../utilities";
import CloseModalButton from "./CloseModalButton";

const cx = classNames.bind(styles);

type DetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  requestForm: RequestFormProps | null;
};

const DetailRequestModal: React.FC<DetailModalProps> = ({
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
        <CloseModalButton onClick={onClose} />
        <h3>Thông tin chi tiết yêu cầu</h3>
        <div className={cx("modal-content")}>
          <div className={cx("info-left")}>
            <div className={cx("info-row")}>
              <p>
                <strong>Tiêu đề:</strong> {requestForm.reservations[0].title}
              </p>
            </div>
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
                <strong>Tần suất:</strong>{" "}
                {requestForm.reservations[0].frequency === "ONE_TIME"
                  ? "Một lần"
                  : requestForm.reservations[0].frequency === "DAILY"
                  ? "Hàng ngày"
                  : "Hàng tuần"}
              </p>
              <p>
                <strong>Thời gian kết thúc:</strong>{" "}
                {requestForm.requestReservation.frequency === "ONE_TIME"
                  ? "Không có"
                  : timeEndFrequency.date}
              </p>
            </div>
            <div className={cx("info-row")}>
              <p>
                <strong>Mô tả:</strong>{" "}
                {requestForm.reservations[0].description}
              </p>
            </div>
            <div className={cx("info-row")}>
              <p>
                <strong>Ghi chú:</strong> {requestForm.reservations[0].note}
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
            <div className={cx("info-row")}>
              <p>
                <strong>Vị trí:</strong> Tầng{" "}
                {requestForm.reservations[0].room.location.floor} - tòa {""}
                {
                  requestForm.reservations[0].room.location.building
                    .buildingName
                }{" "}
                - chi nhánh{" "}
                {
                  requestForm.reservations[0].room.location.building.branch
                    .branchName
                }
              </p>
            </div>

            <div className={cx("info-row")}>
              <p>
                <strong>Chi phí:</strong>{" "}
                {formatCurrencyVND(requestForm.reservations[0].total)}
              </p>
            </div>
            <div className={cx("info-row")}>
              <p>
                <strong>Trạng thái của yêu cầu:</strong>{" "}
                {requestForm.statusRequestForm === "PENDING"
                  ? "Đang chờ phê duyệt"
                  : requestForm.statusRequestForm === "APPROVED"
                  ? "Đã phê duyệt"
                  : "Từ chối"}
              </p>
            </div>
            <div className={cx("info-row")}>
              <p>
                <strong>Lý do từ chối:</strong>{" "}
                {requestForm.reasonReject || "Không có"}
              </p>
            </div>
            <div className={cx("info-row")}>
              <p>
                <strong>Thời gian phản hồi:</strong>{" "}
                {requestForm.timeResponse
                  ? formatDateTime(requestForm.timeResponse).date
                  : "Chưa có"}
              </p>
            </div>
          </div>

          <div className={cx("info-right")}>
            <ul className={cx("container-list")}>
              <div className={cx("list-header")}>
                <strong>Tài liệu</strong>
              </div>
              {requestForm.reservations[0].filePaths.map((file, index) => (
                <li key={index}>
                  <a href={file} target="_blank" rel="noreferrer">
                    {file}
                  </a>
                </li>
              ))}
            </ul>

            <ul className={cx("container-list")}>
              <div className={cx("list-header")}>
                <strong>Dịch vụ</strong>
              </div>
              {requestForm.reservations[0].services?.map((service) => (
                <li key={service.serviceId}>
                  {service.serviceName} -{" "}
                  {formatCurrencyVND(service.priceService.value)}
                </li>
              ))}
            </ul>
            <ul className={cx("container-list")}>
              <div className={cx("list-header")}>
                <strong>Người tham gia</strong>
              </div>
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

export default DetailRequestModal;

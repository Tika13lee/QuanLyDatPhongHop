import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./DetailRequestModal.module.scss";
import { RequestFormProps } from "../../data/data";
import {
  formatCurrencyVND,
  formatDateString,
  getHourMinute,
} from "../../utilities";
import CloseModalButton from "./CloseModalButton";
import PopupNotification from "../popup/PopupNotification";
import usePost from "../../hooks/usePost";
import { on } from "events";

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
  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  // Lấy thông tin người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem("currentUser")!);

  const { postData: cancelRequestForm } = usePost<string[]>(
    "http://localhost:8080/api/v1/requestForm/cancelRequestForm"
  );

  if (!isOpen || !requestForm) return null;

  // hủy yêu cầu
  const handleCancelSchedule = async () => {
    const listRequestFormId = [requestForm.requestFormId];

    const response = await cancelRequestForm(listRequestFormId, {
      method: "POST",
    });

    if (response) {
      setPopupMessage("Hủy yêu cầu thành công");
      setPopupType("success");
      setIsPopupOpen(true);
      window.dispatchEvent(new Event("requestForm:changed"));
    } else {
      setPopupMessage("Hủy yêu cầu thất bại");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  return (
    <div className={cx("modal-overlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        <CloseModalButton onClick={onClose} />
        <button
          className={cx("btn-cancel")}
          disabled={
            requestForm.statusRequestForm !== "PENDING" ||
            requestForm.reservations[0].booker.employeeId !== user.employeeId
          }
          onClick={handleCancelSchedule}
        >
          Hủy yêu cầu
        </button>
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
                <strong>Ngày:</strong>{" "}
                {formatDateString(requestForm.requestReservation.timeStart)}
              </p>
              <p>
                <strong>Giờ:</strong>{" "}
                {getHourMinute(requestForm.requestReservation.timeStart)} -{" "}
                {getHourMinute(requestForm.requestReservation.timeEnd)}
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
                  : formatDateString(
                      requestForm.requestReservation.timeFinishFrequency[
                        requestForm.requestReservation.timeFinishFrequency
                          .length - 1
                      ]
                    )}
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
                <strong>Người phê duyệt:</strong>{" "}
                {requestForm.reservations[0].room.approver.employeeName}
              </p>
              <p>{requestForm.reservations[0].room.approver.phone}</p>
            </div>
            <div className={cx("info-row")}>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {requestForm.statusRequestForm === "PENDING"
                  ? "Chờ phê duyệt"
                  : requestForm.statusRequestForm === "APPROVED"
                  ? "Đã phê duyệt"
                  : "Từ chối"}
              </p>
              <p>
                <strong>Thời gian phản hồi:</strong>{" "}
                {requestForm.timeResponse
                  ? formatDateString(requestForm.timeResponse)
                  : "Chưa có"}
              </p>
            </div>
            <div className={cx("info-row")}>
              <p>
                <strong>Lý do từ chối:</strong>{" "}
                {requestForm.reasonReject || "Không có"}
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

      {/* Hiển thị thông báo popup */}
      <PopupNotification
        message={popupMessage}
        type={popupType}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
};

export default DetailRequestModal;

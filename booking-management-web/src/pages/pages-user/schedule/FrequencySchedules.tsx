import classNames from "classnames/bind";
import styles from "./FrequencySchedules.module.scss";
import IconWrapper from "../../../components/icons/IconWrapper";
import { FaEdit, FiRefreshCw } from "../../../components/icons/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { RequestFormProps } from "../../../data/data";
import {
  formatCurrencyVND,
  formatDateString,
  getHourMinute,
} from "../../../utilities";
import CloseModalButton from "../../../components/Modal/CloseModalButton";
import DatePicker from "react-datepicker";
import PopupNotification from "../../../components/popup/PopupNotification";
import usePost from "../../../hooks/usePost";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const cx = classNames.bind(styles);

function FrequencySchedules() {
  const user = useSelector((state: RootState) => state.user);
  const [eventsByDay, setEventsByDay] = useState<RequestFormProps[]>([]);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<RequestFormProps | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedFrequencyEndDate, setSelectedFrequencyEndDate] =
    useState<Date | null>(null);

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  // Lấy ds requestForm
  useEffect(() => {
    axios
      .get<RequestFormProps[]>(
        `http://localhost:8080/api/v1/requestForm/getRequestFormByBookerId?bookerId=${user?.employeeId}`
      )
      .then((res) => {
        const filteredData = res.data.filter(
          (item) => item.typeRequestForm === "RESERVATION_RECURRING"
        );
        setEventsByDay(filteredData);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
      });
  }, []);

  // mở modal chi tiết
  const handleOpenModalDetail = (schedule: RequestFormProps) => {
    setSelectedSchedule(schedule);
    setOpenModalDetail(true);
  };

  // đóng modal chi tiết
  const handleCloseModalDetail = () => {
    setOpenModalDetail(false);
    setSelectedSchedule(null);
    setIsEdit(false);
    setSelectedFrequencyEndDate(null);
  };

  const {
    data: requestUpdate,
    loading: requestLoading,
    error: requestError,
    postData,
  } = usePost(
    `http://localhost:8080/api/v1/requestForm/createRequestFormUpdateReservationMany?requestFormId=${
      selectedSchedule?.requestFormId
    }&&dayFinishFrequencyNew=${selectedFrequencyEndDate?.toISOString()}`
  );

  // xử lý lưu chỉnh sửa
  const handleSaveEdit = async () => {
    if (selectedFrequencyEndDate && selectedFrequencyEndDate < new Date()) {
      setPopupMessage("Đã hết hạn chỉnh sửa!");
      setPopupType("error");
      setIsPopupOpen(true);

      return;
    }

    const updatedSchedule = {
      requestFormId: selectedSchedule?.requestFormId,
      dayFinishFrequencyNew: selectedFrequencyEndDate?.toISOString(),
    };

    console.log(updatedSchedule);

    const response = await postData(updatedSchedule, { method: "POST" });

    if (response) {
      setPopupMessage("Chỉnh sửa thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      handleCloseModalDetail();
    } else {
      setPopupMessage("Chỉnh sửa thất bại!");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  return (
    <div className={cx("frequency-schedules")}>
      <div className={cx("filter-bar")}>
        <div className={cx("filter-month")}>
          {/* tháng */}
          <label>Chọn tháng:</label>
          <select>
            <option value={0}>Tất cả</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        </div>
        {/* ngày */}
        <div className={cx("filter-date")}>
          <label>Chọn ngày:</label>
          <input type="date" />
        </div>
        {/* tên phòng */}
        <div className={cx("filter-room")}>
          <label>Chọn phòng:</label>
          <select>
            <option value="all">Tất cả</option>
            <option value="1">Phòng 1</option>
            <option value="2">Phòng 2</option>
            <option value="3">Phòng 3</option>
          </select>
        </div>
        <div className={cx("refresh-btn")}>
          <IconWrapper icon={FiRefreshCw} color="#000" size={24} />
        </div>
      </div>

      {/* ds lịch */}
      <div className={cx("schedule-list")}>
        {eventsByDay.map((event, index) => (
          <div
            className={cx("event-item")}
            key={index}
            onClick={() => handleOpenModalDetail(event)}
          >
            <div className={cx("event-info")}>
              <div className={cx("event-time")}>
                <span style={{ color: "red" }}>●</span>{" "}
                {getHourMinute(event.reservations[0].timeStart)} -{" "}
                {getHourMinute(event.reservations[0].timeEnd)} {""}
                <span className={cx("event-repeat")}>
                  ⏰{formatDateString(event.reservations[0].timeStart)} đến{" "}
                  {formatDateString(
                    event.reservations[event.reservations.length - 1].timeStart
                  )}
                </span>
              </div>
              <div className={cx("event-title")}>
                {event.reservations[0].title}
              </div>
            </div>

            <div className={cx("event-info")}>
              <div className={cx("event-room")}>
                Phòng {""}
                {event.reservations[0].room.roomName}
              </div>
              <div className={cx("event-location")}>
                {event.reservations[0].room.location.building.branch.branchName}{" "}
                {event.reservations[0].room.location.building.buildingName}-{" "}
                {event.reservations[0].room.location.floor}
              </div>
            </div>

            <div className={cx("event-participants")}>
              {event.reservations[0].attendants.slice(0, 5).map((avatar, i) => (
                <img
                  key={i}
                  src={avatar.avatar}
                  alt="avatar"
                  className={cx("avatar")}
                />
              ))}
              {event.reservations[0].attendants.length > 5 && (
                <span className={cx("more-participants")}>
                  +{event.reservations[0].attendants.length - 5}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* modal detail */}
      {openModalDetail && (
        <div className={cx("modal-detail")}>
          <div className={cx("modal-content")}>
            <CloseModalButton onClick={handleCloseModalDetail} />
            <div className={cx("modal-header")}>
              <button
                className={cx("btn-update")}
                onClick={() => {
                  if (
                    selectedSchedule?.reservations[
                      selectedSchedule?.reservations.length - 1
                    ].timeEnd &&
                    new Date(
                      selectedSchedule?.reservations[
                        selectedSchedule?.reservations.length - 1
                      ].timeEnd
                    ) < new Date()
                  ) {
                    setPopupMessage("Đã hết hạn chỉnh sửa!");
                    setPopupType("error");
                    setIsPopupOpen(true);
                    return;
                  }
                  setIsEdit(true);
                }}
              >
                <IconWrapper icon={FaEdit} size={16} color="white" />
                Chỉnh sửa
              </button>
              <h2>Chi tiết lịch</h2>
            </div>
            <div className={cx("modal-body")}>
              <div className={cx("info-detail")}>
                <p>
                  <strong>Tiêu đề:</strong>{" "}
                  {selectedSchedule?.reservations[0].title}
                </p>

                <p>
                  <strong>Thời gian:</strong>{" "}
                  {selectedSchedule?.reservations[0].timeStart &&
                    selectedSchedule?.reservations[0].timeEnd && (
                      <>
                        {getHourMinute(
                          selectedSchedule?.reservations[0].timeStart
                        )}{" "}
                        -{" "}
                        {getHourMinute(
                          selectedSchedule?.reservations[0].timeEnd
                        )}{" "}
                      </>
                    )}
                </p>

                <p>
                  <strong>Ngày bắt đầu:</strong>{" "}
                  {selectedSchedule?.reservations[0].timeStart &&
                    selectedSchedule?.reservations[
                      selectedSchedule?.reservations.length - 1
                    ].timeStart && (
                      <>
                        {formatDateString(
                          selectedSchedule.reservations[0].timeStart
                        )}{" "}
                        đến{" "}
                        {formatDateString(
                          selectedSchedule.reservations[
                            selectedSchedule.reservations.length - 1
                          ].timeStart
                        )}
                      </>
                    )}
                </p>
                {isEdit && (
                  <div className={cx("info-row")}>
                    <strong style={{ color: "#f39c12" }}>
                      Chọn ngày kết thúc:
                    </strong>
                    <div>
                      <DatePicker
                        selected={selectedFrequencyEndDate}
                        onChange={(date) => {
                          if (date) setSelectedFrequencyEndDate(date);
                        }}
                        dateFormat="dd / MM / yyyy"
                        minDate={
                          selectedSchedule?.reservations?.[0]?.timeStart &&
                          new Date(selectedSchedule.reservations[0].timeStart) >
                            new Date()
                            ? new Date(
                                selectedSchedule.reservations[0].timeStart
                              )
                            : new Date()
                        }
                      />
                    </div>
                  </div>
                )}

                <p>
                  <strong>Tần suất:</strong>{" "}
                  {selectedSchedule?.reservations[0].frequency === "ONE_TIME"
                    ? "Một lần"
                    : selectedSchedule?.reservations[0].frequency === "DAILY"
                    ? "Hàng ngày"
                    : "Hàng tuần"}
                </p>

                <div className={cx("info-row")}>
                  <p>
                    <strong>Phòng:</strong>{" "}
                    {selectedSchedule?.reservations[0].room.roomName}
                  </p>
                  <p>
                    <strong>Sức chứa:</strong>{" "}
                    {selectedSchedule?.reservations[0].room.capacity}
                  </p>
                  <p>
                    <strong>Loại phòng:</strong>{" "}
                    {selectedSchedule?.reservations[0].room.typeRoom === "VIP"
                      ? "VIP"
                      : selectedSchedule?.reservations[0].room.typeRoom ===
                        "DEFAULT"
                      ? "Mặc định"
                      : "Hội nghị"}
                  </p>
                </div>
                <p>
                  <strong>Vị trí:</strong> Tầng{" "}
                  {selectedSchedule?.reservations[0].room.location.floor} - tòa{" "}
                  {""}
                  {
                    selectedSchedule?.reservations[0].room.location.building
                      .buildingName
                  }{" "}
                  - chi nhánh{" "}
                  {
                    selectedSchedule?.reservations[0].room.location.building
                      .branch.branchName
                  }
                </p>

                <p>
                  <strong>Ghi chú:</strong>{" "}
                  {selectedSchedule?.reservations[0].note}
                </p>
                <p>
                  <strong>Mô tả:</strong>{" "}
                  {selectedSchedule?.reservations[0].description}
                </p>

                <p>
                  <strong>Chi phí:</strong>{" "}
                  {selectedSchedule?.reservations[0].total
                    ? formatCurrencyVND(selectedSchedule?.reservations[0].total)
                    : "Không rõ"}
                </p>
              </div>
            </div>
            {isEdit && (
              <div className={cx("modal-footer")}>
                <button
                  className={cx("btn-cancel")}
                  onClick={() => {
                    setIsEdit(false);
                  }}
                >
                  Hủy
                </button>
                <button className={cx("btn-update")} onClick={handleSaveEdit}>
                  Gửi phê duyệt
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hiển thị thông báo popup */}
      <PopupNotification
        message={popupMessage}
        type={popupType}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
}

export default FrequencySchedules;

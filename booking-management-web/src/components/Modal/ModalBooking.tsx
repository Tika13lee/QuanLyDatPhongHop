import { Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ModalBooking.module.scss";
import { times } from "../../utilities";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const cx = classNames.bind(styles);

type ModalBookingProps = {
  isModalOpen: boolean;
  setIsModalClose: () => void;
  roomName?: string;
  dateSelected?: string;
  timeStart?: string;
  dataRoomByBranch?: string[];
};

const ModalBooking: React.FC<ModalBookingProps> = ({
  isModalOpen,
  setIsModalClose,
  roomName,
  dateSelected,
  timeStart,
  dataRoomByBranch,
}) => {
  console.log("Vào");
  const [timeEndSchedule, setTimeEndSchedule] = useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<string>(times[0]);
  const [selectedDateEndOfFrequency, setSelectedDateEndOfFrequency] =
    useState<Date | null>(new Date());
  const [valueFrequency, setValueFrequency] = useState<string>("ONE_TIME");

  // hiển thị giờ kết thúc
  useEffect(() => {
    if (timeStart) {
      const index = times.findIndex((time) => time === timeStart);
      setTimeEndSchedule(times.slice(index + 1, times.length));
    } else {
      const index = times.findIndex((time) => time === selectedStartTime);
      setTimeEndSchedule(times.slice(index + 1, times.length));
    }
  }, [selectedStartTime]);

  // Xử lý khi nhấn nút gửi phê duyệt
  const handleSubmit = () => {
    setIsModalClose();
  };

  return (
    <Fragment>
      {isModalOpen ? (
        <div className={cx("modal-overlay")}>
          <div className={cx("modal")}>
            <button
              className={cx("close-btn")}
              onClick={() => setIsModalClose()}
            >
              ✖
            </button>
            <h3>Đặt lịch phòng</h3>

            <div className={cx("form")}>
              <div className={cx("form-info")}>
                <div className={cx("form-group")}>
                  <label>Chọn phòng</label>
                  {dataRoomByBranch?.length == 0 ? (
                    <select>
                      <option value={roomName}>{roomName}</option>
                    </select>
                  ) : (
                    <select>
                      {dataRoomByBranch?.map((room) => (
                        <option value={room}>{room}</option>
                      ))}
                    </select>
                  )}
                </div>
                {/* Tiêu đề cuộc họp */}
                <div className={cx("form-group")}>
                  <label>Tiêu đề</label>
                  <input
                    type="text"
                    placeholder="Nhập tiêu đề cuộc họp"
                    name="title"
                  />
                </div>

                {/* chọn ngày */}
                <div className={cx("form-group")}>
                  <label>Ngày</label>
                  <input
                    type="date"
                    name="time"
                    value={dateSelected}
                    disabled
                  />
                </div>

                <div className={cx("form-row")}>
                  {/* bắt đầu */}
                  <div className={cx("form-group")}>
                    <label>Giờ bắt đầu</label>
                    {timeStart ? (
                      <select
                        onChange={(e) => setSelectedStartTime(e.target.value)}
                      >
                        <option value={timeStart}>{timeStart}</option>
                      </select>
                    ) : (
                      <select
                        onChange={(e) => setSelectedStartTime(e.target.value)}
                      >
                        {times.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* kết thúc */}
                  <div className={cx("form-group")}>
                    <label>Giờ kết thúc</label>
                    <select>
                      {timeEndSchedule.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className={cx("form-group")}>
                  <label>Ghi chú</label>
                  <input type="text" placeholder="Nhập ghi chú" name="note" />
                </div>

                {/* Mô tả */}
                <div className={cx("form-group")}>
                  <label>Mô tả</label>
                  <input
                    type="text"
                    placeholder="Nhập mô tả"
                    name="description"
                  />
                </div>

                <div className={cx("form-row")}>
                  {/* Chọn tần suất */}
                  <div className={cx("form-group")}>
                    <label>Tần suất</label>
                    <select
                      name="frequency"
                      value={valueFrequency}
                      onChange={(e) => setValueFrequency(e.target.value)}
                    >
                      <option value="ONE_TIME">Một lần</option>
                      <option value="DAILY">Mỗi ngày</option>
                      <option value="WEEKLY">Mỗi tuần</option>
                    </select>
                  </div>

                  {/* Chọn ngày kết thúc */}
                  <div className={cx("form-group")}>
                    <label>Ngày kết thúc</label>
                    <DatePicker
                      selected={selectedDateEndOfFrequency}
                      onChange={(date) => setSelectedDateEndOfFrequency(date)}
                      minDate={new Date()}
                      dateFormat="dd/MM/yyyy"
                      disabled={valueFrequency === "ONE_TIME"}
                    />
                  </div>
                </div>
              </div>

              <div className={cx("devide")}></div>

              <div className={cx("form-info")}>
                {/* tài liệu */}
                <div className={cx("form-group")}>
                  <label>Tài liệu</label>
                  <input type="file" multiple name="filePaths" />
                </div>

                <select className={cx("form-group")}></select>

                {/* Chọn dịch vụ */}
                <div className={cx("form-group")}>
                  <label>Dịch vụ</label>
                  <div className={cx("checkbox-group")}>
                    <select>
                      <option value="" disabled>
                        Chọn dịch vụ
                      </option>
                    </select>
                  </div>
                </div>

                <div className={cx("form-group")}>
                  {/* <input type="text" readOnly value={serviceName.join(", ")} /> */}
                </div>

                {/* Người tham gia */}
                <div className={cx("form-row")}>
                  <label>Người tham gia</label>

                  <button className={cx("submit-btn")}>Thêm</button>
                </div>
              </div>
            </div>

            {/* Nút gửi phê duyệt */}
            <button className={cx("submit-btn")} onClick={handleSubmit}>
              Gửi phê duyệt
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </Fragment>
  );
};

export default ModalBooking;

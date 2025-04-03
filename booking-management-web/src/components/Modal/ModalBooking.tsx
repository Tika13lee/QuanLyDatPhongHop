import { Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ModalBooking.module.scss";
import {
  formatCurrencyVND,
  formatDateDate,
  formatDateString,
  times,
} from "../../utilities";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useFetch from "../../hooks/useFetch";
import { EmployeeProps, ReservationProps, ServiceProps } from "../../data/data";
import IconWrapper from "../icons/IconWrapper";
import { IoSettingsOutline } from "../../components/icons/icons";
import { FaPlus } from "../../components/icons/icons";
import usePost from "../../hooks/usePost";
import CloseModalButton from "./CloseModalButton";
import { set } from "react-datepicker/dist/date_utils";

const cx = classNames.bind(styles);

type RoomInfo = {
  roomName: string;
  roomId: string;
};

type typeMessage = "success" | "error" | "info" | "warning";

type ModalBookingProps = {
  isModalOpen: boolean;
  setIsModalClose: () => void;
  roomInfo?: RoomInfo;
  dateSelected?: string;
  timeStart?: string;
  timeEnd?: string;
  dataRoomByBranch?: RoomInfo[];
  setIsPopupOpen?: (message: string, type: typeMessage, close: boolean) => void;
};

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ModalBooking: React.FC<ModalBookingProps> = ({
  isModalOpen,
  setIsModalClose,
  roomInfo,
  dateSelected,
  timeStart,
  timeEnd,
  dataRoomByBranch,
  setIsPopupOpen,
}) => {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");

  console.log(dateSelected, timeStart, timeEnd);

  const [timeEndSchedule, setTimeEndSchedule] = useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<string>(times[0]);
  const [selectedDateEndOfFrequency, setSelectedDateEndOfFrequency] =
    useState<Date | null>(new Date());
  const [valueFrequency, setValueFrequency] = useState<string>("ONE_TIME");
  useState<boolean>(false);

  const [modalSetting, setModalSetting] = useState<boolean>(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [checkRemoveDays, setCheckRemoveDays] = useState<string[]>();
  const [dayOriginal, setDayOriginal] = useState<Date[]>([]);
  const [checkRemoveDates, setCheckRemoveDates] = useState<number[]>([]);
  const [typeRequestForm, setTypeRequestForm] = useState<string>(
    "RESERVATION_ONETIME"
  );

  const [openModalAddService, setOpenModalAddService] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceProps[]>([]);

  const [openModalAddParticipant, setOpenModalAddParticipant] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedEmployees, setSuggestedEmployees] = useState<EmployeeProps[]>(
    []
  );
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeProps[]>([
    user,
  ]);

  useEffect(() => {
    const filteredTimes = getTimes();
    if (filteredTimes.length > 0) {
      setSelectedStartTime(filteredTimes[0]);
    }
  }, [dateSelected]);

  // hiển thị giờ kết thúc
  useEffect(() => {
    if (timeStart) {
      const index = times.findIndex((time) => time === timeStart);
      setTimeEndSchedule(times.slice(index + 1, times.length));
      setFormData((prev) => ({
        ...prev,
        reservationDTO: {
          ...prev.reservationDTO,
          timeEnd: new Date(
            `${dateSelected ?? new Date().toString()}T${times[index + 1]}`
          ).toISOString(),
        },
      }));
    } else {
      const index = times.findIndex((time) => time === selectedStartTime);
      setTimeEndSchedule(times.slice(index + 1, times.length));
      setFormData((prev) => ({
        ...prev,
        reservationDTO: {
          ...prev.reservationDTO,
          timeEnd: new Date(
            `${dateSelected ?? new Date().toString()}T${times[index + 1]}`
          ).toISOString(),
        },
      }));
    }
  }, [selectedStartTime]);

  // lấy ngày trong khoảng thời gian
  const getDatesBetween = (startDate: Date, endDate: Date) => {
    const dates = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // lọc giờ theo ngày hiện tại
  const getTimes = () => {
    const currentDate = new Date();
    const selectedDate = new Date(dateSelected ?? currentDate);
    const isToday = currentDate.toDateString() === selectedDate.toDateString();

    if (!isToday) return times.slice(0, times.length - 1);

    const minutesNow = currentDate.getHours() * 60 + currentDate.getMinutes();
    const currentMinutes = Math.ceil(minutesNow / 30) * 30;

    const filteredTimes = times.filter((time) => {
      const [hour, minute] = time.split(":").map(Number);
      const timeInMinutes = hour * 60 + minute;
      return timeInMinutes >= currentMinutes;
    });

    return filteredTimes.slice(0, filteredTimes.length - 1);
  };

  // xử lý cập nhật timeFinsishFrequency
  const handleUpdateTimeFinsihFrequency = (dateFinishFequency: Date[]) => {
    if (valueFrequency === "WEEKLY") {
      const dayOfWeekByDayStart = dateSelected
        ? new Date(dateSelected).toString().split(" ")[0]
        : new Date().toString().split(" ")[0];
      const daysFilter = dateFinishFequency.filter(
        (date) => date.toString().split(" ")[0] === dayOfWeekByDayStart
      );
      return daysFilter;
    } else {
      return dateFinishFequency;
    }
  };

  // loại bỏ ngày
  const handleRemoveDate = () => {
    let data = [] as Date[];
    setModalSetting(false);

    if (checkRemoveDates.length > 0) {
      setDates((prev) => {
        data = prev.filter((date, index) => !checkRemoveDates.includes(index));
        return data;
      });
      setFormData((prev) => ({
        ...prev,
        reservationDTO: {
          ...prev.reservationDTO,
          timeFinishFrequency: data.map((date) => date.toISOString()),
        },
      }));
    } else if (checkRemoveDates.length === 0) {
      setDates(dayOriginal);
      setFormData((prev) => ({
        ...prev,
        reservationDTO: {
          ...prev.reservationDTO,
          timeFinishFrequency: dayOriginal.map((date) => date.toISOString()),
        },
      }));
    }

    if (checkRemoveDays != undefined && checkRemoveDays.length > 0) {
      setFormData((prev) => ({
        ...prev,
        reservationDTO: {
          ...prev.reservationDTO,
          timeFinishFrequency: removeDate(
            prev.reservationDTO.timeFinishFrequency.map(
              (date) => new Date(date)
            ),
            checkRemoveDays ?? []
          ).map((date) => date.toISOString()),
        },
      }));
    } else if (checkRemoveDays != undefined && checkRemoveDays.length === 0) {
      setDates(dayOriginal);
      setFormData((prev) => ({
        ...prev,
        reservationDTO: {
          ...prev.reservationDTO,
          timeFinishFrequency: removeDate(
            prev.reservationDTO.timeFinishFrequency.map(
              (date) => new Date(date)
            ),
            checkRemoveDays ?? []
          ).map((date) => date.toISOString()),
        },
      }));
    }
  };

  // lấy ngày trong tuần không được chọn
  const removeDate = (dates: Date[], weekOfDates: string[]) => {
    const dataExist = dates.filter((date) => {
      console.log(date.toString().split(" ")[0]);
      return !weekOfDates.includes(date.toString().split(" ")[0]);
    });
    return dataExist;
  };

  // lọc thứ không được chọn trong danh sách ngày
  useEffect(() => {
    setDates(removeDate(dayOriginal, checkRemoveDays ?? []));
  }, [checkRemoveDays]);

  // ngày kết thúc tần suất thay đổi
  useEffect(() => {
    const dataTemp = selectedDateEndOfFrequency
      ? getDatesBetween(
          dateSelected ? new Date(dateSelected) : new Date(),
          selectedDateEndOfFrequency
        )
      : [];
    const formatDateList = [...handleUpdateTimeFinsihFrequency(dataTemp)];
    setDates((prev) => {
      return [...formatDateList];
    });
    setDayOriginal((prev) => {
      return [...formatDateList];
    });
    setFormData((prev) => ({
      ...prev,
      reservationDTO: {
        ...prev.reservationDTO,
        timeFinishFrequency: [...formatDateList].map((date) =>
          date.toISOString()
        ),
      },
    }));
  }, [selectedDateEndOfFrequency]);

  // chọn tần suất set loại form
  useEffect(() => {
    if (valueFrequency === "ONE_TIME") {
      setTypeRequestForm("RESERVATION_ONETIME");
    } else {
      setTypeRequestForm("RESERVATION_RECURRING");
    }
  }, [valueFrequency]);

  // form data
  const [formData, setFormData] = useState({
    timeRequest: new Date().toISOString(),
    typeRequestForm: typeRequestForm,
    reservationDTO: {
      time: new Date().toISOString(),
      timeStart: timeStart
        ? new Date(
            `${dateSelected ?? new Date().toString()}T${timeStart}`
          ).toISOString()
        : new Date(
            `${dateSelected ?? new Date().toString()}T${times[0]}`
          ).toISOString(),
      timeEnd: timeEnd
        ? new Date(
            `${dateSelected ?? new Date().toString()}T${timeEnd}`
          ).toISOString()
        : new Date(
            `${dateSelected ?? new Date().toString()}T${times[1]}`
          ).toISOString(),
      note: "",
      description: "",
      title: "",
      frequency: valueFrequency,
      timeFinishFrequency: selectedDateEndOfFrequency
        ? getDatesBetween(
            dateSelected ? new Date(dateSelected) : new Date(),
            selectedDateEndOfFrequency
          ).map((date) => date.toISOString())
        : [],
      bookerId: user?.employeeId ?? "",
      roomId: roomInfo?.roomId ?? "",
      employeeIds: [] as string[],
      serviceIds: [] as string[],
      filePaths: [] as string[],
    },
  });

  // gửi yêu cầu phê duyệt
  const {
    data,
    loading: roomLoading,
    error: roomError,
    postData,
  } = usePost<FormData>(
    "http://localhost:8080/api/v1/requestForm/createRequestForm"
  );

  // hiển thị thông báo lỗi
  useEffect(() => {
    if (roomError) {
      console.log("Error updated:", roomError);
      let data = [] as string[];
      roomError?.map((res: ReservationProps) => {
        data.push(res.timeStart.substring(8, 10));
      });
      console.log(data);
      setIsPopupOpen &&
        setIsPopupOpen(
          "Bạn hoặc phòng này có lịch trùng vào ngày " + data.join(", "),
          "error",
          true
        );
    }
  }, [roomError]);

  // ràng buộc dữ liệu
  const validateForm = () => {
    if (!formData.reservationDTO.roomId) {
      return { isValid: false, message: "Vui lòng chọn phòng!" };
    }

    if (!formData.reservationDTO.title) {
      return { isValid: false, message: "Vui lòng nhập tiêu đề cuộc họp!" };
    }

    if (selectedEmployees.length === 1) {
      return { isValid: false, message: "Vui lòng thêm người tham gia!" };
    }

    return { isValid: true, message: "" };
  };

  // Xử lý khi nhấn nút gửi phê duyệt
  const handleSubmit = async () => {
    const updatedFormData = {
      ...formData,
      typeRequestForm: typeRequestForm,
      timeRequest: new Date().toISOString(),
      reservationDTO: {
        ...formData.reservationDTO,
        serviceIds: selectedServices.map((service) => service.serviceId + ""),
        employeeIds: selectedEmployees.map((emp) => emp.employeeId + ""),
      },
    };

    const { isValid, message } = validateForm();
    if (!isValid) {
      setIsPopupOpen && setIsPopupOpen(message, "error", false);
      return;
    }

    console.log(updatedFormData);

    resetData();

    const response = await postData(updatedFormData, { method: "POST" });

    console.log(response);

    if (response) {
      setIsPopupOpen && setIsPopupOpen("Đặt lịch thành công!", "success", true);
      resetData();
      setIsModalClose();
    }
  };

  const resetData = () => {
    setSelectedServices([]);
    setSelectedEmployees([user]);
  };

  // Hàm xử lý sự thay đổi khi người dùng nhập vào input
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(name);
    switch (name) {
      case "filePaths": {
        setFormData((prev) => ({
          ...prev,
          reservationDTO: {
            ...prev.reservationDTO,
            filePaths: [...prev.reservationDTO.filePaths, value],
          },
        }));
        break;
      }
      case "timeStart": {
        setFormData((prev) => ({
          ...prev,
          reservationDTO: {
            ...prev.reservationDTO,
            timeStart: new Date(
              `${dateSelected ?? new Date().toString()}T${value}`
            ).toISOString(),
          },
        }));
        break;
      }
      case "timeEnd": {
        setFormData((prev) => ({
          ...prev,
          reservationDTO: {
            ...prev.reservationDTO,
            timeEnd: new Date(
              `${dateSelected ?? new Date().toString()}T${value}`
            ).toISOString(),
          },
        }));
        break;
      }
      case "frequency": {
        setValueFrequency(value);
        setFormData((prev) => ({
          ...prev,
          reservationDTO: {
            ...prev.reservationDTO,
            frequency: value,
          },
        }));
        break;
      }
      default: {
        setFormData((prev) => ({
          ...prev,
          reservationDTO: { ...prev.reservationDTO, [name]: value },
        }));
        break;
      }
    }
  };

  // xử lý xóa tài liệu
  const handleRemoveDocument = (index: number) => {
    const updated = formData.reservationDTO.filePaths.filter(
      (_, i) => i !== index
    );

    setFormData((prev) => ({
      ...prev,
      reservationDTO: {
        ...prev.reservationDTO,
        filePaths: updated,
      },
    }));
  };

  // lấy dịch vụ
  const {
    data: services,
    loading: serviceLoading,
    error: serviceError,
  } = useFetch<ServiceProps[]>(
    "http://localhost:8080/api/v1/service/getAllServices"
  );

  // tìm kiếm participant
  useEffect(() => {
    if (!phoneInput.trim()) {
      setSuggestedEmployees([]);
      setShowSuggestions(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/v1/employee/getEmployeeByPhoneOrName?phoneOrName=${encodeURIComponent(
            phoneInput
          )}`
        );
        const data: EmployeeProps[] = await res.json();
        setSuggestedEmployees(
          data.filter(
            (emp) =>
              !selectedEmployees.some((e) => e.employeeId === emp.employeeId)
          )
        );
        setShowSuggestions(true);
      } catch (err) {
        console.error("Lỗi tìm nhân viên:", err);
        setSuggestedEmployees([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [phoneInput]);

  // xử lý thêm participant
  const handleAddEmployee = (employee: EmployeeProps) => {
    if (selectedEmployees.find((e) => e.employeeId === employee.employeeId))
      return;
    setSelectedEmployees((prev) => [...prev, employee]);
    setPhoneInput("");
    setSuggestedEmployees([]);
    setShowSuggestions(false);
  };

  // xử lý xóa participant
  const handleRemoveEmployee = (employeeId: number) => {
    const updatedEmployees = selectedEmployees.filter(
      (e) => e.employeeId !== employeeId
    );
    setSelectedEmployees(updatedEmployees);
  };

  return (
    <Fragment>
      {isModalOpen ? (
        <div className={cx("modal-overlay")}>
          <div className={cx("modal-content")}>
            <CloseModalButton onClick={setIsModalClose} />
            <h3>Đặt lịch phòng</h3>

            <div className={cx("form")}>
              <div className={cx("form-info")}>
                {/* Chọn phòng */}
                <div className={cx("form-group")}>
                  <label>Chọn phòng</label>
                  {dataRoomByBranch?.length == 0 || roomInfo?.roomName ? (
                    <select>
                      <option value={roomInfo?.roomName}>
                        {roomInfo?.roomName}
                      </option>
                    </select>
                  ) : (
                    <select
                      onChange={(e) => {
                        const selectedOption = e.target.selectedOptions[0];
                        const roomId =
                          selectedOption.getAttribute("data-bindid");
                        setFormData((prev) => ({
                          ...prev,
                          reservationDTO: {
                            ...prev.reservationDTO,
                            roomId: roomId ?? "",
                          },
                        }));
                      }}
                    >
                      <option value="" disabled selected>
                        Chọn phòng
                      </option>
                      {dataRoomByBranch?.map((room) => (
                        <option
                          key={room.roomId}
                          value={room.roomName}
                          data-bindid={room.roomId}
                        >
                          {room.roomName}
                        </option>
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
                    value={formData.reservationDTO.title}
                    onChange={handleInputChange}
                  />
                </div>

                {/* chọn ngày */}
                <div className={cx("form-group")}>
                  <label>Ngày</label>
                  <input
                    type="text"
                    name="time"
                    value={formatDateString(
                      dateSelected ?? new Date().toString()
                    )}
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
                        name="timeStart"
                        onChange={(e) => {
                          setSelectedStartTime(e.target.value);
                          handleInputChange(e);
                        }}
                      >
                        {getTimes().map((time, index) => (
                          <option
                            key={time}
                            value={time}
                            selected={index === 0}
                          >
                            {time}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* kết thúc */}
                  <div className={cx("form-group")}>
                    <label>Giờ kết thúc</label>
                    {timeEnd ? (
                      <select>
                        <option value={timeEnd}>{timeEnd}</option>{" "}
                      </select>
                    ) : (
                      <select name="timeEnd" onChange={handleInputChange}>
                        {timeEndSchedule.map((time, index) => (
                          <option
                            key={time}
                            value={time}
                            selected={index === 0}
                          >
                            {time}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Ghi chú */}
                <div className={cx("form-group")}>
                  <label>Ghi chú</label>
                  <input
                    type="text"
                    placeholder="Nhập ghi chú"
                    name="note"
                    value={formData.reservationDTO.note}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Mô tả */}
                <div className={cx("form-group")}>
                  <label>Mô tả</label>
                  <input
                    type="text"
                    placeholder="Nhập mô tả"
                    name="description"
                    value={formData.reservationDTO.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={cx("form-row")}>
                  {/* Chọn tần suất */}
                  <div className={cx("form-group")}>
                    <label>Tần suất</label>
                    <select
                      name="frequency"
                      value={valueFrequency}
                      onChange={handleInputChange}
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
                      minDate={new Date(dateSelected ?? new Date().toString())}
                      dateFormat="dd / MM / yyyy"
                      disabled={valueFrequency === "ONE_TIME"}
                      maxDate={
                        new Date(new Date().setMonth(new Date().getMonth() + 3))
                      }
                    />
                  </div>

                  <div
                    className={cx("setting-btn", {
                      disabled: valueFrequency === "ONE_TIME",
                    })}
                    onClick={
                      valueFrequency !== "ONE_TIME"
                        ? () => setModalSetting(true)
                        : undefined
                    }
                  >
                    <IconWrapper icon={IoSettingsOutline} />
                  </div>

                  {/* modal setting */}
                  {modalSetting && (
                    <div className={cx("modal-overlay")}>
                      <div className={cx("modal-content-setting")}>
                        <CloseModalButton
                          onClick={() => setModalSetting(false)}
                        />
                        <div className={cx("modal-header")}>
                          <h4>Cài đặt </h4>
                        </div>
                        <div className={cx("modal-body")}>
                          <div className={cx("setting-left")}>
                            <label>Loại bỏ thứ</label>
                            {daysOfWeek.map((day, index) => (
                              <div key={index} className={cx("checkbox-group")}>
                                <input
                                  style={{ width: "15px", height: "15px" }}
                                  type="checkbox"
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setCheckRemoveDays((prev) =>
                                        prev ? [...prev, day] : [day]
                                      );
                                    } else {
                                      setCheckRemoveDays((prev) =>
                                        prev?.filter((d) => d !== day)
                                      );
                                    }
                                  }}
                                />
                                <span>{day}</span>
                              </div>
                            ))}
                          </div>
                          <div className={cx("setting-right")}>
                            <label>Loại bỏ ngày</label>
                            <div className={cx("table-checkbox-group")}>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Chọn</th>
                                    <th>Ngày</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {dates.map((date, index) => (
                                    <tr key={index}>
                                      <td>
                                        <input
                                          style={{
                                            width: "15px",
                                            height: "15px",
                                          }}
                                          type="checkbox"
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setCheckRemoveDates((prev) =>
                                                prev ? [...prev, index] : []
                                              );
                                            } else {
                                              setCheckRemoveDates((prev) =>
                                                prev?.filter((d) => d !== index)
                                              );
                                            }
                                          }}
                                        />
                                      </td>
                                      <td>{formatDateDate(date)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className={cx("modal-footer")}>
                          <button onClick={handleRemoveDate}>Lưu</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={cx("devide")}></div>

              <div className={cx("form-info")}>
                {/* document */}
                <ul className={cx("container-list")}>
                  <div className={cx("list-header")}>
                    <strong>Tài liệu</strong>
                    <div>
                      <input
                        id="file-upload"
                        type="file"
                        style={{ display: "none" }}
                        name="filePaths"
                        onChange={handleInputChange}
                      />
                      <label htmlFor="file-upload" className={cx("edit-icon")}>
                        <IconWrapper icon={FaPlus} size={16} color="#33cc33" />
                      </label>
                    </div>
                  </div>
                  {/* hiện tài liệu */}
                  {formData.reservationDTO.filePaths.map((file, index) => (
                    <li key={index} className={cx("file-item")}>
                      <a href={file} target="_blank" rel="noreferrer">
                        {file}
                      </a>
                      <button
                        className={cx("remove-btn")}
                        onClick={() => {
                          handleRemoveDocument(index);
                        }}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>

                {/* service */}
                <ul className={cx("container-list")}>
                  <div className={cx("list-header")}>
                    <strong>Dịch vụ</strong>
                    <div
                      className={cx("edit-icon")}
                      onClick={() => {
                        setOpenModalAddService(true);
                      }}
                    >
                      <IconWrapper icon={FaPlus} size={16} color="#33cc33" />
                    </div>
                  </div>

                  {/* render list service */}
                  {selectedServices?.map((service) => (
                    <li key={service.serviceId}>
                      {service.serviceName} -{" "}
                      {service.priceService?.value &&
                        formatCurrencyVND(service.priceService?.value)}
                    </li>
                  ))}

                  {/* modal add, remove service */}
                  {openModalAddService && (
                    <div className={cx("modal-add-service")}>
                      <div className={cx("modal-add-service-content")}>
                        <CloseModalButton
                          onClick={() => {
                            setOpenModalAddService(false);
                            setShowServiceDropdown(false);
                            setSelectedServices([...selectedServices]);
                          }}
                        />
                        <h3>Thêm dịch vụ</h3>

                        <div className={cx("custom-dropdown")}>
                          <div
                            className={cx("dropdown-toggle")}
                            onClick={() =>
                              setShowServiceDropdown((prev) => !prev)
                            }
                          >
                            Chọn dịch vụ ({selectedServices.length})
                          </div>

                          {showServiceDropdown && (
                            <div className={cx("dropdown-menu")}>
                              {services?.map((service) => {
                                const isChecked = selectedServices.some(
                                  (s) => s.serviceId === service.serviceId
                                );

                                return (
                                  <div
                                    key={service.serviceId}
                                    className={cx("checkbox-item")}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        const updated = checked
                                          ? [...selectedServices, service]
                                          : selectedServices.filter(
                                              (s) =>
                                                s.serviceId !==
                                                service.serviceId
                                            );
                                        setSelectedServices(updated);
                                      }}
                                    />
                                    {service.serviceName} -{" "}
                                    {service.priceService &&
                                      formatCurrencyVND(
                                        service?.priceService?.value
                                      )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Hiển thị dịch vụ đã chọn trong modal */}
                        <h4>Dịch vụ đã chọn:</h4>
                        <div className={cx("selected-list")}>
                          <ul>
                            {selectedServices.map((service) => (
                              <li
                                key={service.serviceId}
                                className={cx("selected-item")}
                              >
                                <span>
                                  {service.serviceName} –{" "}
                                  {service.priceService &&
                                    formatCurrencyVND(
                                      service.priceService.value
                                    )}
                                </span>

                                <button
                                  className={cx("remove-btn")}
                                  onClick={() => {
                                    setSelectedServices(
                                      selectedServices.filter(
                                        (s) => s.serviceId !== service.serviceId
                                      )
                                    );
                                  }}
                                >
                                  ❌
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </ul>

                {/* participant */}
                <ul className={cx("container-list")}>
                  <div className={cx("list-header")}>
                    <strong>Người tham gia</strong>
                    <div
                      className={cx("edit-icon")}
                      onClick={() => setOpenModalAddParticipant(true)}
                    >
                      <IconWrapper icon={FaPlus} size={16} color="#33cc33" />
                    </div>
                  </div>

                  {/* render list emp  */}
                  {selectedEmployees.map((p) => (
                    <li key={p.employeeId}>
                      <div className={cx("info-row")}>
                        <p>{p.employeeName}</p>
                        <p>{p.phone}</p>
                      </div>
                    </li>
                  ))}

                  {/* add, remove emp */}
                  {openModalAddParticipant && (
                    <div className={cx("modal-overlay")}>
                      <div className={cx("modal-add-participant-content")}>
                        <CloseModalButton
                          onClick={() => setOpenModalAddParticipant(false)}
                        />
                        <h3>Thêm người tham gia</h3>
                        <div className={cx("modal-body")}>
                          <div
                            className={cx("form-group")}
                            style={{ position: "relative" }}
                          >
                            <input
                              type="text"
                              name="attendant"
                              placeholder="Nhập số điện thoại"
                              value={phoneInput}
                              onChange={(e) => setPhoneInput(e.target.value)}
                              autoComplete="off"
                            />
                            {showSuggestions &&
                              suggestedEmployees.length > 0 && (
                                <div className={cx("suggestion-box")}>
                                  {suggestedEmployees.map((emp) => (
                                    <div
                                      key={emp.employeeId}
                                      className={cx("suggestion-item")}
                                    >
                                      <span>
                                        {emp.employeeName} - {emp.phone}
                                      </span>
                                      <button
                                        onClick={() => handleAddEmployee(emp)}
                                      >
                                        <IconWrapper
                                          icon={FaPlus}
                                          size={16}
                                          color="#33CC33"
                                        />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>

                          {/* hiển thị emp  */}
                          <h4>Người tham gia đã chọn:</h4>
                          <div className={cx("selected-list")}>
                            <ul>
                              {selectedEmployees.map((emp) => (
                                <li
                                  key={emp.employeeId}
                                  className={cx("employee-item")}
                                >
                                  {emp.employeeName} - {emp.phone}
                                  {emp.employeeId === user.employeeId ? (
                                    <span>(Bạn)</span>
                                  ) : (
                                    <button
                                      className={cx("remove-btn")}
                                      onClick={() =>
                                        handleRemoveEmployee(emp.employeeId)
                                      }
                                    >
                                      ❌
                                    </button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </ul>
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

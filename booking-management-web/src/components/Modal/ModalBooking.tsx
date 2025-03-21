import { Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ModalBooking.module.scss";
import { formatDateDate, formatDateString, times } from "../../utilities";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useFetch from "../../hooks/useFetch";
import {
  EmployeeProps,
  frequency,
  Reservation,
  ReservationProps,
  ServiceProps,
} from "../../data/data";
import IconWrapper from "../icons/IconWrapper";
import { IoSettingsOutline } from "../../components/icons/icons";
import { FaPlus } from "../../components/icons/icons";
import usePost from "../../hooks/usePost";
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

  const [timeEndSchedule, setTimeEndSchedule] = useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<string>(times[0]);
  const [selectedDateEndOfFrequency, setSelectedDateEndOfFrequency] =
    useState<Date | null>(new Date());
  const [valueFrequency, setValueFrequency] = useState<string>("ONE_TIME");
  const [serviceNames, setServiceNames] = useState<string[]>([]);
  const [openModalParticipant, setOpenModalParticipant] =
    useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProps[]>([
    user,
  ]);
  const [listParticipant, setListParticipant] = useState<EmployeeProps[]>([]);
  const [modalSetting, setModalSetting] = useState<boolean>(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [isClickedSelect, setIsClickedSelect] = useState(false);
  const [checkRemoveDays, setCheckRemoveDays] = useState<string[]>();
  const [dayOriginal, setDayOriginal] = useState<Date[]>([]);
  const [checkRemoveDates, setCheckRemoveDates] = useState<number[]>([]);
  const [TypeRequestForm, setTypeRequestForm] = useState<string>(
    "RESERVATION_ONETIME"
  );

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

  // form data
  const [formData, setFormData] = useState({
    timeRequest: new Date().toISOString(),
    TypeRequestForm: TypeRequestForm,
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

  // chọn tần suất set loại form
  useEffect(() => {
    if (valueFrequency === "ONE_TIME") {
      setTypeRequestForm("RESERVATION_ONETIME");
    } else {
      setTypeRequestForm("RESERVATION_RECURRING");
    }
  }, [valueFrequency]);

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
    console.log(dataExist);
    return dataExist;
  };

  // lọc thứ không được chọn trong danh sách ngày
  useEffect(() => {
    console.log(removeDate(dates, checkRemoveDays ?? []));
    setDates(removeDate(dayOriginal, checkRemoveDays ?? []));
  }, [checkRemoveDays]);

  // ngày kết thúc tần suất thay đổi
  useEffect(() => {
    setDates(
      selectedDateEndOfFrequency
        ? getDatesBetween(
            dateSelected ? new Date(dateSelected) : new Date(),
            selectedDateEndOfFrequency
          )
        : []
    );
    setDayOriginal(
      selectedDateEndOfFrequency
        ? getDatesBetween(
            dateSelected ? new Date(dateSelected) : new Date(),
            selectedDateEndOfFrequency
          )
        : []
    );
    setFormData((prev) => ({
      ...prev,
      reservationDTO: {
        ...prev.reservationDTO,
        timeFinishFrequency: selectedDateEndOfFrequency
          ? getDatesBetween(
              dateSelected ? new Date(dateSelected) : new Date(),
              selectedDateEndOfFrequency
            ).map((date) => date.toISOString())
          : [],
      },
    }));
  }, [selectedDateEndOfFrequency]);

  // lấy nhân viên
  const {
    data: employees,
    loading: employeesLoading,
    error: employeesError,
  } = useFetch<EmployeeProps[]>(
    `http://localhost:8080/api/v1/employee/getEmployeeByPhoneOrName?phoneOrName=${phone}`
  );

  // loại người đặt trong ds người tham gia
  const removeBookerInEmployee = (employees: EmployeeProps[]) => {
    return employees.filter((emp) => emp.employeeId !== user.employeeId);
  };

  useEffect(() => {
    if (employees) {
      setListParticipant(removeBookerInEmployee(employees));
    }
  }, [employees]);

  // thêm thành viên
  const handleAddEmployee = (emp: EmployeeProps) => {
    setSelectedEmployee((prev) => [...prev, emp]);
    setFormData((prev) => ({
      ...prev,
      reservationDTO: {
        ...prev.reservationDTO,
        employeeIds: [...prev.reservationDTO.employeeIds, emp.employeeId + ""],
      },
    }));
    setPhone("");
    setOpenModalParticipant(false);
  };

  // loại bỏ thành viên
  const handleRemoveEmployee = (emp: EmployeeProps) => {
    setSelectedEmployee((prev) =>
      prev.filter((employee) => employee.employeeId !== emp.employeeId)
    );
    setFormData((prev) => ({
      ...prev,
      reservationDTO: {
        ...prev.reservationDTO,
        employeeIds: prev.reservationDTO.employeeIds.filter(
          (employeeId) => employeeId !== emp.employeeId + ""
        ),
      },
    }));
  };

  // lấy service name render select option
  useEffect(() => {
    const arrServiceName = services?.filter((service) =>
      formData.reservationDTO.serviceIds.includes(service.serviceId + "")
    );
    setServiceNames(
      arrServiceName?.map((service) => service.serviceName) ?? []
    );
  }, [formData.reservationDTO.serviceIds]);

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
        console.log("Vào");
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
      case "serviceIds": {
        setFormData((prev) => ({
          ...prev,
          reservationDTO: {
            ...prev.reservationDTO,
            serviceIds: [...prev.reservationDTO.serviceIds, value],
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

  // lấy dịch vụ
  const {
    data: services,
    loading: serviceLoading,
    error: serviceError,
  } = useFetch<ServiceProps[]>(
    "http://localhost:8080/api/v1/service/getAllServices"
  );

  useEffect(() => {});

  // đặt lịch
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

  // Xử lý khi nhấn nút gửi phê duyệt
  const handleSubmit = async () => {
    const updatedFormData = {
      ...formData,
      TypeRequestForm: TypeRequestForm,
      timeRequest: new Date().toISOString(),
    };

    console.log(updatedFormData);

    const response = await postData(updatedFormData, { method: "POST" });

    if (response) {
      setIsPopupOpen && setIsPopupOpen("Đặt lịch thành công!", "success", true);
      setIsModalClose();
    }
  };

  const handleOpenModalSetting = () => {
    setModalSetting(true);
  };

  const handleCloseModalSetting = () => {
    setModalSetting(false);
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
                    <select>
                      {dataRoomByBranch?.map((room) => (
                        <option value={room.roomName} data-bindid={room.roomId}>
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
                        {times.map((time, index) => (
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
                      minDate={new Date()}
                      dateFormat="dd/MM/yyyy"
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
                        ? handleOpenModalSetting
                        : undefined
                    }
                  >
                    <IconWrapper icon={IoSettingsOutline} />
                  </div>

                  {/* modal setting */}
                  {modalSetting && (
                    <div className={cx("modal-setting")}>
                      <div className={cx("modal-content")}>
                        <div className={cx("modal-header")}>
                          <h4>Cài đặt </h4>
                          <button onClick={handleCloseModalSetting}>✖</button>
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
                {/* tài liệu */}
                <div className={cx("form-group")}>
                  <label>Tài liệu</label>
                  <input
                    type="file"
                    multiple
                    name="filePaths"
                    onChange={handleInputChange}
                  />
                </div>

                {/* hiện tài liệu đã chọn */}
                <select className={cx("form-group")}>
                  {formData.reservationDTO.filePaths.map((file) => (
                    <option value={file}>{file}</option>
                  ))}
                </select>

                {/* Chọn dịch vụ */}
                <div className={cx("form-group")}>
                  <label>Dịch vụ</label>
                  <div className={cx("checkbox-group")}>
                    <select name="serviceIds" onChange={handleInputChange}>
                      <option value="" disabled>
                        Chọn dịch vụ
                      </option>
                      {services?.map((service) => (
                        <option
                          key={service.serviceId}
                          value={service.serviceId}
                          id={service.serviceName}
                        >
                          {service.serviceName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* hiện dịch vụ đã chọn */}
                <div className={cx("form-group")}>
                  <select
                    onClick={() => setIsClickedSelect(true)}
                    onBlur={() => setIsClickedSelect(false)}
                  >
                    {!isClickedSelect && (
                      <option value="" disabled selected>
                        {serviceNames.join(", ")}
                      </option>
                    )}

                    {serviceNames.map((serviceName, index) => (
                      <option key={index} value={serviceName} disabled>
                        {serviceName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Người tham gia */}
                <div className={cx("form-row")}>
                  <label>Người tham gia</label>

                  <button
                    className={cx("submit-btn")}
                    onClick={() => {
                      setOpenModalParticipant(true);
                    }}
                  >
                    <IconWrapper icon={FaPlus} size={14} color="#fff" />
                  </button>
                </div>

                {selectedEmployee.length > 0 &&
                  selectedEmployee.map((emp) => (
                    <div className={cx("form-row", "list-emp-participant")}>
                      <div key={emp.employeeId}>
                        {emp.employeeName} - {emp.phone}
                      </div>
                      <button
                        className={cx("btn-remove-employee")}
                        onClick={() => handleRemoveEmployee(emp)}
                        disabled={emp.employeeId === user.employeeId}
                      >
                        ✖
                      </button>
                    </div>
                  ))}

                {/* modal thêm thành viên */}
                {openModalParticipant && (
                  <div className={cx("modal-employee")}>
                    <div className={cx("model-add")}>
                      <button
                        className={cx("btn-close-modalParticipant")}
                        onClick={() => setOpenModalParticipant(false)}
                      >
                        ✖
                      </button>
                      <input
                        type="text"
                        placeholder="Nhập số điện thoại người tham gia"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      {phone && listParticipant && (
                        <div className={cx("form-group", "employee-list")}>
                          {listParticipant.map((emp) => (
                            <div className={cx("employee-item")}>
                              <div key={emp.employeeId}>
                                {emp.employeeName} - {emp.phone}
                              </div>
                              <button onClick={() => handleAddEmployee(emp)}>
                                <IconWrapper
                                  icon={FaPlus}
                                  size={14}
                                  color="#fff"
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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

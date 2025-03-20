import { Fragment } from "react/jsx-runtime";
import React, { useEffect, useState, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./ModalBooking.module.scss";
import { times } from "../../utilities";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useFetch from "../../hooks/useFetch";
import { EmployeeProps, ServiceProps } from "../../data/data";
import IconWrapper from "../icons/IconWrapper";
import { IoSettingsOutline } from "../../components/icons/icons";

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
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProps[]>([]);
  const [modalSetting, setModalSetting] = useState<boolean>(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [isClickedSelect, setIsClickedSelect] = useState(false);
  const [checkRemoveDays, setCheckRemoveDays] = useState<string[]>();
  const [dayOriginal, setDayOriginal] = useState<Date[]>([]);

  // lấy ngày
  const getDatesBetween = (startDate: Date, endDate: Date) => {
    const dates = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const [formData, setFormData] = useState({
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
  });

  const removeDate = (dates: Date[], weekOfDates: string[]) => {
  
    const dataExsist = dates.filter((date) => {
      console.log(date.toString().split(" ")[0]);
      return !weekOfDates.includes(date.toString().split(" ")[0]);
    });
    console.log(dataExsist);
    return dataExsist;
  };

  // lọc thứ  không được chọn trong danh sách ngày
  useEffect(() => {
    console.log(removeDate(dates, checkRemoveDays ?? []));
    setDates(removeDate(dayOriginal, checkRemoveDays ?? []));
    setFormData((prev) => ({
      ...prev,
      timeFinishFrequency: removeDate(
        prev.timeFinishFrequency.map((date) => new Date(date)),
        checkRemoveDays ?? []
      ).map((date) => date.toISOString()),
    }));
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
    setDayOriginal(selectedDateEndOfFrequency
    ? getDatesBetween(
        dateSelected ? new Date(dateSelected) : new Date(),
        selectedDateEndOfFrequency
      )
    : [])
    setFormData((prev) => ({
      ...prev,
      timeFinishFrequency: selectedDateEndOfFrequency
        ? getDatesBetween(
            dateSelected ? new Date(dateSelected) : new Date(),
            selectedDateEndOfFrequency
          ).map((date) => date.toISOString())
        : [],
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

  // thêm thành viên
  const handleAddEmployee = (emp: EmployeeProps) => {
    setSelectedEmployee((prev) => [...prev, emp]);
    setFormData((prev) => ({
      ...prev,
      employeeIds: [...prev.employeeIds, emp.employeeId + ""],
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
      employeeIds: prev.employeeIds.filter(
        (employeeId) => employeeId !== emp.employeeId + ""
      ),
    }));
  };

  // lấy service name render select option
  useEffect(() => {
    const arrServiceName = services?.filter((service) =>
      formData.serviceIds.includes(service.serviceId + "")
    );
    setServiceNames(
      arrServiceName?.map((service) => service.serviceName) ?? []
    );
  }, [formData.serviceIds]);

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
          filePaths: [...prev.filePaths, value],
        }));
        break;
      }
      case "timeStart": {
        setFormData((prev) => ({
          ...prev,
          timeStart: new Date(
            `${dateSelected ?? new Date().toString()}T${value}`
          ).toISOString(),
        }));
        break;
      }
      case "timeEnd": {
        setFormData((prev) => ({
          ...prev,
          timeEnd: new Date(
            `${dateSelected ?? new Date().toString()}T${value}`
          ).toISOString(),
        }));
        break;
      }
      case "serviceIds": {
        setFormData((prev) => ({
          ...prev,
          serviceIds: [...prev.serviceIds, value],
        }));
        break;
      }
      default: {
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        timeEnd: new Date(
          `${dateSelected ?? new Date().toString()}T${times[index + 1]}`
        ).toISOString(),
      }));
    } else {
      const index = times.findIndex((time) => time === selectedStartTime);
      setTimeEndSchedule(times.slice(index + 1, times.length));
      setFormData((prev) => ({
        ...prev,
        timeEnd: new Date(
          `${dateSelected ?? new Date().toString()}T${times[index + 1]}`
        ).toISOString(),
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

  // Xử lý khi nhấn nút gửi phê duyệt
  const handleSubmit = async () => {
    console.log(formData);

    // const response = await postData(formData);

    // if (response) {
    //   console.log(response);
    //   setIsPopupOpen && setIsPopupOpen("Đặt lịch thành công!", "success", true);
    //   setIsModalClose();
    // } else {
    //   setIsPopupOpen &&
    //     setIsPopupOpen("Đặt lịch không thành công!", "error", true);
    // }
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
                    value={formData.title}
                    onChange={handleInputChange}
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
                    value={formData.note}
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
                    value={formData.description}
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
                      onChange={(e) => {
                        setValueFrequency(e.target.value);
                      }}
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
                    className={cx("setting-btn")}
                    onClick={handleOpenModalSetting}
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
                            {daysOfWeek.map((day) => (
                              <div className={cx("checkbox-group")}>
                                <input
                                  style={{ width: "15px", height: "15px" }}
                                  type="checkbox"
                                  onChange={(e) => {
                                    if(e.target.checked) {
                                    setCheckRemoveDays((prev) =>
                                      prev ? [...prev, day] : [day]
                                    );
                                  }else {
                                    setCheckRemoveDays((prev) => prev?.filter((d) => d !== day));
                                  }
                                  }}
                                />
                                <span>{day}</span>
                              </div>
                            ))}
                          </div>
                          <div className={cx("setting-left")}>
                            <label>Loại bỏ ngày</label>
                            <table>
                              <tr>
                                <th>Chọn</th>
                                <th>Ngày</th>
                              </tr>
                              {dates.map((date) => (
                                <tr>
                                  <td>
                                    <input
                                      style={{ width: "15px", height: "15px" }}
                                      type="checkbox"
                                    />
                                  </td>
                                  <td>{date.toISOString().split("T")[0]}</td>
                                </tr>
                              ))}
                            </table>
                          </div>
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

                <select className={cx("form-group")}>
                  {formData.filePaths.map((file) => (
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
                    Thêm
                  </button>
                </div>

                {selectedEmployee.length > 0 &&
                  selectedEmployee.map((emp) => (
                    <div className={cx("form-row")}>
                      <div key={emp.employeeId}>
                        {emp.employeeName} - {emp.phone}
                      </div>
                      <button onClick={() => handleRemoveEmployee(emp)}>
                        x
                      </button>
                    </div>
                  ))}

                {openModalParticipant && (
                  <div className={cx("modal-employee")}>
                    <div className={cx("model-add")}>
                      <input
                        type="text"
                        placeholder="Nhập số điện thoại người tham gia"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      {phone && employees && (
                        <div className={cx("form-group", "employee-list")}>
                          {employees.map((emp) => (
                            <div className={cx("employee-item")}>
                              <div key={emp.employeeId}>
                                {emp.employeeName} - {emp.phone}
                              </div>
                              <button onClick={() => handleAddEmployee(emp)}>
                                Thêm
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

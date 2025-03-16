import React, { ChangeEventHandler, useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./WeeklySchedule.module.scss";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { EmployeeProps, ServiceProps } from "../../data/data";
import useFetch from "../../hooks/useFetch";
import { time } from "console";
import { set } from "react-datepicker/dist/date_utils";
import usePost from "../../hooks/usePost";
import PopupNotification from "../popup/PopupNotification";

const cx = classNames.bind(styles);

const daysOfWeek = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

type FormData = {
  time: string;
  timeStart: string;
  timeEnd: string;
  note: string;
  description: string;
  title: string;
  frequency: string;
  timeFinishFrequency: string;
  bookerId: string;
  roomId: string;
  employeeIds: string[];
  serviceIds: string[];
  filePaths: string[];
};

const WeeklySchedule = ({ roomId }: { roomId?: string }) => {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");

  const roomDetail = useSelector((state: RootState) => state.room.selectedRoom);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const reservations = roomDetail?.reservationDTOS || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);

  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  const date = new Date();
  const [timeEnd, setTimeEnd] = useState<string>("");
  const [files, setFiles] = useState<string>();
  const [serviceName, setServiceName] = useState<string[]>([]);
  const [phone, setPhone] = useState<string>("");
  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProps[]>([]);

  const [formData, setFormData] = useState({
    time: "",
    timeStart: "",
    timeEnd: "",
    note: "",
    description: "",
    title: "",
    frequency: "ONE_TIME",
    timeFinishFrequency: "",
    bookerId: "",
    roomId: "",
    employeeIds: [] as string[],
    serviceIds: [] as string[],
    filePaths: [] as string[],
  });

  // lấy dv
  const {
    data: services,
    loading: serviceLoading,
    error: serviceError,
  } = useFetch<ServiceProps[]>(
    "http://localhost:8080/api/v1/service/getAllServices"
  );

  const {
    data: employees,
    loading: employeesLoading,
    error: employeesError,
  } = useFetch<EmployeeProps[]>(
    `http://localhost:8080/api/v1/employee/getEmployeeByPhoneOrName?phoneOrName=${phone}`
  );

  const {
    data,
    loading: roomLoading,
    error: roomError,
    postData,
  } = usePost<FormData>(
    "http://localhost:8080/api/v1/reservation/createReservation"
  );

  // Hàm xử lý sự thay đổi khi người dùng chọn một dịch vụ
  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setServiceName((prevServiceName) => [
      ...prevServiceName,
      event.target.options[event.target.selectedIndex].id,
    ]);
    console.log();
    const serviceId = event.target.value;
    setFormData((prevFormData) => {
      const updatedServiceIds = [...prevFormData.serviceIds];

      if (updatedServiceIds.includes(serviceId)) {
        const index = updatedServiceIds.indexOf(serviceId);
        updatedServiceIds.splice(index, 1);
      } else {
        updatedServiceIds.push(serviceId);
      }

      return {
        ...prevFormData,
        serviceIds: updatedServiceIds,
      };
    });
  };

  useEffect(() => {
    if (roomDetail) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        roomId: roomDetail.roomId.toString() || "",
      }));
    }
  }, [roomDetail]);

  // Hàm xử lý sự thay đổi khi người dùng nhập vào input
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = (emp: EmployeeProps) => {
    setSelectedEmployee((prev) => [...prev, emp]);
    setPhone("");
    setAddOpen(false);
  };

  const handleRemoveEmployee = (emp: EmployeeProps) => {
    setSelectedEmployee((prev) =>
      prev.filter((employee) => employee.employeeId !== emp.employeeId)
    );
  };

  // xử lý khi click vào ô
  const handleCellClick = (date: string, time: string) => {
    const today = new Date().toISOString().split("T")[0];

    if (date < today) {
      toast.warning("Bạn không thể đặt lịch cho ngày trong quá khứ!");
      return;
    }
    setSelectedSlot({ date, time });
    setIsModalOpen(true);
  };

  // Hàm xử lý gửi form
  const handleFormSubmit = async () => {
    const newData = {
      ...formData,
      time: new Date().toISOString(),
      timeStart: new Date(
        `${selectedSlot?.date}T${selectedSlot?.time}:00`
      ).toISOString(),
      timeEnd: new Date(`${selectedSlot?.date}T${timeEnd}:00`).toISOString(),
      timeFinishFrequency: formData.timeFinishFrequency
        ? formData.timeFinishFrequency
        : new Date().toISOString(),
      employeeIds: selectedEmployee.map((emp) => emp.employeeId),
      bookerId: user.employeeId,
    };

    console.log(newData);

    const response = await postData(newData);

    if (response) {
      setPopupMessage("Đặt lịch thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      setIsModalOpen(false);
    } else {
      setPopupMessage("Đặt lịch không thành công!");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // hàm tạo mảng thời gian
  const timeSlots = Array.from({ length: 23 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${String(hour).padStart(2, "0")}:${minute}`;
  });

  // Hàm chuyển đổi tuần
  const changeWeek = (direction: "previous" | "next") => {
    const currentDate = new Date(selectedDate);
    if (direction === "previous") {
      currentDate.setDate(currentDate.getDate() - 7);
    } else {
      currentDate.setDate(currentDate.getDate() + 7);
    }
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  // Tính toán ngày của từng thứ dựa trên selectedDate
  const getWeekDates = (dateStr: string) => {
    const selected = new Date(dateStr);
    const startOfWeek = new Date(selected);
    startOfWeek.setDate(selected.getDate() - ((selected.getDay() + 6) % 7));

    return daysOfWeek.map((_, index) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + index);
      return currentDate.toISOString().split("T")[0];
    });
  };

  const weekDates = getWeekDates(selectedDate);

  // Chuyển đổi từ yyyy-mm-dd sang dd/mm/yyyy
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Hàm chuyển đổi từ định dạng ISO thành giờ và phút
  const formatTime = (isoString: string) => {
    const time = new Date(isoString);
    return `${String(time.getHours()).padStart(2, "0")}:${String(
      time.getMinutes()
    ).padStart(2, "0")}`;
  };

  // Hàm đóng popup thông báo
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className={cx("scheduleContainer")}>
      <ToastContainer />
      <div className={cx("header")}>
        <h2>Lịch đặt phòng theo tuần</h2>

        {/* Chọn ngày */}
        <div className={cx("filterContainer")}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={cx("datePicker")}
          />
        </div>

        {/* Nút điều hướng */}
        <div className={cx("actionButtons")}>
          <button
            onClick={() =>
              setSelectedDate(new Date().toISOString().split("T")[0])
            }
          >
            Hiện tại
          </button>
          <button onClick={() => changeWeek("previous")}>Trở về</button>
          <button onClick={() => changeWeek("next")}>Tiếp</button>
        </div>
      </div>

      {/* Bảng lịch */}
      <div className={cx("tableWrapper")}>
        <div className={cx("tableContainer")}>
          <table className={cx("scheduleTable")}>
            <thead>
              <tr>
                <th>Giờ</th>
                {daysOfWeek.map((day, index) => (
                  <th key={index}>
                    {day}
                    <br />
                    <span className={cx("date")}>
                      {formatDate(weekDates[index])}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {timeSlots.map((time, index) => (
                <tr key={index}>
                  <td className={cx("timeColumn")}>{time}</td>
                  {daysOfWeek.map((day, i) => {
                    const bookedSchedule = reservations?.find((reservation) => {
                      // Tách thời gian giờ và phút từ timeStart và timeEnd
                      const startTime = formatTime(reservation.timeStart);
                      const endTime = formatTime(reservation.timeEnd);

                      // So sánh thời gian với thời gian trong bảng
                      return (
                        reservation.timeStart.split("T")[0] === weekDates[i] &&
                        startTime <= time &&
                        endTime > time
                      );
                    });

                    console.log(bookedSchedule);
                    const editBackground: { [key: string]: string } = {
                      "normal": "normal",
                      "pending": "pending",
                      "waiting": "waiting",
                      "checked_in": "checked_in",
                      "completed": "completed",
                      "waitingCanceled": "waitingCanceled",
                    }
                    const statusKey = bookedSchedule?.statusReservation.toLocaleLowerCase() || "normal";

                    console.log(editBackground[statusKey]);
                    
                    return (
                      <td
                        key={i}
                        className={cx("schedule-cell", {
                          booked: bookedSchedule,
                          [editBackground[statusKey]]: editBackground[statusKey]
                        })}
                        onClick={() => {
                          if (bookedSchedule) {
                            toast.warning("Khung giờ này đã được đặt!");
                          } else {
                            handleCellClick(weekDates[i], time);
                          }
                        }}
                      >
                        {bookedSchedule ? (
                          <div className={cx("booked-title")}>
                            <p>{bookedSchedule?.title}</p>
                            <p className={cx("status")}>
                              {bookedSchedule.statusReservation === "PENDING"
                                ? "Chờ phê duyệt"
                                : bookedSchedule.statusReservation ===
                                  "WAITING_PAYMENT"
                                ? "Chờ thanh toán"
                                : bookedSchedule.statusReservation === "WAITING"
                                ? "Chờ nhận phòng"
                                : bookedSchedule.statusReservation ===
                                  "CHECKED_IN"
                                ? "Đã nhận phòng"
                                : bookedSchedule.statusReservation ===
                                  "COMPLETED"
                                ? "Đã hoàn thành"
                                : bookedSchedule.statusReservation ===
                                  "WAITING_CANCELED"
                                ? "Chờ hủy"
                                : ""}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal */}
          {isModalOpen && selectedSlot && (
            <div className={cx("modal-overlay")}>
              <div className={cx("modal")}>
                <button
                  className={cx("close-btn")}
                  onClick={() => setIsModalOpen(false)}
                >
                  ✖
                </button>
                <h3>Đặt lịch phòng "{roomDetail?.roomName}"</h3>

                <div className={cx("form")}>
                  <div className={cx("form-info")}>
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
                        value={selectedSlot?.date || ""}
                        name="time"
                        onChange={(e) => {
                          setSelectedSlot((prev) => ({
                            ...prev!,
                            date: e.target.value,
                          }));
                        }}
                      />
                    </div>

                    <div className={cx("form-row")}>
                      {/* bắt đầu */}
                      <div className={cx("form-group")}>
                        <label>Giờ bắt đầu</label>
                        <select
                          value={selectedSlot?.time || ""}
                          onChange={(e) =>
                            setSelectedSlot((prev) => ({
                              ...prev!,
                              time: e.target.value,
                            }))
                          }
                        >
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* kết thúc */}
                      <div className={cx("form-group")}>
                        <label>Giờ kết thúc</label>
                        <select
                          value={timeEnd}
                          onChange={(e) => setTimeEnd(e.target.value)}
                        >
                          {timeSlots.map((time) => (
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
                          value={formData.frequency}
                          onChange={handleInputChange}
                          name="frequency"
                        >
                          <option value="ONE_TIME">Một lần</option>
                          <option value="DAILY">Mỗi ngày</option>
                          <option value="WEEKLY">Mỗi tuần</option>
                        </select>
                      </div>

                      {/* Chọn ngày kết thúc */}
                      <div className={cx("form-group")}>
                        <label>Ngày kết thúc</label>
                        <input
                          type="date"
                          name="timeFinishFrequency"
                          value={formData.timeFinishFrequency}
                          onChange={handleInputChange}
                        />
                      </div>
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
                        value={files}
                        onChange={(e) => {
                          setFiles(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            filePaths: [...prev.filePaths, e.target.value],
                          }));
                        }}
                      />
                    </div>

                    <select className={cx("form-group")}>
                      {formData.filePaths.map((file, index) => (
                        <option key={index}>{file}</option>
                      ))}
                    </select>

                    {/* Chọn dịch vụ */}
                    <div className={cx("form-group")}>
                      <label>Dịch vụ</label>
                      <div className={cx("checkbox-group")}>
                        <select
                          value={selectedServiceId}
                          onChange={handleServiceChange}
                        >
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
                      <input
                        type="text"
                        readOnly
                        value={serviceName.join(", ")}
                      />
                    </div>

                    {/* Người tham gia */}
                    <div className={cx("form-row")}>
                      <label>Người tham gia</label>

                      <button
                        className={cx("submit-btn")}
                        onClick={() => {
                          setAddOpen(true);
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

                    {addOpen && (
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
                                  <button
                                    onClick={() => handleAddEmployee(emp)}
                                  >
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
                <button className={cx("submit-btn")} onClick={handleFormSubmit}>
                  Gửi phê duyệt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PopupNotification
        message={popupMessage}
        type={popupType}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default WeeklySchedule;

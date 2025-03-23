import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Schedule.module.scss";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  parseISO,
  set,
} from "date-fns";
import { se, vi } from "date-fns/locale";
import useFetch from "../../../hooks/useFetch";
import {
  EmployeeProps,
  ReservationDetailProps,
  ServiceProps,
} from "../../../data/data";
import { formatCurrencyVND } from "../../../utilities";
import IconWrapper from "../../../components/icons/IconWrapper";
import { FaPlus } from "../../../components/icons/icons";
import usePost from "../../../hooks/usePost";

const cx = classNames.bind(styles);

const Schedule = () => {
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedSchedule, setSelectedSchedule] =
    useState<ReservationDetailProps | null>(null);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);

  const [selectedServiceNames, setSelectedServiceNames] = useState<string[]>(
    []
  );
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [phoneInput, setPhoneInput] = useState("");
  const [suggestedEmployees, setSuggestedEmployees] = useState<EmployeeProps[]>(
    []
  );
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeProps[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Cập nhật danh sách ngày trong tuần
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Lấy danh sách lịch đặt phòng theo tuần
  const {
    data: reservations,
    loading,
    error,
  } = useFetch<ReservationDetailProps[]>(
    `http://localhost:8080/api/v1/reservation/getAllReservationByBooker?phone=${
      user.phone
    }&dayStart=${new Date(daysOfWeek[0]).toISOString()}&dayEnd=${new Date(
      daysOfWeek[6]
    ).toISOString()}`
  );

  // Chuyển đổi dữ liệu lịch để hiển thị
  const formattedEvents = reservations?.map((event) => ({
    ...event,
    date: format(parseISO(event.timeStart), "yyyy-MM-dd"),
    timeStartEnd: `${format(parseISO(event.timeStart), "HH:mm")} - ${format(
      parseISO(event.timeEnd),
      "HH:mm"
    )}`,
  }));

  // Chuyển tuần
  const changeWeek = (direction: "prev" | "current" | "next") => {
    let newStart;
    if (direction === "prev") {
      newStart = addWeeks(weekStart, -1);
    } else if (direction === "next") {
      newStart = addWeeks(weekStart, 1);
    } else {
      newStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    }
    setWeekStart(newStart);
    setSelectedDate(newStart);
  };

  // Xử lý sự kiện chọn ngày
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    const newWeekStart = startOfWeek(newDate, { weekStartsOn: 1 });
    setWeekStart(newWeekStart);
  };

  // xử lý đóng mở modal chi tiết
  const handleOpenDetail = (reservation: ReservationDetailProps) => {
    setSelectedSchedule(reservation);
    setIsModalOpenDetail(true);
    console.log(reservation);
  };
  const handleCloseDetail = () => {
    setSelectedSchedule(null);
    setIsModalOpenDetail(false);
  };

  // xử lý đóng mở modal cập nhật
  const handleOpenUpdate = () => {
    setIsOpenUpdateModal(true);
    setIsModalOpenDetail(false);
    setFormData({
      ...formData,
      reservationIds: [selectedSchedule?.reservationId ?? 0],
      reservationDTO: {
        ...formData.reservationDTO,
        // time: selectedSchedule?.time ?? "",
        // timeStart: selectedSchedule?.timeStart ?? "",
        // timeEnd: selectedSchedule?.timeEnd ?? "",
        note: selectedSchedule?.note ?? "",
        // description: selectedSchedule?.description ?? "",
        // title: selectedSchedule?.title ?? "",
        // frequency: selectedSchedule?.frequency ?? "",
        // timeFinishFrequency: "",
        // bookerId: user?.employeeId ?? "",
        // roomId: selectedSchedule?.room.roomId,
        employeeIds:
          selectedSchedule?.attendants?.map((p) => p.employeeId) ?? [],
        serviceIds: selectedSchedule?.services?.map((s) => s.serviceId) ?? [],
        filePaths: selectedSchedule?.filePaths ?? [],
      },
    });

    setSelectedEmployees(selectedSchedule?.attendants ?? []);
  };
  const handleCloseUpdate = () => {
    setIsOpenUpdateModal(false);
    setSelectedServiceNames([]);
    setSelectedServiceIds([]);
    setFormData({
      ...formData,
      reservationIds: [] as number[],
      reservationDTO: {
        ...formData.reservationDTO,
        // time: "",
        // timeStart: "",
        // timeEnd: "",
        note: "",
        // description: "",
        // title: "",
        // frequency: "",
        // timeFinishFrequency: "",
        // bookerId: user?.employeeId ?? "",
        // roomId: 0,
        employeeIds: [] as number[],
        serviceIds: [] as number[],
        filePaths: [] as string[],
      },
    });
  };

  console.log(selectedSchedule);

  const [formData, setFormData] = useState({
    timeRequest: new Date().toISOString(),
    reservationIds: [] as number[],
    reservationDTO: {
      // time: new Date().toISOString(),
      // timeStart: selectedSchedule?.timeStart ?? "",
      // timeEnd: selectedSchedule?.timeEnd ?? "",
      note: "",
      // description: selectedSchedule?.description ?? "",
      // title: selectedSchedule?.title ?? "",
      // frequency: selectedSchedule?.frequency ?? "",
      // timeFinishFrequency: "",
      // bookerId: user?.employeeId ?? "",
      // roomId: selectedSchedule?.room.roomId,
      employeeIds: [] as number[],
      serviceIds: [] as number[],
      filePaths: [] as string[],
    },
  });

  const {
    data,
    loading: requestLoading,
    error: requestError,
    postData,
  } = usePost(
    "http://localhost:8080/api/v1/requestForm/createRequestFormUpdateReservationOne"
  );

  const handleUpdateForm = async () => {
    const updateForm = {
      ...formData,
    };
    console.log("Dữ liệu gửi: ", updateForm);

    const response = await postData(updateForm, { method: "POST" });

    if (response) {
      console.log("Cập nhật thành công");
      handleCloseUpdate();
    } else {
      console.log("Cập nhật thất bại");
    }
  };

  // Lấy danh sách dịch vụ
  const {
    data: services,
    loading: serviceLoading,
    error: serviceError,
  } = useFetch<ServiceProps[]>(
    "http://localhost:8080/api/v1/service/getAllServices"
  );

  // lấy ds dịch vụ không có trong lịch
  const servicesNotInSchedule = services?.filter(
    (service) =>
      !selectedSchedule?.services?.some(
        (s) => s.serviceId === service.serviceId
      )
  );

  // lấy nhân viên
  const {
    data: employees,
    loading: employeesLoading,
    error: employeesError,
  } = useFetch<EmployeeProps[]>(
    "http://localhost:8080/api/v1/employee/getAllEmployee"
  );

  // lấy danh sách nhân viên có trong lịch
  const employeeIds =
    selectedSchedule?.attendants?.map((p) => p.employeeId) ?? [];

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

        console.log(data);
        console.log(selectedEmployees);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Lỗi tìm nhân viên:", err);
        setSuggestedEmployees([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [phoneInput]);

  const handleAddEmployee = (employee: EmployeeProps) => {
    if (selectedEmployees.find((e) => e.employeeId === employee.employeeId))
      return;

    setSelectedEmployees((prev) => [...prev, employee]);

    setFormData({
      ...formData,
      reservationDTO: {
        ...formData.reservationDTO,
        employeeIds: [
          ...formData.reservationDTO.employeeIds,
          employee.employeeId,
        ],
      },
    });

    setPhoneInput("");
    setSuggestedEmployees([]);
    setShowSuggestions(false);
  };

  const handleRemoveEmployee = (employeeId: number) => {
    const updatedEmployees = selectedEmployees.filter(
      (e) => e.employeeId !== employeeId
    );
    setSelectedEmployees(updatedEmployees);

    const updatedIds = updatedEmployees.map((e) => e.employeeId);
    setFormData((prev) => ({
      ...prev,
      reservationDTO: {
        ...prev.reservationDTO,
        employeeIds: updatedIds,
      },
    }));
  };

  return (
    <div className={cx("schedule")}>
      <div className={cx("header")}>
        <h3>Lịch theo tuần</h3>
        {/* Chọn ngày */}
        <div>
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={handleDateChange}
            className={cx("date-picker")}
          />
        </div>
        {/* Nút chuyển tuần */}
        <div className={cx("week-navigation")}>
          <button onClick={() => changeWeek("current")}>Hiện tại</button>
          <button onClick={() => changeWeek("prev")}>Tuần trước</button>
          <button onClick={() => changeWeek("next")}>Tuần sau</button>
        </div>
      </div>

      {/* Hiển thị lịch hàng tuần */}
      <div className={cx("calendar")}>
        <table className={cx("week-table")}>
          <thead>
            <tr>
              <th></th>
              {daysOfWeek.map((day, index) => (
                <th key={index} className={cx("day")}>
                  {format(day, "EEEE", { locale: vi })} <br />
                  {format(day, "dd/MM")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Hàng buổi sáng */}
            <tr>
              <td className={cx("time-label")}>🌅 Sáng</td>
              {daysOfWeek.map((day, index) => {
                const dayFormatted = format(day, "yyyy-MM-dd");

                // sắp xếp theo thời gian bắt đầu
                const dayEvents = (formattedEvents ?? [])
                  .filter((event) => event.date === dayFormatted)
                  .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

                // Lọc sự kiện buổi sáng
                const morningEvents = dayEvents.filter((event) => {
                  const hour = parseInt(event.timeStartEnd.split(":")[0], 10);
                  return hour < 12;
                });

                return (
                  <td key={index} style={{ verticalAlign: "top" }}>
                    {morningEvents.map((event) => (
                      <div
                        className={cx("event-item")}
                        key={event.reservationId}
                        onClick={() => handleOpenDetail(event)}
                      >
                        <small>{event.timeStartEnd}</small> <br />
                        {event.title} <br />
                        <small>Phòng {event.room.roomName} </small> <br />
                        <small>
                          Tầng {event.room.location.floor} - Tòa{" "}
                          {event.room.location.building.buildingName}
                        </small>
                        <br />
                        <small>
                          {event.room.location.building.branch.branchName}
                        </small>
                        <br />
                        <small className={cx("status")}>
                          {event.statusReservation === "PENDING" &&
                            "Đang chờ phê duyệt"}
                          {event.statusReservation === "CHECKED_IN" &&
                            "Đã nhận phòng"}
                          {event.statusReservation === "COMPLETED" &&
                            "Hoàn thành"}
                        </small>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>

            {/* Hàng buổi chiều */}
            <tr>
              <td className={cx("time-label")}>🌇 Chiều</td>
              {daysOfWeek.map((day, index) => {
                const dayFormatted = format(day, "yyyy-MM-dd");

                const dayEvents = (formattedEvents ?? [])
                  .filter((event) => event.date === dayFormatted)
                  .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

                const afternoonEvents = dayEvents.filter((event) => {
                  const hour = parseInt(event.timeStartEnd.split(":")[0], 10);
                  return hour >= 12;
                });

                return (
                  <td key={index} style={{ verticalAlign: "top" }}>
                    {afternoonEvents.map((event) => (
                      <div
                        key={event.reservationId}
                        className={cx("event-item")}
                        onClick={() => handleOpenDetail(event)}
                      >
                        <small>{event.timeStartEnd}</small> <br />
                        {event.title} <br />
                        <small>Phòng {event.room.roomName} </small> <br />
                        <small>
                          Tầng {event.room.location.floor} - Tòa{" "}
                          {event.room.location.building.buildingName}
                        </small>
                        <br />
                        <small>
                          {event.room.location.building.branch.branchName}
                        </small>
                        <br />
                        <small className={cx("status")}>
                          {event.statusReservation === "PENDING" &&
                            "Đang chờ phê duyệt"}
                          {event.statusReservation === "CHECKED_IN" &&
                            "Đã nhận phòng"}
                          {event.statusReservation === "COMPLETED" &&
                            "Hoàn thành"}
                        </small>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* modal xem chi tiết */}
      {isModalOpenDetail && selectedSchedule && (
        <div className={cx("modal-overlay")}>
          <div className={cx("modal")}>
            <button className={cx("close-btn")} onClick={handleCloseDetail}>
              ✖
            </button>
            <button
              className={cx("btn-update")}
              onClick={handleOpenUpdate}
              disabled={selectedSchedule.booker.employeeId !== user.employeeId}
            >
              Chỉnh sửa thông tin cuộc họp
            </button>
            <h3>Chi tiết lịch</h3>

            <div className={cx("modal-content")}>
              <div className={cx("info-left")}>
                <p>
                  <strong>Tiêu đề:</strong> {selectedSchedule.title}
                </p>
                <p>
                  <strong>Mô tả:</strong> {selectedSchedule.description}
                </p>
                <p>
                  <strong>Ghi chú:</strong> {selectedSchedule.note}
                </p>
                <p>
                  <strong>Thời gian:</strong> {selectedSchedule.time}
                </p>
                <div className={cx("info-row")}>
                  <p>
                    <strong>Phòng:</strong> {selectedSchedule.room.roomName}
                  </p>
                  <p>
                    <strong>Sức chứa:</strong> {selectedSchedule.room.capacity}
                  </p>
                  <p>
                    <strong>Loại phòng:</strong>{" "}
                    {selectedSchedule.room.typeRoom === "VIP"
                      ? "VIP"
                      : selectedSchedule.room.typeRoom === "DEFAULT"
                      ? "Mặc định"
                      : "Hội nghị"}
                  </p>
                </div>
                <p>
                  <strong>Vị trí:</strong> Tầng{" "}
                  {selectedSchedule.room.location.floor} - tòa {""}
                  {selectedSchedule.room.location.building.buildingName} - chi
                  nhánh{" "}
                  {selectedSchedule.room.location.building.branch.branchName}
                </p>
                <p>
                  <strong>Thời gian nhận phòng:</strong>{" "}
                  {selectedSchedule.timeCheckIn ?? "Chưa nhận phòng"}
                </p>
                <p>
                  <strong>Thời gian trả phòng:</strong>{" "}
                  {selectedSchedule.timeCheckOut ?? "Chưa trả phòng"}
                </p>
                <p>
                  <strong>Thời gian hủy:</strong>{" "}
                  {selectedSchedule.timeCancel ?? "Không có"}
                </p>
                <p>
                  <strong>Chi phí:</strong>{" "}
                  {formatCurrencyVND(selectedSchedule.total)}
                </p>
              </div>

              <div className={cx("info-right")}>
                <ul className={cx("container-list")}>
                  <strong>Tài liệu</strong>
                  {selectedSchedule.filePaths.map((file, index) => (
                    <li key={index}>
                      <a href={file} target="_blank" rel="noreferrer">
                        {file}
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className={cx("container-list")}>
                  <strong>Dịch vụ</strong>
                  {selectedSchedule.services?.map((service) => (
                    <li key={service.serviceId}>
                      {service.serviceName} -{" "}
                      {formatCurrencyVND(service.priceService?.value)}
                    </li>
                  ))}
                </ul>
                <ul className={cx("container-list")}>
                  <strong>Người tham gia</strong>
                  {selectedSchedule.attendants?.map((p) => (
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
      )}

      {/* modal cập nhật thông tin: ghi chú, tài liệu, dịch vụ, người tham gia */}
      {isOpenUpdateModal && (
        <div className={cx("modal-update")}>
          <div className={cx("modal-update-content")}>
            <button className={cx("close-btn")} onClick={handleCloseUpdate}>
              ✖
            </button>
            <h3>Cập nhật thông tin cuộc họp</h3>
            <div className={cx("modal-body")}>
              <div className={cx("info-update")}>
                {/* note */}
                <div className={cx("form-group")}>
                  <label htmlFor="note">Ghi chú</label>
                  <input
                    type="text"
                    name="note"
                    id="note"
                    placeholder="Nhập ghi chú"
                    value={formData.reservationDTO.note}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reservationDTO: {
                          ...formData.reservationDTO,
                          note: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                {/* người tham gia */}
                <div
                  className={cx("form-group")}
                  style={{ position: "relative" }}
                >
                  <label htmlFor="attendant">Thêm người tham gia</label>
                  <input
                    type="text"
                    name="attendant"
                    id="attendant"
                    placeholder="Nhập số điện thoại"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    autoComplete="off"
                  />

                  {showSuggestions && suggestedEmployees.length > 0 && (
                    <div className={cx("suggestion-box")}>
                      {suggestedEmployees.map((emp) => (
                        <div
                          key={emp.employeeId}
                          className={cx("suggestion-item")}
                        >
                          <span>
                            {emp.employeeName} - {emp.phone}
                          </span>
                          <button onClick={() => handleAddEmployee(emp)}>
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

                <div className={cx("form-group")}>
                  <label>Người tham gia đã chọn:</label>
                  <ul>
                    {selectedEmployees.map((emp) => (
                      <li key={emp.employeeId} className={cx("employee-item")}>
                        {emp.employeeName} - {emp.phone}
                        {emp.employeeId === user.employeeId ? (
                          <span style={{ marginLeft: "8px", color: "blue" }}>
                            (Bạn)
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRemoveEmployee(emp.employeeId)}
                            style={{ marginLeft: "8px", color: "red" }}
                          >
                            ❌
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={cx("info-update")}>
                {/* document */}
                <div className={cx("form-group")}>
                  <label htmlFor="file">Thêm tài liệu</label>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        reservationDTO: {
                          ...formData.reservationDTO,
                          filePaths: [
                            ...formData.reservationDTO.filePaths,
                            e.target.value,
                          ],
                        },
                      });
                    }}
                  />
                </div>
                <div className={cx("form-group")}>
                  <select>
                    {formData.reservationDTO.filePaths.map((file) => (
                      <option value={file}>{file}</option>
                    ))}
                  </select>
                </div>

                {/* service */}
                <div className={cx("form-group")}>
                  <label htmlFor="service">Thêm dịch vụ</label>
                  <select
                    name="service"
                    id="service"
                    onChange={(e) => {
                      const serviceId = parseInt(e.target.value);
                      const service = services?.find(
                        (s) => s.serviceId === serviceId
                      );
                      if (selectedServiceIds.includes(serviceId)) return;
                      if (!service) return;

                      setSelectedServiceNames((prev) => [
                        ...prev,
                        service?.serviceName,
                      ]);

                      const updatedIds = [
                        ...formData.reservationDTO.serviceIds,
                        serviceId,
                      ];
                      setSelectedServiceIds(updatedIds);

                      setFormData({
                        ...formData,
                        reservationDTO: {
                          ...formData.reservationDTO,
                          serviceIds: updatedIds,
                        },
                      });
                    }}
                  >
                    {servicesNotInSchedule?.map((service) => (
                      <option key={service.serviceId} value={service.serviceId}>
                        {service.serviceName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={cx("form-group")}>
                  {
                    <ul>
                      {selectedServiceNames.map((name, index) => (
                        <li key={index}>{name}</li>
                      ))}
                    </ul>
                  }
                </div>
              </div>
            </div>
            <div className={cx("modal-footer")}>
              <button className={cx("btn-update")} onClick={handleUpdateForm}>
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;

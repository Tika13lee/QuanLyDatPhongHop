import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Schedule.module.scss";
import { format, addDays, startOfWeek, addWeeks, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import useFetch from "../../../hooks/useFetch";
import {
  EmployeeProps,
  ReservationDetailProps,
  ServiceProps,
} from "../../../data/data";
import {
  formatCurrencyVND,
  formatDateString,
  getHourMinute,
} from "../../../utilities";
import IconWrapper from "../../../components/icons/IconWrapper";
import { FaEdit, FaPlus, TbRepeat } from "../../../components/icons/icons";
import usePost from "../../../hooks/usePost";
import PopupNotification from "../../../components/popup/PopupNotification";
import CloseModalButton from "../../../components/Modal/CloseModalButton";

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
  const [phoneInput, setPhoneInput] = useState("");
  const [suggestedEmployees, setSuggestedEmployees] = useState<EmployeeProps[]>(
    []
  );
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeProps[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [openModalAddParticipant, setOpenModalAddParticipant] = useState(false);
  const [valueNote, setValueNote] = useState("");
  const [openModalAddService, setOpenModalAddService] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceProps[]>([]);
  const [reservations, setReservations] = useState<ReservationDetailProps[]>(
    []
  );

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  // Cập nhật danh sách ngày trong tuần
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const endOfDay = new Date(daysOfWeek[6]);
  endOfDay.setHours(23, 59, 59, 999);
  const dayEndISO = endOfDay.toISOString();

  // Lấy danh sách lịch đặt phòng theo tuần
  const { data, loading, error } = useFetch<ReservationDetailProps[]>(
    `http://localhost:8080/api/v1/reservation/getAllReservationByBooker?phone=${
      user.phone
    }&dayStart=${new Date(daysOfWeek[0]).toISOString()}&dayEnd=${dayEndISO}`
  );

  useEffect(() => {
    if (!data) return;
    setReservations(data);
  }, [data]);

  console.log("Lịch đặt phòng: ", reservations);

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

  // mở modal chi tiết
  const handleOpenDetail = (reservation: ReservationDetailProps) => {
    setSelectedSchedule(reservation);
    setIsModalOpenDetail(true);
    setValueNote(reservation.note);
    setSelectedEmployees(reservation.attendants ?? []);
    setSelectedServices(reservation.services ?? []);
  };

  // đóng modal chi tiết
  const handleCloseDetail = () => {
    setSelectedSchedule(null);
    setIsModalOpenDetail(false);
    setIsEdit(false);
    setValueNote("");
    setSelectedEmployees([]);
    setSelectedServices([]);
  };

  // mở modal thêm người tham gia
  const handleOpenAddParticipant = () => {
    setOpenModalAddParticipant(true);
    setSelectedEmployees(selectedSchedule?.attendants ?? []);
  };
  // đóng modal thêm người tham gia
  const handleCloseAddParticipant = () => {
    setOpenModalAddParticipant(false);
    if (!selectedSchedule) return;
    setSelectedSchedule({
      ...selectedSchedule,
      attendants: selectedEmployees,
    });
  };

  // tìm kiếm nhân viên tham gia
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

  // xử lý thêm nhân viên tham gia
  const handleAddEmployee = (employee: EmployeeProps) => {
    if (selectedEmployees.find((e) => e.employeeId === employee.employeeId))
      return;

    setSelectedEmployees((prev) => [...prev, employee]);

    setPhoneInput("");
    setSuggestedEmployees([]);
    setShowSuggestions(false);
  };

  // xử lý xóa nhân viên tham gia
  const handleRemoveEmployee = (employeeId: number) => {
    const updatedEmployees = selectedEmployees.filter(
      (e) => e.employeeId !== employeeId
    );
    setSelectedEmployees(updatedEmployees);
  };

  // xử lý xóa tài liệu
  const handleRemoveDocument = (index: number) => {
    const updated = selectedSchedule?.filePaths.filter((_, i) => i !== index);

    if (updated)
      setSelectedSchedule((prev) =>
        prev
          ? {
              ...prev,
              filePaths: updated,
            }
          : prev
      );
  };

  const {
    data: updateData,
    loading: updateLoading,
    error: updateError,
    postData,
  } = usePost("http://localhost:8080/api/v1/reservation/updateReservation");

  // xử lý cập nhật
  const handleSaveUpdate = async () => {
    const updateForm = {
      reservationId: `${selectedSchedule?.reservationId}`,
      note: valueNote ?? "",
      employeeIds: selectedEmployees.map((e) => e.employeeId),
      filePaths: selectedSchedule?.filePaths ?? [],
    };
    console.log("Dữ liệu gửi: ", updateForm);

    try {
      const response = await postData(updateForm, { method: "POST" });

      if (response) {
        console.log(response.data);
        setPopupMessage("Cập nhật thành công");
        setPopupType("success");
        setIsPopupOpen(true);

        // cập nhật lại lịch
        setSelectedSchedule(
          (prev) =>
            ({
              ...(response.data || {}),
            } as ReservationDetailProps)
        );

        setReservations((prev: ReservationDetailProps[]) => {
          return prev.map((schedule) =>
            schedule.reservationId === Number(updateForm.reservationId)
              ? (response.data as ReservationDetailProps)
              : schedule
          );
        });

        handleCloseDetail();
      } else {
        setPopupMessage("Cập nhật thất bại");
        setPopupType("error");
        setIsPopupOpen(true);
      }
    } catch (err) {
      console.error("Lỗi cập nhật: ", err);
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

  // xử lý xóa dịch vụ
  const handleRemoveService = (id: number) => {
    const updated = selectedServices.filter(
      (service) => service.serviceId !== id
    );

    setSelectedServices(updated);
  };

  const [formData, setFormData] = useState({
    timeRequest: new Date().toISOString(),
    reservationIds: [] as number[],
    reservationDTO: {
      note: "",
      employeeIds: [] as number[],
      serviceIds: [] as number[],
      filePaths: [] as string[],
    },
  });

  // gửi phê duyệt chỉnh sửa dịch vụ
  const {
    data: requestUpdateService,
    loading: requestLoading,
    error: requestError,
    postData: postDataService,
  } = usePost(
    "http://localhost:8080/api/v1/requestForm/createRequestFormUpdateReservationOne"
  );

  // xử lý gửi phê duyệt chỉnh sửa dịch vụ
  const handleSubmitService = async () => {
    const updateForm = {
      ...formData,
      reservationIds: [selectedSchedule?.reservationId ?? 0],
      reservationDTO: {
        ...formData.reservationDTO,
        serviceIds: selectedServices.map((s) => s.serviceId),
      },
    };
    console.log("Dữ liệu gửi dv: ", updateForm);

    const response = await postDataService(updateForm, { method: "POST" });

    if (response) {
      setPopupMessage("Gửi phê duyệt thành công");
      setPopupType("success");
      setIsPopupOpen(true);
      setOpenModalAddService(false);
    } else {
      setPopupMessage("Gửi phê duyệt thất bại");
      setPopupType("error");
      setIsPopupOpen(true);
    }
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
              <td className={cx("time-label")}>Sáng</td>
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
                        className={cx("event-item", {
                          "status-pending":
                            event.statusReservation == "PENDING",
                          "status-other": event.statusReservation !== "PENDING",
                        })}
                        key={event.reservationId}
                        onClick={() => handleOpenDetail(event)}
                      >
                        <p>
                          {event.frequency === "ONE_TIME" ? (
                            <span style={{ color: "red" }}>●</span>
                          ) : (
                            <IconWrapper
                              icon={TbRepeat}
                              size={12}
                              color="blue"
                            />
                          )}{" "}
                          {event.timeStartEnd}
                        </p>
                        <p>
                          <strong>{event.title}</strong>
                        </p>
                        <p>Phòng {event.room.roomName} </p>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>

            {/* Hàng buổi chiều */}
            <tr>
              <td className={cx("time-label")}>Chiều</td>
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
                        className={cx("event-item", {
                          "status-pending":
                            event.statusReservation == "PENDING",
                          "status-other": event.statusReservation !== "PENDING",
                        })}
                        key={event.reservationId}
                        onClick={() => handleOpenDetail(event)}
                      >
                        <p>
                          {event.frequency === "ONE_TIME" ? (
                            <span style={{ color: "red" }}>●</span>
                          ) : (
                            <IconWrapper
                              icon={TbRepeat}
                              size={12}
                              color="blue"
                            />
                          )}{" "}
                          {event.timeStartEnd}
                        </p>
                        <p>
                          <strong>{event.title}</strong>
                        </p>
                        <p>Phòng {event.room.roomName} </p>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ghi chú màu */}
      <div className={cx("schedule-legend")}>
        <div className={cx("legend-item")}>
          <span className={cx("legend-color", "pending")}></span> Đang chờ phê
          duyệt
        </div>
        <div className={cx("legend-item")}>
          <span className={cx("legend-color", "approval")}></span>Đã phê duyệt
        </div>
      </div>

      {/* modal xem chi tiết */}
      {isModalOpenDetail && selectedSchedule && (
        <div className={cx("modal-overlay")}>
          <div className={cx("modal")}>
            <CloseModalButton onClick={handleCloseDetail} />
            <div className={cx("modal-header")}>
              <button
                className={cx("btn-update")}
                onClick={() => {
                  if (selectedSchedule.booker.employeeId !== user.employeeId) {
                    setPopupMessage(`Bạn không được phép chỉnh sửa lịch này!`);
                    setPopupType("error");
                    setIsPopupOpen(true);
                    return;
                  }
                  setIsEdit(true);
                }}
                disabled={new Date(selectedSchedule.timeStart) < new Date()}
              >
                <IconWrapper icon={FaEdit} size={16} color="white" />
                Chỉnh sửa
              </button>
              <button
                className={cx("btn-delete")}
                disabled={new Date(selectedSchedule.timeStart) < new Date()}
              >
                <IconWrapper icon={FaEdit} size={16} color="white" />
                Hủy lịch
              </button>
            </div>
            <h3>Chi tiết lịch</h3>

            <div className={cx("modal-content")}>
              <div className={cx("info-left")}>
                <p>
                  <strong>Tiêu đề:</strong> {selectedSchedule.title}
                </p>
                <div className={cx("info-row")}>
                  <p>
                    <strong>Ngày:</strong>{" "}
                    {formatDateString(selectedSchedule.timeStart)}
                  </p>

                  <p>
                    <strong>Thời gian:</strong>{" "}
                    {getHourMinute(selectedSchedule.timeStart)} -{" "}
                    {getHourMinute(selectedSchedule.timeEnd)}
                  </p>
                </div>

                <p>
                  <strong>Tần suất:</strong>{" "}
                  {selectedSchedule.frequency === "ONE_TIME"
                    ? "Một lần"
                    : selectedSchedule.frequency === "DAILY"
                    ? "Mỗi ngày"
                    : "Hàng tuần"}
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
                {isEdit ? (
                  <div className={cx("info-row")}>
                    <label>
                      <strong>Ghi chú:</strong>
                    </label>
                    <input
                      type="text"
                      value={valueNote}
                      onChange={(e) => {
                        setValueNote(e.target.value);
                      }}
                    />
                  </div>
                ) : (
                  <p>
                    <strong>Ghi chú:</strong> {selectedSchedule.note}
                  </p>
                )}
                <p>
                  <strong>Mô tả:</strong> {selectedSchedule.description}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  {statusLabels[
                    selectedSchedule.statusReservation as keyof typeof statusLabels
                  ] || "Không xác định"}
                </p>
                <p>
                  <strong>Thời gian nhận phòng:</strong>{" "}
                  {selectedSchedule.timeCheckIn
                    ? `Ngày ${formatDateString(
                        selectedSchedule.timeCheckIn
                      )} lúc ${getHourMinute(selectedSchedule.timeCheckIn)}`
                    : "Chưa nhận"}
                </p>
                <p>
                  <strong>Thời gian trả phòng:</strong>{" "}
                  {selectedSchedule.timeCheckOut
                    ? `Ngày ${formatDateString(
                        selectedSchedule.timeCheckOut
                      )} lúc ${getHourMinute(selectedSchedule.timeCheckOut)}`
                    : "Chưa trả"}
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
                {/* document */}
                <ul className={cx("container-list")}>
                  <div className={cx("list-header")}>
                    <strong>Tài liệu</strong>
                    {isEdit && (
                      <>
                        <input
                          id="file-upload"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const fakeUrl = URL.createObjectURL(file);
                              const updated = [
                                ...selectedSchedule.filePaths,
                                fakeUrl,
                              ];

                              setSelectedSchedule((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      filePaths: updated,
                                    }
                                  : prev
                              );
                            }
                          }}
                          style={{ display: "none" }}
                        />
                        <label
                          htmlFor="file-upload"
                          className={cx("edit-icon")}
                        >
                          <IconWrapper
                            icon={FaPlus}
                            size={16}
                            color="#33cc33"
                          />
                        </label>
                      </>
                    )}
                  </div>
                  {/* hiện tài liệu */}
                  {selectedSchedule.filePaths.map((file, index) => (
                    <li key={index} className={cx("file-item")}>
                      <a href={file} target="_blank" rel="noreferrer">
                        {file}
                      </a>
                      {isEdit && (
                        <button
                          className={cx("remove-btn")}
                          onClick={() => handleRemoveDocument(index)}
                        >
                          ❌
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {/* service */}
                <ul className={cx("container-list")}>
                  <div className={cx("list-header")}>
                    <strong>Dịch vụ</strong>
                    {isEdit && (
                      <div
                        className={cx("edit-icon")}
                        onClick={() => {
                          setOpenModalAddService(true);
                        }}
                      >
                        <IconWrapper icon={FaPlus} size={16} color="#33cc33" />
                      </div>
                    )}
                  </div>

                  {/* render list service */}
                  {selectedSchedule.services?.map((service) => (
                    <li key={service.serviceId}>
                      {service.serviceName} -{" "}
                      {formatCurrencyVND(service.priceService?.value)}
                    </li>
                  ))}

                  {/* add, remove service */}
                  {openModalAddService && (
                    <div className={cx("modal-add-service")}>
                      <div className={cx("modal-add-service-content")}>
                        <CloseModalButton
                          onClick={() => setOpenModalAddService(false)}
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
                                  onClick={() =>
                                    handleRemoveService(service.serviceId)
                                  }
                                >
                                  ❌
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className={cx("modal-footer")}>
                          <button
                            className={cx("btn-update")}
                            onClick={handleSubmitService}
                          >
                            Gửi phê duyệt
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </ul>

                {/* participant */}
                <ul className={cx("container-list")}>
                  <div className={cx("list-header")}>
                    <strong>Người tham gia</strong>
                    {isEdit && (
                      <div
                        className={cx("edit-icon")}
                        onClick={handleOpenAddParticipant}
                      >
                        <IconWrapper icon={FaPlus} size={16} color="#33cc33" />
                      </div>
                    )}
                  </div>

                  {/* render list emp  */}
                  {selectedSchedule.attendants?.map((p) => (
                    <li key={p.employeeId}>
                      <div className={cx("info-row")}>
                        <p>{p.employeeName}</p>
                        <p>{p.phone}</p>
                      </div>
                    </li>
                  ))}

                  {/* add, remove emp */}
                  {openModalAddParticipant && (
                    <div className={cx("modal-add-participant")}>
                      <div className={cx("modal-add-participant-content")}>
                        <CloseModalButton onClick={handleCloseAddParticipant} />
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
                        <div className={cx("modal-footer")}>
                          <button
                            className={cx("btn-update")}
                            onClick={handleCloseAddParticipant}
                          >
                            Cập nhật
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </ul>
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
                <button className={cx("btn-update")} onClick={handleSaveUpdate}>
                  Lưu
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
};

const statusLabels = {
  PENDING: "Chờ phê duyệt",
  CANCELED: "Đã hủy",
  CHECKED_IN: "Đã nhận phòng",
  COMPLETED: "Hoàn thành",
  WAITING: "Đang chờ nhận",
  NOT_CHECKED_IN: "Không nhận phòng",
};

export default Schedule;

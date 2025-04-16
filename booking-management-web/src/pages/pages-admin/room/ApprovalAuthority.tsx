import classNames from "classnames/bind";
import styles from "./ApprovalAuthority.module.scss";
import { BranchProps, EmployeeProps, RoomProps } from "../../../data/data";
import { use, useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { formatCurrencyVND } from "../../../utilities";
import IconWrapper from "../../../components/icons/IconWrapper";
import { FiRefreshCw, SiFusionauth } from "../../../components/icons/icons";
import CloseModalButton from "../../../components/Modal/CloseModalButton";
import { FaPlus } from "react-icons/fa";
import PopupNotification from "../../../components/popup/PopupNotification";

const cx = classNames.bind(styles);

function ApprovalAuthority() {
  const [roomsNotApproved, setRoomsNotApproved] = useState<RoomProps[]>([]);
  const [openEmployees, setOpenEmployees] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedEmployees, setSuggestedEmployees] = useState<EmployeeProps[]>(
    []
  );
  const [roomId, setRoomId] = useState<number>(0);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeProps | null>(null);

  const [selectedBranch, setSelectedBranch] = useState<string>("");

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const { data, loading, error } = useFetch<RoomProps[]>(
    "http://localhost:8080/api/v1/room/getRoomNotApprover"
  );

  // load rooms not approved
  useEffect(() => {
    if (data) {
      setRoomsNotApproved(data);
    }
  }, [data]);

  // tìm kiếm nhân viên
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
        setSuggestedEmployees(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Lỗi tìm nhân viên:", err);
        setSuggestedEmployees([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [phoneInput]);

  // xử lý chọn nhân viên
  const handleSelectEmployee = (employee: EmployeeProps) => {
    setSelectedEmployee(employee);
    setPhoneInput("");
    setSuggestedEmployees([]);
    setShowSuggestions(false);
  };

  // Xử lý sự kiện khi nhấn nút "Lưu"
  const handleSubmit = async () => {
    if (!selectedEmployee) {
      setPopupMessage("Vui lòng chọn nhân viên phê duyệt.");
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    const data = {
      roomId: roomId,
      employeePhone: selectedEmployee.phone,
    };

    console.log("Data to submit:", data);

    fetch(
      `http://localhost:8080/api/v1/room/addApproveToRoom?roomId=${data.roomId}&phoneApprover=${data.employeePhone}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPopupMessage("Thêm nhân viên phê duyệt thành công.");
        setPopupType("success");
        setIsPopupOpen(true);

        setOpenEmployees(false);
        setPhoneInput("");
        setSelectedEmployee(null);
        setRoomsNotApproved((prevRooms) =>
          prevRooms.filter((room) => room.roomId !== roomId)
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        setPopupMessage("Có lỗi xảy ra. Vui lòng thử lại.");
        setPopupType("error");
        setIsPopupOpen(true);
      });
  };

  // Lấy danh sách chi nhánh
  const {
    data: branchs,
    loading: branchsLoading,
    error: branchsError,
  } = useFetch<BranchProps[]>(
    "http://localhost:8080/api/v1/location/getAllBranch"
  );

  return (
    <div className={cx("approval-authority")}>
      <div className={cx("header")}>
        <div className={cx("search")}>
          <span>Tên phòng</span>
          <input type="text" placeholder="Nhập tên phòng..." />
        </div>
        <div className={cx("search")}>
          <span>Chi nhánh</span>
          <select
            name="branch"
            id="branch"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="" disabled>
              Chọn chi nhánh
            </option>
            {branchsLoading ? (
              <option>Loading...</option>
            ) : branchsError ? (
              <option>Error loading branches</option>
            ) : (
              branchs?.map((branch) => (
                <option key={branch.branchId} value={branch.branchName}>
                  {branch.branchName}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <button>
            <IconWrapper icon={FiRefreshCw} color="#0d6efd" size={18} />
          </button>
        </div>
      </div>

      <div className={cx("room-list")}>
        <table className={cx("room-table")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên phòng</th>
              <th>Vị trí</th>
              <th>Sức chứa</th>
              <th>Giá đang áp dụng</th>
              <th>Phân người phê duyệt</th>
            </tr>
          </thead>
          <tbody>
            {roomsNotApproved.length === 0 ? (
              <tr>
                <td colSpan={5}>Tất cả các phòng đã có người phê duyệt.</td>
              </tr>
            ) : (
              roomsNotApproved.map((room, index) => (
                <tr key={room.roomId}>
                  <td>{index + 1}</td>
                  <td>{room.roomName}</td>
                  <td>
                    {(() => {
                      const loc = room.location;

                      if (
                        "building" in loc &&
                        typeof loc.building === "object"
                      ) {
                        // Kiểu LocationProps
                        return (
                          <>
                            {loc.building.branch.branchName} - Tòa{" "}
                            {loc.building.buildingName} - tầng {loc.floor}
                          </>
                        );
                      }
                    })()}
                  </td>
                  <td>{room.capacity}</td>
                  <td>{formatCurrencyVND(Number(room.priceValue))}</td>
                  <td
                    onClick={() => {
                      setOpenEmployees(true);
                      setRoomId(room.roomId);
                    }}
                  >
                    <IconWrapper icon={SiFusionauth} color="red" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {openEmployees && (
        <div className={cx("modal-overlay")}>
          <div className={cx("modal-content")}>
            <CloseModalButton onClick={() => setOpenEmployees(false)} />
            <h3>Tìm nhân viên phê duyệt cho phòng</h3>
            <div className={cx("modal-body")}>
              <div
                className={cx("form-group")}
                style={{ position: "relative" }}
              >
                <input
                  type="text"
                  name="attendant"
                  placeholder="Nhập số điện thoại"
                  autoComplete="off"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                />
                {showSuggestions && suggestedEmployees.length > 0 && (
                  <div className={cx("suggestion-box")}>
                    {suggestedEmployees.map((emp) => (
                      <div
                        key={emp.employeeId}
                        className={cx("suggestion-item")}
                        onClick={() => handleSelectEmployee(emp)}
                      >
                        <span>
                          {emp.employeeName} - {emp.phone}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedEmployee && (
                  <div className={cx("selected-employee")}>
                    <div>
                      <img
                        src={selectedEmployee.avatar}
                        alt="Avatar"
                        className={cx("avatar")}
                        style={{ width: "100px", height: "100px" }}
                      />
                    </div>
                    <div>
                      <p>
                        <strong>Tên: </strong>
                        {selectedEmployee.employeeName}
                      </p>
                      <p>
                        <strong>Số điện thoại: </strong>
                        {selectedEmployee.phone}
                      </p>
                      <p>
                        <strong>Email: </strong>
                        {selectedEmployee.email}
                      </p>
                      <p>
                        <strong>Phòng ban: </strong>
                        {selectedEmployee.department.depName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={cx("modal-footer")}>
              <button className={cx("submit-btn")} onClick={handleSubmit}>
                Lưu
              </button>
            </div>
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

export default ApprovalAuthority;

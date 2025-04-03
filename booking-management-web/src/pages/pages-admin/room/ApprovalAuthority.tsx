import classNames from "classnames/bind";
import styles from "./ApprovalAuthority.module.scss";
import { EmployeeProps, RoomProps } from "../../../data/data";
import { use, useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { formatCurrencyVND } from "../../../utilities";
import IconWrapper from "../../../components/icons/IconWrapper";
import { SiFusionauth } from "../../../components/icons/icons";
import CloseModalButton from "../../../components/Modal/CloseModalButton";
import { FaPlus } from "react-icons/fa";

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

  const { data, loading, error } = useFetch<RoomProps[]>(
    "http://localhost:8080/api/v1/room/getRoomNotApprover"
  );

  // load rooms not approved
  useEffect(() => {
    if (data) {
      setRoomsNotApproved(data);
    }
  }, [data]);

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

  const handleSelectEmployee = (employee: EmployeeProps) => {
    setSelectedEmployee(employee);
    setPhoneInput("");
    setSuggestedEmployees([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async () => {
    if (!selectedEmployee) {
      alert("Vui lòng chọn nhân viên phê duyệt.");
      return;
    }

    const data = {
      roomId: roomId,
      employeeId: selectedEmployee.phone,
    };

    console.log("Data to submit:", data);
  };

  return (
    <div className={cx("approval-authority")}>
      {/* <div className={cx("header")}>
        <div className={cx("filters")}>
          <div className={cx("filter-item")}>
            <label>Chi nhánh:</label>
            <select>
              <option value="">-- Chọn chi nhánh --</option>
            </select>
          </div>

          <div className={cx("filter-item")}>
            <label>Nhân viên:</label>
            <select>
              <option value="">-- Chọn nhân viên --</option>
            </select>
          </div>
        </div>
        <div></div>
      </div> */}

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
                    <p>{selectedEmployee.employeeName}</p>
                    <p>{selectedEmployee.phone}</p>
                    <p>{selectedEmployee.email}</p>
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
    </div>
  );
}

export default ApprovalAuthority;

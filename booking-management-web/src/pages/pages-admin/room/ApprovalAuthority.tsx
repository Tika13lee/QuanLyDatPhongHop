import classNames from "classnames/bind";
import styles from "./ApprovalAuthority.module.scss";
import { RoomProps } from "../../../data/data";
import { use, useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { formatCurrencyVND } from "../../../utilities";

const cx = classNames.bind(styles);

// Dữ liệu mẫu – bạn có thể thay bằng props, API call, v.v.
const departmentsWithoutApprover = [
  {
    id: 1,
    name: "Phòng Kế Toán",
    location: "Tầng 1",
    capacity: 10,
    price: 1000000,
  },
  {
    id: 2,
    name: "Phòng Kỹ Thuật",
    location: "Tầng 2",
    capacity: 20,
    price: 2000000,
  },
  {
    id: 3,
    name: "Phòng Nhân Sự",
    location: "Tầng 3",
    capacity: 30,
    price: 3000000,
  },
  {
    id: 4,
    name: "Phòng Kinh Doanh",
    location: "Tầng 4",
    capacity: 40,
    price: 4000000,
  },
  {
    id: 5,
    name: "Phòng Marketing",
    location: "Tầng 5",
    capacity: 50,
    price: 5000000,
  },
];

function ApprovalAuthority() {
  const [roomsNotApproved, setRoomsNotApproved] = useState<RoomProps[]>([]);

  const { data, loading, error } = useFetch<RoomProps[]>(
    "http://localhost:8080/api/v1/room/getRoomNotApprover"
  );

  useEffect(() => {
    if (data) {
      setRoomsNotApproved(data);
    }
  }, [data]);

  return (
    <div className={cx("approval-authority")}>
      <div className={cx("header")}>
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
  
                      if ("building" in loc && typeof loc.building === "object") {
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ApprovalAuthority;

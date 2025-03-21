import classNames from "classnames/bind";
import styles from "./ApprovalAuthority.module.scss";

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
        <div>
          
        </div>
      </div>

      <table className={cx("table")}>
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
          {departmentsWithoutApprover.length === 0 ? (
            <tr>
              <td colSpan={3}>Tất cả các phòng đã có người phê duyệt.</td>
            </tr>
          ) : (
            departmentsWithoutApprover.map((dept, index) => (
              <tr key={dept.id}>
                <td>{index + 1}</td>
                <td>{dept.name}</td>
                <td>{dept.location}</td>
                <td>{dept.capacity}</td>
                <td>{dept.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ApprovalAuthority;

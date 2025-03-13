import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Employee.module.scss";
import { EmployeeProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const cx = classNames.bind(styles);

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<EmployeeProps[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<EmployeeProps>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  // Lấy dữ liệu locations từ Redux Store
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state: RootState) => state.location);

  const {
    data,
    loading: fetchLoading,
    error: fetchError,
  } = useFetch<EmployeeProps[]>(
    "http://localhost:8080/api/v1/employee/getAllEmployee"
  );

  useEffect(() => {
    if (data) {
      setEmployees(data);
      setLoading(false);
    }
    if (fetchError) {
      setError(fetchError.message || "Đã xảy ra lỗi khi tải dữ liệu");
      setLoading(false);
    }
  }, [data, fetchError]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleSubmit = () => {
  //   if (editingId) {
  //     setEmployees(
  //       employees?.map((emp) =>
  //         emp.employeeId === editingId ? ({ ...emp, ...form } as EmployeeProps) : emp
  //       )
  //     );
  //     setEditingId(null);
  //   } else {
  //     setEmployees([...employees, { id: Date.now(), ...form } as EmployeeProps]);
  //   }
  //   setForm({});
  // };

  // const handleEdit = (employee: EmployeeProps) => {
  //   setForm(employee);
  //   setEditingId(employee.employeeId);
  // };

  return (
    <div className={cx("employee-container")}>
      <div className={cx("form-container")}>
        <div className={cx("form-image")}>
          <h3>Chọn hình ảnh</h3>
          <input
            name="avatar"
            placeholder="Hình ảnh URL"
            value={form.avatar || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className={cx("form-input")}>
          <h3>Nhập thông tin</h3>
          <input
            name="employeeName"
            placeholder="Tên"
            value={form.employeeName || ""}
            onChange={handleInputChange}
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email || ""}
            onChange={handleInputChange}
          />
          <input
            name="phone"
            placeholder="Điện thoại"
            value={form.phone || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className={cx("form-select")}>
          <h3>Chọn thông tin</h3>
          <select name="departmentId">
            <option value="">Chọn phòng ban</option>
            <option value="1">Phòng ban 1</option>
            <option value="2">Phòng ban 2</option>
            <option value="3">Phòng ban 3</option>
          </select>
          <select>
            <option value="">Chọn chi nhánh</option>
            {[
              ...new Set(locations?.map((location) => location.branch) || []),
            ].map((branch, index) => (
              <option key={index} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <select name="departmentId">
            <option value="">Chọn trạng thái</option>
            <option value="1">Còn hoạt động</option>
            <option value="2">Đã ngừng</option>
          </select>
        </div>

        <div className={cx("form-button")}>
          <button>{editingId ? "Cập nhật" : "Thêm"}</button>
        </div>
      </div>

      <div className={cx("table-wrapper")}>
        <table>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Phòng ban</th>
              <th>Vị trí</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((emp) => (
              <tr key={emp.employeeId}>
                <td>
                  <img
                    src={emp.avatar}
                    alt=""
                    className={cx("employee-image")}
                  />
                </td>
                <td>{emp.employeeName}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department.depName}</td>
                <td>{emp.department.location.branch}</td>
                <td>
                  <button>✏️</button>
                  <button>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManagement;

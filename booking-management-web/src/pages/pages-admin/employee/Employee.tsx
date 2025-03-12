import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Employee.module.scss";

const cx = classNames.bind(styles);

interface Employee {
  id: number;
  name: string;
  email: string;
  age: number;
  phone: string;
  image: string;
  position: string;
  department: string;
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "Nguyen Van A",
      email: "nguyenvana@example.com",
      age: 30,
      phone: "0901234567",
      image: "https://via.placeholder.com/50",
      position: "Developer",
      department: "IT",
    },
    {
      id: 2,
      name: "Nguyen Van A",
      email: "nguyenvana@example.com",
      age: 30,
      phone: "0901234567",
      image: "https://via.placeholder.com/50",
      position: "Developer",
      department: "IT",
    },
    {
      id: 3,
      name: "Nguyen Van A",
      email: "nguyenvana@example.com",
      age: 30,
      phone: "0901234567",
      image: "https://via.placeholder.com/50",
      position: "Developer",
      department: "IT",
    },
    {
      id: 4,
      name: "Nguyen Van A",
      email: "nguyenvana@example.com",
      age: 30,
      phone: "0901234567",
      image: "https://via.placeholder.com/50",
      position: "Developer",
      department: "IT",
    },
  ]);
  const [form, setForm] = useState<Partial<Employee>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editingId) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingId ? ({ ...emp, ...form } as Employee) : emp
        )
      );
      setEditingId(null);
    } else {
      setEmployees([...employees, { id: Date.now(), ...form } as Employee]);
    }
    setForm({});
  };

  const handleEdit = (employee: Employee) => {
    setForm(employee);
    setEditingId(employee.id);
  };

  const handleDelete = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div className={cx("employee-container")}>
      <div className={cx("form-container")}>
        <input
          name="name"
          placeholder="Tên"
          value={form.name || ""}
          onChange={handleInputChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email || ""}
          onChange={handleInputChange}
        />
        <input
          name="age"
          placeholder="Tuổi"
          type="number"
          value={form.age?.toString() || ""}
          onChange={handleInputChange}
        />
        <input
          name="phone"
          placeholder="Điện thoại"
          value={form.phone || ""}
          onChange={handleInputChange}
        />
        <input
          name="image"
          placeholder="Hình ảnh URL"
          value={form.image || ""}
          onChange={handleInputChange}
        />
        <input
          name="position"
          placeholder="Vị trí"
          value={form.position || ""}
          onChange={handleInputChange}
        />
        <select
          name="department"
          value={form.department || ""}
          onChange={handleInputChange}
        >
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Marketing">Marketing</option>
        </select>
        <button onClick={handleSubmit}>
          {editingId ? "Cập nhật" : "Thêm"}
        </button>
      </div>

      <div className={cx("table-wrapper")}>
        <table>
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Tuổi</th>
              <th>Điện thoại</th>
              <th>Vị trí</th>
              <th>Phòng ban</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <img
                    src={emp.image}
                    alt=""
                    className={cx("employee-image")}
                  />
                </td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.age}</td>
                <td>{emp.phone}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>
                  <button onClick={() => handleEdit(emp)}>✏️</button>
                  <button onClick={() => handleDelete(emp.id)}>🗑️</button>
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

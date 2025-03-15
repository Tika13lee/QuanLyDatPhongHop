import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Employee.module.scss";
import { DepartmentProps, EmployeeProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import IconWrapper from "../../../components/icons/IconWrapper";
import {
  FaPlus,
  MdOutlineInfo,
  MdSearch,
} from "../../../components/icons/icons";
import usePost from "../../../hooks/usePost";

const cx = classNames.bind(styles);

const EmployeeManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [employees, setEmployees] = useState<EmployeeProps[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileName, setFileName] = useState("");
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeProps | null>();

  const [isCheck, setIsCheck] = useState<any>();

  const [formData, setFormData] = useState({
    employeeName: "",
    email: "",
    phone: "",
    departmentId: "",
    avatar: "",
    role: "true",
  });

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  // Lấy locations từ Redux Store
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state: RootState) => state.location);

  //lấy derpartment
  const {
    data: departments,
    loading: departmentLoading,
    error: departmentError,
  } = useFetch<DepartmentProps[]>(
    "http://localhost:8080/api/v1/department/getAllDepartments"
  );

  // ds nhân viên
  const {
    data: employeesData,
    loading: fetchLoading,
    error: fetchError,
  } = useFetch<EmployeeProps[]>(
    "http://localhost:8080/api/v1/employee/getAllEmployee"
  );

  // thêm nhân viên
  const {
    data,
    loading: loadingAdd,
    error: errorAdd,
    postData,
  } = usePost<EmployeeProps[]>(
    "http://localhost:8080/api/v1/employee/addEmployee"
  );

  useEffect(() => {
    if (employeesData) {
      setEmployees(employeesData);
      setLoading(false);
    }
    if (fetchError) {
      setError(fetchError.message || "Đã xảy ra lỗi khi tải dữ liệu");
      setLoading(false);
    }
  }, [employeesData, fetchError]);

  // Hàm xử lý khi thay đổi input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value, files } = e.target as HTMLInputElement;

    if (type === "file" && files?.[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
      setFileName(file.name);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setFileName("");
    }
  };

  // Hàm xử lý khi chọn nhân viên để chỉnh sửa
  const handleEditEmployee = (emp: any) => {
    setOpenForm(true);
    setSelectedEmployee(emp);
    setFormData({
      // employeeId: "",
      employeeName: emp.employeeName,
      email: emp.email,
      phone: emp.phone,
      departmentId: "",
      avatar: "",
      role: "",
    });
  };

  // hàm xử lý thêm mới nhân viên
  const handleAddEmployee = async () => {
    const newEmployee = {
      employeeName: formData.employeeName,
      email: formData.email,
      phone: formData.phone,
      departmentId: formData.departmentId,
      avatar: formData.avatar,
      role: formData.role,
    };

    console.log(newEmployee);

    const response = await postData(newEmployee);

    if (response) {
      setPopupMessage("Nhân viên đã được thêm thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      // dispatch(fetchEmployees());
      resetForm();
      setOpenForm(false);
    } else {
      setPopupMessage("Đã xảy ra lỗi khi thêm nhân viên!");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // hàm xử lý cập nhật nhân viên
  const handleUpdateEmployee = async () => {
    console.log("Dữ liệu gửi đến backend: ", formData);
  };

  // Hàm reset form
  const resetForm = () => {
    setFormData({
      // employeeId: "",
      employeeName: "",
      email: "",
      phone: "",
      departmentId: "",
      avatar: "",
      role: "",
    });
    setFileName("");
    setEditingId(null);
  };

  // Hàm mở form thêm mới
  const handleOpenForm = () => {
    setOpenForm(true);
  };

  // Hàm đóng form
  const handleCloseForm = () => {
    setOpenForm(false);
    // resetForm();
  };

  return (
    <div className={cx("employee-container")}>
      {/* tìm kiếm */}
      <div className={cx("search-container")}>
        <div className={cx("search-box")}>
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên theo tên, sdt"
            className={cx("search-input")}
          />
          <button>
            <IconWrapper icon={MdSearch} color="#fff" size={24} />
          </button>
        </div>
        <div className={cx("filter-container")}>
          <p>Lọc nhân viên theo</p>
          <select>
            <option value="">Chọn chi nhánh</option>
            {[
              ...new Set(
                locations?.map(
                  (location) => location.branch
                ) || []
              ),
            ].map((branch, index) => (
              <option key={index} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <select name="departmentId">
            <option value="">Chọn phòng ban</option>
            {departments?.map((department) => (
              <option
                key={department.departmentId}
                value={department.departmentId}
              >
                {department.depName}
              </option>
            ))}
          </select>
          <select name="departmentId">
            <option value="">Chọn trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>
        </div>
      </div>

      {/* chức năng */}
      <div className={cx("function-container")}>
        <p>Danh sách nhân viên</p>
        <div className={cx("function-btn")}>
          <button type="button" className={cx("submit-btn", "btn-delete")}>
            Vô hiệu hóa tài khoản
          </button>
          <button
            type="button"
            className={cx("submit-btn")}
            onClick={() => handleOpenForm()}
          >
            Thêm
            <IconWrapper icon={FaPlus} color="#fff" size={18} />
          </button>
        </div>
      </div>

      {/* Form thêm mới */}
      {openForm && (
        <div className={cx("form-container")}>
          <div className={cx("form")}>
            <button className={cx("close-btn")} onClick={handleCloseForm}>
              ✖
            </button>

            <h3>Thông tin nhân viên</h3>

            {/* tên */}
            <div className={cx("form-group")}>
              <label>Tên nhân viên</label>
              <input
                name="employeeName"
                placeholder="Nhập tên"
                value={formData.employeeName || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* ảnh */}
            <div className={cx("form-group")}>
              <label>Chọn hình ảnh</label>
              <div className={cx("form-row")}>
                <input
                  name="avatar"
                  placeholder="Nhập URL"
                  value={formData.avatar || ""}
                  onChange={handleInputChange}
                />
                hoặc
                <input
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* email */}
            <div className={cx("form-group")}>
              <label>Email</label>
              <input
                name="email"
                placeholder="Email"
                value={formData.email || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* sdt */}
            <div className={cx("form-group")}>
              <label>Điện thoại</label>
              <input
                name="phone"
                placeholder="Điện thoại"
                value={formData.phone || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* vai trò */}
            <div className={cx("form-group")}>
              <label>Chọn vai trò</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="true">Admin</option>
                <option value="false">User</option>
              </select>
            </div>

            {/* chi nhánh */}
            <div className={cx("form-group")}>
              <label>Chọn chi nhánh</label>
              <select>
                <option value="">Chọn chi nhánh</option>
                {[
                  ...new Set(
                    locations?.map(
                      (location) => location.branch
                    ) || []
                  ),
                ].map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            {/* phòng ban */}
            <div className={cx("form-group")}>
              <label>Chọn phòng ban</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleInputChange}
              >
                <option value="">Chọn phòng ban</option>
                {departments?.map((department) => (
                  <option
                    key={department.departmentId}
                    value={department.departmentId}
                  >
                    {department.depName}
                  </option>
                ))}
              </select>
            </div>

            <div className={cx("form-button")}>
              <button
                className={cx("submit-btn")}
                onClick={
                  selectedEmployee ? handleUpdateEmployee : handleAddEmployee
                }
              >
                {selectedEmployee ? "Cập nhật" : "Thêm nhân viên"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* danh sách nhân viên */}
      <div className={cx("table-wrapper")}>
        <table className={cx("employee-table")}>
          <thead>
            <tr>
              <th>Chọn</th>
              <th>Hình ảnh</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Phòng ban</th>
              <th>Vị trí</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((emp) => (
              <tr key={emp.employeeId}>
                <td>
                  <input type="checkbox" className={cx("")} />
                </td>
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
                <td>
                  {emp.department?.location?.building?.branch?.branchName ||
                    "N/A"}
                </td>

                <td
                  className={cx("icon-info")}
                  onClick={() => handleEditEmployee(emp)}
                >
                  <IconWrapper icon={MdOutlineInfo} color="#0670C7" />
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

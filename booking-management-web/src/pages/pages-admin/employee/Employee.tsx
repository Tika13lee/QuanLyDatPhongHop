import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Employee.module.scss";
import {
  BranchProps,
  DepartmentProps,
  EmployeeProps,
} from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import IconWrapper from "../../../components/icons/IconWrapper";
import {
  FaPlus,
  MdOutlineInfo,
  MdSearch,
} from "../../../components/icons/icons";
import usePost from "../../../hooks/usePost";
import PopupNotification from "../../../components/popup/PopupNotification";
import { fetchEmployees } from "../../../features/employeeSlice";
import { METHODS } from "http";

const cx = classNames.bind(styles);

const EmployeeManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileName, setFileName] = useState("");
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeProps | null>();
  // const { employees, loading, error } = useSelector(
  // (state: RootState) => state.employee
  // );

  const [employees, setEmployees] = useState<EmployeeProps[]>([]);
  const [isCheck, setIsCheck] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [filters, setFilters] = useState({
    depName: "",
    isActived: true,
    branchName: "",
  });

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

  // lấy ds nhân viên
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [employees]);

  // lấy chi nhánh
  const {
    data: branchs,
    loading: branchsLoading,
    error: branchsError,
  } = useFetch<BranchProps[]>(
    "http://localhost:8080/api/v1/location/getAllBranch"
  );

  // lấy derpartment
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
  } = usePost<EmployeeProps>(
    "http://localhost:8080/api/v1/employee/addEmployee"
  );

  // vô hiệu hóa nhân viên
  const {
    data: deActiveEmployee,
    loading: deActiveLoading,
    error: deActiveError,
    postData: deActiveData,
  } = usePost<string[]>(
    "http://localhost:8080/api/v1/employee/nonActiveEmployee"
  );

  // Hàm xử lý thay đổi trong ô tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Hàm xử lý thay đổi giá trị của các bộ lọc
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    filterName: string
  ) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: filterName === "isActived" ? value === "true" : value,
    }));
  };

  // Hàm gọi API để tìm kiếm nhân viên
  const {
    data: filteredEmployees,
    loading: searchLoading,
    error: searchError,
  } = useFetch<EmployeeProps[]>(
    searchQuery
      ? `http://localhost:8080/api/v1/employee/getEmployeeByPhoneOrName?phoneOrName=${searchQuery}`
      : filters.depName || filters.isActived || filters.branchName
      ? `http://localhost:8080/api/v1/employee/getEmployeeByDepartmentOrActivedOrBranch?depName=${filters.depName}&isActived=${filters.isActived}&branchName=${filters.branchName}`
      : "http://localhost:8080/api/v1/employee/getAllEmployee"
  );

  useEffect(() => {
    if (filteredEmployees) {
      setEmployees(filteredEmployees);
    }
  }, [filteredEmployees, dispatch]);

  // Xử lý khi chọn hoặc bỏ chọn một nhân viên
  const handleCheckboxChange = (employeeId: number) => {
    setIsCheck((prevSelected) => {
      if (prevSelected.includes(employeeId)) {
        return prevSelected.filter((id) => id !== employeeId);
      } else {
        return [...prevSelected, employeeId];
      }
    });
  };

  console.log(isCheck);

  // Xử lý khi chọn tất cả nhân viên
  const handleSelectAll = () => {
    if (isCheck.length === employees.length) {
      setIsCheck([]);
    } else {
      setIsCheck(employees.map((emp) => emp.employeeId));
    }
  };

  // Hàm để vô hiệu hóa tài khoản
  const handleDisableAccount = async () => {
    const resp = await deActiveData(isCheck, { method: "PUT" });

    if (resp) {
      setPopupMessage("Tài khoản đã được vô hiệu hóa!");
      setPopupType("success");
      setIsPopupOpen(true);

      // dispatch(fetchEmployees());
      setEmployees(
        employees.filter((emp) => !isCheck.includes(emp.employeeId))
      );
    } else {
      setPopupMessage("Đã xảy ra lỗi khi vô hiệu hóa tài khoản!");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

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

  // Kiểm tra dữ liệu đầu vào
  const validateData = (formData: any) => {
    if (
      !formData.employeeName ||
      !formData.email ||
      !formData.phone ||
      !formData.departmentId ||
      !formData.role
    ) {
      return { isValid: false, message: "Vui lòng điền đầy đủ thông tin." };
    }

    // email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      return { isValid: false, message: "Định dạng email không hợp lệ." };
    }

    // số điện thoại
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      return {
        isValid: false,
        message: "Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.",
      };
    }

    // Nếu dữ liệu hợp lệ
    return { isValid: true, message: "" };
  };

  // Hàm xử lý khi chọn nhân viên để chỉnh sửa
  const handleEditEmployee = (emp: any) => {
    setOpenForm(true);
    setSelectedEmployee(emp);
    setFormData({
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
    // Kiểm tra dữ liệu đầu vào
    const { isValid, message } = validateData(formData);
    if (!isValid) {
      setPopupMessage(message);
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

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

      setEmployees((prev) => [...prev, response?.data]);

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

  // Hàm đóng popup thông báo
  const handleClosePopup = () => {
    setIsPopupOpen(false);
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
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button>
            <IconWrapper icon={MdSearch} color="#fff" size={24} />
          </button>
        </div>
        <div className={cx("filter-container")}>
          <p>Lọc nhân viên theo</p>
          {/* branchName */}
          <select
            name="branchName"
            value={filters.branchName}
            onChange={(e) => handleFilterChange(e, "branchName")}
          >
            <option value="">Chọn chi nhánh</option>
            {branchs?.map((branch) => (
              <option key={branch.branchId} value={branch.branchName}>
                {branch.branchName}
              </option>
            ))}
          </select>
          {/* depName */}
          <select
            name="depName"
            value={filters.depName}
            onChange={(e) => handleFilterChange(e, "depName")}
          >
            <option value="">Chọn phòng ban</option>
            {departments?.map((department) => (
              <option key={department.departmentId} value={department.depName}>
                {department.depName}
              </option>
            ))}
          </select>
          {/* isActived */}
          <select
            name="isActived"
            value={filters.isActived.toString()}
            onChange={(e) => handleFilterChange(e, "isActived")}
          >
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>
        </div>
      </div>

      {/* chức năng */}
      <div className={cx("function-container")}>
        <p>Danh sách nhân viên</p>
        <div className={cx("function-btn")}>
          <button
            type="button"
            className={cx("submit-btn", "btn-delete")}
            disabled={isCheck.length === 0}
            onClick={handleDisableAccount}
          >
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
                {branchs?.map((branch) => (
                  <option key={branch.branchId} value={branch.branchName}>
                    {branch.branchName}
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
              <th>
                <input
                  type="checkbox"
                  checked={isCheck.length === employees.length}
                  onChange={handleSelectAll}
                />
              </th>
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
                  <input
                    type="checkbox"
                    className={cx("")}
                    checked={isCheck.includes(emp.employeeId)}
                    onChange={() => handleCheckboxChange(emp.employeeId)}
                  />
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
      {/* Hiển thị thông báo popup */}
      <PopupNotification
        message={popupMessage}
        type={popupType}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default EmployeeManagement;

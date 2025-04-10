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
  FiRefreshCw,
  MdOutlineEdit,
  MdSearch,
} from "../../../components/icons/icons";
import usePost from "../../../hooks/usePost";
import PopupNotification from "../../../components/popup/PopupNotification";
import { fetchEmployees } from "../../../features/employeeSlice";
import { uploadImageToCloudinary } from "../../../utilities";
import CloseModalButton from "../../../components/Modal/CloseModalButton";

const cx = classNames.bind(styles);

const Employee = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [openForm, setOpenForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeProps | null>();

  const [employees, setEmployees] = useState<EmployeeProps[]>([]);
  const [isCheck, setIsCheck] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("");
  const [departments, setDepartments] = useState<DepartmentProps[]>([]);

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

  // Lấy danh sách phòng ban theo chi nhánh
  useEffect(() => {
    if (!filters.branchName) return;

    fetch(
      `http://localhost:8080/api/v1/department/getDepartmentByBranchName?branchName=${filters.branchName}`
    )
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách phòng ban:", error)
      );
  }, [filters.branchName]);

  // Hàm xử lý thay đổi trong ô tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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

  // lọc nhân viên
  useEffect(() => {
    if (filteredEmployees) {
      setEmployees(filteredEmployees);
    }
  }, [filteredEmployees, dispatch]);

  // Hàm xử lý thay đổi giá trị của các bộ lọc
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    filterName: string
  ) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  // xử lý url ảnh
  const handleFilePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const resp = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, avatar: resp }));
    }
  };

  // Hàm xử lý khi thay đổi input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Kiểm tra dữ liệu đầu vào
  const validateData = (formData: any) => {
    if (!formData.employeeName) {
      return { isValid: false, message: "Vui lòng nhập tên nhân viên" };
    }

    if (!formData.avatar) {
      return { isValid: false, message: "Vui lòng chọn ảnh đại diện" };
    }

    if (!formData.email) {
      return { isValid: false, message: "Vui lòng nhập email" };
    }

    if (!formData.phone) {
      return { isValid: false, message: "Vui lòng nhập số điện thoại" };
    }

    if (!formData.role) {
      return { isValid: false, message: "Vui lòng chọn vai trò" };
    }

    if (!formData.departmentId) {
      return { isValid: false, message: "Vui lòng chọn phòng ban" };
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

  // thêm nhân viên
  const {
    data,
    loading: loadingAdd,
    error: errorAdd,
    postData,
  } = usePost<EmployeeProps>(
    "http://localhost:8080/api/v1/employee/addEmployee"
  );

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

    console.log("Thêm nhân viên", newEmployee);

    const response = await postData(newEmployee);

    if (response) {
      setPopupMessage("Nhân viên đã được thêm thành công!");
      setPopupType("success");
      setIsPopupOpen(true);

      setEmployees((prev) => [...prev, response?.data]);

      handleCloseForm();
    } else {
      setPopupMessage(
        "Thất bại: " + errorAdd || "Đã xảy ra lỗi khi thêm nhân viên!"
      );
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // Chọn nhân viên để chỉnh sửa
  const handleEditEmployee = (emp: any) => {
    setOpenForm(true);
    setBranchName(
      emp.department?.location?.building?.branch?.branchName || "N/A"
    );
    setSelectedEmployee(emp);
    setFormData({
      employeeName: emp.employeeName,
      email: emp.email,
      phone: emp.phone,
      departmentId: emp.department.departmentId,
      avatar: emp.avatar,
      role: emp.account.role,
    });
  };

  const { postData: updateData } = usePost<EmployeeProps>(
    "http://localhost:8080/api/v1/employee/upDateEmployee"
  );

  // hàm xử lý cập nhật nhân viên
  const handleUpdateEmployee = async () => {
    const { isValid, message } = validateData(formData);
    if (!isValid) {
      setPopupMessage(message);
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    const updatedEmployee = {
      employeeId: `${selectedEmployee?.employeeId}`,
      employeeName: formData.employeeName,
      email: formData.email,
      phone: formData.phone,
      departmentId: formData.departmentId,
      avatar: formData.avatar,
      role: `${formData.role}`,
    };

    console.log("Chỉnh sửa nhân viên: ", updatedEmployee);

    const response = await updateData(updatedEmployee, { method: "PUT" });

    if (response) {
      setPopupMessage("Nhân viên đã được cập nhật thành công!");
      setPopupType("success");
      setIsPopupOpen(true);

      setEmployees(
        employees.map((emp) =>
          emp.employeeId === selectedEmployee?.employeeId
            ? {
                ...emp,
                employeeId: response?.data.employeeId,
                employeeName: response?.data.employeeName,
                email: response?.data.email,
                phone: response?.data.phone,
                department: {
                  ...emp.department,
                  departmentId: response?.data.department.departmentId,
                  depName: response?.data.department.depName,
                },
                avatar: response?.data.avatar,
              }
            : emp
        )
      );

      handleCloseForm();
    } else {
      setPopupMessage("Thất bại: Số điện thoại đã tồn tại!");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // Hàm reset form
  const resetForm = () => {
    setFormData({
      employeeName: "",
      email: "",
      phone: "",
      departmentId: "",
      avatar: "",
      role: "true",
    });
    setBranchName("");
  };

  // Đóng form
  const handleCloseForm = () => {
    setOpenForm(() => {
      setSelectedEmployee(null);
      return false;
    });
    resetForm();
  };

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

  // Xử lý khi chọn tất cả nhân viên
  const handleSelectAll = () => {
    if (isCheck.length === employees.length) {
      setIsCheck([]);
    } else {
      setIsCheck(employees.map((emp) => emp.employeeId));
    }
  };

  // vô hiệu hóa nhân viên
  const {
    data: deActiveEmployee,
    loading: deActiveLoading,
    error: deActiveError,
    postData: deActiveData,
  } = usePost<string[]>(
    "http://localhost:8080/api/v1/employee/nonActiveEmployee"
  );

  // xử lý vô hiệu hóa tài khoản
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

  const handleRefresh = () => {
    dispatch(fetchEmployees());
    setFilters({
      depName: "",
      isActived: true,
      branchName: "",
    });
    setSearchQuery("");
  };

  return (
    <div className={cx("employee-container")}>
      {/* tìm kiếm */}
      <div className={cx("search-container")}>
        {/* tên, sđt */}
        <div className={cx("search-box")}>
          <input
            type="search"
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
            {branchsLoading ? (
              <option>Đang tải chi nhánh...</option>
            ) : branchsError ? (
              <option>Lỗi khi tải chi nhánh</option>
            ) : (
              <>
                <option value="">Chọn chi nhánh</option>
                {branchs?.map((branch) => (
                  <option key={branch.branchId} value={branch.branchName}>
                    {branch.branchName}
                  </option>
                ))}
              </>
            )}
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
            <option value="" disabled>
              Chọn trạng thái
            </option>
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>
          <div onClick={handleRefresh}>
            <button>
              <IconWrapper icon={FiRefreshCw} color="#000" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* chức năng */}
      <div className={cx("function-container")}>
        <p>Danh sách nhân viên</p>
        <div className={cx("function-btn")}>
          <button
            type="button"
            className={cx("submit-btn", "delete-btn")}
            disabled={isCheck.length === 0}
            onClick={handleDisableAccount}
          >
            Vô hiệu hóa tài khoản
          </button>
          <button
            type="button"
            className={cx("submit-btn")}
            onClick={() => setOpenForm(true)}
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
            <CloseModalButton onClick={handleCloseForm} />

            <h3>Thông tin nhân viên</h3>

            {/* tên */}
            <div className={cx("form-group")}>
              <label>Tên nhân viên</label>
              <input
                name="employeeName"
                placeholder="Nhập tên"
                value={formData.employeeName || ""}
                onChange={handleInputChange}
                disabled={selectedEmployee ? true : false}
              />
            </div>

            {/* ảnh */}
            <div className={cx("form-group")}>
              <label>Chọn hình ảnh</label>
              <div className={cx("form-row")}>
                <input
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFilePicture}
                  disabled={selectedEmployee ? true : false}
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
                disabled={selectedEmployee ? true : false}
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

            {/* vai trò: chờ lấy role từ be */}
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
              <select
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              >
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
              <th>Chỉnh sửa</th>
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
                <td className={cx("employee-image")}>
                  <img src={emp.avatar} alt="" className={cx("avatar")} />
                </td>
                <td>{emp.employeeName}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department.depName}</td>
                <td>
                  {emp.department?.location?.building?.branch?.branchName ||
                    "N/A"}
                </td>

                <td onClick={() => handleEditEmployee(emp)}>
                  <IconWrapper icon={MdOutlineEdit} color="#0670C7" size={20} />
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
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
};

export default Employee;

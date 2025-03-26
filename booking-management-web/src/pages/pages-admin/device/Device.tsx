import classNames from "classnames/bind";
import styles from "./Device.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import usePost from "../../../hooks/usePost";
import { useState } from "react";
import { fetchDevices } from "../../../features/deviceSlice";
import PopupNotification from "../../../components/popup/PopupNotification";
import IconWrapper from "../../../components/icons/IconWrapper";
import { FaPlus, MdSearch } from "../../../components/icons/icons";
import { DeviceProps } from "../../../data/data";

const cx = classNames.bind(styles);

function Device() {
  const dispatch = useDispatch<AppDispatch>();
  const [openForm, setOpenForm] = useState(false);

  // Lấy dữ liệu devices từ Redux Store
  const {
    devices,
    loading: devicesLoading,
    error: devicesError,
  } = useSelector((state: RootState) => state.device);

  // thêm device
  const { data, loading, error, postData } = usePost<DeviceProps[]>(
    "http://localhost:8080/api/v1/device/addDevice"
  );

  // cập nhật device
  const { postData: updateData } = usePost<DeviceProps[]>(
    "http://localhost:8080/api/v1/device/upDateDevice"
  );

  const [formData, setFormData] = useState({
    deviceName: "",
    description: "",
  });
  const [selectedDevice, setSelectedDevice] = useState<DeviceProps | null>();

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  // Hàm xử lý khi thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.deviceName) {
      return { isValid: false, message: "Vui lòng nhập tên thiết bị!" };
    }

    if (!formData.description) {
      return { isValid: false, message: "Vui lòng nhập mô tả!" };
    }

    return { isValid: true, message: "" };
  };

  // thêm device
  const handleAddDevice = async () => {
    const { isValid, message } = validateForm();
    if (!isValid) {
      setPopupMessage(message);
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    const newDevice = {
      deviceName: formData.deviceName,
      description: formData.description,
    };

    const response = await postData(newDevice);

    if (response) {
      setPopupMessage("Thiết bị đã được thêm thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      dispatch(fetchDevices());
      resetForm();
      setOpenForm(false);
    } else {
      setPopupMessage("Thêm thiết bị thất bại, vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // Hàm xử lý khi chọn thiết bị để chỉnh sửa
  const handleEditDevice = (device: any) => {
    setOpenForm(true);
    setSelectedDevice(device);
    setFormData({
      deviceName: device.deviceName,
      description: device.description,
    });
  };

  // Chỉnh sửa device
  const handleUpdateDevice = async () => {
    if (selectedDevice === null) return;

    const updatedDevice = selectedDevice
      ? {
          deviceId: selectedDevice.deviceId,
          deviceName: formData.deviceName,
          description: formData.description,
        }
      : null;

    console.log("Dữ liệu gửi đến backend: ", updatedDevice);

    const response = await updateData(updatedDevice, {}, "PUT");

    console.log("Kết quả trả về từ backend: ", response);

    if (response) {
      setPopupMessage("Thiết bị đã được chỉnh sửa thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      dispatch(fetchDevices());
      resetForm();
      setOpenForm(false);
    } else {
      setPopupMessage("Chỉnh sửa thiết bị thất bại, vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // Reset form sau khi thêm hoặc sửa
  const resetForm = () => {
    setFormData({
      deviceName: "",
      description: "",
    });
    setSelectedDevice(null);
  };

  // Hàm mở form thêm mới
  const handleOpenForm = () => {
    setOpenForm(true);
  };

  // Hàm đóng form
  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedDevice(null);
    resetForm();
  };

  // Hàm đóng popup thông báo
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className={cx("device-container")}>
      {/* Tìm kiếm */}
      <div className={cx("search-container")}>
        <div className={cx("search-box")}>
          <input type="search" placeholder="Tìm kiếm theo tên thiết bị" />
          <button>
            <IconWrapper icon={MdSearch} color="#fff" size={24} />
          </button>
        </div>
      </div>

      {/* chức năng */}
      <div className={cx("function-container")}>
        <p>Danh sách thiết bị</p>
        <div className={cx("function-btn")}>
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
        <div className={cx("device-header")}>
          <div className={cx("device-info")}>
            <button className={cx("close-btn")} onClick={handleCloseForm}>
              ✖
            </button>
            <h3>Thông tin thiết bị</h3>

            <form className={cx("form")}>
              <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                  <label>Tên thiết bị:</label>
                  <input
                    type="text"
                    name="deviceName"
                    placeholder="Nhập tên thiết bị..."
                    value={formData.deviceName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                  <label>Mô tả:</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Nhập mô tả..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={cx("btn-row")}>
                <button
                  type="button"
                  className={cx("submit-btn")}
                  onClick={
                    selectedDevice ? handleUpdateDevice : handleAddDevice
                  }
                >
                  {selectedDevice ? "Chỉnh sửa" : "Thêm thiết bị"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bảng danh sách */}
      <div className={cx("device-list")}>
        <table className={cx("device-table")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên thiết bị</th>
              <th>Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className={cx("loading-message")}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : error || !devices || devices.length === 0 ? (
              <tr>
                <td colSpan={4}>Không có thiết bị nào</td>
              </tr>
            ) : (
              devices.map((device, index) => (
                <tr
                  key={device.deviceId}
                  onClick={() => handleEditDevice(device)}
                >
                  <td>{index + 1}</td>
                  <td>{device.deviceName}</td>
                  <td>{device.description}</td>
                </tr>
              ))
            )}
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
}

export default Device;

import classNames from "classnames/bind";
import styles from "./Device.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import usePost from "../../../hooks/usePost";
import { useState } from "react";
import { fetchDevices } from "../../../features/deviceSlice";
import PopupNotification from "../../../components/popup/PopupNotification";

const cx = classNames.bind(styles);

function Device() {
  const dispatch = useDispatch<AppDispatch>();

  // Lấy dữ liệu devices từ Redux Store
  const {
    devices,
    loading: devicesLoading,
    error: devicesError,
  } = useSelector((state: RootState) => state.device);

  // thêm device
  const { data, loading, error, postData } = usePost<any>(
    "http://localhost:8080/api/v1/device/addDevice"
  );

  // cập nhật device
  const { postData: updateData } = usePost<any>(
    "http://localhost:8080/api/v1/device/updateDevice"
  );

  const [formData, setFormData] = useState({
    deviceName: "",
    description: "",
    price: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm gửi dữ liệu tạo mới device
  const handleAddDevice = async () => {
    if (isAdding) return;
    setIsAdding(true);

    const newDevice = {
      deviceName: formData.deviceName,
      description: formData.description,
      price: formData.price,
    };

    const response = await postData(newDevice);

    if (response) {
      setPopupMessage("Thiết bị đã được thêm thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      dispatch(fetchDevices());
      resetForm();
    } else {
      setPopupMessage("Thêm thiết bị thất bại, vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
    setIsAdding(false);
  };

  // Hàm chỉnh sửa dữ liệu device
  const handleUpdateDevice = async () => {
    if (isAdding) return;
    setIsAdding(true);

    const updatedDevice = {
      deviceId: selectedDevice.deviceId,
      deviceName: formData.deviceName,
      description: formData.description,
      priceId: formData.price,
    };

    console.log("Dữ liệu gửi đến backend: ", updatedDevice);

    const response = await updateData(updatedDevice, {}, "PUT");

    if (response) {
      setPopupMessage("Thiết bị đã được chỉnh sửa thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      dispatch(fetchDevices());
      resetForm();
    } else {
      setPopupMessage("Chỉnh sửa thiết bị thất bại, vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
    setIsAdding(false);
  };

  // Reset form sau khi thêm hoặc sửa
  const resetForm = () => {
    setFormData({
      deviceName: "",
      description: "",
      price: "",
    });
    setSelectedDevice(null);
  };

  // Hàm xử lý khi chọn vị trí để chỉnh sửa
  const handleEditDevice = (device: any) => {
    setSelectedDevice(device);
    setFormData({
      deviceName: device.deviceName,
      description: device.description,
      price: device.price.value,
    });
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  return (
    <div className={cx("device-container")}>
      <div className={cx("device-header")}>
        <div className={cx("device-info")}>
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
              <div className={cx("form-group")}>
                <label>Giá:</label>
                <input
                  type="text"
                  name="price"
                  placeholder="Nhập giá..."
                  value={formData.price}
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
                onClick={selectedDevice ? handleUpdateDevice : handleAddDevice}
                disabled={isAdding}
              >
                {selectedDevice ? "Chỉnh sửa" : "Thêm thiết bị"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className={cx("device-list")}>
        <table className={cx("device-table")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên thiết bị</th>
              <th>Mô tả</th>
              <th>Giá</th>
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
                  <td>{device.price?.value || "N/A"}</td>
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

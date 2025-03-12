import classNames from "classnames/bind";
import styles from "./Location.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import { useState } from "react";
import usePost from "../../../hooks/usePost";
import PopupNotification from "../../../components/popup/PopupNotification";
import { fetchLocations } from "../../../features/locationSlice";

const cx = classNames.bind(styles);

function Location() {
  const dispatch = useDispatch<AppDispatch>();

  // load danh sách location từ store
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state: RootState) => state.location);

  // thêm location
  const { data, loading, error, postData } = usePost<any>(
    "http://localhost:8080/api/v1/location/addLocation"
  );

  // cập nhật location
  const { postData: updateData } = usePost<any>(
    "http://localhost:8080/api/v1/location/updateLocation"
  );

  const [formData, setFormData] = useState({
    branch: "",
    building: "",
    floor: "",
    number: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

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

  // Hàm gửi dữ liệu tạo mới location
  const handleAddLocation = async () => {
    if (isAdding) return;
    setIsAdding(true);

    const newLocation = {
      branch: formData.branch,
      building: formData.building,
      floor: formData.floor,
      number: formData.number,
    };

    const response = await postData(newLocation);

    if (response) {
      setPopupMessage("Vị trí đã được thêm thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      dispatch(fetchLocations());
      resetForm();
    } else {
      setPopupMessage("Thêm vị trí thất bại, vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
    setIsAdding(false);
  };

  // Hàm chỉnh sửa dữ liệu location
  const handleUpdateLocation = async () => {
    if (isAdding) return;
    setIsAdding(true);

    const updatedLocation = {
      locationId: selectedLocation.locationId,
      branch: formData.branch,
      building: formData.building,
      floor: formData.floor,
      number: formData.number,
    };

    const response = await updateData(updatedLocation, {}, "PUT");

    if (response) {
      setPopupMessage("Vị trí đã được chỉnh sửa thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      dispatch(fetchLocations());
      resetForm();
    } else {
      setPopupMessage("Chỉnh sửa vị trí thất bại, vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
    setIsAdding(false);
  };

  // Reset form sau khi thêm hoặc sửa
  const resetForm = () => {
    setFormData({
      branch: "",
      building: "",
      floor: "",
      number: "",
    });
    setSelectedLocation(null);
  };

  // Hàm xử lý khi chọn vị trí để chỉnh sửa
  const handleEditLocation = (loc: any) => {
    setSelectedLocation(loc);
    setFormData({
      branch: loc.branch,
      building: loc.building,
      floor: loc.floor,
      number: loc.number,
    });
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className={cx("location-container")}>
      <div className={cx("location-header")}>
        <div className={cx("location-info")}>
          <h3>Thông tin vị trí</h3>
          <form className={cx("form")}>
            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label>Chi nhánh:</label>
                <input
                  type="text"
                  name="branch"
                  placeholder="Nhập chi nhánh..."
                  value={formData.branch}
                  onChange={handleInputChange}
                />
              </div>
              <div className={cx("form-group")}>
                <label>Tòa nhà:</label>
                <input
                  type="text"
                  name="building"
                  placeholder="Nhập tòa nhà..."
                  value={formData.building}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label>Tầng:</label>
                <input
                  type="text"
                  name="floor"
                  placeholder="Nhập tầng..."
                  value={formData.floor}
                  onChange={handleInputChange}
                />
              </div>
              <div className={cx("form-group")}>
                <label>Số phòng:</label>
                <input
                  type="text"
                  name="number"
                  placeholder="Nhập số phòng..."
                  value={formData.number}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={cx("btn-row")}>
              <button
                type="button"
                className={cx("submit-btn")}
                onClick={
                  selectedLocation ? handleUpdateLocation : handleAddLocation
                }
                disabled={isAdding}
              >
                {selectedLocation ? "Chỉnh sửa" : "Tạo vị trí"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className={cx("location-list")}>
        <table className={cx("location-table")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Chi nhánh</th>
              <th>Tòa nhà</th>
              <th>Tầng</th>
              <th>Số phòng</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className={cx("loading-message")}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : error || !locations || locations.length === 0 ? (
              <tr>
                <td colSpan={5}>Không có dữ liệu</td>
              </tr>
            ) : (
              locations.map((loc, index) => (
                <tr
                  key={loc.locationId}
                  onClick={() => handleEditLocation(loc)}
                >
                  <td>{index + 1}</td>
                  <td>{loc.branch}</td>
                  <td>{loc.building}</td>
                  <td>{loc.floor}</td>
                  <td>{loc.number}</td>
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

export default Location;

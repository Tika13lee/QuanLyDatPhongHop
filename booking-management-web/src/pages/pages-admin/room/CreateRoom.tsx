import classNames from "classnames/bind";
import styles from "./CreateRoom.module.scss";
import { LocationProps, statusesRoom, typeRoom } from "../../../data/data";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import usePost from "../../../hooks/usePost";
import { useState } from "react";
import useFetch from "../../../hooks/useFetch";

const cx = classNames.bind(styles);

const CreateRoom = () => {
  // lấy dữ liệu devices từ Redux Store
  const {
    devices,
    loading: devicesLoading,
    error: devicesError,
  } = useSelector((state: RootState) => state.device);

  const {
    data: locations,
    loading: locationsLoading,
    error: locationsError,
  } = useFetch<LocationProps[]>(
    "http://localhost:8080/api/v1/location/getLocationsByRoomIsNull"
  );

  // Dùng usePost để gửi dữ liệu lên API
  const { data, loading, error, postData } = usePost(
    "http://localhost:8080/api/v1/room/create"
  );

  // State lưu thông tin phòng họp
  const [roomData, setRoomData] = useState({
    roomName: "",
    capacity: "",
    price: "",
    location: {
      branch: "",
      building: "",
      floor: "",
      number: "",
    },
    typeRoom: "",
    statusRoom: "",
    room_deviceDTOS: [] as { deviceName: string; quantity: number }[],
    imgs: [] as string[],
  });

  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setRoomData((prev) => {
      if (name === "location") {
        // Kiểm tra `locations` trước khi tìm
        const selectedLocation = locations?.find(
          (loc) => loc.locationId && loc.locationId.toString() === value
        );

        if (selectedLocation) {
          return {
            ...prev,
            location: {
              branch: selectedLocation.branch,
              building: selectedLocation.building,
              floor: selectedLocation.floor,
              number: selectedLocation.number,
            },
          };
        }
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map((file) => file.name);

      setRoomData((prev) => ({
        ...prev,
        imgs: [...prev.imgs, ...fileNames],
      }));
    }
  };

  // Xử lý thay đổi thiết bị
  const handleDeviceChange = (
    deviceName: string,
    checked: boolean,
    quantity: number = 1
  ) => {
    setRoomData((prev) => {
      let updatedDevices = [...prev.room_deviceDTOS];

      if (checked) {
        const existingDevice = updatedDevices.find(
          (d) => d.deviceName === deviceName
        );
        if (existingDevice) {
          existingDevice.quantity = quantity;
        } else {
          updatedDevices.push({ deviceName: deviceName, quantity });
        }
      } else {
        updatedDevices = updatedDevices.filter(
          (d) => d.deviceName !== deviceName
        );
      }

      return { ...prev, room_deviceDTOS: updatedDevices }; // ⬅ Sửa đúng key
    });
  };

  // Gửi dữ liệu lên API khi tạo phòng
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Dữ liệu trước khi gửi:", roomData);

    const requestData = {
      ...roomData,
      images: JSON.stringify(roomData.imgs),
    };

    const response = await postData(requestData, {
      headers: { "Content-Type": "application/json" },
    });

    if (response) {
      if (response.status === 200 || response.status === 201) {
        alert("Tạo phòng thành công!");
      } else {
        alert(`Có lỗi xảy ra: ${response.statusText}`);
      }
    } else {
      alert("Lỗi khi gửi dữ liệu! Vui lòng thử lại.");
    }
  };

  return (
    <div className={cx("create-container")}>
      <div className={cx("room-form-container")}>
        <form className={cx("form")}>
          <div className={cx("column-container")}>
            {/* Chọn vị trí*/}
            <div className={cx("cover")}>
              <h3>Bước 1: Chọn vị trí</h3>
              <div className={cx("form-row")}>
                <select name="location" onChange={handleChange}>
                  <option value="">Chọn vị trí</option>
                  {Array.isArray(locations) && locations.length > 0 ? (
                    locations.map((loc) => (
                      <option key={loc.locationId} value={loc.locationId}>
                        {loc.branch} - {loc.building} - Tầng {loc.floor} - Phòng{" "}
                        {loc.number}
                      </option>
                    ))
                  ) : (
                    <option value="">Không có dữ liệu</option>
                  )}
                </select>
              </div>
            </div>

            {/* Chọn thiết bị */}
            <div className={cx("cover")}>
              <h3>Bước 3: Chọn thiết bị</h3>
              <div className={cx("device-group")}>
                <div className={cx("device-table-container")}>
                  <table className={cx("device-table")}>
                    <thead>
                      <tr>
                        <th>Chọn</th>
                        <th>Tên thiết bị</th>
                        <th>Số lượng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map((device, index) => {
                        const selectedDevice = roomData.room_deviceDTOS.find(
                          (d) => d.deviceName === device.deviceName
                        );
                        return (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                className={cx("checkbox")}
                                checked={!!selectedDevice}
                                onChange={(e) =>
                                  handleDeviceChange(
                                    device.deviceName,
                                    e.target.checked
                                  )
                                }
                              />
                            </td>
                            <td>{device.deviceName}</td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                className={cx("device-quantity")}
                                placeholder="Số lượng"
                                value={
                                  selectedDevice ? selectedDevice.quantity : ""
                                }
                                onChange={(e) =>
                                  handleDeviceChange(
                                    device.deviceName,
                                    true,
                                    Number(e.target.value)
                                  )
                                }
                                disabled={!selectedDevice}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("column-container")}>
            {/* Nhập thông tin */}
            <div className={cx("cover")}>
              <h3>Bước 2: Nhập thông tin</h3>
              <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                  <label>Tên phòng:</label>
                  <input
                    type="text"
                    placeholder="Nhập tên phòng..."
                    name="roomName"
                    value={roomData.roomName}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("form-group")}>
                  <label>Sức chứa:</label>
                  <input
                    type="number"
                    placeholder="Nhập sức chứa..."
                    name="capacity"
                    value={roomData.capacity}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("form-group")}>
                  <label>Giá:</label>
                  <input
                    type="number"
                    placeholder="Nhập giá..."
                    name="price"
                    value={roomData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            {/* Chọn thiết lập*/}
            <div className={cx("cover")}>
              <h3>Bước 4: Chọn thiết lập</h3>
              <div className={cx("form-row")}>
                <select
                  name="typeRoom"
                  value={roomData.typeRoom}
                  onChange={handleChange}
                >
                  <option value="">Chọn loại phòng...</option>
                  {typeRoom.map((type, index) => (
                    <option key={index} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <select
                  name="statusRoom"
                  value={roomData.statusRoom}
                  onChange={handleChange}
                >
                  <option value="">Chọn trạng thái...</option>
                  {statusesRoom.map((status, index) => (
                    <option key={index} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                />
              </div>
            </div>
          </div>
        </form>
        <div className={cx("btn-row")}>
          <button
            type="submit"
            className={cx("submit-btn")}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Đang tạo phòng..." : "Tạo phòng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;

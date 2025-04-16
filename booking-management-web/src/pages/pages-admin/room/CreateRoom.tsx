import classNames from "classnames/bind";
import styles from "./CreateRoom.module.scss";
import {
  BranchProps,
  BuildingProps,
  DeviceProps,
  LocationProps,
  statusesRoom,
  typeRoom,
} from "../../../data/data";
import usePost from "../../../hooks/usePost";
import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import PopupNotification from "../../../components/popup/PopupNotification";
import { uploadImageToCloudinary } from "../../../utilities";
import LoadingSpinner from "../../../components/spinner/LoadingSpinner";

const cx = classNames.bind(styles);

const CreateRoom = () => {
  const [buildings, setBuildings] = useState<BuildingProps[]>([]);
  const [floors, setFloors] = useState<LocationProps[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>();
  const [selectedBuilding, setSelectedBuilding] = useState<string>();
  const [selectedFloor, setSelectedFloor] = useState<string>();
  const [filesImage, setFilesImage] = useState<File[]>([]);

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  // State lưu thông tin phòng họp
  const [roomData, setRoomData] = useState({
    roomName: "",
    capacity: "",
    price: "",
    location: {
      locationId: "",
    },
    typeRoom: "",
    statusRoom: "",
    room_deviceDTOS: [] as { deviceName: string; quantity: number }[],
    imgs: [] as string[],
  });

  // lấy thiết bị
  const {
    data: devices,
    loading: devicesLoading,
    error: devicesError,
  } = useFetch<DeviceProps[]>(
    "http://localhost:8080/api/v1/device/getAllDevices"
  );

  // lấy chi nhánh
  const {
    data: branchs,
    loading: branchsLoading,
    error: branchsError,
  } = useFetch<BranchProps[]>(
    "http://localhost:8080/api/v1/location/getAllBranch"
  );

  // lấy ds tòa nhà theo chi nhánh
  useEffect(() => {
    fetch(
      `http://localhost:8080/api/v1/location/getBuildingsByBranchName?branchName=${selectedBranch}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBuildings(data);
        setSelectedBuilding(" ");
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách tòa nhà:", error));
  }, [selectedBranch]);

  // lấy ds tầng theo tòa nhà
  useEffect(() => {
    setFloors([]);
    setSelectedFloor(" ");

    if (selectedBuilding === " " || !selectedBranch) return;

    if (
      selectedBuilding !== " " &&
      selectedBuilding !== undefined &&
      selectedBuilding !== null
    ) {
      console.log("Vào");
      fetch(
        `http://localhost:8080/api/v1/location/getLocationsByBuildingId?buildingId=${selectedBuilding}`
      )
        .then((res) => res.json())
        .then((data) => {
          setFloors(data || []);
          setSelectedFloor(" ");
        })
        .catch((error) => console.error("Lỗi khi lấy danh sách tầng:", error));
    }
  }, [selectedBuilding, selectedBranch]);

  // Xử lý thay đổi input floor
  const handleFloorChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setSelectedFloor(e.target.value);
    setRoomData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        locationId: e.target.value || "",
      },
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      return { ...prev, room_deviceDTOS: updatedDevices };
    });
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const fileNames = Array.from(e.target.files).map((file) => file.name);
      const filesOutput = Array.from(e.target.files).map((file) => file);
      setFilesImage((prev) => [...prev, ...filesOutput]);

      setRoomData((prev) => ({
        ...prev,
        imgs: [...prev.imgs, ...fileNames],
      }));
    }
  };

  // thêm phòng
  const { data, loading, error, postData } = usePost(
    "http://localhost:8080/api/v1/room/create"
  );

  // Hàm kiểm tra form
  const validateForm = () => {
    // if (!roomData.location.building.branch.branchName) {
    //   return { isValid: false, message: "Vui lòng chọn chi nhánh!" };
    // }

    // if (!roomData.location.building.buildingName) {
    //   return { isValid: false, message: "Vui lòng chọn tòa nhà!" };
    // }

    if (!roomData.location.locationId) {
      return { isValid: false, message: "Vui lòng chọn vị trí!" };
    }

    if (!roomData.roomName) {
      return { isValid: false, message: "Vui lòng nhập tên phòng!" };
    }

    if (!roomData.capacity) {
      return { isValid: false, message: "Vui lòng nhập sức chứa!" };
    } else if (Number(roomData.capacity) < 1) {
      return { isValid: false, message: "Sức chứa phải lớn hơn 0!" };
    } else if (Number.isInteger(Number(roomData.capacity)) === false) {
      return { isValid: false, message: "Sức chứa phải là số nguyên!" };
    }

    if (!roomData.price) {
      return { isValid: false, message: "Vui lòng nhập giá!" };
    } else if (Number(roomData.price) < 1) {
      return { isValid: false, message: "Giá phải lớn hơn 0!" };
    } else if (Number.isInteger(Number(roomData.price)) === false) {
      return { isValid: false, message: "Giá phải là số nguyên!" };
    }

    if (!roomData.typeRoom) {
      return { isValid: false, message: "Vui lòng chọn loại phòng!" };
    }

    if (!roomData.statusRoom) {
      return { isValid: false, message: "Vui lòng chọn trạng thái!" };
    }

    if (roomData.imgs.length === 0) {
      return { isValid: false, message: "Vui lòng chọn ảnh!" };
    }

    if (roomData.room_deviceDTOS.length === 0) {
      return { isValid: false, message: "Vui lòng chọn thiết bị!" };
    }

    return { isValid: true, message: "" };
  };

  // xử lý thêm phòng
  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();

    const { isValid, message } = validateForm();
    if (!isValid) {
      setPopupMessage(message);
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    const responsePictureCLoudinary = await Promise.all(
      filesImage.map((img) => uploadImageToCloudinary(img))
    );

    console.log(responsePictureCLoudinary);

    const requestData = {
      ...roomData,
      imgs: responsePictureCLoudinary,
    };
    console.log("Dữ liệu trước khi gửi:", requestData);

    const response = await postData(requestData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Response:", response);

    if (response) {
      if (response.status === 200 || response.status === 201) {
        setPopupMessage("Phòng đã được tạo thành công!");
        setPopupType("success");
        setIsPopupOpen(true);
        resetData();
      } else {
        setPopupMessage("Lỗi khi gửi dữ liệu! Vui lòng thử lại.");
        setPopupType("error");
        setIsPopupOpen(true);
      }
    } else {
      setPopupMessage("Lỗi khi gửi dữ liệu! Vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // reset data
  const resetData = () => {
    setRoomData({
      roomName: "",
      capacity: "",
      price: "",
      location: {
        locationId: "",
      },
      typeRoom: "",
      statusRoom: "",
      room_deviceDTOS: [],
      imgs: [],
    });
    setSelectedBranch("");
    setSelectedBuilding("");
    setSelectedFloor("");
    setFilesImage([]);
  };

  return (
    <div className={cx("create-container")}>
      <div className={cx("room-form-container")}>
        <form className={cx("form")}>
          <div className={cx("form-group")}>
            {/* Chọn vị trí*/}
            <div className={cx("cover")}>
              <h3>Bước 1: Chọn vị trí</h3>
              <div className={cx("form-row")}>
                <select
                  name="branch"
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  value={selectedBranch}
                >
                  <option value="">Chọn chi nhánh</option>
                  {branchs?.map((branch) => (
                    <option key={branch.branchId} value={branch.branchName}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={cx("form-row")}>
                <select
                  defaultValue={""}
                  name="building"
                  onChange={(e) => {
                    setSelectedBuilding(e.target.value);
                  }}
                  value={selectedBuilding}
                >
                  <option value="" selected={"" === selectedBuilding}>
                    Chọn tòa nhà
                  </option>
                  {buildings.map((building: BuildingProps) => (
                    <option
                      key={building.buildingId}
                      value={building.buildingId}
                      data-buildingname={building.buildingName}
                      selected={building.buildingName === selectedBuilding}
                    >
                      {building.buildingName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={cx("form-row")}>
                <select
                  defaultValue={""}
                  name="floor"
                  onChange={handleFloorChange}
                  value={roomData.location.locationId}
                >
                  <option value="" selected={"" === selectedFloor}>
                    Chọn tầng
                  </option>
                  {floors &&
                    floors.length > 0 &&
                    floors.map((floor) => (
                      <option
                        key={floor.locationId}
                        value={floor.locationId}
                        selected={floor.floor === selectedFloor}
                      >
                        {floor.floor}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Nhập thông tin */}
            <div className={cx("cover")}>
              <h3>Bước 2: Nhập thông tin</h3>
              <div className={cx("form-row")}>
                <div className={cx("form-input")}>
                  <label>Tên phòng:</label>
                  <input
                    type="text"
                    placeholder="Nhập tên phòng..."
                    name="roomName"
                    value={roomData.roomName}
                    onChange={handleChange}
                  />
                </div>
                <div className={cx("form-input")}>
                  <label>Sức chứa:</label>
                  <input
                    type="number"
                    placeholder="Nhập sức chứa..."
                    name="capacity"
                    value={roomData.capacity}
                    onChange={handleChange}
                    min={1}
                  />
                </div>
                <div className={cx("form-input")}>
                  <label>Giá:</label>
                  <input
                    type="number"
                    placeholder="Nhập giá..."
                    name="price"
                    value={roomData.price}
                    onChange={handleChange}
                    min={1}
                  />
                </div>
              </div>
            </div>

            {/* Chọn thiết lập*/}
            <div className={cx("cover")}>
              <h3>Bước 3: Chọn thiết lập</h3>
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
              </div>
              <div className={cx("form-row")}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                />
              </div>
            </div>
          </div>
          <div className={cx("form-group")}>
            {/* Chọn thiết bị */}
            <div className={cx("cover")}>
              <h3>Bước 4: Chọn thiết bị</h3>
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
                      {(devices ? devices.length : 0) === 0 ? (
                        <tr>
                          <td colSpan={3} className={cx("no-data")}>
                            Không có thiết bị nào
                          </td>
                        </tr>
                      ) : (
                        devices?.map((device, index) => {
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
                                    selectedDevice
                                      ? selectedDevice.quantity
                                      : ""
                                  }
                                  onChange={(e) =>
                                    handleDeviceChange(
                                      device.deviceName,
                                      true,
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
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

export default CreateRoom;

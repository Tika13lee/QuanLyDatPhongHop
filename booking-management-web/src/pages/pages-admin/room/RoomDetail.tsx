import classNames from "classnames/bind";
import styles from "./RoomDetail.module.scss";
import IconWrapper from "../../../components/icons/IconWrapper";
import { IoIosArrowBack, MdOutlineEdit } from "../../../components/icons/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { DeviceProps, RoomDeviceProps } from "../../../data/data";
import { FaPlus } from "react-icons/fa";
import usePost from "../../../hooks/usePost";
import PopupNotification from "../../../components/popup/PopupNotification";

const cx = classNames.bind(styles);

type RoomDevice = {
  deviceName: string;
  quantity: number;
};

const RoomDetail = () => {
  const navigate = useNavigate();
  const [isModelEditOpen, setIsModelEditOpen] = useState(false);
  const [isModelAddDeviceOpen, setIsModelAddDeviceOpen] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<{
    [deviceName: string]: { deviceId: number; quantity: number };
  }>({});
  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  const [roomDevices, setRoomDevices] = useState<RoomDevice[]>([]);

  const { id } = useParams();

  // Lấy thông tin phòng
  let {
    data: roomDetail,
    loading,
    error,
    setData,
  } = useFetch<any>(
    id ? `http://localhost:8080/api/v1/room/getRoomById?roomId=${id}` : ""
  );

  console.log("roomDetail", roomDetail);

  // set ds thiết bị vào mảng mới
  useEffect(() => {
    roomDetail?.room_deviceDTOS?.map((device: RoomDeviceProps) => {
      setRoomDevices((prev) => [
        ...prev,
        { deviceName: device.deviceName, quantity: device.quantity },
      ]);
    });
  }, [roomDetail]);

  // Lấy ds thiết bị
  const {
    data: devices,
    loading: loadingDevices,
    error: errorDevices,
  } = useFetch<DeviceProps[]>(
    "http://localhost:8080/api/v1/device/getAllDevices"
  );

  // lấy ds thiết bị chưa có trong phòng
  const devicesNotInRoom = devices?.filter(
    (device) =>
      !roomDetail?.room_deviceDTOS?.some(
        (roomDevice: RoomDeviceProps) =>
          roomDevice.deviceName === device.deviceName
      )
  );

  // Xử lý thay đổi thiết bị
  const handleDeviceChange = (
    deviceName: string,
    checked: boolean,
    quantity: number = 1
  ) => {
    console.log(deviceName, checked, quantity);
    const device = devicesNotInRoom?.find((d) => d.deviceName === deviceName);
    if (!device) return;

    setSelectedDevices((prev) => {
      const newSelected = { ...prev };
      if (checked) {
        newSelected[deviceName] = { deviceId: device.deviceId, quantity };
      } else {
        delete newSelected[deviceName];
      }
      return newSelected;
    });
  };

  // xử lý thêm thiết bị
  const handleSubmitDevices = async () => {
    const roomId = roomDetail?.roomId;

    if (!roomId) {
      setPopupMessage("Lỗi khi thêm thiết bị: không tìm thấy phòng.");
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    for (const deviceName in selectedDevices) {
      const { deviceId, quantity } = selectedDevices[deviceName];
      try {
        await fetch(
          `http://localhost:8080/api/v1/room/addDeviceToRoom?deviceId=${deviceId}&roomId=${roomId}&quantity=${quantity}`,
          {
            method: "POST",
          }
        );
        console.log(`Đã thêm ${deviceName} vào phòng.`);
      } catch (error) {
        console.error(`Lỗi khi thêm ${deviceName}:`, error);
      }
      setRoomDevices((prev) => [...prev, { deviceName, quantity }]);
      console.log("roomDevices1", roomDevices);
    }

    setPopupMessage("Thêm thiết bị thành công!");
    setPopupType("success");
    setIsPopupOpen(true);
    handleCloseAddDeviceModal();
  };

  // đóng mở modal thêm thiết bị
  const handleOpenAddDeviceModal = () => {
    setIsModelAddDeviceOpen(true);
    console.log("Add device");
  };
  const handleCloseAddDeviceModal = () => {
    setIsModelAddDeviceOpen(false);
  };

  const [roomUpdateData, setRoomUpdateData] = useState({
    roomId: 0,
    roomName: "",
    capacity: "",
    price: "",
    location: {
      locationId: 0,
    },
    typeRoom: "",
    statusRoom: "",
    room_deviceDTOS: [] as RoomDevice[],
    imgs: [] as string[],
  });

  // cập nhật phòng
  const {
    data,
    loading: updateRoomLoading,
    error: updateRoomError,
    postData,
  } = usePost("http://localhost:8080/api/v1/room/updateRoom");

  // cập nhật dữ liệu phòng khi popup đóng
  useEffect(() => {
    if (setData && isPopupOpen == false)
      setData((prev: any) => ({
        ...prev,
        ...roomUpdateData,
        // location: { ...prev.location },
      }));
  }, [isPopupOpen]);

  // xử lý cập nhật phòng
  const handleUpdateRoom = async () => {
    const updateRoom = {
      ...roomUpdateData,
      roomId: roomDetail.roomId,
      roomName: roomUpdateData.roomName,
      capacity: roomUpdateData.capacity,
      price: roomDetail.price,
      typeRoom: roomUpdateData.typeRoom,
      statusRoom: roomUpdateData.statusRoom,
      room_deviceDTOS: roomDetail.room_deviceDTOS,
      imgs: roomDetail.imgs,
    };

    console.log("Dữ liệu gửi UPDATE", updateRoom);

    const response = await postData(updateRoom, { method: "PUT" });
    console.log("response", response);

    if (response) {
      setPopupMessage("Cập nhật phòng thành công!");
      setPopupType("success");
      setIsPopupOpen(true);

      handleCloseUpdateModal();
    } else {
      setPopupMessage("Cập nhật phòng thất bại!");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // đóng mở modal chỉnh sửa
  const handleOpenUpdateModal = () => {
    setIsModelEditOpen(true);
    setRoomUpdateData({
      ...roomUpdateData,
      roomName: roomDetail?.roomName,
      capacity: roomDetail?.capacity,
      typeRoom: roomDetail?.typeRoom,
      statusRoom: roomDetail?.statusRoom,
      imgs: roomDetail?.imgs,
      price: roomDetail?.price,
    });
    console.log("Edit room");
  };
  const handleCloseUpdateModal = () => {
    setIsModelEditOpen(false);
  };

  // Hàm đóng popup thông báo
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const [urlQR, setUrlQR] = useState("");
  const [pdfPath, setPdfPath] = useState("");

  const handleCreateQR = () => {
    fetch(
      `http://localhost:8080/api/v1/room/generateRoomQR?roomId=${roomDetail?.roomId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setUrlQR(data.qrCode);
        setPdfPath(data.pdfPath); // Cập nhật đường dẫn file PDF
        // Tải file PDF
        const link = document.createElement("a");
        link.href = `http://localhost:8080/QRCodeFiles/${encodeURIComponent(
          data.pdfPath.split("/").pop()
        )}`;
        link.download = data.pdfPath.split("/").pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  console.log(urlQR);

  return (
    <div className={cx("room-detail-container")}>
      <div className={cx("header")}>
        <div className={cx("back-button")} onClick={() => navigate(-1)}>
          <IconWrapper icon={IoIosArrowBack} />
          <span>Quay lại</span>
        </div>
      </div>

      <div className={cx("room-content")}>
        <div className={cx("room-info-container")}>
          <div className={cx("room-image")}>
            <img
              src={
                roomDetail?.imgs?.length > 0
                  ? roomDetail.imgs[0]
                  : "/images/default-room.jpg"
              }
              alt="Phòng họp"
              style={{ width: "300px", height: "210px", objectFit: "cover" }}
            />
            <div className={cx("qr-code")}>
              {urlQR != "" && (
                <img src={urlQR} alt="QR Code" width={300} height={300} />
              )}
            </div>
          </div>

          <div className={cx("room-info")}>
            <div className={cx("room-header")}>
              <span className={cx("room-title")}>
                Tên phòng - {roomDetail?.roomName}
              </span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => handleCreateQR()}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "5px",
                    backgroundColor: "#0056B3",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  Tạo mã QR
                </button>
                <div className={cx("btn-edit")} onClick={handleOpenUpdateModal}>
                  <IconWrapper icon={MdOutlineEdit} size={22} />
                </div>
              </div>

              {/* modal chỉnh sửa */}
              {isModelEditOpen && (
                <div
                  className={cx("modal-overlay")}
                  onClick={handleCloseUpdateModal}
                >
                  <div
                    className={cx("modal-content")}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2>Chỉnh sửa thông tin</h2>

                    <div className={cx("input-group")}>
                      <label htmlFor="room-name">Tên phòng</label>

                      <input
                        type="text"
                        id="room-name"
                        defaultValue={roomDetail.roomName}
                        value={roomUpdateData.roomName}
                        onChange={(e) => {
                          setRoomUpdateData({
                            ...roomUpdateData,
                            roomName: e.target.value,
                          });
                        }}
                      />
                    </div>

                    <div className={cx("input-group")}>
                      <label htmlFor="room-capacity">Sức chứa</label>
                      <input
                        type="number"
                        min={1}
                        id="room-capacity"
                        defaultValue={roomDetail.capacity}
                        value={roomUpdateData.capacity}
                        onChange={(e) =>
                          setRoomUpdateData({
                            ...roomUpdateData,
                            capacity: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className={cx("input-group")}>
                      <label htmlFor="room-type">Loại phòng</label>
                      <select
                        id="room-type"
                        defaultValue={roomDetail.typeRoom}
                        onChange={(e) =>
                          setRoomUpdateData({
                            ...roomUpdateData,
                            typeRoom: e.target.value,
                          })
                        }
                      >
                        <option value="DEFAULT">Phòng mặc định</option>
                        <option value="VIP">Phòng cao cấp</option>
                        <option value="CONFERENCEROOM">Phòng hội nghị</option>
                      </select>
                    </div>

                    <div className={cx("input-group")}>
                      <label htmlFor="room-status">Trạng thái</label>
                      <select
                        id="room-status"
                        defaultValue={roomDetail.statusRoom}
                        onChange={(e) =>
                          setRoomUpdateData({
                            ...roomUpdateData,
                            statusRoom: e.target.value,
                          })
                        }
                      >
                        <option value="AVAILABLE">Có sẵn</option>
                        <option value="MAINTAIN">Đang bảo trì</option>
                        <option value="REPAIR">Đang sửa chữa</option>
                      </select>
                    </div>

                    <button
                      className={cx("btn-save")}
                      onClick={handleUpdateRoom}
                    >
                      Lưu
                    </button>

                    <button
                      className={cx("close-button")}
                      onClick={handleCloseUpdateModal}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className={cx("room-details")}>
              {/* vị trí */}
              <div className={cx("room-info-row")}>
                <p>
                  <strong>Vị trí:</strong> {roomDetail?.location.branch} - tòa{" "}
                  {roomDetail?.location.building} - tầng{" "}
                  {roomDetail?.location.floor}
                </p>
              </div>
              {/* sức chứa, giá */}
              <div className={cx("room-info-row")}>
                <p>
                  <strong>Sức chứa:</strong> {roomDetail?.capacity} người
                </p>
                <p>
                  <strong>Giá:</strong> ${roomDetail?.price}
                </p>
              </div>
              {/* loại, trạng thái */}
              <div className={cx("room-info-row")}>
                <p>
                  <strong>Loại phòng:</strong>{" "}
                  <span>
                    {roomDetail?.typeRoom === "DEFAULT"
                      ? "Mặc định"
                      : roomDetail?.typeRoom === "VIP"
                      ? "Phòng VIP"
                      : "Phòng hội nghị"}
                  </span>
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <span>
                    {roomDetail?.statusRoom === "AVAILABLE" ||
                    roomDetail?.statusRoom === "ONGOING"
                      ? "Có sẵn"
                      : roomDetail?.statusRoom === "MAINTAIN"
                      ? "Đang bảo trì"
                      : "Đang sửa chữa"}
                  </span>
                </p>
              </div>
              {/* người phê duyệt */}
              <div className={cx("room-info-row")}>
                <p>
                  <strong>Người phê duyệt:</strong>{" "}
                  <span>{roomDetail?.approver?.name}</span>
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{" "}
                  <span>{roomDetail?.approver?.phone}</span>
                </p>
              </div>
              {/* ds thiết bị */}
              <div className={cx("room-info-row")}>
                <p>
                  <strong>Danh Sách Thiết Bị</strong>
                </p>
                <div
                  className={cx("btn-edit")}
                  onClick={handleOpenAddDeviceModal}
                >
                  <IconWrapper icon={FaPlus} size={18} color={"#179817"} />
                </div>
              </div>
              <div className={cx("device-details")}>
                {roomDevices.length > roomDetail?.room_deviceDTOS?.length ? (
                  roomDevices.map((device, index) => (
                    <div key={index} className={cx("device-row")}>
                      <p className={cx("device-name")}>{device.deviceName}</p>
                      <p className={cx("device-quantity")}>{device.quantity}</p>
                    </div>
                  ))
                ) : roomDetail?.room_deviceDTOS?.length > 0 ? (
                  roomDetail?.room_deviceDTOS.map(
                    (device: RoomDeviceProps, index: number) => (
                      <div key={index} className={cx("device-row")}>
                        <p className={cx("device-name")}>{device.deviceName}</p>
                        <p className={cx("device-quantity")}>
                          {device.quantity}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p>Không có thiết bị nào.</p>
                )}
              </div>
              {/* modal thêm device */}
              {isModelAddDeviceOpen && (
                <div
                  className={cx("modal-overlay")}
                  onClick={handleCloseAddDeviceModal}
                >
                  <div
                    className={cx("modal-content")}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2>Thêm thiết bị vào phòng</h2>

                    <div className={cx("device-table-container")}>
                      <table className={cx("device-table")}>
                        <thead>
                          <tr>
                            <th>Chọn</th>
                            <th>Thiết bị</th>
                            <th>Số lượng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {devicesNotInRoom?.map((device, index) => {
                            const selectedDevice =
                              selectedDevices[device.deviceName];
                            return (
                              <tr key={index}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={!!selectedDevice}
                                    onChange={(e) =>
                                      handleDeviceChange(
                                        device.deviceName,
                                        e.target.checked,
                                        selectedDevice?.quantity || 1
                                      )
                                    }
                                  />
                                </td>
                                <td>{device.deviceName}</td>
                                <td>
                                  <input
                                    type="number"
                                    defaultValue={1}
                                    min={0}
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
                          })}
                        </tbody>
                      </table>
                    </div>

                    <button
                      className={cx("btn-save")}
                      onClick={handleSubmitDevices}
                    >
                      Lưu
                    </button>

                    <button
                      className={cx("close-button")}
                      onClick={handleCloseAddDeviceModal}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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

export default RoomDetail;

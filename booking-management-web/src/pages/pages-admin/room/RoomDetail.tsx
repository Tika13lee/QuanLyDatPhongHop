import classNames from "classnames/bind";
import styles from "./RoomDetail.module.scss";
import IconWrapper from "../../../components/icons/IconWrapper";
import { IoIosArrowBack, MdOutlineEdit } from "../../../components/icons/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedRoom } from "../../../features/roomSlice";
import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import {
  DeviceProps,
  RoomDeviceProps,
  RoomProps,
  RoomProps2,
} from "../../../data/data";
import { FaPlus } from "react-icons/fa";
import { set } from "react-datepicker/dist/date_utils";

const cx = classNames.bind(styles);

const RoomDetail = () => {
  const navigate = useNavigate();
  const [isModelEditOpen, setIsModelEditOpen] = useState(false);
  const [isModelAddDeviceOpen, setIsModelAddDeviceOpen] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<{
    [deviceName: string]: { deviceId: number; quantity: number };
  }>({});
  type RoomDevice = {
    deviceName: string;
    quantity: number;
  };
  const [roomDevices, setRoomDevices] = useState<RoomDevice[]>([]);

  // const dispatch = useDispatch();
  const { id } = useParams();

  // Lấy thông tin phòng
  const {
    data: roomDetail,
    loading,
    error,
  } = useFetch<any>(
    id ? `http://localhost:8080/api/v1/room/getRoomById?roomId=${id}` : ""
  );

  useEffect(() => {
      roomDetail?.room_deviceDTOS?.map((device: RoomDeviceProps) => {
        setRoomDevices((prev) => [...prev, { deviceName: device.deviceName, quantity: device.quantity }]);
      });
      console.log("roomDevices", roomDevices);
    
  }, [roomDetail]);

  console.log("roomDetail", roomDetail);

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
      alert("Không có roomId!");
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

    alert("Thêm thiết bị thành công!");
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

  // đóng mở modal chỉnh sửa
  const handleOpenUpdateModal = () => {
    setIsModelEditOpen(true);
    console.log("Edit room");
  };
  const handleCloseUpdateModal = () => {
    setIsModelEditOpen(false);
  };

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
            />
          </div>

          <div className={cx("room-info")}>
            <div className={cx("room-header")}>
              <span className={cx("room-title")}>
                Tên phòng - {roomDetail?.roomName}
              </span>
              <div className={cx("btn-edit")} onClick={handleOpenUpdateModal}>
                <IconWrapper icon={MdOutlineEdit} size={22} />
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
                      />
                    </div>

                    <div className={cx("input-group")}>
                      <label htmlFor="room-capacity">Sức chứa</label>
                      <input
                        type="text"
                        id="room-capacity"
                        defaultValue={roomDetail.capacity}
                      />
                    </div>

                    <div className={cx("input-group")}>
                      <label htmlFor="room-type">Loại phòng</label>
                      <select id="room-type" defaultValue={roomDetail.typeRoom}>
                        <option value="Mặc định">Mặc định</option>
                        <option value="Cao cấp">Cao cấp</option>
                        <option value="Tiêu chuẩn">Tiêu chuẩn</option>
                      </select>
                    </div>

                    <div className={cx("input-group")}>
                      <label htmlFor="room-status">Trạng thái</label>
                      <select
                        id="room-status"
                        defaultValue={roomDetail.statusRoom}
                      >
                        <option value="Có sẵn">Có sẵn</option>
                        <option value="Đã đặt">Đã đặt</option>
                        <option value="Chờ phê duyệt">Chờ phê duyệt</option>
                      </select>
                    </div>

                    <button className={cx("btn-save")}>Lưu</button>

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
                {/* <p>
                  <strong>Vị trí:</strong> {roomDetail?.location.branch} -{" "}
                  {roomDetail?.location.building} - tầng{" "}
                  {roomDetail?.location.floor}
                </p> */}
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
                {roomDevices.length >  roomDetail?.room_deviceDTOS?.length ? (
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
    </div>
  );
};

export default RoomDetail;

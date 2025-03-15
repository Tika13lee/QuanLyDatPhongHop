import classNames from "classnames/bind";
import styles from "./RoomDetail.module.scss";
import IconWrapper from "../../../components/icons/IconWrapper";
import { IoIosArrowBack, MdOutlineEdit } from "../../../components/icons/icons";
import WeeklySchedule from "../../../components/Schedule/WeeklySchedule";
import { useNavigate, useParams } from "react-router-dom";
import MonthlySchedule from "../../../components/Schedule/MonthlySchedule";
import { useDispatch } from "react-redux";
import { setSelectedRoom } from "../../../features/roomSlice";
import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { RoomDeviceProps } from "../../../data/data";

const cx = classNames.bind(styles);

const defaultRoom = {
  roomImg: "/images/default-room.jpg",
  roomName: "Chưa có thông tin",
  location: {
    branch: "N/A",
    building: "N/A",
    floor: "N/A",
    number: "N/A",
  },
  capacity: "N/A",
  price: "N/A",
  typeRoom: "N/A",
  statusRoom: "N/A",
  approvers: {
    phone: "N/A",
    name: "N/A",
  },
  devices: [],
};

const RoomDetail = () => {
  const navigate = useNavigate();
  const [isModelEditOpen, setIsModelEditOpen] = useState(false);
  const [view, setView] = useState<"week" | "month">("week");

  const dispatch = useDispatch();
  const { id } = useParams();
  const {
    data: roomDetail,
    loading,
    error,
  } = useFetch<any>(
    id ? `http://localhost:8080/api/v1/room/getRoomById?roomId=${id}` : ""
  );

  // lưu room vào Redux Store
  useEffect(() => {
    if (roomDetail) {
      dispatch(setSelectedRoom(roomDetail));
    }
  }, [roomDetail, dispatch]);

  console.log(roomDetail);

  // Nếu có dữ liệu từ API, sử dụng dữ liệu này
  const room = roomDetail || defaultRoom;

  // Hàm chuyển đổi view
  const toggleView = () => {
    setView(view === "week" ? "month" : "week");
  };

  const handleOpenModal = () => {
    setIsModelEditOpen(true);
    console.log("Edit room");
  };

  const handleCloseModal = () => {
    setIsModelEditOpen(false);
  };

  return (
    <div className={cx("room-detail-container")}>
      <div className={cx("header")}>
        <div className={cx("back-button")} onClick={() => navigate(-1)}>
          <IconWrapper icon={IoIosArrowBack} />
          <span>Quay lại</span>
        </div>

        <div className={cx("switch-container")}>
          <button
            className={cx("switch-btn", { active: view === "week" })}
            onClick={toggleView}
          >
            Tuần
          </button>
          <button
            className={cx("switch-btn", { active: view === "month" })}
            onClick={toggleView}
          >
            Tháng
          </button>
        </div>
      </div>

      <div className={cx("room-content")}>
        <div className={cx("room-info-container")}>
          <div className={cx("room-image")}>
            <img
              src={
                room.imgs?.length > 0
                  ? room.imgs[0]
                  : "/images/default-room.jpg"
              }
              alt="Phòng họp"
            />
          </div>

          <div className={cx("room-info")}>
            <div className={cx("room-header")}>
              <span className={cx("room-title")}>{room.roomName}</span>
              <div className={cx("btn-edit")} onClick={handleOpenModal}>
                <IconWrapper icon={MdOutlineEdit} size={22} />
              </div>
              {isModelEditOpen && (
                <div className={cx("modal-overlay")} onClick={handleCloseModal}>
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
                      onClick={handleCloseModal}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className={cx("room-details")}>
              <p>
                <strong>Vị trí:</strong> {room.location.branch} -{" "}
                {room.location.building} - tầng {room.location.floor} -{" "}
                {room.location.number}
              </p>
              <div className={cx("room-info-row")}>
                <p>
                  <strong>Sức chứa:</strong> {room.capacity} người
                </p>
                <p>
                  <strong>Giá:</strong> ${room.price}
                </p>
              </div>
              <p>
                <strong>Loại phòng:</strong> <span>{room.typeRoom}</span>
              </p>
              <p>
                <strong>Trạng thái:</strong> <span>{room.statusRoom}</span>
              </p>
              <p>
                <strong>Người phê duyệt:</strong>{" "}
                <span>{room.approver?.name}</span>
              </p>
              <p>
                <strong>Danh Sách Thiết Bị</strong>
              </p>
              <div className={cx("device-details")}>
                {room.room_deviceDTOS?.length > 0 ? (
                  room.room_deviceDTOS.map(
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
            </div>
          </div>
        </div>

        {/* <div className={cx("room-schedule-container")}>
          {view === "week" ? <WeeklySchedule /> : <MonthlySchedule />}
        </div> */}
      </div>
    </div>
  );
};

export default RoomDetail;

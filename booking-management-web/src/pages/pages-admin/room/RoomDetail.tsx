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
import { RoomDeviceProps,  } from "../../../data/data";

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

  const { id } = useParams();
  const {
    data: roomDetail,
    loading,
    error,
  } = useFetch<any>(
    id ? `http://localhost:8080/api/v1/room/getRoomById?roomId=${id}` : ""
  );
  const dispatch = useDispatch();

  // lưu room vào Redux Store
  useEffect(() => {
    if (roomDetail) {
      dispatch(setSelectedRoom(roomDetail));
    }
  }, [roomDetail, dispatch]);

  console.log(roomDetail);

  // Nếu có dữ liệu từ API, sử dụng dữ liệu này
  const room = roomDetail || defaultRoom;

  const toggleView = () => {
    setView(view === "week" ? "month" : "week");
  };

  const handleOpenModal = () => {
    setIsModelEditOpen(true);
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

        <div className={cx("room-schedule-container")}>
          {view === "week" ? <WeeklySchedule /> : <MonthlySchedule />}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;

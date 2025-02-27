import classNames from "classnames/bind";
import styles from "./RoomDetail.module.scss";
import IconWrapper from "../../../components/icons/IconWrapper";
import { IoIosArrowBack } from "../../../components/icons/icons";
import WeeklySchedule from "../../../components/Schedule/WeeklySchedule";
import { useNavigate, useParams } from "react-router-dom";
import { rooms } from "../../../data/data";

const cx = classNames.bind(styles);

const roomDetail = {
  name: "Phòng họp VIP",
  location: "Hà Nội - Tòa A - 3 - P301",
  capacity: 20,
  price: "500,000 VND",
  type: "Phòng hội thảo",
  status: "Đang sử dụng",
  approver: "Nguyễn Văn A",
  image:
    "https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg",
  devices: [
    { name: "Máy chiếu", quantity: 2 },
    { name: "Tivi", quantity: 1 },
    { name: "Hệ thống âm thanh", quantity: 1 },
    { name: "Bảng trắng", quantity: 3 },
  ],
};

const RoomDetail = () => {
  const navigate = useNavigate();

  // Lấy id từ URL
  const { id } = useParams();
  const roomDetail = rooms.find((room) => room.id === id);
  if (!roomDetail) {
    return <p>Phòng không tồn tại!</p>;
  }

  return (
    <div className={cx("room-detail-container")}>
      {/* nút quay lại */}
      <div className={cx("back-button")} onClick={() => navigate(-1)}>
        <IconWrapper icon={IoIosArrowBack} />
        <span>Quay lại</span>
      </div>

      <div className={cx("room-content")}>
        {/* thông tin phòng họp */}
        <div className={cx("room-info-container")}>
          {/* Hình ảnh phòng họp */}
          <div className={cx("room-image")}>
            <img src={roomDetail.roomImg} alt="Phòng họp" />
          </div>

          {/* Thông tin chi tiết */}
          <div className={cx("room-info")}>
            <p className={cx("room-title")}>{roomDetail.name}</p>

            <div className={cx("room-details")}>
              <p>
                <strong>Vị trí:</strong> {roomDetail.location.branch} -{" "}
                {roomDetail.location.building} - {roomDetail.location.floor} -{" "}
              </p>
              <p>
                <strong>Sức chứa:</strong> {roomDetail.capacity} người
              </p>
              <p>
                <strong>Giá:</strong> {roomDetail.price}
              </p>
              <p>
                <strong>Loại phòng:</strong>
                {/* <span>{roomDetail.type}</span> */}
              </p>
              <p>
                <strong>Trạng thái:</strong>
                {/* <span> {roomDetail.status}</span> */}
              </p>
              <p>
                <strong>Người phê duyệt:</strong>{" "}
                {roomDetail.approver.map((approver) => (
                  <span key={approver.id}>{approver.name}</span>
                ))}
              </p>
              {/* Danh sách thiết bị */}
              <p>
                <strong>Danh Sách Thiết Bị</strong>
              </p>
              <div className={cx("device-details")}>
                {/* {roomDetail.devices.map((device, index) => (
                  <div key={index} className={cx("device-row")}>
                    <p className={cx("device-name")}>{device.name}</p>
                    <p className={cx("device-quantity")}>{device.quantity}</p>
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </div>

        {/* lịch đặt phòng của room */}
        <div className={cx("room-schedule-container")}>
          <WeeklySchedule />
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;

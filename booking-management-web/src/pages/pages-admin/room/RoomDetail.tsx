import classNames from "classnames/bind";
import styles from "./RoomDetail.module.scss";
import IconWrapper from "../../../components/icons/IconWrapper";
import { IoIosArrowBack, MdOutlineEdit } from "../../../components/icons/icons";
import WeeklySchedule from "../../../components/Schedule/WeeklySchedule";
import { useNavigate, useParams } from "react-router-dom";
import { rooms } from "../../../data/data";
import { useEffect, useState } from "react";
import MonthlySchedule from "../../../components/Schedule/MonthlySchedule";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { setSelectedRoom } from "../../../features/roomSlice";

const cx = classNames.bind(styles);

const RoomDetail = () => {
  const navigate = useNavigate();
  const [isModelEditOpen, setIsModelEditOpen] = useState(false);
  const [view, setView] = useState<"week" | "month">("week");

  // Lấy id từ URL
  const { id } = useParams();
  const dispatch = useDispatch();
  const roomDetail = useSelector((state: RootState) => state.room.selectedRoom);

  useEffect(() => {
    if (id !== undefined) {
      dispatch(setSelectedRoom(Number(id)));
    }
  }, [id, dispatch]);

  if (!roomDetail) {
    return <p>Phòng không tồn tại!</p>;
  }

  // Chuyển đổi giữa chế độ xem tuần và tháng
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
      {/* nút quay lại */}
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
          {/* Hình ảnh phòng họp */}
          <div className={cx("room-image")}>
            <img src={roomDetail.roomImg} alt="Phòng họp" />
          </div>

          {/* Thông tin chi tiết */}
          <div className={cx("room-info")}>
            <div className={cx("room-header")}>
              <span className={cx("room-title")}>{roomDetail.name}</span>
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
                        defaultValue={roomDetail.name}
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
                      <label htmlFor="room-price">Giá</label>
                      <input
                        type="text"
                        id="room-price"
                        defaultValue={roomDetail.price}
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

                    <div className={cx("input-group")}>
                      <label htmlFor="room-approver">Người phê duyệt</label>
                      <select
                        id="room-approver"
                        defaultValue={roomDetail.approvers[0].id}
                      >
                        <option value="9">Bùi Đức I</option>
                        <option value="10">Đỗ Mai J</option>
                        <option value="11">Nguyễn Thị K</option>
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
                <strong>Vị trí:</strong> {roomDetail.location.branch} -{" "}
                {roomDetail.location.building} - tầng{" "}
                {roomDetail.location.floor} - {roomDetail.location.number}
              </p>
              <div className={cx("room-info-row")}>
                <p>
                  <strong>Sức chứa:</strong> {roomDetail.capacity} người
                </p>
                <p>
                  <strong>Giá:</strong> ${roomDetail.price}
                </p>
              </div>
              <p>
                <strong>Loại phòng:</strong>
                <span> {roomDetail.typeRoom}</span>
              </p>
              <p>
                <strong>Trạng thái:</strong>
                <span> {roomDetail.statusRoom}</span>
              </p>
              <p>
                <strong>Người phê duyệt:</strong>{" "}
                {roomDetail.approvers.map((approver) => (
                  <span key={approver.id}>{approver.name}, </span>
                ))}
              </p>
              {/* Danh sách thiết bị */}
              <p>
                <strong>Danh Sách Thiết Bị</strong>
              </p>
              <div className={cx("device-details")}>
                {roomDetail.devices.map((device, index) => (
                  <div key={index} className={cx("device-row")}>
                    <p className={cx("device-name")}>{device.name}</p>
                    <p className={cx("device-quantity")}>{device.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* lịch đặt phòng của room */}
        <div className={cx("room-schedule-container")}>
          {/* <WeeklySchedule /> */}
          {view === "week" ? <WeeklySchedule /> : <MonthlySchedule />}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;

import classNames from "classnames/bind";
import styles from "./CardRoom.module.scss";
import { RoomProps } from "../../data/data";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const timeSlots = Array.from({ length: 19 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

function CardRoom({ rooms }: { rooms: RoomProps[] }) {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<RoomProps | null>(null);

  return (
    <>
      <div className={cx("card-room-list")}>
        {rooms?.map(
          (room) => (
            (
              <div className={cx("card-room")} key={room.roomId}>
                <div className={cx("card-room__image")}>
                  <img src={room.imgs[0]} alt="" />
                </div>
                <div className={cx("card-room__content")}>
                  <h3 className={cx("card-room__name")}>{room.roomName}</h3>
                  <p className={cx("card-room__location")}>
                    📍 {room.location.building.branch.branchName} - tòa{" "}
                    {room.location.building.buildingName} - tầng{" "}
                    {room.location.floor}{" "}
                  </p>
                  <p className={cx("card-room__capacity")}>
                    👥 {room.capacity} người
                  </p>
                  <p className={cx("card-room__price")}>
                    💲 {room.price.value}
                  </p>

                  <div className={cx("card-room__buttons")}>
                    <button
                      className={cx("btn", "btn-view")}
                      onClick={() => navigate(`/user/detail/${room.roomId}`)}
                    >
                      Xem
                    </button>
                    <button
                      className={cx("btn", "btn-book")}
                      onClick={() => setSelectedRoom(room)}
                    >
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>

      {/* Modal đặt phòng */}
      {selectedRoom && (
        <div className={cx("modal-overlay")}>
          <div className={cx("modal")}>
            <button
              className={cx("close-btn")}
              onClick={() => setSelectedRoom(null)}
            >
              ✖
            </button>
            <h3>Đặt lịch phòng "{selectedRoom.roomName}"</h3>

            <div className={cx("form-row")}>
              {/* chọn ngày */}
              <div className={cx("form-group")}>
                <label>Ngày</label>
                <input type="date" />
              </div>
              {/* bắt đầu */}
              <div className={cx("form-group")}>
                <label>Giờ bắt đầu</label>
                <select>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              {/* kết thúc */}
              <div className={cx("form-group")}>
                <label>Giờ kết thúc</label>
                <select>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tiêu đề cuộc họp */}
            <div className={cx("form-group")}>
              <label>Tiêu đề</label>
              <input type="text" placeholder="Nhập tiêu đề cuộc họp" />
            </div>

            {/* Ghi chú */}
            <div className={cx("form-group")}>
              <label>Ghi chú</label>
              <input type="text" placeholder="Nhập ghi chú" />
            </div>

            {/* Mô tả */}
            <div className={cx("form-group")}>
              <label>Mô tả</label>
              <input type="text" placeholder="Nhập mô tả" />
            </div>

            <div className={cx("form-row")}>
              {/* Chọn tần suất */}
              <div className={cx("form-group")}>
                <label>Tần suất</label>
                <select>
                  <option value="none">Không lặp lại</option>
                  <option value="daily">Mỗi ngày</option>
                  <option value="weekly">Mỗi tuần</option>
                </select>
              </div>

              {/* Chọn dịch vụ */}
              <div className={cx("form-group")}>
                <label>Dịch vụ</label>
                <div className={cx("checkbox-group")}>
                  <select>
                    <option value="none">Không chọn</option>
                    <option value="coffee">Cà phê</option>
                    <option value="tea">Trà</option>
                    <option value="water">Nước</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Người tham gia */}
            <div className={cx("form-group")}>
              <label>Người tham gia</label>
              <input type="text" placeholder="Nhập email người tham gia" />
            </div>

            {/* Nút gửi phê duyệt */}
            <button className={cx("submit-btn")}>Gửi phê duyệt</button>
          </div>
        </div>
      )}
    </>
  );
}

export default CardRoom;

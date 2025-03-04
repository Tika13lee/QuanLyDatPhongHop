import classNames from "classnames/bind";
import styles from "./CardRoom.module.scss";

const cx = classNames.bind(styles);

function CardRoom( { rooms } : { rooms: any[] }) {
  return (
    <div className={cx("card-room-list")}>
      {rooms.map((room) => (
        <div className={cx("card-room")} key={room.id}>
          <div className={cx("card-room__image")}>
            <img src={room.roomImg} alt={room.name} />
          </div>
          <div className={cx("card-room__content")}>
            <h3 className={cx("card-room__name")}>{room.name}</h3>
            <p className={cx("card-room__location")}>📍 {room.location.branch}</p>
            <p className={cx("card-room__capacity")}>👥 {room.capacity} người</p>
            <p className={cx("card-room__price")}>💲 {room.price}</p>

            <div className={cx("card-room__buttons")}>
              <button className={cx("btn", "btn-view")}>Xem chi tiết</button>
              <button className={cx("btn", "btn-book")}>Đặt ngay</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardRoom;

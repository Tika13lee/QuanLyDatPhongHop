import classNames from "classnames/bind";
import styles from "./CardRoom.module.scss";
import { RoomProps } from "../../data/data";

const cx = classNames.bind(styles);

function CardRoom( { rooms } : { rooms: RoomProps[] | null| undefined }) {
  return (
    <div className={cx("card-room-list")}>
      {rooms?.map((room) => (
        <div className={cx("card-room")} key={room.roomId}>
          <div className={cx("card-room__image")}>
            <img src={room.imgs[0]} alt="" />
          </div>
          <div className={cx("card-room__content")}>
            <h3 className={cx("card-room__name")}>{room.roomName}</h3>
            <p className={cx("card-room__location")}>📍 {room.location.branch}</p>
            <p className={cx("card-room__capacity")}>👥 {room.capacity} người</p>
            <p className={cx("card-room__price")}>💲 {room.price.value}</p>

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

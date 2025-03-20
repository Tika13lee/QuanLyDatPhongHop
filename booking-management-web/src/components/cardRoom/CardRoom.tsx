import classNames from "classnames/bind";
import styles from "./CardRoom.module.scss";
import { RoomProps } from "../../data/data";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalBooking from "../Modal/ModalBooking";

const cx = classNames.bind(styles);

type DataSearch = {
  branch: string;
  date: string;
  timeStart: string;
  timeEnd: string;
};

const timeSlots = Array.from({ length: 19 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

function CardRoom({ rooms, dataSearch }: { rooms: RoomProps[], dataSearch: DataSearch }) {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<RoomProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={cx("card-room-list")}>
        {rooms?.map((room) => (
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
              <p className={cx("card-room__price")}>💲 {room.price.value}</p>

              <div className={cx("card-room__buttons")}>
                <button
                  className={cx("btn", "btn-view")}
                  onClick={() => navigate(`/user/detail/${room.roomId}`)}
                >
                  Xem
                </button>
                <button
                  className={cx("btn", "btn-book")}
                  onClick={() => {
                    
                    setIsModalOpen(() => {
                      setSelectedRoom(room);
                      return true;
                    });
                  }}
                >
                  Đặt ngay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ModalBooking
          isModalOpen={isModalOpen}
          setIsModalClose={() => setIsModalOpen(false)}
          roomInfo={selectedRoom ? { roomName: selectedRoom.roomName, roomId: selectedRoom.roomId + "" } : { roomName: "", roomId: "" }}
          dateSelected={dataSearch.date}
          timeStart={dataSearch.timeStart}
          timeEnd={dataSearch.timeEnd}
        />
      )}
    </>
  );
}

export default CardRoom;

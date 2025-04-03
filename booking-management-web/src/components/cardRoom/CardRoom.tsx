import classNames from "classnames/bind";
import styles from "./CardRoom.module.scss";
import { LocationProps2, RoomProps } from "../../data/data";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalBooking from "../Modal/ModalBooking";
import PopupNotification from "../popup/PopupNotification";
import { formatDateString } from "../../utilities";

const cx = classNames.bind(styles);

type DataSearch = {
  branch: string;
  date: string;
  timeStart: string;
  timeEnd: string;
};

type typeMessage = "error" | "success" | "info" | "warning";

type typeInfoPopup = {
  message: string;
  type: typeMessage;
  close: boolean;
};

function CardRoom({
  rooms,
  dataSearch,
}: {
  rooms: RoomProps[];
  dataSearch: DataSearch;
}) {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<RoomProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // handleOpenModal
  const handleOpenModal = (room: RoomProps) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  // thông báo popup
  const [infoPopup, setInfoPopup] = useState<typeInfoPopup>({
    message: "",
    type: "success",
    close: false,
  });

  // xử lý mở popup
  const handleOpenPopup = (
    message: string,
    type: typeMessage,
    close: boolean
  ) => {
    setInfoPopup({ message, type, close: true });
  };

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
              <div className={cx("card-room__location")}>
                {(() => {
                  const loc = room.location;

                  if ("building" in loc && typeof loc.building === "object") {
                    // Kiểu LocationProps
                    return (
                      <>
                        <p>📍 {loc.building.branch.branchName}</p>
                        <p>
                          🏢 Tòa {loc.building.buildingName} - tầng {loc.floor}
                        </p>
                      </>
                    );
                  } else {
                    // Kiểu LocationProps2
                    const loc2 = loc as LocationProps2;
                    return (
                      <>
                        <p>📍 {loc2.branch}</p>
                        <p>
                          🏢 Tòa {loc2.building} - tầng {loc2.floor}
                        </p>
                      </>
                    );
                  }
                })()}
              </div>

              <p className={cx("card-room__capacity")}>
                👥 {room.capacity} người
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
                  onClick={() => handleOpenModal(room)}
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
          roomInfo={
            selectedRoom
              ? {
                  roomName: selectedRoom.roomName,
                  roomId: selectedRoom.roomId + "",
                }
              : { roomName: "", roomId: "" }
          }
          dateSelected={dataSearch.date}
          timeStart={dataSearch.timeStart}
          timeEnd={dataSearch.timeEnd}
          setIsPopupOpen={handleOpenPopup}
        />
      )}

      {/* Popup thông báo */}
      {infoPopup.close && (
        <PopupNotification
          message={infoPopup.message}
          type={infoPopup.type}
          isOpen={infoPopup.close}
          onClose={() =>
            setInfoPopup({ message: "", type: "success", close: false })
          }
        />
      )}
    </>
  );
}

export default CardRoom;

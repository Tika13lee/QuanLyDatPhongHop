import classNames from "classnames/bind";
import styles from "./CardApproval.module.scss";
import UserAvatar from "../UserAvatar/UserAvatar";
import { ReservationProps, reservations } from "../../data/data";

const cx = classNames.bind(styles);

type CardApprovalProps = {
  reservation: ReservationProps;
  isActive: boolean;
  onClick: () => void;
};

function CardApproval({ reservation, isActive, onClick }: CardApprovalProps) {
  return (
    <div
      className={cx("card-approval-item", { active: isActive })}
      onClick={onClick}
    >
      <div className={cx("left-info")}>
        <UserAvatar imgUrl={reservation.booker.img} />
        <div>
          <p className={cx("nameBooker")}>{reservation.booker.name}</p>
          <p className={cx("isBooked")}>
            {reservation.approvalType ? "Đặt phòng" : "Hủy đặt phòng"}
          </p>
        </div>
      </div>
      <div className={cx("right-time")}>
        <span>{reservation.timeStart}</span> -{" "}
        <span>{reservation.timeEnd}</span>
      </div>
    </div>
  );
}

export default CardApproval;

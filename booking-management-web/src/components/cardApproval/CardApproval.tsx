import classNames from "classnames/bind";
import styles from "./CardApproval.module.scss";
import UserAvatar from "../UserAvatar/UserAvatar";
import { ReservationProps } from "../../data/data";

const cx = classNames.bind(styles);

type CardApprovalProps = {
  reservation: ReservationProps;
  isActive: boolean;
  onClick: () => void;
};

function CardApproval({ reservation, isActive, onClick }: CardApprovalProps) {
  // định dạng
  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }
  return (
    <div
      className={cx("card-approval-item", { active: isActive })}
      onClick={onClick}
    >
      <div className={cx("left-info")}>
        <UserAvatar imgUrl={reservation.img} />
        <div className="info">
          <p className={cx("nameBooker")}>{reservation.nameBooker}</p>
          <p className={cx("title")}>{reservation.title}</p>
        </div>
      </div>
      <div className={cx("right-time")}>
        <span>{formatDateTime(reservation.time)}</span>
        <div>
          <span>{formatDateTime(reservation.timeStart)}</span> -{" "}
          <br/>
          <span>{formatDateTime(reservation.timeEnd)}</span>
        </div>
      </div>
    </div>
  );
}

export default CardApproval;

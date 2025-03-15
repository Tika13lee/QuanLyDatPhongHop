import classNames from "classnames/bind";
import styles from "./Approve.module.scss";

const cx = classNames.bind(styles);

function Approve() {
  return (
    <div className={cx("approve")}>
      <h1>Approve</h1>
    </div>
  );
}

export default Approve;

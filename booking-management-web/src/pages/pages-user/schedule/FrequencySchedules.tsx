import classNames from "classnames/bind";
import styles from "./FrequencySchedules.module.scss";

const cx = classNames.bind(styles);

function FrequencySchedules() {
  return (
    <div className={cx("frequency-schedules")}>
      <h1>Frequency Schedules</h1>
    </div>
  );
}

export default FrequencySchedules;

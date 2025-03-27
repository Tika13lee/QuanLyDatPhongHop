import classNames from "classnames/bind";
import styles from "./CloseModalButton.module.scss";

const cx = classNames.bind(styles);

type CloseModalButtonProps = {  
  onClick: () => void;
};

function CloseModalButton({ onClick }: CloseModalButtonProps) {
  return (
    <button className={cx("close-btn")} onClick={onClick}>
      ✖
    </button>
  );
}

export default CloseModalButton;

import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
import UserAvatar from "../UserAvatar/UserAvatar";

const cx = classNames.bind(styles);

const Navbar = () => {
  return (
    <div className={cx("navbar-container")}>
      <div className={cx("navbar")}>
        <div className={cx("brand")}>
          <p>TÊN CÔNG TY - THƯƠNG HIỆU</p>
        </div>
        <div></div>
        <div>
          <UserAvatar imgUrl="https://i.pravatar.cc/300" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

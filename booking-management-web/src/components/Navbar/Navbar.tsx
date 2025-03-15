import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
import IconWrapper from "../icons/IconWrapper";
import { FaRegBell } from "../icons/icons";
import UserAvatarWithMenu from "../UserAvatar/UserAvatarWithMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { login } from "../../features/authSlice";

const cx = classNames.bind(styles);

const Navbar = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <div className={cx("navbar-container")}>
      <div className={cx("navbar")}>
        <div className={cx("brand")}>
          <p>TÊN CÔNG TY - THƯƠNG HIỆU</p>
        </div>

        <div className={cx("user")}>
          <IconWrapper icon={FaRegBell} size={20} color="#000" />
          <div className={cx("divider")} />
          <UserAvatarWithMenu imgUrl="https://i.pravatar.cc/300" />
          {/* {isLoggedIn ? (
            <UserAvatarWithMenu imgUrl="https://i.pravatar.cc/300" />
          ) : (
            <button
              className={cx("login-btn")}
              onClick={() => dispatch(login())}
            >
              Login
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

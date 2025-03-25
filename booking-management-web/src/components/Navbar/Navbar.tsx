import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
import IconWrapper from "../icons/IconWrapper";
import { FaRegBell } from "../icons/icons";
import UserAvatarWithMenu from "../UserAvatar/UserAvatarWithMenu";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { login } from "../../features/authSlice";
import { useEffect, useRef, useState } from "react";
import NotificationDropdown from "../popup/NotificationDropdown";

const cx = classNames.bind(styles);

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // đóng mở dropdown thông báo
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // đóng dropdown thông báo khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cx("navbar-container")}>
      <div className={cx("navbar")}>
        <div className={cx("brand")}>
          <p>
            <strong>HỆ THỐNG QUẢN LÝ ĐẶT PHÒNG HỌP</strong>
          </p>
        </div>

        <div className={cx("user")}>
          <div
            ref={bellRef}
            className={cx("notification")}
            onClick={toggleNotifications}
          >
            <IconWrapper icon={FaRegBell} size={20} color="#000" />
          </div>
          {showNotifications && <NotificationDropdown ref={dropdownRef}/>}
          <div className={cx("divider")} />
          <div>
            <UserAvatarWithMenu imgUrl="https://i.pravatar.cc/300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

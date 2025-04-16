import React, { useEffect, useRef, useState, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./User-avatar-with-menu.module.scss";
import UserAvatar from "./UserAvatar";
import {} from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Profile from "../Profile/Profile";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

type AvatarWithMenuProps = React.ComponentProps<typeof UserAvatar>;

const UserAvatarWithMenu: React.FC<AvatarWithMenuProps> = ({
  imgUrl,
  size,
  borderColor,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // đóng mở menu
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cx("menu-container")}>
      <div ref={avatarRef} onClick={toggleMenu}>
        <UserAvatar imgUrl={imgUrl} />
      </div>

      {isMenuOpen && (
        <div ref={menuRef} className={cx("dropdown-menu")}>
          <div
            className={cx("dropdown-item")}
            onClick={() => {
              setIsProfileOpen(true);
              setIsMenuOpen(false);
            }}
          >
            <span>Hồ sơ cá nhân</span>
          </div>
          <div className={cx("dropdown-item")}>
            <span>Chế độ tối</span>
          </div>
          <div className={cx("dropdown-item")}>
            <span>Ngôn ngữ</span>
          </div>
          <div className={cx("dropdown-divider")} />
          <div
            className={cx("dropdown-item")}
            onClick={() => {
              localStorage.removeItem("userPhone");
              localStorage.removeItem("currentUser");
              localStorage.removeItem("accessToken");
              navigate("/");
            }}
          >
            <span style={{ color: "#dc3545" }}>Đăng xuất</span>
          </div>
        </div>
      )}

      {isProfileOpen && <Profile onClose={() => setIsProfileOpen(false)} />}
    </div>
  );
};

export default UserAvatarWithMenu;

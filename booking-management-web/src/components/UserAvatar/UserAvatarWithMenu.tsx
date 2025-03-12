import React, { useEffect, useRef, useState, useCallback } from "react";
import classNames from "classnames/bind";
import styles from "./User-avatar-with-menu.module.scss";
import UserAvatar from "./UserAvatar";
import {} from "react-icons/bs";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

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

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

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
            onClick={() => setIsProfileOpen(true)}
          >
            <span>Hồ sơ cá nhân</span>
          </div>
          <div className={cx("dropdown-item")}>
            <span>Lịch sử đặt phòng</span>
          </div>
          <div className={cx("dropdown-item")}>
            <span>Chế độ tối</span>
          </div>
          <div className={cx("dropdown-item")}>
            <span>Ngôn ngữ</span>
          </div>
          <div className={cx("dropdown-divider")} />
          <div className={cx("dropdown-item")}>
            <span>Đăng xuất</span>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div
          className={cx("popup-overlay")}
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className={cx("popup-content")}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Hồ sơ cá nhân</h2>
            <p>Thông tin chi tiết về người dùng</p>
            <button onClick={() => setIsProfileOpen(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatarWithMenu;

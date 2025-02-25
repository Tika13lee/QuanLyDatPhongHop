import classNames from "classnames/bind";
import styles from "./MainLayoutAdmin.module.scss";
import Navbar from "../components/Navbar/Navbar";
import { NavLink, Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

const cx = classNames.bind(styles);

const MainLayoutAdmin = () => {
  const [isActive, setIsActive] = useState(false);

  const handleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={cx("main-layout-admin")}>
      <Navbar />
      <div className={cx("content")}>
        <div className={cx("sidebar")}>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            Bảng Điều Khiển
          </NavLink>
          <NavLink
            to="/admin/booking"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            QL Đặt Phòng
          </NavLink>
          <NavLink
            to="/admin/room"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            QL Phòng Họp
          </NavLink>
          <NavLink
            to="/admin/employee"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            QL Nhân Viên
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayoutAdmin;

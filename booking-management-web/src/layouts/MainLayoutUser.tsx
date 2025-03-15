import classNames from "classnames/bind";
import styles from "./MainLayoutUser.module.scss";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";

const cx = classNames.bind(styles);

const MainLayoutUser = () => {
  return (
    <div className={cx("main-layout-user")}>
      <Navbar />
      <div className={cx("content")}>
        <div className={cx("sidebar")}>
          <NavLink
            to="/user"
            end
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            Đặt lịch họp
          </NavLink>
          <NavLink
            to="/user/approve"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            Quản lý phê duyệt
          </NavLink>
          <NavLink
            to="/user/schedule"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            Lịch cá nhân
          </NavLink>
        </div>
        <div className={cx("outlet-container")}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayoutUser;

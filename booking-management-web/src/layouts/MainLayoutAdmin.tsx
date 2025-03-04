import classNames from "classnames/bind";
import styles from "./MainLayoutAdmin.module.scss";
import Navbar from "../components/Navbar/Navbar";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import IconWrapper from "../components/icons/IconWrapper";
import { IoIosArrowDown, IoIosArrowForward } from "../components/icons/icons";

const cx = classNames.bind(styles);

const MainLayoutAdmin = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(true);
  const [isRoomOpen, setIsRoomOpen] = useState(true);

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

          <div className={cx("dropdown")}>
            <div
              className={cx("dropdown-header")}
              onClick={() => setIsBookingOpen(!isBookingOpen)}
            >
              <span>QL Lịch Đặt Phòng</span>
                <IconWrapper
                  icon={!isBookingOpen ? IoIosArrowForward : IoIosArrowDown}
                  color={isBookingOpen ? "#fff" : "#7c7f83"}
                />
            </div>
            {isBookingOpen && (
              <div className={cx("dropdown-menu")}>
                <NavLink
                  to="/admin/booking-mgmt"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  Danh sách chờ
                </NavLink>

                <NavLink
                  to="/admin/booking-mgmt/approved"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  Thông tin nhận/trả
                </NavLink>
              </div>
            )}
          </div>

          <div className={cx("dropdown")}>
            <div
              className={cx("dropdown-header")}
              onClick={() => setIsRoomOpen(!isRoomOpen)}
            >
              <span>QL Phòng Họp</span>
                <IconWrapper
                  icon={!isRoomOpen ? IoIosArrowForward : IoIosArrowDown}
                  color={isRoomOpen ? "#fff" : "#7c7f83"}
                />
            </div>
            {isRoomOpen && (
              <div className={cx("dropdown-menu")}>
                <NavLink
                  to="/admin/room"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  Danh sách Phòng Họp
                </NavLink>

                <NavLink
                  to="/admin/room/approved"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  Phân Quyền Phê Duyệt
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/admin/location"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            QL Vị Trí
          </NavLink>

          <NavLink
            to="/admin/device"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            QL Thiết Bị
          </NavLink>

          <NavLink
            to="/admin/service"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            QL Dịch Vụ
          </NavLink>

          <NavLink
            to="/admin/employee"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            QL Nhân Viên
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            Cài Đặt Thiết Lập
          </NavLink>

          <NavLink
            to="/admin/statistics"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            Thống Kê
          </NavLink>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default MainLayoutAdmin;

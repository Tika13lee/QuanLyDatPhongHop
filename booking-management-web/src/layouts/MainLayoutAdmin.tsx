import classNames from "classnames/bind";
import styles from "./MainLayoutAdmin.module.scss";
import Navbar from "../components/Navbar/Navbar";
import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import IconWrapper from "../components/icons/IconWrapper";
import { IoIosArrowDown, IoIosArrowForward } from "../components/icons/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchLocations } from "../features/locationSlice";
import { fetchDevices } from "../features/deviceSlice";

const cx = classNames.bind(styles);

const MainLayoutAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { locations, loading, error } = useSelector(
    (state: RootState) => state.location
  );

  const { devices } = useSelector((state: RootState) => state.device);

  useEffect(() => {
    if (locations.length === 0) {
      dispatch(fetchLocations());
    }
  }, [dispatch, locations.length]);

  useEffect(() => {
    if (devices.length === 0) {
      dispatch(fetchDevices());
    }
  }, [dispatch, devices.length]);

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [isBookingOpen, setIsBookingOpen] = useState(true);

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
              <span className={cx({ "booking-open": isBookingOpen })}>
                QL Lịch Đặt Phòng
              </span>
              <IconWrapper
                icon={!isBookingOpen ? IoIosArrowForward : IoIosArrowDown}
                color={isBookingOpen ? "#212529" : "#7c7f83"}
              />
            </div>
            {isBookingOpen && (
              <div className={cx("dropdown-menu")}>
                <NavLink
                  to="/admin/overview"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  Tổng quát
                </NavLink>

                <NavLink
                  to="/admin/approval-list"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  DS yêu cầu
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/admin/room"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            QL Phòng Họp
          </NavLink>

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
            to="/admin/price"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            QL Bảng Giá
          </NavLink>

          <NavLink
            to="/admin/employee"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            QL Nhân Viên
          </NavLink>

          {/* <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            Cài Đặt Thiết Lập
          </NavLink> */}

          <NavLink
            to="/admin/statistics"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            Thống Kê
          </NavLink>
        </div>

        <div className={cx("outlet-container")}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayoutAdmin;

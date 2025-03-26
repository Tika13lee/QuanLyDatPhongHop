import classNames from "classnames/bind";
import styles from "./MainLayoutUser.module.scss";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import IconWrapper from "../components/icons/IconWrapper";
import { IoIosArrowDown, IoIosArrowForward } from "../components/icons/icons";

const cx = classNames.bind(styles);

const MainLayoutUser = () => {
  const [isApprovedOpen, setIsApprovedOpen] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);

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
            Tổng quan
          </NavLink>

          <NavLink
            to="/user/booking"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            Đặt lịch họp
          </NavLink>

          <NavLink
            to="/user/booking-list"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            DS gửi yêu cầu
          </NavLink>

          <div className={cx("dropdown")}>
            <div
              className={cx("dropdown-header")}
              onClick={() => setIsApprovedOpen(!isApprovedOpen)}
            >
              <span className={cx({ "booking-open": isApprovedOpen })}>
                Quản lý phê duyệt
              </span>
              <IconWrapper
                icon={!isApprovedOpen ? IoIosArrowForward : IoIosArrowDown}
                color={isApprovedOpen ? "#212529" : "#7c7f83"}
              />
            </div>
            {isApprovedOpen && (
              <div className={cx("dropdown-menu")}>
                <NavLink
                  to="/user/approve"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  DS cần phê duyệt
                </NavLink>

                <NavLink
                  to="/user/approved"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  DS lịch đã phê duyệt
                </NavLink>

                <NavLink
                  to="/user/rejected"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  DS lịch đã từ chối
                </NavLink>
              </div>
            )}
          </div>

          <div className={cx("dropdown")}>
            <div
              className={cx("dropdown-header")}
              onClick={() => {
                setIsScheduleOpen(!isScheduleOpen);
              }}
            >
              <span className={cx({ "booking-open": isScheduleOpen })}>
                Lịch cá nhân
              </span>
              <IconWrapper
                icon={!isScheduleOpen ? IoIosArrowForward : IoIosArrowDown}
                color={isScheduleOpen ? "#212529" : "#7c7f83"}
              />
            </div>
            {isScheduleOpen && (
              <div className={cx("dropdown-menu")}>
                <NavLink
                  to="/user/schedule"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  Lịch theo tuần
                </NavLink>

                <NavLink
                  to="/user/schedulelist"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  Danh sách lịch
                </NavLink>
                <NavLink
                  to="/user/schedule-frequency"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  Lịch tần suất
                </NavLink>
              </div>
            )}
          </div>
        </div>

        <div className={cx("outlet-container")}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayoutUser;

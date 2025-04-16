import classNames from "classnames/bind";
import styles from "./MainLayoutUser.module.scss";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import IconWrapper from "../components/icons/IconWrapper";
import { IoIosArrowDown, IoIosArrowForward } from "../components/icons/icons";
import { EmployeeProps } from "../data/data";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";

const cx = classNames.bind(styles);

const MainLayoutUser = () => {
  // Lấy thông tin sdt người dùng từ localStorage
  const currentUserPhone = JSON.parse(localStorage.getItem("userPhone")!);
  const [userData, setUserData] = useState<EmployeeProps | null>(null);

  const dispatch = useDispatch();

  const [isApprovedOpen, setIsApprovedOpen] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);

  const fetchUserData = async () => {
    try {
      const phone = currentUserPhone; // Số điện thoại người dùng
      const response = await axios.get<EmployeeProps>(
        `http://localhost:8080/api/v1/employee/getEmployeeByPhone`,
        { params: { phone } }
      );

      setUserData(response.data);

      // Lưu dữ liệu vào localStorage, redux
      dispatch(setUser(response.data));
      localStorage.setItem("currentUser", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
            to="/user/search"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            Tìm phòng
          </NavLink>

          <NavLink
            to="/user/booking-list"
            className={({ isActive }) =>
              cx("sidebar-item", { active: isActive })
            }
          >
            Lịch sử đặt lịch
          </NavLink>

          {userData?.account.role === "APPROVER" && (
            <div className={cx("dropdown")}>
              <div
                className={cx("dropdown-header")}
                onClick={() => setIsApprovedOpen(!isApprovedOpen)}
              >
                <span className={cx({ "booking-open": isApprovedOpen })}>
                  Quản lý yêu cầu
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
                    DS đồng ý
                  </NavLink>

                  <NavLink
                    to="/user/rejected"
                    className={({ isActive }) =>
                      cx("dropdown-item", { active: isActive })
                    }
                  >
                    DS từ chối
                  </NavLink>
                </div>
              )}
            </div>
          )}

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
                  Lịch một lần
                </NavLink>
                <NavLink
                  to="/user/schedule-frequency"
                  className={({ isActive }) =>
                    cx("dropdown-item", { active: isActive })
                  }
                >
                  Lịch định kỳ
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

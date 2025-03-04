import classNames from "classnames/bind";
import styles from "./MainLayoutUser.module.scss";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const cx = classNames.bind(styles);

const MainLayoutUser = () => {
  return (
    <div className={cx("main-layout-user")}>
      <Navbar />
      <div className={cx("content")}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayoutUser;

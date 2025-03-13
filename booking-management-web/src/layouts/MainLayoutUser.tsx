import classNames from "classnames/bind";
import styles from "./MainLayoutUser.module.scss";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import useFetch from "../hooks/useFetch";

const cx = classNames.bind(styles);

const MainLayoutUser = () => {
  const [empPhone, setEmpPhone] = useState<string>("0914653334");
  const { data, loading, error } = useFetch(
    `http://localhost:8080/api/v1/employee/getEmployeeByPhone?phone=${empPhone}`
  );

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

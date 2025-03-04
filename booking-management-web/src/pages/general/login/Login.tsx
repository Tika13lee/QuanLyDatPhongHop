import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import Navbar from "../../../components/Navbar/Navbar";

const cx = classNames.bind(styles);

type LoginForm = {
  username: string;
  password: string;
  role: "admin" | "user";
};

const Login = () => {
  return (
    <div className={cx("container")}>
      <form className={cx("form")}>
        <h2 className={cx("title")}>Đăng Nhập</h2>

        <div className={cx("inputGroup")}>
          <label htmlFor="username">Tên đăng nhập</label>
          <input id="username" className={cx("input")} type="text" />
        </div>

        <div className={cx("inputGroup")}>
          <label htmlFor="password">Mật khẩu</label>
          <input id="password" className={cx("input")} type="password" />
        </div>

        <button type="submit" className={cx("button")}>
          Đăng Nhập
        </button>
      </form>
    </div>
  );
};

export default Login;

import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { useState } from "react";
import IconWrapper from "../../../components/icons/IconWrapper";
import { IoEyeOffOutline, IoEyeOutline } from "../../../components/icons/icons";

const cx = classNames.bind(styles);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Đăng nhập được gửi!");
  };

  return (
    <div className={cx("container")}>
      <form className={cx("form")} onSubmit={handleSubmit}>
        <h2 className={cx("title")}>Đăng Nhập</h2>

        <div className={cx("inputGroup")}>
          <label htmlFor="username">Tên đăng nhập</label>
          <input
            id="username"
            className={cx("input")}
            type="text"
            placeholder="Nhập tên đăng nhập"
          />
        </div>

        <div className={cx("inputGroup", "passwordGroup")}>
          <label htmlFor="password">Mật khẩu</label>
          <div className={cx("passwordWrapper")}>
            <input
              id="password"
              className={cx("input")}
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
            />
            <span className={cx("toggleIcon")} onClick={togglePassword}>
              <IconWrapper
                icon={showPassword ? IoEyeOutline : IoEyeOffOutline}
                color="#000"
                size={20}
              />
            </span>
          </div>
        </div>

        <div className={cx("optionsRow")}>
          <label className={cx("checkboxLabel")}>
            <input type="checkbox" className={cx("checkbox")} />
            Ghi nhớ đăng nhập
          </label>
          <a href="#" className={cx("forgotLink")}>
            Quên mật khẩu?
          </a>
        </div>

        <button type="submit" className={cx("submitButton")}>
          Đăng Nhập
        </button>
      </form>
    </div>
  );
};

export default Login;

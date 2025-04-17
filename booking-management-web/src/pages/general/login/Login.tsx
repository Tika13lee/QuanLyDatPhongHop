import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { useState } from "react";
import IconWrapper from "../../../components/icons/IconWrapper";
import { IoEyeOffOutline, IoEyeOutline } from "../../../components/icons/icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PopupNotification from "../../../components/popup/PopupNotification";

const cx = classNames.bind(styles);

type JwtPayloadProp = {
  sub: string;
  exp: number;
  iat: number;
  role: string;
  userName: string;
  [key: string]: any;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Kiểm tra dữ liệu đầu vào
    if (!userName) {
      setPopupMessage("Vui lòng nhập tên đăng nhập.");
      setPopupType("warning");
      setIsPopupOpen(true);
      return;
    }

    if (!password) {
      setPopupMessage("Vui lòng nhập mật khẩu.");
      setPopupType("warning");
      setIsPopupOpen(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/account/login",
        {
          userName,
          password,
        }
      );

      setPopupMessage("Đăng nhập thành công!");
      setPopupType("success");
      setIsPopupOpen(true);

      const accessToken = response.data;
      // Lưu accessToken vào localStorage
      localStorage.setItem("accessToken", accessToken);

      // Giải mã token để lấy thông tin user
      const decoded = jwtDecode<JwtPayloadProp>(accessToken);
      console.log("Decoded JWT:", decoded);

      // Lưu thông tin user vào localStorage
      localStorage.setItem("userPhone", JSON.stringify(decoded.userName));

      // Điều hướng
      if (decoded.role === "ADMIN") {
        navigate("/admin");
      } else if (decoded.role === "USER" || decoded.role === "APPROVER") {
        navigate("/user");
      } else {
        setPopupMessage("Vai trò không hợp lệ.");
        setPopupType("error");
        setIsPopupOpen(true);
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;

        if (status === 401) {
          setPopupMessage("Mật khẩu không đúng. Vui lòng thử lại.");
        } else if (status === 404) {
          setPopupMessage("Tài khoản không tồn tại.");
        } else {
          setPopupMessage("Đã xảy ra lỗi không xác định.");
        }

        setPopupType("error");
        setIsPopupOpen(true);
      } else {
        setPopupMessage("Không thể kết nối đến máy chủ.");
        setPopupType("error");
        setIsPopupOpen(true);
      }
    }
  };

  return (
    <div className={cx("login-container")}>
      <div className={cx("login-form")}>
        <img
          className={cx("logo")}
          src="https://res.cloudinary.com/drfbxuss6/image/upload/v1744446582/Booking_w1cmz7.png"
          alt="Logo"
          height={500}
          width={700}
        />
        <form className={cx("form")} onSubmit={handleSubmit}>
          <h2 className={cx("title")}>Đăng Nhập</h2>

          <div className={cx("inputGroup")}>
            <label htmlFor="userName">Tên đăng nhập</label>
            <input
              id="userName"
              className={cx("input")}
              type="text"
              placeholder="Nhập số điện thoại"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

      {/* Hiển thị thông báo popup */}
      <PopupNotification
        message={popupMessage}
        type={popupType}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
};

export default Login;

import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import CloseModalButton from "../Modal/CloseModalButton";
import UserAvatar from "../UserAvatar/UserAvatar";

const cx = classNames.bind(styles);

type ProfileProps = {
  onClose: () => void;
};

const Profile = ({ onClose }: ProfileProps) => {
  return (
    <div className={cx("profile-modal")}>
      <div className={cx("modal")}>
        <CloseModalButton onClick={onClose} />
        <div className={cx("profile-header")}>
          <h3 className={cx("profile-title")}>Thông tin tài khoản</h3>
        </div>
        <div className={cx("profile-content")}>
          <div className={cx("profile-avatar")}>
            <UserAvatar imgUrl="" size={100} />
            <h3 className={cx("profile-name")}>Nguyễn Văn A</h3>
          </div>
          <div className={cx("profile-info")}>
            <h3>Thông tin cá nhân</h3>
            <div className={cx("profile-info-item")}>
              <p>Email</p>
              <span>abc@gmail.com</span>
            </div>
            <div className={cx("profile-info-item")}>
              <p>Số điện thoại</p>
              <span>0147852369</span>
            </div>
            <div className={cx("profile-info-item")}>
              <p>Phòng ban</p>
              <span>Kế toán</span>
            </div>
            <div className={cx("profile-info-item")}>
              <p>Chi nhánh</p>
              <span>TP. Hồ Chí Minh</span>
            </div>
          </div>
        </div>
        <div className={cx("profile-footer")}>
          <button className={cx("save-btn")}>Cập nhật</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

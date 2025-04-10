import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import CloseModalButton from "../Modal/CloseModalButton";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useState } from "react";
import IconWrapper from "../icons/IconWrapper";
import { IoIosArrowBack } from "../icons/icons";

const cx = classNames.bind(styles);

type ProfileProps = {
  onClose: () => void;
};

const Profile = ({ onClose }: ProfileProps) => {
  // lấy user từ localStorage
  const userCurrent = localStorage.getItem("currentEmployee");
  const user = JSON.parse(userCurrent || "{}");

  console.log(user);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatar || "");
  const [name, setName] = useState<string>(user.employeeName || "");
  const [email, setEmail] = useState<string>(user.email || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setAvatarUrl(newUrl);
    }
  };

  return (
    <div className={cx("profile-modal")}>
      <div className={cx("modal")}>
        <CloseModalButton onClick={onClose} />

        {/* header */}
        {isEditMode ? (
          <div className={cx("profile-header")}>
            <button onClick={() => setIsEditMode(!isEditMode)}>
              <IconWrapper icon={IoIosArrowBack} />
            </button>
            <h3 className={cx("profile-title")}>Cập nhật thông tin</h3>
          </div>
        ) : (
          <div className={cx("profile-header")}>
            <h3 className={cx("profile-title")}>Thông tin tài khoản</h3>
          </div>
        )}

        {/* body */}
        {isEditMode ? (
          <div className={cx("profile-content")}>
            <div className={cx("profile-avatar")}>
              <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
                <UserAvatar imgUrl={avatarUrl} size={100} />
              </label>
              <label className={cx("profile-label")}>Ảnh đại diện</label>

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div>
              <label className={cx("profile-label")}>Họ và tên</label>
              <input
                className={cx("profile-input")}
                type="text"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className={cx("profile-label")}>Email</label>
              <input
                className={cx("profile-input")}
                type="text"
                placeholder="abc@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className={cx("profile-content")}>
            <div className={cx("profile-avatar")}>
              <UserAvatar imgUrl={user.avatar} size={100} />
              <h3 className={cx("profile-name")}>{user.employeeName}</h3>
            </div>
            <div className={cx("profile-info")}>
              <h3>Thông tin cá nhân</h3>
              <div className={cx("profile-info-item")}>
                <p>Email</p>
                <span>{user.email}</span>
              </div>
              <div className={cx("profile-info-item")}>
                <p>Số điện thoại</p>
                <span>{user.phone}</span>
              </div>
              <div className={cx("profile-info-item")}>
                <p>Phòng ban</p>
                <span>{user.department.depName}</span>
              </div>
              <div className={cx("profile-info-item")}>
                <p>Chi nhánh</p>
                <span>
                  {user.department.location.building.branch.branchName}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* footer */}
        {isEditMode ? (
          <div className={cx("profile-footer")}>
            <button
              className={cx("cancel-btn")}
              onClick={() => {
                setIsEditMode(!isEditMode);
              }}
            >
              Huỷ
            </button>
            <button
              className={cx("update-btn")}
              onClick={() => {
                setIsEditMode(!isEditMode);
              }}
            >
              Lưu
            </button>
          </div>
        ) : (
          <div className={cx("profile-footer")}>
            <button
              className={cx("save-btn")}
              onClick={() => {
                setIsEditMode(!isEditMode);
              }}
            >
              Cập nhật
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

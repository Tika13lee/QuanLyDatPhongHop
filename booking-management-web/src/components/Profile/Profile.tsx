import classNames from "classnames/bind";
import styles from "./Profile.module.scss";
import CloseModalButton from "../Modal/CloseModalButton";
import UserAvatar from "../UserAvatar/UserAvatar";
import { useState } from "react";
import IconWrapper from "../icons/IconWrapper";
import { IoIosArrowBack } from "../icons/icons";
import { uploadImageToCloudinary } from "../../utilities";
import usePost from "../../hooks/usePost";
import { EmployeeProps } from "../../data/data";
import PopupNotification from "../popup/PopupNotification";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const cx = classNames.bind(styles);

type ProfileProps = {
  onClose: () => void;
};

const Profile = ({ onClose }: ProfileProps) => {
  // lấy user từ redux
  const user = useSelector((state: RootState) => state.user);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || "");
  const [name, setName] = useState<string>(user?.employeeName || "");
  const [email, setEmail] = useState<string>(user?.email || "");

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  // Hàm xử lý sự kiện khi người dùng chọn ảnh đại diện mới
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file); // Lưu file ảnh vào state

    // Hiển thị preview ảnh tạm thời
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
  };

  const { loading, postData: updateData } = usePost<EmployeeProps>(
    "http://localhost:8080/api/v1/employee/upDateEmployee"
  );

  // Hàm xử lý sự kiện khi người dùng nhấn nút "Lưu"
  const handleUpdateProfile = async () => {
    // load ảnh lên cloudinary
    let uploadedImageUrl = "";
    if (avatarFile) {
      uploadedImageUrl = await uploadImageToCloudinary(avatarFile);
    }

    // Cập nhật thông tin người dùng
    const updatedUser = {
      employeeId: user?.employeeId,
      avatar: uploadedImageUrl || user?.avatar,
      employeeName: name || user?.employeeName,
      email: email || user?.email,
      phone: user?.phone,
      departmentId: user?.department.departmentId,
      role: user?.account.role,
    };

    console.log("updatedUser", updatedUser);

    const response = await updateData(updatedUser, { method: "PUT" });

    if (response) {
      setPopupMessage("Cập nhật thành công!");
      setPopupType("success");
      setIsPopupOpen(true);

      // Cập nhật thông tin người dùng trong localStorage
      const updatedUserData = {
        ...user,
        ...updatedUser,
      };
      localStorage.setItem("currentEmployee", JSON.stringify(updatedUserData));

      resetData();
    } else {
      setPopupMessage("Cập nhật thất bại!");
      setPopupType("error");
      setIsPopupOpen(true);
      resetData();
    }
  };

  if (!user) return null;

  // reset data
  const resetData = () => {
    setAvatarUrl(user.avatar);
    setName(user.employeeName);
    setEmail(user.email);
    setAvatarFile(null);
    setIsEditMode(false);
  };

  return (
    <div className={cx("profile-modal")}>
      <div className={cx("modal")}>
        <CloseModalButton
          onClick={() => {
            resetData();
            onClose();
          }}
        />

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
                onChange={handleAvatarChange}
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
            <button className={cx("cancel-btn")} onClick={resetData}>
              Huỷ
            </button>
            <button className={cx("update-btn")} onClick={handleUpdateProfile}>
              Lưu
            </button>
          </div>
        ) : (
          <div className={cx("profile-footer")}>
            <button
              className={cx("save-btn")}
              onClick={() => {
                setIsEditMode(true);
              }}
            >
              Cập nhật
            </button>
          </div>
        )}
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

export default Profile;

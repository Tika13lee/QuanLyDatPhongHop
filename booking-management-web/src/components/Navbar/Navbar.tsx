import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
import IconWrapper from "../icons/IconWrapper";
import { FaRegBell, MdSearch } from "../icons/icons";
import UserAvatarWithMenu from "../UserAvatar/UserAvatarWithMenu";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { login } from "../../features/authSlice";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleFocus = () => {
    setSearchOpen(true);
  };

  // Đóng modal search khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    data: rooms,
    loading,
    error,
  } = useFetch<any[]>(
    `http://localhost:8080/api/v1/room/searchRoomByName?roomName=${searchQuery}`
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Hủy bỏ timeout trước đó nếu có
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Tạo một timeout mới để trì hoãn việc gọi API
    const newTimer = setTimeout(() => {
      setSearchQuery(value);
    }, 1000);
    setDebounceTimer(newTimer);
  };

  const handleResultClick = (roomId: string) => {
    // Điều hướng đến trang chi tiết của phòng
    navigate(`room/detail/${roomId}`);
  };

  return (
    <div className={cx("navbar-container")}>
      <div className={cx("navbar")}>
        <div className={cx("brand")}>
          <p>TÊN CÔNG TY - THƯƠNG HIỆU</p>
        </div>

        <div className={cx("search-container")}>
          <div className={cx("search-bar")}>
            <input
              ref={inputRef}
              type="search"
              placeholder="Tìm kiếm nhanh theo tên phòng họp"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleFocus}
            />
            <button>
              <IconWrapper icon={MdSearch} size={20} color="#fff" />
            </button>
          </div>
          {searchOpen && (
            <div
              className={cx("search-popup")}
              ref={searchRef}
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className={cx("search-results")}>
                {loading ? (
                  <p>Đang tìm kiếm...</p>
                ) : error ? (
                  <p>Lỗi khi tìm kiếm</p>
                ) : rooms && rooms.length > 0 ? (
                  rooms.map((room, index) => (
                    <div
                      key={index}
                      className={cx("result-item")}
                      onClick={() => handleResultClick(room.roomId)}
                    >
                      {room.roomName}
                    </div>
                  ))
                ) : (
                  <p className={cx("no-results")}>Không tìm thấy kết quả</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={cx("user")}>
          <IconWrapper icon={FaRegBell} size={20} color="#000" />
          <div className={cx("divider")} />
          <UserAvatarWithMenu imgUrl="https://i.pravatar.cc/300" />
          {/* {isLoggedIn ? (
            <UserAvatarWithMenu imgUrl="https://i.pravatar.cc/300" />
          ) : (
            <button
              className={cx("login-btn")}
              onClick={() => dispatch(login())}
            >
              Login
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

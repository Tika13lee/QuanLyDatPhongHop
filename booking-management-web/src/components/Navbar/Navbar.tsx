import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
import IconWrapper from "../icons/IconWrapper";
import { FaRegBell, MdSearch } from "../icons/icons";
import UserAvatarWithMenu from "../UserAvatar/UserAvatarWithMenu";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { login } from "../../features/authSlice";

const cx = classNames.bind(styles);

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                {results.length > 0 ? (
                  results.map((result, index) => (
                    <div key={index} className={cx("result-item")}>
                      {result}
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

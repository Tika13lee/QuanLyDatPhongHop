import classNames from "classnames/bind";
import styles from "./Booking.module.scss";
import CardRoom from "../../../components/cardRoom/CardRoom";
import { useState } from "react";
import IconWrapper from "../../../components/icons/IconWrapper";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  MdArrowForward,
  MdDeselect,
} from "../../../components/icons/icons";
import { rooms } from "../../../data/data";

const cx = classNames.bind(styles);

const branches = [
  "Chi nhánh 1",
  "Chi nhánh 2",
  "Chi nhánh 3",
  "Chi nhánh 4",
  "Chi nhánh 5",
  "Chi nhánh 6",
  "Chi nhánh 7",
  "Chi nhánh 8",
  "Chi nhánh 9",
  "Chi nhánh 10",
];

function Booking() {
  // hiển thị thêm chi nhánh
  const [showMoreBranches, setShowMoreBranches] = useState(false);

  // hiển thị tất cả phòng có sẵn
  const [showAll1, setShowAll1] = useState(false);
  const visibleRooms1 = showAll1
    ? rooms
    : rooms.slice(0, Math.min(4, rooms.length));

  const toggleBranches = () => {
    setShowMoreBranches((prev) => !prev);
  };

  // hiển thị tất cả phòng có sẵn
  const [showAll2, setShowAll2] = useState(false);
  const visibleRooms2 = showAll2
    ? rooms
    : rooms.slice(0, Math.min(4, rooms.length));


  return (
    <div className={cx("booking-container")}>
      <div className={cx("filter-room-container")}>
        <div className={cx("filter-room")}>
          <div className={cx("filter-room__header")}>
            <h3>Lọc phòng</h3>
            <div>
              <IconWrapper icon={MdDeselect} />
            </div>
          </div>

          {/* Loại phòng */}
          <div className={cx("filter-section")}>
            <h4>Loại phòng</h4>
            <div className={cx("filter-room__item")}>
              <label>
                <input type="checkbox" />
                Nhỏ
              </label>
              <label>
                <input type="checkbox" />
                Trung
              </label>
              <label>
                <input type="checkbox" />
                Lớn
              </label>
            </div>
          </div>

          {/* Sức chứa */}
          <div className={cx("filter-section")}>
            <h4>Sức chứa</h4>
            <div className={cx("filter-room__item")}>
              <label>
                <input type="checkbox" />
                Dưới 10 người
              </label>
              <label>
                <input type="checkbox" />
                10-20 người
              </label>
              <label>
                <input type="checkbox" />
                20-30 người
              </label>
              <label>
                <input type="checkbox" />
                30-50 người
              </label>
              <label>
                <input type="checkbox" />
                Trên 50 người
              </label>
            </div>
          </div>

          {/* Giá */}
          <div className={cx("filter-section")}>
            <h4>Giá</h4>
            <div className={cx("filter-room__item")}>
              <label>
                <input type="checkbox" />
                Dưới 1 triệu
              </label>
              <label>
                <input type="checkbox" />1 - 5 triệu
              </label>
              <label>
                <input type="checkbox" />
                Trên 5 triệu
              </label>
            </div>
          </div>

          {/* Vị trí */}
          <div className={cx("filter-section")}>
            <h4>Vị trí</h4>
            {branches
              .slice(0, showMoreBranches ? 10 : 5)
              .map((branch, index) => (
                <div key={index} className={cx("filter-room__item")}>
                  <label key={index}>
                    <input type="checkbox" />
                    {branch}
                  </label>
                </div>
              ))}
            <div className={cx("filter-room__item")}>
              <button className={cx("view-more-btn")} onClick={toggleBranches}>
                {showMoreBranches ? "Ẩn bớt" : "Xem thêm"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách phòng */}
      <div className={cx("room-list")}>
        <div className={cx("search-container")}>
          <p>Tìm kiếm</p>
          <input type="text" placeholder="Tìm kiếm phòng theo tên" />
        </div>

        <div className={cx("room-list-content")}>
          <div className={cx("room-list-header")}>
            <h3>Danh sách phòng có sẵn</h3>
            <div
              className={cx("view-all")}
              onClick={() => setShowAll1(!showAll1)}
            >
              <p>{showAll1 ? "Thu gọn" : "Xem tất cả"}</p>
              <IconWrapper
                icon={showAll1 ? IoIosArrowDown : IoIosArrowForward}
                color={"#0056B3"}
              />
            </div>
          </div>
          <div className={cx("room-grid")}>
            <CardRoom rooms={visibleRooms1} />
          </div>


          <div className={cx("room-list-header")}>
            <h3>Danh sách phòng bạn đã từng đặt</h3>
            <div
              className={cx("view-all")}
              onClick={() => setShowAll2(!showAll2)}
            >
              <p>{showAll2 ? "Thu gọn" : "Xem tất cả"}</p>
              <IconWrapper
                icon={showAll2 ? IoIosArrowDown : IoIosArrowForward}
                color={"#0056B3"}
              />
            </div>
          </div>
          <div className={cx("room-grid")}>
            <CardRoom rooms={visibleRooms2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;

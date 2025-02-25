import classNames from "classnames/bind";
import styles from "./Room.module.scss";
import { useState } from "react";
import CreateRoom from "./CreateRoom";
import ListRoom from "./ListRoom";

const cx = classNames.bind(styles);

const Room = () => {
  const [activeTab, setActiveTab] = useState("list");

  const rooms = Array.from({ length: 20 }, (_, i) => ({
    id: `P00${i + 1}`,
    name: `Phòng họp ${String.fromCharCode(65 + (i % 5))}`,
    capacity: Math.floor(Math.random() * 30) + 10,
    status: ["Đang sử dụng", "Trống", "Bảo trì"][i % 3],
  }));

  return (
    <div className={cx("room-container")}>
      <div className={cx("tab-container")}>
        <div className={cx("tab-header")}>
          <div
            className={cx("tab-item", { active: activeTab === "list" })}
            onClick={() => setActiveTab("list")}
          >
            <p>Danh sách phòng họp</p>
          </div>
          <div
            className={cx("tab-item", { active: activeTab === "create" })}
            onClick={() => setActiveTab("create")}
          >
            <p>Tạo phòng họp</p>
          </div>
        </div>

        <div className={cx("divide")}></div>

        <div className={cx("tab-content")}>
          {activeTab === "list" && <ListRoom />}
          {activeTab === "create" && <CreateRoom />}
        </div>
      </div>
    </div>
  );
};

export default Room;

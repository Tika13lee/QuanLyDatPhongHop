import classNames from "classnames/bind";
import styles from "./Room.module.scss";
import { useState } from "react";
import CreateRoom from "./CreateRoom";
import ListRoom from "./ListRoom";

const cx = classNames.bind(styles);

const Room = () => {
  const [activeTab, setActiveTab] = useState("list");

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

import classNames from "classnames/bind";
import styles from "./WaitingList.module.scss";
import { useState } from "react";
import ApprovalList from "./ApprovalList";
import PaymentList from "./PaymentList";

const cx = classNames.bind(styles);

const WaitingList = () => {
  const [activeTab, setActiveTab] = useState("approval");

  return (
    <div className={cx("waiting-list-container")}>
      <div className={cx("tab-container")}>
        <div className={cx("tab-header")}>
          <div
            className={cx("tab-item", { active: activeTab === "approval" })}
            onClick={() => setActiveTab("approval")}
          >
            <p>Danh sách phê duyệt</p>
          </div>
          <div
            className={cx("tab-item", { active: activeTab === "payment" })}
            onClick={() => setActiveTab("payment")}
          >
            <p>Danh sách thanh toán</p>
          </div>
        </div>

        <div className={cx("divide")}></div>

        <div className={cx("tab-content")}>
          {activeTab === "approval" && <ApprovalList />}
          {activeTab === "payment" && <PaymentList />}
        </div>
      </div>
    </div>
  );
};

export default WaitingList;

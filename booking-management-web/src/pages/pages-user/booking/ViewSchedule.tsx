import classNames from "classnames/bind";
import styles from "./ViewSchedule.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import IconWrapper from "../../../components/icons/IconWrapper";
import { IoIosArrowBack } from "../../../components/icons/icons";
import { useEffect, useState } from "react";
import WeeklySchedule from "../../../components/Schedule/WeeklySchedule";
import MonthlySchedule from "../../../components/Schedule/MonthlySchedule";
import { useDispatch } from "react-redux";
import useFetch from "../../../hooks/useFetch";
import { setSelectedRoom } from "../../../features/roomSlice";

const cx = classNames.bind(styles);

const ViewSchedule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [view, setView] = useState<"week" | "month">("week");

  const { id } = useParams();
  const {
    data: roomDetail,
    loading,
    error,
  } = useFetch<any>(
    id ? `http://localhost:8080/api/v1/room/getRoomById?roomId=${id}` : ""
  );

  // lưu room vào Redux Store
  useEffect(() => {
    if (roomDetail) {
      dispatch(setSelectedRoom(roomDetail));
    }
  }, [roomDetail, dispatch]);

  console.log(roomDetail);

  // Hàm chuyển đổi view
  const toggleView = () => {
    setView(view === "week" ? "month" : "week");
  };

  return (
    <div className={cx("view-schedule")}>
      <div className={cx("header")}>
        <div className={cx("back-button")} onClick={() => navigate(-1)}>
          <IconWrapper icon={IoIosArrowBack} />
          <span>Quay lại</span>
        </div>

        <div className={cx("switch-container")}>
          <button
            className={cx("switch-btn", { active: view === "week" })}
            onClick={toggleView}
          >
            Tuần
          </button>
          <button
            className={cx("switch-btn", { active: view === "month" })}
            onClick={toggleView}
          >
            Tháng
          </button>
        </div>
      </div>

      <div className={cx("room-schedule-container")}>
        {view === "week" ? (
          <WeeklySchedule roomId={id} />
        ) : (
          <MonthlySchedule />
        )}
      </div>
    </div>
  );
};

export default ViewSchedule;

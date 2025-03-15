import classNames from "classnames/bind";
import styles from "./General.module.scss";
import { useEffect, useState } from "react";
import {
  BranchProps,
  ReservationDetailProps,
  RoomViewProps,
} from "../../../data/data";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import useFetch from "../../../hooks/useFetch";
import axios from "axios";

const cx = classNames.bind(styles);

// hàm tạo ds thời gian
const times = Array.from({ length: 23 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const minute = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

function General() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // lấy chi nhánh
  const {
    data: branchs,
    loading: branchsLoading,
    error: branchsError,
  } = useFetch<BranchProps[]>(
    "http://localhost:8080/api/v1/location/getAllBranch"
  );

  const [selectedBranch, setSelectedBranch] =
    useState<string>("TP. Hồ Chí Minh");

  const getStartOfDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0);
    return date.toISOString();
  };

  const getEndOfDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setUTCHours(23, 59, 59, 999);
    return date.toISOString();
  };

  // Fetch danh sách đặt phòng theo ngày của 1 chi nhánh
  const {
    data: rooms,
    loading,
    error,
  } = useFetch<RoomViewProps[]>(
    `http://localhost:8080/api/v1/room/getRoomOverView?branch=${selectedBranch}&dayStart=${getStartOfDay(
      selectedDate
    )}&dayEnd=${getEndOfDay(selectedDate)}`
  );

  // Hàm chuyển đổi ngày
  const changeDay = (direction: "previous" | "next") => {
    const currentDate = new Date(selectedDate);
    if (direction === "previous") {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  };

  return (
    <div className={cx("overview-container")}>
      <div className={cx("header-container")}>
        {/* Chọn chi nhánh */}
        <div className={cx("form-group")}>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            {branchs?.map((branch) => (
              <option key={branch.branchId}>{branch.branchName}</option>
            ))}
          </select>
        </div>

        {/* Chọn ngày */}
        <div className={cx("filterContainer")}>
          <input
            type="date"
            className={cx("datePicker")}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Nút điều hướng */}
        <div className={cx("actionButtons")}>
          <button
            onClick={() =>
              setSelectedDate(new Date().toISOString().split("T")[0])
            }
          >
            Hiện tại
          </button>
          <button onClick={() => changeDay("previous")}>Trở về</button>
          <button onClick={() => changeDay("next")}>Tiếp</button>
        </div>
      </div>

      {/* Bảng lịch */}
      <div className={cx("schedule-container")}>
        {loading ? (
          <p>Đang tải danh sách phòng...</p>
        ) : error ? (
          <p className={cx("error")}>{error.message}</p>
        ) : rooms && rooms.length > 0 ? (
          <table className={cx("schedule-table")}>
            <thead>
              <tr>
                <th className={cx("time-column")}>Thời gian</th>
                {rooms.map((room) => (
                  <th key={room.roomId}>{room.roomName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map((time) => (
                <tr key={time}>
                  {/* Cột hiển thị thời gian */}
                  <td className={cx("time-column")}>{time}</td>

                  {/* Duyệt qua từng phòng */}
                  {rooms.map((room) => {
                    // Tìm tất cả đặt phòng phù hợp với `time`
                    const reservations = room.reservationViewDTOS.filter(
                      (res) => {
                        const startTime = res.timeStart
                          .split("T")[1]
                          .substring(0, 5);
                        const endTime = res.timeEnd
                          .split("T")[1]
                          .substring(0, 5);

                        // Kiểm tra `time` có nằm trong khoảng đặt phòng không
                        return startTime <= time && time < endTime;
                      }
                    );
                    return (
                      <td
                        key={`${room.roomId}-${time}`}
                        className={cx({ booked: reservations.length > 0 })}
                      >
                        {/* Hiển thị tất cả đặt phòng trùng với `time` */}
                        {reservations.map((res) => (
                          <div>
                            <div key={res.reservationId}>{res.title}</div>
                            <div key={res.reservationId}>{res.nameBooker}</div>
                            <div key={res.reservationId}>
                              Trạng thái: {res.statusReservation}
                            </div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={cx("no-rooms")}>
            Không có phòng nào cho chi nhánh này.
          </p>
        )}
      </div>
    </div>
  );
}

export default General;

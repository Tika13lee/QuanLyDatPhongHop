import classNames from "classnames/bind";
import styles from "./Booking.module.scss";
import CardRoom from "../../../components/cardRoom/CardRoom";
import { useEffect, useState } from "react";
import IconWrapper from "../../../components/icons/IconWrapper";
import {
  IoIosArrowDown,
  IoIosArrowForward,
} from "../../../components/icons/icons";
import {
  BranchProps,
  EmployeeProps,
  LocationProps,
  RoomProps,
} from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import axios from "axios";
import DatePicker from "react-datepicker";

const cx = classNames.bind(styles);

// Tạo danh sách giờ từ 08:00 đến 17:00, mỗi bước 30 phút
const generateTimeSlots = () => {
  const times = [];
  for (let hour = 8; hour < 17; hour++) {
    times.push(`${hour}:00`, `${hour}:30`);
  }
  times.push("17:00");
  return times;
};

const timeSlots = generateTimeSlots();
const durationOptions = [30, 60, 90, 120, 150, 180, 210, 240];

function Booking() {
  const [empPhone, setEmpPhone] = useState<string>("0914653334");
  const { data, loading, error } = useFetch<EmployeeProps>(
    `http://localhost:8080/api/v1/employee/getEmployeeByPhone?phone=${empPhone}`
  );
  localStorage.setItem("currentEmployee", JSON.stringify(data));

  const [locID, setLocID] = useState<number | undefined>(undefined);
  const [roomsData, setRoomsData] = useState<RoomProps[] | null>(null);
  const [roomsUseData, setRoomsUseData] = useState<RoomProps[] | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [startTime, setStartTime] = useState(timeSlots[0]);
  const [duration, setDuration] = useState(30);
  const [capacity, setCapacity] = useState<number>(1);

  // Lấy danh sách chi nhánh
  const { data: branches } = useFetch<BranchProps[]>(
    "http://localhost:8080/api/v1/location/getAllBranch"
  );

  // Chỉ cập nhật locID khi data thay đổi
  useEffect(() => {
    if (data) {
      setLocID(data.department.location.locationId);
    }
  }, [data]);

  // Gọi API khi locID thay đổi
  useEffect(() => {
    if (!locID) return;

    axios
      .get<RoomProps[]>(
        `http://localhost:8080/api/v1/room/getRoomsByBranch?locationId=${locID}`
      )
      .then((response) => {
        setRoomsData(response.data);
      });
  }, [locID]);

  // Gọi API khi empPhone thay đổi
  useEffect(() => {
    if (!empPhone) return;

    axios
      .get<RoomProps[]>(
        `http://localhost:8080/api/v1/room/getRoomByEmployee?phone=${empPhone}`
      )
      .then((response) => {
        setRoomsUseData(response.data);
      });
  }, [empPhone]);

  // hiển thị tất cả phòng có sẵn
  const [showAll1, setShowAll1] = useState(false);
  const visibleRooms1 = showAll1
    ? roomsData
    : roomsData?.slice(0, Math.min(5, roomsData.length));

  // hiển thị tất cả phòng đã đặt
  const [showAll2, setShowAll2] = useState(false);
  const visibleRooms2 = showAll2
    ? roomsUseData
    : roomsUseData?.slice(0, Math.min(5, roomsUseData.length));

  return (
    <div className={cx("booking-container")}>
      <div className={cx("booking-header")}>
        <div className={cx("search")}>
          <label>Tìm kiếm theo tên phòng</label>
          <div>
            <input
              type="text"
              placeholder="Nhập tên phòng"
            />
          </div>
        </div>
        <div className={cx("filters")}>
          {/* Chọn chi nhánh */}
          <div className={cx("filter-item")}>
            <label>Chi nhánh</label>
            <select>
              {branches?.map((branch) => (
                <option key={branch.branchId} value={branch.branchId}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn ngày */}
          <div className={cx("filter-item")}>
            <label>Ngày</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Dropdown chọn giờ bắt đầu */}
          <div className={cx("filter-item")}>
            <label>Giờ bắt đầu</label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown chọn thời gian họp */}
          <div className={cx("filter-item")}>
            <label>Thời gian họp</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              {durationOptions.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} phút
                </option>
              ))}
            </select>
          </div>

          {/* sức chứa */}
          <div className={cx("filter-item")}>
            <label>Sức chứa</label>
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              placeholder="Nhập số người"
            />
          </div>

          {/* Nút tìm kiếm */}
          <div>
            <button className={cx("search-button")}>Tìm phòng</button>
          </div>
        </div>
      </div>

      {/* Danh sách phòng */}
      <div className={cx("room-list")}>
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
            <CardRoom rooms={visibleRooms1 ?? []} />
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
            <CardRoom rooms={visibleRooms2 ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;

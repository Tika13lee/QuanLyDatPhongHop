import classNames from "classnames/bind";
import styles from "./Booking.module.scss";
import CardRoom from "../../../components/cardRoom/CardRoom";
import { useEffect, useState } from "react";
import IconWrapper from "../../../components/icons/IconWrapper";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  MdArrowForward,
  MdDeselect,
} from "../../../components/icons/icons";
import {
  EmployeeProps,
  LocationProps,
  RoomProps,
  rooms,
} from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { set } from "react-datepicker/dist/date_utils";

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

  const [empPhone, setEmpPhone] = useState<string>("0914653334");
  const { data, loading, error } = useFetch<EmployeeProps>(
    `http://localhost:8080/api/v1/employee/getEmployeeByPhone?phone=${empPhone}`
  );
  const [locID, setLocID] = useState<number | undefined>(undefined);
  const [roomsData, setRoomsData] = useState<RoomProps[] | null>(null);
  const [roomLoading, setRoomLoading] = useState<boolean>(false);
  const [roomError, setRoomError] = useState<Error | null>(null);
  const [roomsUseData, setRoomsUseData] = useState<RoomProps[] | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const [minCapacity, setMinCapacity] = useState<string>();
  const [maxCapacity, setMaxCapacity] = useState<string>();
  const [minPrice, setMinPrice] = useState<string>();
  const [maxPrice, setMaxPrice] = useState<string>();

  const {
    data: locations,
    loading: locationsLoading,
    error: locationsError,
  } = useFetch<LocationProps[]>(
    "http://localhost:8080/api/v1/location/getAllLocation"
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

    setRoomLoading(true);
    setRoomError(null);

    axios
      .get<RoomProps[]>(
        `http://localhost:8080/api/v1/room/getRoomsByBranch?locationId=${locID}`
      )
      .then((response) => {
        setRoomsData(response.data);
      })
      .catch((error) => {
        setRoomError(error);
      })
      .finally(() => {
        setRoomLoading(false);
      });
  }, [locID]);

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
    : roomsData?.slice(0, Math.min(4, roomsData.length));

  const toggleBranches = () => {
    setShowMoreBranches((prev) => !prev);
  };

  // hiển thị tất cả phòng có sẵn
  const [showAll2, setShowAll2] = useState(false);
  const visibleRooms2 = showAll2
    ? roomsUseData
    : roomsUseData?.slice(0, Math.min(4, roomsUseData.length));

  // loại bỏ các phòng trùng lặp
  const uniqueLocations = locations
    ? locations.filter(
        (loc, index, self) =>
          index === self.findIndex((l) => l.branch === loc.branch)
      )
    : [];

  // xử lý khi thay đổi checkbox
  const handleCheckboxChange = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  console.log("selectedFilters", selectedFilters);

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
                <input
                  type="checkbox"
                  value="DEFAULT"
                  checked={selectedFilters.includes("DEFAULT")}
                  onChange={(e) => handleCheckboxChange(e.target.value)}
                />
                Phòng mặc định
              </label>
              <label>
                <input
                  type="checkbox"
                  value={"VIP"}
                  checked={selectedFilters.includes("VIP")}
                  onChange={(e) => handleCheckboxChange(e.target.value)}
                />
                Phòng VIP
              </label>
              <label>
                <input type="checkbox" 
                value={"CONFERENCE"}
                checked={selectedFilters.includes("CONFERENCE")}
                onChange={(e) => handleCheckboxChange(e.target.value)}
                />
                Phòng hội nghị
              </label>
            </div>
          </div>

          {/* Sức chứa */}
          <div className={cx("filter-section")}>
            <h4>Sức chứa</h4>
            <div className={cx("filter-room__item")}>
              <label>
                <input type="checkbox" 
                value={0}
                onChange={(e) => {
                  if (e.target.checked && minCapacity === "30") {
                    setMinCapacity(e.target.value);
                    setMaxCapacity("10");
                  }
                }}
                />
                Dưới 10 người
              </label>
              <label>
                <input type="checkbox" 
                onChange={(e) => {
                  if (e.target.checked && maxCapacity === "10" ) {
                    setMinCapacity("0");
                    setMaxCapacity("30");
                  } else if (e.target.checked && minCapacity === "30") {
                    setMinCapacity("10");
                    setMaxCapacity("30");
                  }
                }}
                />
                Từ 10-30 người
              </label>
              <label>
                <input type="checkbox" />
                Trên 30 người
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
            <div className={cx("filter-room__item")}>
              {uniqueLocations?.map((location) => (
                <label key={location.locationId}>
                  <input
                    type="checkbox"
                    value={location.branch}
                    onChange={(e) => handleCheckboxChange(e.target.value)}
                  />
                  {location.branch}
                </label>
              ))}
            </div>
            {/* <div className={cx("filter-room__item")}>
              <button className={cx("view-more-btn")} onClick={toggleBranches}>
                {showMoreBranches ? "Ẩn bớt" : "Xem thêm"}
              </button>
            </div> */}
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

import classNames from "classnames/bind";
import styles from "./BookingSearch.module.scss";
import CardRoom from "../../../components/cardRoom/CardRoom";
import { useEffect, useState } from "react";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdSearch } from "../../../components/icons/icons";
import { BranchProps, EmployeeProps, RoomProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import { generateStartTime, generateStartTime2 } from "../../../utilities";
import DatePicker from "react-datepicker";

const cx = classNames.bind(styles);

const durationOptions = [30, 60, 90, 120, 150, 180, 210, 240];

type DataSearch = {
  branch: string;
  date: string;
  timeStart: string;
  timeEnd: string;
};

function BookingSearch() {
  // lưu emp hiện tại vào localStorage
  const [empPhone, setEmpPhone] = useState<string>("0914653334");
  const { data, loading, error } = useFetch<EmployeeProps>(
    `http://localhost:8080/api/v1/employee/getEmployeeByPhone?phone=${empPhone}`
  );
  console.log(data);
  useEffect(() => {
    if (data) {
      localStorage.setItem("currentEmployee", JSON.stringify(data));
    }
  }, [data]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const { filteredTimes, adjustedDate } = generateStartTime2(selectedDate);
  const [startTime, setStartTime] = useState(filteredTimes[0]);
  const [duration, setDuration] = useState(30);
  const [capacity, setCapacity] = useState<number>(1);
  const [branchName, setBranchName] = useState<string>("TP. Hồ Chí Minh");
  const [filterData, setFilterData] = useState<RoomProps[] | null>(null);
  const [searchName, setSearchName] = useState<string>("");

  // Lấy danh sách chi nhánh
  const { data: branches } = useFetch<BranchProps[]>(
    "http://localhost:8080/api/v1/location/getAllBranch"
  );

  // Hàm tính toán thời gian kết thúc
  const calculateEndTime = (
    startTime: string,
    duration: number,
    selectedDate: string
  ) => {
    const startDate = new Date(`${selectedDate}T${startTime}`);

    startDate.setMinutes(startDate.getMinutes() + duration);

    const endHour = startDate.getHours().toString().padStart(2, "0");
    const endMinute = startDate.getMinutes().toString().padStart(2, "0");

    return `${endHour}:${endMinute}`;
  };

  // lấy duration còn lại
  const getAvailableDurations = (
    startTime: string,
    endTime: string = "18:00"
  ): number[] => {
    const getMinutesFromHHMM = (hhmm: string): number => {
      const [hours, minutes] = hhmm.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = getMinutesFromHHMM(startTime);
    const endMinutes = getMinutesFromHHMM(endTime);
    const maxDuration = endMinutes - startMinutes;

    // Lọc các duration còn phù hợp
    return durationOptions.filter((duration) => duration <= maxDuration);
  };

  // dữ liệu tìm kiếm
  const [dataSearch, setDataSearch] = useState<DataSearch>({
    branch: branchName,
    date: adjustedDate,
    timeStart: "",
    timeEnd: "",
  });

  // xử lý filter
  const handleFilter = () => {
    if (!startTime) return;

    const [hour, minute] = startTime.split(":");
    const normalizedStartTime = `${hour.padStart(2, "0")}:${minute}`;
    const endTime = calculateEndTime(
      normalizedStartTime,
      duration,
      adjustedDate
    );
    const timeStart = new Date(
      `${adjustedDate}T${normalizedStartTime}`
    ).toISOString();

    const timeEnd = new Date(`${adjustedDate}T${endTime}`).toISOString();

    console.log(
      branchName,
      new Date(adjustedDate).toISOString(),
      timeStart,
      timeEnd,
      capacity
    );

    fetch(
      `http://localhost:8080/api/v1/room/searchRoomByAttribute?capacity=${capacity}&timeStart=${timeStart}&timeEnd=${timeEnd}&branch=${branchName}`
    )
      .then((response) => response.json())
      .then((data) => {
        setFilterData(data);
        setDataSearch({
          branch: branchName,
          date: adjustedDate,
          timeStart: startTime,
          timeEnd: endTime,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Lọc dữ liệu theo tên phòng
  useEffect(() => {
    const trimmedSearch = searchName.trim();
    const delayDebounce = setTimeout(() => {
      if (trimmedSearch !== "") {
        fetch(
          `http://localhost:8080/api/v1/room/searchRoomByName?roomName=${encodeURIComponent(
            trimmedSearch
          )}`
        )
          .then((response) => response.json())
          .then((data) => {
            setFilterData(data);
          })
          .catch((error) => {
            console.error("Error searching room by name:", error);
          });
      } else {
        handleFilter();
        console.log(1);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchName]);

  return (
    <div className={cx("Search-container")}>
      <div className={cx("booking-header")}>
        {/* room name */}
        <div className={cx("search-room")}>
          <label>Tìm kiếm phòng theo tên</label>
          <div className={cx("search-box")}>
            <input
              type="text"
              placeholder="Nhập tên phòng"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <button>
              <IconWrapper icon={MdSearch} color="#fff" size={24} />
            </button>
          </div>
        </div>
        <div className={cx("filters")}>
          {/* Chọn chi nhánh */}
          <div className={cx("filter-item")}>
            <label>Chi nhánh</label>
            <select
              name="branch"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
            >
              {branches?.map((branch) => (
                <option key={branch.branchId} value={branch.branchName}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn ngày */}
          <div className={cx("filter-item")}>
            <label>Ngày</label>
            <DatePicker
              selected={adjustedDate ? new Date(adjustedDate) : null}
              onChange={(date) => {
                if (date) {
                  setSelectedDate(date.toISOString().split("T")[0]);
                  const startTimeOptions = generateStartTime2(
                    date.toISOString().split("T")[0]
                  );
                  if (startTimeOptions.filteredTimes.length > 0) {
                    setStartTime(startTimeOptions.filteredTimes[0]);
                  } else {
                    setStartTime("");
                  }
                }
              }}
              minDate={new Date()}
              dateFormat="dd / MM / yyyy"
            />
          </div>

          {/* Dropdown chọn giờ bắt đầu */}
          <div className={cx("filter-item")}>
            <label>Giờ bắt đầu</label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            >
              {filteredTimes.length > 0 &&
                filteredTimes
                  .filter((time) => time <= "17:30")
                  .map((time) => (
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
              {getAvailableDurations(startTime).map((minutes) => (
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
            <button className={cx("search-button")} onClick={handleFilter}>
              Tìm phòng
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách phòng */}
      <div className={cx("room-list")}>
        <div className={cx("room-list-content")}>
          {filterData && filterData.length > 0 ? (
            <div className={cx("")}>
              <div className={cx("room-list-header")}>
                <h3>Danh sách phòng phù hợp</h3>
              </div>
              <div className={cx("room-grid")}>
                <CardRoom rooms={filterData ?? []} dataSearch={dataSearch} />
              </div>
            </div>
          ) : (
            <div className={cx("room-list-header")}>
              <h3>Không có phòng nào phù hợp với yêu cầu của bạn</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingSearch;

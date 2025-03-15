import classNames from "classnames/bind";
import styles from "./ListRoom.module.scss";
import { BranchProps, RoomProps2 } from "../../../data/data";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import useFetch from "../../../hooks/useFetch";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function ListRoom() {
  const [rooms, setRooms] = useState<RoomProps2[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const pageSize = 9;
  const [searchQuery, setSearchQuery] = useState("");
  // Thời gian trễ gọi API (Debouncing)
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [formData, setFormData] = useState({
    roomName: "",
    location: "",
    capacity: "",
    price: "",
    statusRoom: "",
  });

  // lấy dữ liệu lọc từ form tìm kiếm
  const [filters, setFilters] = useState({
    branch: "",
    capacity: "",
    price: "",
    statusRoom: "",
  });

  // Lấy danh sách chi nhánh
  const {
    data: branchs,
    loading: branchsLoading,
    error: branchsError,
  } = useFetch<BranchProps[]>(
    "http://localhost:8080/api/v1/location/getAllBranch"
  );

  useEffect(() => {
    fetchRooms(page);
  }, []);

  // Gọi API lấy danh sách phòng
  const fetchRooms = async (pageNumber: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/room/getAllRooms?page=${
          pageNumber - 1
        }&size=${pageSize}`
      );
      setRooms(response.data.roomDTOS);
      setTotalPage(response.data.totalPage);
      setPage(pageNumber);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phòng:", error);
    }
  };

  // Gọi API khi tìm kiếm
  const handleSearch = async () => {
    try {
      const searchParams = new URLSearchParams();

      // Thêm các tham số nếu chúng có giá trị
      if (filters.capacity) searchParams.append("capacity", filters.capacity);
      if (filters.statusRoom)
        searchParams.append("statusRoom", filters.statusRoom);
      if (filters.price) searchParams.append("price", filters.price);
      if (filters.branch) searchParams.append("branch", filters.branch);

      const searchUrl = `http://localhost:8080/api/v1/room/searchRooms?${searchParams.toString()}`;

      const response = await axios.get(searchUrl);
      setRooms(response.data.roomDTOS);
      setTotalPage(response.data.totalPage);
      setPage(1);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm phòng:", error);
    }
  };

  // Hàm gọi API tìm kiếm phòng theo tên
  const fetchRoomsByName = async (query: string) => {
    try {
      const searchUrl = `http://localhost:8080/api/v1/room/searchRoomByName?roomName=${query}`;
      const response = await axios.get(searchUrl);
      setRooms(response.data);
      console.log(response.data);
      setTotalPage(response.data.totalPage);
      setPage(1); 
    } catch (error) {
      console.error("Lỗi khi tìm kiếm phòng theo tên:", error);
    }
  };

  // Hàm xử lý thay đổi trong input tìm kiếm
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      if (query) {
        fetchRoomsByName(query);
      } else {
        fetchRooms(1);
      }
    }, 500);
    setDebounceTimeout(newTimeout);
  };

  return (
    <div className={cx("list-container")}>
      {/* khung tìm kiếm */}
      <div className={cx("search-container")}>
        <div className={cx("advanced-search")}>
          <div className={cx("form-row")}>
            <div className={cx("form-search")}>
              <input
                type="text"
                placeholder="Tìm kiếm phòng theo tên"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
            <div className={cx("devide")}></div>
            <div className={cx("form-search")}>
              <select
                value={filters.branch}
                onChange={(e) => {
                  setFilters({ ...filters, branch: e.target.value });
                }}
              >
                <option value="">Chọn chi nhánh</option>
                {Array.isArray(branchs) &&
                  branchs.map((branch, index) => (
                    <option key={index} value={branch.branchName}>
                      {branch.branchName}
                    </option>
                  ))}
              </select>
            </div>

            <div className={cx("form-search")}>
              <input
                type="number"
                placeholder="Nhập sức chứa..."
                value={filters.capacity}
                onChange={(e) => {
                  setFilters({ ...filters, capacity: e.target.value });
                }}
              />
            </div>

            <div className={cx("form-search")}>
              <input
                type="number"
                placeholder="Nhập giá..."
                value={filters.price}
                onChange={(e) => {
                  setFilters({ ...filters, price: e.target.value });
                }}
              />
            </div>

            <div className={cx("form-search")}>
              <select
                value={filters.statusRoom}
                onChange={(e) => {
                  setFilters({ ...filters, statusRoom: e.target.value });
                }}
              >
                <option value="AVAILABLE">Phòng có sẵn</option>
                <option value="MAINTAIN">Phòng đang bảo trì</option>
                <option value="REPAIR">Phòng đang sửa chữa</option>
              </select>
            </div>

            <button className={cx("search-btn")} onClick={() => handleSearch()}>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
      {/* danh sách phòng họp */}
      <div className={cx("table-wrapper")}>
        <table className={cx("room-table")}>
          <thead>
            <tr>
              <th>Tên phòng</th>
              <th>Vị trí</th>
              <th>Sức chứa</th>
              <th>Giá đang áp dụng</th>
              <th>Người phê duyệt</th>
              <th>Xem chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(rooms) && rooms.length > 0 ? (
              rooms.map((room, index) => (
                <tr key={index}>
                  <td>{room.roomName}</td>
                  <td>
                    {room.location
                      ? `${room.location.branch}, ${room.location.building}, tầng ${room.location.floor}`
                      : "Không có thông tin vị trí"}
                  </td>
                  <td>{room.capacity}</td>
                  <td>${room.price}</td>
                  <td>
                    {Array.isArray(room.approvers) && room.approvers.length > 0
                      ? room.approvers.map((approver) => (
                          <span key={approver.id}>{approver.name}, </span>
                        ))
                      : "Không có người phê duyệt"}
                  </td>
                  <td className={cx("icon-info")}>
                    <Link to={`/admin/room/detail/${room.roomId}`}>
                      <IconWrapper icon={MdOutlineInfo} color="#0670C7" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Nút chuyển trang */}
      <div className={cx("pagination")}>
        {/* Nút "Trước" */}
        <button
          className={cx("page-btn")}
          onClick={() => {
            setPage((prev) => {
              const newPage = Math.max(prev - 1, 1);
              fetchRooms(newPage);
              return newPage;
            });
          }}
          disabled={page === 1}
        >
          {"<"} Trước
        </button>

        {/* Các nút trang */}
        {[...Array(totalPage)].map((_, index) => (
          <button
            key={index}
            className={cx("page-btn", { active: page === index + 1 })}
            onClick={() => {
              const newPage = index + 1;
              setPage(newPage);
              fetchRooms(newPage);
            }}
          >
            {index + 1}
          </button>
        ))}

        {/* Nút "Sau" */}
        <button
          className={cx("page-btn")}
          onClick={() => {
            setPage((prev) => {
              const newPage = Math.min(prev + 1, totalPage);
              fetchRooms(newPage);
              return newPage;
            });
          }}
          disabled={page >= totalPage || totalPage === 1}
        >
          Sau {">"}
        </button>
      </div>
    </div>
  );
}

export default ListRoom;

import classNames from "classnames/bind";
import styles from "./ListRoom.module.scss";
import { RoomProps, rooms, statusesRoom } from "../../../data/data";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { useRef, useState } from "react";
import useFetch from "../../../hooks/useFetch";

const cx = classNames.bind(styles);

function ListRoom() {
  // Lấy dữ liệu locations từ Redux Store
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state: RootState) => state.location);

  const [filters, setFilters] = useState({
    // branch: "",
    capacity: "",
    price: "",
    statusRoom: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 7;
  const [searching, setSearching] = useState(false);

  const { data, error, loading } = useFetch<RoomProps[]>(
    searching
      ? `http://localhost:8080/api/v1/room/sreachRooms?capacity=${filters.capacity}&statusRoom=${filters.statusRoom}&price=${filters.price}&page=${page}&size=${pageSize}`
      : `http://localhost:8080/api/v1/room/getAllRooms?page=${page}&size=${pageSize}`
  );

  console.log("data", data);

  const handleSearch = () => {
    setSearching(true);
    setPage(1);
  };

  return (
    <div className={cx("list-container")}>
      {/* khung tìm kiếm */}
      <div className={cx("search-container")}>
        <div className={cx("advanced-search")}>
          <h3>Tìm kiếm nâng cao (theo nhiều chỉ tiêu)</h3>

          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label>Chi nhánh:</label>
              <select>
                <option value="">Chọn chi nhánh</option>
                {[
                  ...new Set(
                    locations?.map((location) => location.branch) || []
                  ),
                ].map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div className={cx("form-group")}>
              <label>Sức chứa:</label>
              <input
                type="number"
                placeholder="Nhập sức chứa..."
                value={filters.capacity}
                onChange={(e) => {
                  setFilters({ ...filters, capacity: e.target.value });
                }}
              />
            </div>

            <div className={cx("form-group")}>
              <label>Giá:</label>
              <input
                type="number"
                placeholder="Nhập giá..."
                value={filters.price}
                onChange={(e) => {
                  setFilters({ ...filters, price: e.target.value });
                }}
              />
            </div>

            <div className={cx("form-group")}>
              <label>Trạng thái:</label>
              <select
                value={filters.statusRoom}
                onChange={(e) =>
                  setFilters({ ...filters, statusRoom: e.target.value })
                }
              >
                <option value="">Chọn trạng thái...</option>
                {statusesRoom.map((status, index) => (
                  <option key={index} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={cx("btn-row")}>
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
            {Array.isArray(data) && data.length > 0 ? (
              data.map((room, index) => (
                <tr key={index}>
                  <td>{room.roomName}</td>
                  <td>
                    {room.location
                      ? `${room.location.branch}, ${room.location.building}, tầng ${room.location.floor}, phòng ${room.location.number}`
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
                    <Link to={`detail/${room.id}`}>
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
        <button
          className={cx("page-btn")}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          {"<"} Trước
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={cx("page-btn", { active: page === index + 1 })}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className={cx("page-btn")}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Sau {">"}
        </button>
      </div>
    </div>
  );
}

export default ListRoom;

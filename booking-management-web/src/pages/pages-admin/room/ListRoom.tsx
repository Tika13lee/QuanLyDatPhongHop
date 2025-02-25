import classNames from "classnames/bind";
import styles from "./ListRoom.module.scss";

const cx = classNames.bind(styles);

const rooms = Array.from({ length: 20 }, (_, i) => ({
  id: `P00${i + 1}`,
  name: `Phòng họp ${String.fromCharCode(65 + (i % 5))}`,
  capacity: Math.floor(Math.random() * 30) + 10,
  status: ["Đang sử dụng", "Trống", "Bảo trì"][i % 3],
}));

const locations = [
  "Hà Nội - Tòa A - 3 - P301",
  "HCM - Tòa B - 5 - P502",
  "Đà Nẵng - Tòa C - 2 - P203",
];
const statuses = ["Trống", "Đang sử dụng", "Bảo trì"];
const approvers = ["Nguyễn Văn A", "Trần Thị B", "Lê Minh C"];

function ListRoom() {
  return (
    <div className={cx("list-container")}>
      <div className={cx("search-container")}>
        {/* Thanh tìm kiếm nhanh */}
        <div className={cx("search-bar")}>
          <h3>Tìm Kiếm Phòng Họp</h3>
          <input type="text" placeholder="🔍 Nhập tên phòng..." />
          <button>Tìm kiếm</button>
        </div>

        {/* Tìm kiếm nâng cao */}
        <div className={cx("advanced-search")}>
          <h3>Tìm kiếm nâng cao</h3>

          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label>Vị trí:</label>
              <select>
                <option value="">Chọn vị trí...</option>
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className={cx("form-group")}>
              <label>Sức chứa:</label>
              <input type="number" placeholder="Nhập sức chứa..." />
            </div>

            <div className={cx("form-group")}>
              <label>Giá:</label>
              <input type="number" placeholder="Nhập giá..." />
            </div>

            <div className={cx("form-group")}>
              <label>Trạng thái:</label>
              <select>
                <option value="">Chọn trạng thái...</option>
                {statuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className={cx("form-group")}>
              <label>Người phê duyệt:</label>
              <select>
                <option value="">Chọn người phê duyệt...</option>
                {approvers.map((person, index) => (
                  <option key={index} value={person}>
                    {person}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={cx("btn-row")}>
            <button className={cx("search-btn")}>🔍 Đặt lại</button>
            {/* <button className={cx("search-btn")}>🔍 Tìm kiếm</button> */}
          </div>
        </div>
      </div>

      <div className={cx("table-wrapper")}>
        <table className={cx("room-table")}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên</th>
              <th>Sức chứa</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.name}</td>
                <td>{room.capacity}</td>
                <td
                  className={cx(
                    `status-${room.status.replace(" ", "-").toLowerCase()}`
                  )}
                >
                  {room.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListRoom;

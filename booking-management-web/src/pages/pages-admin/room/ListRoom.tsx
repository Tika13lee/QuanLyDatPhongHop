import classNames from "classnames/bind";
import styles from "./ListRoom.module.scss";
import { locations, rooms, statusesRoom } from "../../../data/data";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";
import { Link, useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const approvers = ["Nguyễn Văn A", "Trần Thị B", "Lê Minh C"];

function ListRoom() {

  return (
    <div className={cx("list-container")}>
      <div className={cx("search-container")}>
        {/* Thanh tìm kiếm nhanh */}
        <div className={cx("search-bar")}>
          <h3>Tìm Kiếm Phòng Họp</h3>
          <input type="text" placeholder="Tìm kiếm nhanh theo tên..." />
          <button>Tìm kiếm</button>
        </div>

        {/* Tìm kiếm nâng cao */}
        <div className={cx("advanced-search")}>
          <h3>Tìm kiếm nâng cao (theo nhiều chỉ tiêu)</h3>

          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label>Vị trí:</label>
              <select>
                <option value="">Chọn vị trí...</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.branch} - {loc.building} - Floor {loc.floor} - Room{" "}
                    {loc.number}
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
                {statusesRoom.map((status, index) => (
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
            <button className={cx("search-btn")}>Đặt lại</button>
          </div>
        </div>
      </div>

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
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>
                  {room.location.branch}, {room.location.building}, Floor{" "}
                  {room.location.floor}, Room {room.location.number}
                </td>
                <td>{room.capacity}</td>
                <td>${room.price}</td>
                <td>
                  {room.approver.map((approver) => (
                    <span key={approver.id}>{approver.name}, </span>
                  ))}
                </td>
                <td className={cx("icon-info")}>
                  <Link to={`detail/${room.id}`}>
                    <IconWrapper icon={MdOutlineInfo} color="#0670C7" />
                  </Link>
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

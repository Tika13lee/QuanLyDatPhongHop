import classNames from "classnames/bind";
import styles from "./CreateRoom.module.scss";
import { MdSearch } from "../../../components/icons/icons";
import IconWrapper from "../../../components/icons/IconWrapper";

const cx = classNames.bind(styles);

const locations = [
  { branch: "Hà Nội", building: "Tòa A", floor: "3", number: "P301" },
  { branch: "HCM", building: "Tòa B", floor: "5", number: "P502" },
  { branch: "Đà Nẵng", building: "Tòa C", floor: "2", number: "P203" },
  { branch: "Đà Nẵng", building: "Tòa C", floor: "2", number: "P203" },
  { branch: "Đà Nẵng", building: "Tòa C", floor: "2", number: "P203" },
  { branch: "Đà Nẵng", building: "Tòa C", floor: "2", number: "P203" },
  { branch: "Đà Nẵng", building: "Tòa C", floor: "2", number: "P203" },
  { branch: "Đà Nẵng", building: "Tòa C", floor: "2", number: "P203" },
  { branch: "Đà Nẵng", building: "Tòa C", floor: "2", number: "P203" },
  { branch: "Đà Nẵng", building: "Tòa C", floor: "2", number: "P203" },
];

const roomTypes = ["Phòng họp nhỏ", "Phòng họp lớn", "Phòng hội thảo"];
const statuses = ["Trống", "Đang sử dụng", "Bảo trì"];
const approvers = ["Nguyễn Văn A", "Trần Thị B", "Lê Minh C"];
const devices = ["Máy chiếu", "Tivi", "Bảng trắng", "Hệ thống âm thanh"];

const CreateRoom = () => {
  return (
    <div className={cx("create-container")}>
      <div className={cx("location-container")}>
        <div className={cx("location-form-container")}>
          <h2>Tạo Vị Trí Phòng Họp</h2>
          <form className={cx("form")}>
            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label>Chi nhánh:</label>
                <input
                  type="text"
                  name="branch"
                  placeholder="Nhập chi nhánh..."
                />
              </div>
              <div className={cx("form-group")}>
                <label>Tòa nhà:</label>
                <input
                  type="text"
                  name="building"
                  placeholder="Nhập tòa nhà..."
                />
              </div>
            </div>

            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label>Tầng:</label>
                <input type="text" name="floor" placeholder="Nhập tầng..." />
              </div>
              <div className={cx("form-group")}>
                <label>Số phòng:</label>
                <input
                  type="text"
                  name="number"
                  placeholder="Nhập số phòng..."
                />
              </div>
            </div>

            <div className={cx("btn-row")}>
              <button type="button" className={cx("submit-btn")}>
                Tạo vị trí
              </button>
              <button type="button" className={cx("submit-btn")}>
                Chỉnh sửa
              </button>
            </div>
          </form>
        </div>

        <div className={cx("table-container")}>
          <div className={cx("table-header")}>
            <h3>Danh Sách Vị Trí</h3>
            <div className={cx("search")}>
              <input type="search" placeholder="Tìm kiếm vị trí" />
            </div>
          </div>
          <div className={cx("table-wrapper")}>
            <table className={cx("location-table")}>
              <thead>
                <tr>
                  <th>Chi nhánh</th>
                  <th>Tòa nhà</th>
                  <th>Tầng</th>
                  <th>Số phòng</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc, index) => (
                  <tr key={index}>
                    <td>{loc.branch}</td>
                    <td>{loc.building}</td>
                    <td>{loc.floor}</td>
                    <td>{loc.number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={cx("room-form-container")}>
        <h2>Tạo Phòng Họp</h2>
        <form className={cx("form")}>
          {/* Chọn vị trí, Nhập giá */}
          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label>Vị trí:</label>
              <select>
                <option value="">Chọn vị trí...</option>
                {locations.map((loc, index) => (
                  <option
                    key={index}
                    value={`${loc.branch} - ${loc.building} - ${loc.floor} - ${loc.number}`}
                  >
                    {loc.branch} - {loc.building} - {loc.floor} - {loc.number}
                  </option>
                ))}
              </select>
            </div>
            <div className={cx("form-group")}>
              <label>Giá:</label>
              <input type="number" placeholder="Nhập giá..." />
            </div>
          </div>

          {/* Nhập tên phòng, sức chứa */}
          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <label>Tên phòng:</label>
              <input type="text" placeholder="Nhập tên phòng..." />
            </div>
            <div className={cx("form-group")}>
              <label>Sức chứa:</label>
              <input type="number" placeholder="Nhập sức chứa..." />
            </div>
          </div>

          {/* Chọn trạng thái, người phê duyệt , chọn loại phòng*/}
          <div className={cx("form-row")}>
            <div className={cx("form-group")}>
              <select>
                <option value="">Chọn loại phòng...</option>
                {roomTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className={cx("form-group")}>
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

          {/* Chọn thiết bị */}
          <div className={cx("device-group")}>
            <label>Thiết bị:</label>
            <div className={cx("device-table-container")}>
              <table className={cx("device-table")}>
                <thead>
                  <tr>
                    <th>Chọn</th>
                    <th>Tên thiết bị</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device, index) => (
                    <tr key={index}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>{device}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className={cx("device-quantity")}
                          placeholder="Số lượng"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={cx("btn-row")}>
            <button type="button" className={cx("submit-btn")}>
              Tạo phòng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;

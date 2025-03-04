import classNames from "classnames/bind";
import styles from "./CreateRoom.module.scss";
import { devices, LocationProps, locations, statusesRoom } from "../../../data/data";
import { useState } from "react";

const cx = classNames.bind(styles);

const roomTypes = ["Phòng họp nhỏ", "Phòng họp lớn", "Phòng hội thảo"];
const approvers = ["Nguyễn Văn A", "Trần Thị B", "Lê Minh C"];
// const devices = [
//   "Máy chiếu",
//   "Tivi",
//   "Bảng trắng",
//   "Hệ thống âm thanh",
//   "Hệ thống âm thanh",
//   "Hệ thống âm thanh",
// ];

const CreateRoom = () => {
  // Hiển thị vi trí đuợc chọn trong bảng lên form
  const [dataLocations, setDataLocations] = useState(locations);
  const [selectedLocation, setSelectedLocation] = useState({
    branch: "",
    building: "",
    floor: "",
    number: "",
  });

  const handleRowClick = (location: LocationProps) => {
    setSelectedLocation(location);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedLocation((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={cx("create-container")}>
      {/* <div className={cx("location-container")}>
        <div className={cx("location-form-container")}>
          <h2>Tạo Vị Trí Phòng Họp</h2>

          <form className={cx("form")}>
            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label>Chi nhánh:</label>
                <input
                  type="text"
                  name="branch"
                  value={selectedLocation.branch}
                  onChange={handleInputChange}
                  placeholder="Nhập chi nhánh..."
                />
              </div>
              <div className={cx("form-group")}>
                <label>Tòa nhà:</label>
                <input
                  type="text"
                  name="building"
                  value={selectedLocation.building}
                  onChange={handleInputChange}
                  placeholder="Nhập tòa nhà..."
                />
              </div>
            </div>

            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label>Tầng:</label>
                <input
                  type="text"
                  name="floor"
                  value={selectedLocation.floor}
                  onChange={handleInputChange}
                  placeholder="Nhập tầng..."
                />
              </div>
              <div className={cx("form-group")}>
                <label>Số phòng:</label>
                <input
                  type="text"
                  name="number"
                  value={selectedLocation.number}
                  onChange={handleInputChange}
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
                  <tr key={index} onClick={() => handleRowClick(loc)}>
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
      </div> */}

      <div className={cx("room-form-container")}>
        <form className={cx("form")}>
          <div className={cx("row-container")}>
            {/* Chọn vị trí*/}
            <div className={cx("cover")}>
              <h3>Bước 1: Chọn vị trí</h3>
              <div className={cx("form-row")}>
                <select>
                  <option value="">Chọn chi nhánh</option>
                  {locations.map((loc, index) => (
                    <option key={index} value={`${loc.branch}`}>
                      {loc.branch}
                    </option>
                  ))}
                </select>
                <select>
                  <option value="">Chọn tòa nhà</option>
                  {locations.map((loc, index) => (
                    <option key={index} value={`${loc.building}`}>
                      {loc.building}
                    </option>
                  ))}
                </select>
                <select>
                  <option value="">Chọn tầng - phòng</option>
                  {locations.map((loc, index) => (
                    <option key={index} value={`${loc.floor} - ${loc.number}`}>
                      {loc.floor} - {loc.number}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Chọn trạng thái, người phê duyệt , chọn loại phòng*/}
            <div className={cx("cover")}>
              <h3>Bước 3: Chọn thiết lập</h3>
              <div className={cx("form-row")}>
                <select>
                  <option value="">Chọn loại phòng...</option>
                  {roomTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <select>
                  <option value="">Chọn trạng thái...</option>
                  {statusesRoom.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
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
          </div>

          <div className={cx("row-container")}>
            {/* Nhập tên phòng, sức chứa, giá */}
            <div className={cx("cover")}>
              <h3>Bước 2: Nhập thông tin</h3>
              <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                  <label>Tên phòng:</label>
                  <input type="text" placeholder="Nhập tên phòng..." />
                </div>
                <div className={cx("form-group")}>
                  <label>Sức chứa:</label>
                  <input type="number" placeholder="Nhập sức chứa..." />
                </div>
                <div className={cx("form-group")}>
                  <label>Giá:</label>
                  <input type="number" placeholder="Nhập giá..." />
                </div>
              </div>
            </div>

            {/* Chọn thiết bị */}
            <div className={cx("cover")}>
              <h3>Bước 4: Chọn thiết bị</h3>
              <div className={cx("device-group")}>
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
                            <input type="checkbox" className={cx("checkbox")} />
                          </td>
                          <td>{device.deviceName}</td>
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

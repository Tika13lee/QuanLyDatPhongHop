import classNames from "classnames/bind";
import styles from "./CreateRoom.module.scss";
import { devices, locations, statusesRoom, typeRoom } from "../../../data/data";

const cx = classNames.bind(styles);

const approvers = ["Nguyễn Văn A", "Trần Thị B", "Lê Minh C"];

const CreateRoom = () => {
  return (
    <div className={cx("create-container")}>
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
                  {typeRoom.map((type, index) => (
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

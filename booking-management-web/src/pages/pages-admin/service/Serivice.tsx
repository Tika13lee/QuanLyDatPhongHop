import classNames from "classnames/bind";
import styles from "./Service.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const cx = classNames.bind(styles);

function Service() {
  // Lấy dữ liệu devices từ Redux Store
  const { devices, loading, error } = useSelector(
    (state: RootState) => state.device
  );

  return (
    <div className={cx("service-container")}>
      <div className={cx("service-header")}>
        <div className={cx("service-info")}>
          <h3>Thông tin thiết bị</h3>

          <form className={cx("form")}>
            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label>Tên thiết bị:</label>
                <input
                  type="text"
                  name="serviceName"
                  placeholder="Nhập tên thiết bị..."
                />
              </div>
              <div className={cx("form-group")}>
                <label>Giá:</label>
                <input type="text" name="price" placeholder="Nhập giá..." />
              </div>
            </div>

            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label>Mô tả:</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Nhập mô tả..."
                />
              </div>
            </div>

            <div className={cx("btn-row")}>
              <button type="button" className={cx("submit-btn")}>
                Thêm thiết bị
              </button>
              <button type="button" className={cx("submit-btn")}>
                Chỉnh sửa
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className={cx("service-list")}>
        <table className={cx("service-table")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên thiết bị</th>
              <th>Mô tả</th>
              <th>Giá</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className={cx("loading-message")}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : error || !devices || devices.length === 0 ? (
              <tr>
                <td colSpan={4}>Không có thiết bị nào</td>
              </tr>
            ) : (
              devices.map((device, index) => (
                <tr key={device.deviceId}>
                  <td>{index + 1}</td>
                  <td>{device.deviceName}</td>
                  <td>{device.description}</td>
                  <td>{device.price?.value || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Service;

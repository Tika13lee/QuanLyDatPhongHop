import classNames from "classnames/bind";
import styles from "./Location.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const cx = classNames.bind(styles);

function Location() {
  const { locations, loading, error } = useSelector(
    (state: RootState) => state.location
  );

  console.log("locations", locations);

  return (
    <div className={cx("location-container")}>
      <div className={cx("location-header")}>
        <div className={cx("location-info")}>
          <h3>Thông tin vị trí</h3>
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
      </div>

      {/* Bảng danh sách */}
      <div className={cx("location-list")}>
        <table className={cx("location-table")}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Chi nhánh</th>
              <th>Tòa nhà</th>
              <th>Tầng</th>
              <th>Số phòng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className={cx("loading-message")}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : error || !locations || locations.length === 0 ? (
              <tr>
                <td colSpan={6}>Không có dữ liệu</td>
              </tr>
            ) : (
              locations.map((loc, index) => (
                <tr key={loc.locationId}>
                  <td>{index + 1}</td>
                  <td>{loc.branch}</td>
                  <td>{loc.building}</td>
                  <td>{loc.floor}</td>
                  <td>{loc.number}</td>
                  <td>
                    <button className={cx("edit-btn")}>Sửa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Location;

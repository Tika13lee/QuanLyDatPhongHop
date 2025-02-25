import classNames from "classnames/bind";
import styles from "./Room.module.scss";

const cx = classNames.bind(styles);

const Room = () => {
  return (
    <div className={cx("room-container")}>
      <div className={cx("room-info-container")}>
        <div className={cx("room-image")}>
          <img
            src="https://anviethouse.vn/wp-content/uploads/2020/06/Thiet-ke-phong-hop-hien-dai-1-2.jpg"
            alt="image-room"
          />
        </div>
        <div className={cx("room-info")}>
          <div className={cx("room-info-detail")}>
            <div className={cx("room-info-detail-1")}>
              <div className={cx("room-info-item")}>
                <span>Mã Phòng</span>
                <input type="text" disabled />
              </div>
              <div className={cx("room-info-item")}>
                <span>Tên Phòng</span>
                <input type="text" />
              </div>
              <div className={cx("room-info-item")}>
                <span>Sức chứa</span>
                <input type="number" />
              </div>
              <div className={cx("room-info-item")}>
                <span>Trạng thái</span>
                <select>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>
            <div className={cx("room-info-detail-2")}>
              <div className={cx("room-info-item")}>
                <span>Vị trí</span>
                <select>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
              <div className={cx("room-info-item")}>
                <span>Giá</span>
                <select>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
              <div className={cx("room-info-item")}>
                <span>Thiết bị</span>
                <select>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>
          </div>
          <div className={cx("room-add")}>
            <button>Thêm</button>
            <button>Sửa</button>
            <button>Xóa</button>
          </div>
        </div>
      </div>
      <div className={cx("list-room-container")}>
        <table border={1} className={cx("room-table")}>
          <thead>
            <tr>
              <th>Room ID</th>
              <th>Room Name</th>
              <th>Capacity</th>
              <th>Image</th>
              <th>Price</th>
              <th>Prices</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Phòng 1</td>
              <td>10</td>
              <td></td>
              <td>100000</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Phòng 2</td>
              <td>20</td>
              <td></td>
              <td>200000</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Phòng 2</td>
              <td>20</td>
              <td></td>
              <td>200000</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Phòng 2</td>
              <td>20</td>
              <td></td>
              <td>200000</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Phòng 2</td>
              <td>20</td>
              <td></td>
              <td>200000</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Phòng 2</td>
              <td>20</td>
              <td></td>
              <td>200000</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Phòng 2</td>
              <td>20</td>
              <td></td>
              <td>200000</td>
            </tr>



          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Room;

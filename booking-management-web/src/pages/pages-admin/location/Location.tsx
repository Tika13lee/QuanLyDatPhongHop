import classNames from "classnames/bind";
import styles from "./Location.module.scss";
import { locations } from "../../../data/data";
import { useState } from "react";

const cx = classNames.bind(styles);

function Location() {
  const [search, setSearch] = useState("");

  return (
    <div className={styles["location-container"]}>
      <h1 className={styles["title"]}>Quản lý Địa điểm</h1>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm theo chi nhánh, tòa nhà, tầng, số phòng..."
        className={styles["search-input"]}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Bảng danh sách */}
      <table className={styles["location-table"]}>
        <thead>
          <tr>
            <th>Chọn</th>
            <th>ID</th>
            <th>Chi nhánh</th>
            <th>Tòa nhà</th>
            <th>Tầng</th>
            <th>Số phòng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc.id}>
              <td className={styles["checkbox"]}>
                <input type="checkbox" value={loc.id}/>
              </td>
              <td>{loc.id}</td>
              <td>{loc.branch}</td>
              <td>{loc.building}</td>
              <td>{loc.floor}</td>
              <td>{loc.number}</td>
              <td>
                <button className={styles["edit-btn"]}>Sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Location;

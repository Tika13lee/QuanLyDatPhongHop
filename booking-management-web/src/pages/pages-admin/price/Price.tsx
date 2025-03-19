import classNames from "classnames/bind";
import styles from "./Price.module.scss";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo, MdSearch } from "../../../components/icons/icons";
import { useState } from "react";

const cx = classNames.bind(styles);

type PriceType = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

const priceData = [
  {
    id: "1",
    name: "Bảng giá A",
    startTime: "2024-03-01 08:00",
    endTime: "2024-03-10 18:00",
    isActive: true,
  },
  {
    id: "2",
    name: "Bảng giá B",
    startTime: "2024-03-05 08:00",
    endTime: "2024-03-15 18:00",
    isActive: false,
  },
  {
    id: "3",
    name: "Bảng giá C",
    startTime: "2024-04-01 08:00",
    endTime: "2024-04-10 18:00",
    isActive: true,
  },
];

function Price() {
  const [priceList, setPriceList] = useState<PriceType[]>(priceData);
  const [isCheck, setIsCheck] = useState<number[]>([]);
  const [isShowModal, setIsShowModal] = useState(false);

  // Xử lý khi chọn hoặc bỏ chọn
  const handleCheckboxChange = (itemId: number) => {
    setIsCheck((prevSelected) => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter((id) => id !== itemId);
      } else {
        return [...prevSelected, itemId];
      }
    });
  };

  // Xử lý mở và đóng modal
  const handleOpenModal = () => {
    setIsShowModal(true);
  };
  const handleCloseModal = () => {
    setIsShowModal(false);
  };

  return (
    <div className={cx("price-container")}>
      {/* Tìm kiếm */}
      <div className={cx("search-container")}>
        <div className={cx("search-date")}>
          <label>Tìm kiếm bảng giá theo ngày</label>
          <input type="date" />
        </div>
      </div>

      {/* chức năng */}
      <div className={cx("function-container")}>
        <p>Danh sách bảng giá</p>
        <div className={cx("function-btn")}>
          <button
            type="button"
            className={cx("submit-btn")}
            disabled={isCheck.length === 0}
          >
            Áp dụng
          </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className={cx("price-list")}>
        <table className={cx("price-table")}>
          <thead>
            <tr>
              <th style={{ width: "10px" }}>Check</th>
              <th style={{ width: "100px" }}>Mã</th>
              <th style={{ width: "120px" }}>Tên bảng giá</th>
              <th style={{ width: "200px" }}>Thời gian bắt đầu</th>
              <th style={{ width: "200px" }}>Thời gian kết thúc</th>
              <th style={{ width: "100px" }}>Đang được sử dụng</th>
              <th style={{ width: "50px" }}>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {priceList.map((price, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    className={cx("checkbox")}
                    checked={isCheck.includes(Number(price.id))}
                    onChange={() => handleCheckboxChange(Number(price.id))}
                  />
                </td>
                <td>{price.id}</td>
                <td>{price.name}</td>
                <td>{price.startTime}</td>
                <td>{price.endTime}</td>
                <td>{price.isActive ? "✅" : "❌"}</td>
                <td className={cx("icon-info")} onClick={handleOpenModal}>
                  <IconWrapper icon={MdOutlineInfo} color="#0670C7" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isShowModal && (
        <div className={cx("price-header")}>
          <div className={cx("price-info")}>
            <button className={cx("close-btn")} onClick={handleCloseModal}>
              ✖
            </button>
            <h3>Thông tin</h3>
            <div className={cx("price-detail")}>
              <div style={{ width: "45%" }}>
                <h4>Dịch vụ</h4>
                <div className={cx("table-container")}>
                  <table>
                    <thead>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>100.000</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>200.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ width: "45%" }}>
                <h4>Phòng</h4>
                <div className={cx("table-container")}>
                  <table>
                    <thead>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>100.000</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>200.000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Price;

import classNames from "classnames/bind";
import styles from "./Price.module.scss";
import IconWrapper from "../../../components/icons/IconWrapper";
import { MdOutlineInfo } from "../../../components/icons/icons";
import { useEffect, useState } from "react";
import { PriceTableProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import { formatCurrencyVND, formatDateString } from "../../../utilities";
import DatePicker from "react-datepicker";
import usePost from "../../../hooks/usePost";
import PopupNotification from "../../../components/popup/PopupNotification";
import { FiRefreshCw } from "../../../components/icons/icons";

const cx = classNames.bind(styles);

type RoomListType = {
  roomId: number;
  value?: number;
};

type ServiceListType = {
  serviceId: number;
  value?: number;
};

function Price() {
  // const [priceList, setPriceList] = useState<PriceType[]>(priceData);
  const [pricesTable, setPricesTable] = useState<PriceTableProps[]>([]);
  const [isCheck, setIsCheck] = useState<number[]>([]);
  const [isShowModalDetail, setIsShowModalDetail] = useState<boolean>(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [isApply, setIsApply] = useState<boolean>(false);
  const [selectedPriceTable, setSelectedPriceTable] =
    useState<PriceTableProps | null>(null);
  const [isCheckApply, setIsCheckApply] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [render, setRender] = useState<boolean>(false);

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  const [dateValue, setDateValue] = useState<String>("");
  const [newPriceData, setNewPriceData] = useState({
    priceName: "",
    timeStart: "",
    timeEnd: "",
    isActive: false,
    priceServices: [] as ServiceListType[],
    priceRooms: [] as RoomListType[],
  });

  // kiểm tra thời gian áp dụng
  const fetchCheckApply = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/price/checkTimePrice?timeStart=${startTime?.toISOString()}&timeEnd=${endTime?.toISOString()}`
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // tim kiem bang gia ap dung theo ngay
  const handleSearchPrice = async (dateSreach: Date) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/price/getPricesInTime?time=${dateSreach?.toISOString()}`
      );
      const data = await response.json();
      console.log(data);
      setPricesTable(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // reset thời gian khi thay đổi
  useEffect(() => {
    setIsCheckApply(false);
  }, [startTime, endTime]);

  // kiểm tra thời gian áp dụng
  const handleCheckApply = async () => {
    setIsCheckApply(!isCheckApply);
    if (startTime && endTime) {
      const duplicatePrices: PriceTableProps[] = await fetchCheckApply();
      console.log(duplicatePrices);
      if (!duplicatePrices) {
        alert("Lỗi khi kiểm tra thời gian.");
        setIsCheckApply(false);
      } else {
        console.log(duplicatePrices);
        if (duplicatePrices?.length === 0) {
          setIsCheckApply(true);
          setNewPriceData({
            ...newPriceData,
            isActive: true,
          });
        } else {
          let response = "";
          duplicatePrices?.forEach((price) => {
            response += `Bảng giá ${price.priceName} từ ${formatDateString(
              price.timeStart
            )} đến ${formatDateString(price.timeEnd)}\n`;
          });
          alert("Thời gian này đã trùng với: \n" + response);
          setIsCheckApply(false);
        }
      }
    } else {
      console.log(isCheckApply);
      alert("Vui lòng chọn thời gian bắt đầu và kết thúc.");

      setIsCheckApply(false);
    }
  };

  // thêm bảng giá mới
  const { data, loading, error, postData } = usePost<PriceTableProps>(
    "http://localhost:8080/api/v1/price/createPrice"
  );

  // Thêm bảng giá mới
  const handleAddPrice = async () => {
    const updateNewPriceData = {
      ...newPriceData,
      timeStart: startTime?.toISOString(),
      timeEnd: endTime?.toISOString(),
    };

    console.log(updateNewPriceData);

    const response = await postData(updateNewPriceData, { method: "POST" });

    if (response) {
      console.log(response);
      setPopupMessage("Thêm bảng giá thành công!");
      setPopupType("success");
      setIsPopupOpen(true);

      setPricesTable([...pricesTable, response.data]);

      handleCloseAddModal();
    } else {
      alert("Lỗi khi thêm bảng giá.");
    }

    console.log(updateNewPriceData);
  };

  // đóng mở modal thêm mới
  const handleOpenAddModal = () => {
    if (selectedPriceTable) {
      setNewPriceData({
        priceName: "",
        timeStart: "",
        timeEnd: "",
        isActive: false,
        priceServices: selectedPriceTable.priceService.map((item) => ({
          ...item,
        })),
        priceRooms: selectedPriceTable.priceRoom.map((item) => ({
          ...item,
        })),
      });
      setIsOpenAddModal(true);
    }
  };
  const handleCloseAddModal = () => {
    setIsOpenAddModal(false);
    selectedPriceTable && setSelectedPriceTable(null);
    setIsCheck([]);
    setIsCheckApply(false);
    setStartTime(undefined);
    setEndTime(undefined);
  };

  // lấy bảng giá
  const {
    data: priceList,
    loading: priceListLoading,
    error: priceListError,
  } = useFetch<PriceTableProps[]>(
    "http://localhost:8080/api/v1/price/getAllPrice"
  );

  // render bảng giá, lấy ds phòng và dịch vụ
  useEffect(() => {
    if (priceList) {
      setPricesTable(priceList);
    }
  }, [priceList, render]);

  // Xử lý khi chọn hoặc bỏ chọn
  const handleCheckboxChange = (
    itemId: number,
    isActive: boolean,
    eventCheck: boolean
  ) => {
    if (eventCheck === false) {
      setIsApply(eventCheck);
    } else {
      setIsApply(isActive);
    }
    let updatedCheck = [] as number[];
    if (isCheck.includes(itemId)) {
      updatedCheck = isCheck.filter((id) => id !== itemId);
    } else {
      updatedCheck = [...isCheck, itemId];
    }

    setIsCheck(updatedCheck);

    if (updatedCheck.length === 1) {
      const selected = pricesTable.find(
        (price) => price.priceId === updatedCheck[0]
      );
      if (selected) setSelectedPriceTable(selected);
    } else {
      setSelectedPriceTable(null);
    }
  };

  // Áp dụng bảng giá
  const handleActivePrice = async () => {
    if (isCheck.length === 0) {
      alert("Vui lòng chọn ít nhất một bảng giá.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/price/activePrice?priceId=${isCheck[0]}`,
        {
          method: "POST", // Hoặc "POST" nếu cần
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      let stringErr = "";
      const dataArray = Array.isArray(data) ? data : [data];
      if (dataArray.length !== 0) {
        dataArray?.forEach((resDup: any) => {
          stringErr += `Bảng giá: ${resDup.priceName} từ ${formatDateString(
            resDup.timeStart
          )} đến ${formatDateString(resDup.timeEnd)}`;
        });
      }

      if (response.status !== 200) {
        setPopupMessage(
          "Ngày áp dụng bị trùng với bảng giá khác:\n" + stringErr
        );
        setPopupType("error");
        setIsPopupOpen(true);
        return;
      }
      setPopupMessage("Áp dụng bảng giá thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      setPricesTable((prevPrices) =>
        prevPrices.map((price) =>
          price.priceId === isCheck[0] ? { ...price, active: true } : price
        )
      );
    } catch (error) {
      console.error("Lỗi khi áp dụng bảng giá:", error);
      setPopupMessage("Lỗi khi áp dụng bảng giá.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
    setIsCheck([]);
  };

  console.log(isCheck);
  // Xử lý mở và đóng modal chi tiết
  const handleOpenDetailModal = (priceTable: PriceTableProps) => {
    console.log(priceTable);
    if (priceTable) setSelectedPriceTable(priceTable);
    setIsShowModalDetail(true);
  };
  const handleCloseDetailModal = () => {
    setIsShowModalDetail(false);
    setSelectedPriceTable(null);
  };

  return (
    <div className={cx("price-container")}>
      {/* Tìm kiếm */}
      <div className={cx("search-container")}>
        <div className={cx("search-date")}>
          <label>Tìm kiếm bảng giá theo ngày</label>
          <input
            type="date"
            value={String(dateValue)}
            onChange={(e) => {
              handleSearchPrice(new Date(e.target.value));
              setDateValue(e.target.value);
            }}
          />
          <div className={cx("refresh-btn")}>
            <button
              type="button"
              onClick={(e) => {
                setRender(!render);
                setDateValue("");
              }}
            >
              <IconWrapper icon={FiRefreshCw} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* chức năng */}
      <div className={cx("function-container")}>
        <p>Danh sách bảng giá</p>
        <div className={cx("function-btn")}>
          <button
            type="button"
            className={cx("action-btn", "apply-btn")}
            disabled={
              isCheck.length === 0 || isApply === true || isCheck.length > 1
            }
            onClick={handleActivePrice}
          >
            Áp dụng
          </button>
          <button
            type="button"
            className={cx("action-btn", "copy-btn")}
            disabled={isCheck.length === 0 || isCheck.length > 1}
            onClick={handleOpenAddModal}
          >
            Sao chép bảng giá
          </button>
          <button type="button" className={cx("action-btn", "add-btn")}>
            Tạo bảng giá
          </button>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className={cx("price-list")}>
        <table className={cx("price-table")}>
          <thead>
            <tr>
              <th>Check</th>
              <th>Mã</th>
              <th>Tên bảng giá</th>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
              <th>Đang áp dụng</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {priceListError ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "red" }}>
                  ❌ Lỗi khi tải dữ liệu:{" "}
                  {priceListError.message || "Không xác định"}
                </td>
              </tr>
            ) : pricesTable.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  Không có dữ liệu bảng giá.
                </td>
              </tr>
            ) : (
              pricesTable.map((price, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      className={cx("checkbox")}
                      checked={isCheck.includes(Number(price.priceId))}
                      onChange={(e) =>
                        handleCheckboxChange(
                          Number(price.priceId),
                          price.active,
                          e.target.checked
                        )
                      }
                    />
                  </td>
                  <td>{price.priceId}</td>
                  <td>{price.priceName}</td>
                  <td>{formatDateString(price.timeStart)}</td>
                  <td>{formatDateString(price.timeEnd)}</td>
                  <td>{price.active ? "✅" : "❌"}</td>
                  <td
                    className={cx("icon-info")}
                    onClick={() => handleOpenDetailModal(price)}
                  >
                    <IconWrapper icon={MdOutlineInfo} color="#0670C7" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isShowModalDetail && (
        <div className={cx("price-modal")}>
          <div className={cx("price-header")}>
            <button
              className={cx("close-btn")}
              onClick={handleCloseDetailModal}
            >
              ✖
            </button>
            <h3>Thông tin</h3>
            <div className={cx("price-detail")}>
              <div style={{ width: "45%" }}>
                <h3>Dịch vụ</h3>
                <div className={cx("table-container")}>
                  <table className={cx("price-detail-table")}>
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPriceTable?.priceService.map(
                        (service, index) => (
                          <tr key={service.serviceId}>
                            <td>{service.serviceName}</td>
                            <td>{formatCurrencyVND(service.value)}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ width: "45%" }}>
                <h3>Phòng</h3>
                <div className={cx("table-container")}>
                  <table className={cx("price-detail-table")}>
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPriceTable?.priceRoom.map((room) => (
                        <tr key={room.roomId}>
                          <td>{room.roomName}</td>
                          <td>{formatCurrencyVND(room.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm mới */}
      {isOpenAddModal && (
        <div className={cx("price-modal")}>
          <div className={cx("price-header")}>
            <button className={cx("close-btn")} onClick={handleCloseAddModal}>
              ✖
            </button>
            <h3>Thông tin</h3>
            <div className={cx("price-info")}>
              <div className={cx("form-row")}>
                <div className={cx("form-group")}>
                  <label>Tên</label>
                  <input
                    type="text"
                    placeholder="Tên bảng giá"
                    value={newPriceData.priceName}
                    onChange={(e) =>
                      setNewPriceData({
                        ...newPriceData,
                        priceName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={cx("form-group")}>
                  <label>Thời gian bắt đầu</label>
                  <DatePicker
                    selected={startTime}
                    onChange={(date) => {
                      setStartTime(date as Date);
                    }}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    showTimeSelect={false}
                  />
                </div>
                <div className={cx("form-group")}>
                  <label>Thời gian kết thúc</label>
                  <DatePicker
                    selected={endTime}
                    onChange={(date) => {
                      setEndTime(date as Date);
                    }}
                    minDate={startTime}
                    dateFormat="dd / MM / yyyy"
                    showTimeSelect={false}
                  />
                </div>
              </div>
            </div>
            <div className={cx("price-detail")}>
              <div style={{ width: "45%" }}>
                <h3>Dịch vụ</h3>
                <div className={cx("table-container")}>
                  <table className={cx("price-detail-table")}>
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPriceTable?.priceService.map(
                        (service, index) => (
                          <tr key={index}>
                            <td>{service.serviceName}</td>
                            <td>
                              <input
                                type="number"
                                placeholder="Giá"
                                min={10000}
                                step={10000}
                                value={service.value ?? ""}
                                onChange={(e) => {
                                  const updatedService = [
                                    ...newPriceData.priceServices,
                                  ];

                                  const updatedPriceService =
                                    selectedPriceTable.priceService.map(
                                      (item, i) =>
                                        i === index
                                          ? {
                                              ...item,
                                              value: Number(e.target.value),
                                            }
                                          : item
                                    );

                                  setSelectedPriceTable({
                                    ...selectedPriceTable,
                                    priceService: updatedPriceService,
                                  });

                                  updatedService[index].value = Number(
                                    e.target.value
                                  );

                                  setNewPriceData({
                                    ...newPriceData,
                                    priceServices: updatedService,
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ width: "45%" }}>
                <h3>Phòng</h3>
                <div className={cx("table-container")}>
                  <table className={cx("price-detail-table")}>
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPriceTable?.priceRoom.map((room, index) => (
                        <tr key={index}>
                          <td>{room.roomName}</td>
                          <td>
                            <input
                              type="number"
                              placeholder="Giá"
                              min={10000}
                              step={10000}
                              value={room.value}
                              onChange={(e) => {
                                const updatedRoom = [
                                  ...newPriceData.priceRooms,
                                ];

                                const updatedPriceRoom =
                                  selectedPriceTable.priceRoom.map((item, i) =>
                                    i === index
                                      ? {
                                          ...item,
                                          value: Number(e.target.value),
                                        }
                                      : item
                                  );

                                setSelectedPriceTable({
                                  ...selectedPriceTable,
                                  priceRoom: updatedPriceRoom,
                                });

                                updatedRoom[index].value = Number(
                                  e.target.value
                                );

                                setNewPriceData({
                                  ...newPriceData,
                                  priceRooms: updatedRoom,
                                });
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className={cx("price-footer")}>
              <div className={cx("form-checkbox")}>
                <input
                  type="checkbox"
                  checked={isCheckApply}
                  onChange={handleCheckApply}
                />
                <label>Áp dụng</label>
              </div>
              <button
                className={cx("action-btn", "add-btn")}
                onClick={handleAddPrice}
              >
                Tạo bảng giá mới
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hiển thị thông báo popup */}
      <PopupNotification
        message={popupMessage}
        type={popupType}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
}

export default Price;

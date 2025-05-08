import classNames from "classnames/bind";
import styles from "./RequestList.module.scss";
import { use, useEffect, useState } from "react";
import { RequestFormProps } from "../../../data/data";
import useFetch from "../../../hooks/useFetch";
import DetailModal from "../../../components/Modal/DetailRequestModal";
import IconWrapper from "../../../components/icons/IconWrapper";
import { FiRefreshCw, MdOutlineInfo } from "../../../components/icons/icons";
import { formatDateString, getHourMinute } from "../../../utilities";
import LoadingSpinner from "../../../components/spinner/LoadingSpinner";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const cx = classNames.bind(styles);

type DataSearch = {
  dayStart: string;
  statusRequestForm: string;
  typeRequestForm: string;
};

function RequestList() {
  const user = useSelector((state: RootState) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestForm, setSelectedRequestForm] =
    useState<RequestFormProps | null>(null);
  const [statusRequestForm, setStatusRequestForm] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [typeRequestForm, setTypeRequestForm] = useState<string>("");
  const [requestListData, setRequestListData] = useState<
    RequestFormProps[] | null
  >(null);

  // Lấy danh sách lịch đặt phòng
  const {
    data: requestList,
    loading: loadingRequestList,
    error: errorRequestList,
  } = useFetch<RequestFormProps[]>(
    `http://localhost:8080/api/v1/requestForm/getRequestFormByBookerId?bookerId=${user?.employeeId}&reload=${reloadTrigger}`
  );

  // Lấy danh sách yêu cầu từ API
  useEffect(() => {
    if (requestList) {
      // Lọc danh sách yêu cầu theo tiêu đề
      const filteredRequestList = requestList?.filter(
        (schedule) =>
          schedule.requestReservation.title
            .toLowerCase()
            .includes(searchQuery) ||
          schedule.reservations[0]?.room?.roomName
            .toLowerCase()
            .includes(searchQuery)
      );
      setRequestListData(filteredRequestList);
    }
  }, [requestList, searchQuery, reloadTrigger]);

  // dữ liệu tìm kiếm
  const [dataSearch, setDataSearch] = useState<DataSearch>({
    dayStart: "",
    statusRequestForm: statusRequestForm,
    typeRequestForm: typeRequestForm,
  });

  useEffect(() => {
    setDataSearch({
      dayStart: startDate ? new Date(startDate).toISOString() : "",
      statusRequestForm: statusRequestForm,
      typeRequestForm: typeRequestForm,
    });
    console.log("dataSearch", dataSearch);

    // Gọi API với dữ liệu tìm kiếm
    fetch(
      `http://localhost:8080/api/v1/requestForm/getRequestFormByBookerId?bookerId=${user?.employeeId}&dayStart=${dataSearch.dayStart}&statusRequestForm=${dataSearch.statusRequestForm}&typeRequestForm=${dataSearch.typeRequestForm}`
    )
      .then((response) => response.json())
      .then((data) => {
        setRequestListData(data);
        setDataSearch({
          dayStart: startDate ? new Date(startDate).toISOString() : "",
          statusRequestForm: statusRequestForm,
          typeRequestForm: typeRequestForm,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [startDate, statusRequestForm, typeRequestForm]);

  // Mở modal
  const handleShowDetails = (requestFormDetail: RequestFormProps) => {
    setSelectedRequestForm(requestFormDetail);
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    selectedRequestForm && setSelectedRequestForm(null);
  };

  // load lại danh sách yêu cầu
  useEffect(() => {
    const handleReload = () => {
      setReloadTrigger((prev) => prev + 1);
    };
    window.addEventListener("requestForm:changed", handleReload);
    return () => {
      window.removeEventListener("requestForm:changed", handleReload);
    };
  }, []);

  return (
    <div className={cx("booking-list")}>
      <div className={cx("booking-search")}>
        <div className={cx("search-group")}>
          <label>Tìm kiếm</label>
          <input
            type="text"
            placeholder="Nhập tên phòng, tiêu đề cuộc họp"
            className={cx("search-input")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>
        <div className={cx("search-group")}>
          <label>Ngày bắt đầu</label>
          <input
            type="date"
            className={cx("search-input")}
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setDataSearch({
                ...dataSearch,
                dayStart: new Date(e.target.value).toISOString(),
              });
            }}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className={cx("search-group")}>
          <label>Loại yêu cầu</label>
          <select
            className={cx("search-input")}
            name="typeRequestForm"
            value={typeRequestForm}
            onChange={(e) => {
              setTypeRequestForm(e.target.value);
              setDataSearch({
                ...dataSearch,
                typeRequestForm: e.target.value,
              });
            }}
          >
            <option value="">Tất cả</option>
            <option value="RESERVATION_ONETIME">Đặt lịch một lần</option>
            <option value="RESERVATION_RECURRING">Đặt lịch định kỳ</option>
            <option value="UPDATE_RESERVATION">Cập nhật</option>
          </select>
        </div>
        <div className={cx("search-group")}>
          <label>Trạng thái</label>
          <select
            className={cx("search-input")}
            name="status"
            value={statusRequestForm}
            onChange={(e) => {
              setStatusRequestForm(e.target.value);
              setDataSearch({
                ...dataSearch,
                statusRequestForm: e.target.value,
              });
            }}
          >
            <option value="">Tất cả</option>
            <option value="APPROVED">Đã phê duyệt</option>
            <option value="PENDING">Chờ phê duyệt</option>
            <option value="REJECTED">Từ chối phê duyệt</option>
          </select>
        </div>
        <div style={{ marginTop: "24px" }}>
          <button
            onClick={() => {
              setReloadTrigger((prev) => prev + 1);
              setSearchQuery("");
              setStartDate("");
              setStatusRequestForm("");
              setTypeRequestForm("");
            }}
          >
            <IconWrapper icon={FiRefreshCw} color="#0d6efd" size={18} />
          </button>
        </div>
      </div>

      {loadingRequestList ? (
        <LoadingSpinner />
      ) : Array.isArray(requestList) && requestList.length === 0 ? (
        <p className={cx("no-schedule-message")}>Không có form yêu cầu nào</p>
      ) : (
        <div className={cx("schedule-list")}>
          <table className={cx("schedule-table")}>
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Ngày</th>
                <th>Giờ bắt đầu - kết thúc</th>
                <th>Trạng thái</th>
                <th>Loại yêu cầu</th>
                <th>Thời gian gửi</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(requestListData) &&
              requestListData.filter((r) => r.statusRequestForm !== "CANCELLED")
                .length > 0 ? (
                requestListData
                  .filter((r) => r.statusRequestForm !== "CANCELLED")
                  .map((schedule) => {
                    const statusText = getStatusText(
                      schedule.statusRequestForm
                    );

                    return (
                      <tr key={schedule.requestFormId}>
                        <td>{schedule.requestReservation.title}</td>
                        <td>
                          {formatDateString(
                            schedule.requestReservation.timeStart
                          )}
                        </td>
                        <td>
                          {getHourMinute(schedule.requestReservation.timeStart)}{" "}
                          - {getHourMinute(schedule.requestReservation.timeEnd)}
                        </td>
                        <td>{statusText}</td>
                        <td>
                          {schedule.typeRequestForm === "UPDATE_RESERVATION"
                            ? "Cập nhật"
                            : "Đặt lịch"}
                        </td>
                        <td>
                          {formatDateString(schedule.timeRequest)} -{" "}
                          {getHourMinute(schedule.timeRequest)}
                        </td>
                        <td>
                          <div
                            className={cx("actions")}
                            onClick={() => handleShowDetails(schedule)}
                          >
                            <IconWrapper icon={MdOutlineInfo} color="#FFBB49" />
                          </div>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={7} className={cx("no-schedule-message")}>
                    Không có yêu cầu nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        requestForm={selectedRequestForm}
      />
    </div>
  );
}

const getStatusText = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "Đã phê duyệt";
    case "REJECTED":
      return "Từ chối phê duyệt";
    default:
      return "Chờ phê duyệt";
  }
};

export default RequestList;

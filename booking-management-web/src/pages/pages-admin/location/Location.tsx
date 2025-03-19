import classNames from "classnames/bind";
import styles from "./Location.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../app/store";
import { useEffect, useState } from "react";
import usePost from "../../../hooks/usePost";
import PopupNotification from "../../../components/popup/PopupNotification";
import { fetchLocations } from "../../../features/locationSlice";
import useFetch from "../../../hooks/useFetch";
import { BranchProps, BuildingProps, LocationProps } from "../../../data/data";

const cx = classNames.bind(styles);

function Location() {
  const dispatch = useDispatch<AppDispatch>();

  const [openBranchModal, setOpenBranchModal] = useState(false);
  const [openBuildingModal, setOpenBuildingModal] = useState(false);

  const [branchName, setBranchName] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string>();
  const [maxFloor, setMaxFloor] = useState(1);
  const [floor, setFloor] = useState(maxFloor);

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  const [formData, setFormData] = useState({
    building: "",
    floor: "",
  });

  const [formBuilding, setFormBuilding] = useState({
    branchId: "",
    building: "",
  });

  // lấy chi nhánh
  const {
    data: branchs,
    loading: branchsLoading,
    error: branchsError,
  } = useFetch<BranchProps[]>(
    "http://localhost:8080/api/v1/location/getAllBranch"
  );

  // Lấy danh sách tòa nhà theo chi nhánh
  useEffect(() => {
    if (!branchName) return;

    fetch(
      `http://localhost:8080/api/v1/location/getBuildingsByBranchName?branchName=${branchName}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBuildings(data);
        setSelectedBuilding(" ");
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách tòa nhà:", error));
  }, [branchName]);

  // load danh sách location từ store
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useSelector((state: RootState) => state.location);

  // lấy ds tầng theo tòa nhà
  useEffect(() => {
    if (
      selectedBuilding !== " " &&
      selectedBuilding !== undefined &&
      selectedBuilding !== null
    ) {
      fetch(
        `http://localhost:8080/api/v1/location/getLocationsByBuildingId?buildingId=${selectedBuilding}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            const max = Math.max.apply(
              Math,
              data.map((loc: LocationProps) => loc.floor)
            );
            setMaxFloor(max + 1);
            setFloor(max + 1);
            setFormData((prev) => ({
              ...prev,
              floor: (max + 1).toString(),
            }));
          } else {
            setMaxFloor(1);
          }
        })
        .catch((error) => console.error("Lỗi khi lấy danh sách tầng:", error));
    }
  }, [selectedBuilding]);

  console.log(maxFloor);

  // mở modal thêm branch
  const handleOpenBranchModal = () => {
    setOpenBranchModal(true);
  };

  // đóng modal thêm branch
  const handleCloseBranchModal = () => {
    setOpenBranchModal(false);
    setBranchName("");
  };

  // thêm branch
  const {
    data: branchData,
    loading: branchLoading,
    error: branchError,
    postData: postBranch,
  } = usePost<any>(
    `http://localhost:8080/api/v1/location/addBranch?branchName=${branchName}`
  );

  // xử lý thêm branch
  const handleAddBranch = async () => {
    if (!branchName) {
      setPopupMessage("Vui lòng nhập tên chi nhánh!");
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    const newBranch = {
      branchName: branchName,
    };
    console.log(newBranch);

    const response = await postBranch(newBranch);

    if (response) {
      setPopupMessage("Vị trí đã được thêm thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      handleCloseBranchModal();
    } else {
      setPopupMessage("Thêm vị trí thất bại, vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // mở modal thêm building
  const handleOpenBuildingModal = () => {
    setOpenBuildingModal(true);
  };

  // đóng modal thêm building
  const handleCloseBuildingModal = () => {
    setOpenBuildingModal(false);
    setFormBuilding({
      branchId: "",
      building: "",
    });
  };

  // thêm building
  const {
    data: buildingData,
    loading: buildingLoading,
    error: buildingError,
    postData: postBuilding,
  } = usePost<any>(
    `http://localhost:8080/api/v1/location/addBuilding?branchId=${formBuilding.branchId}&buildingName=${formBuilding.building}`
  );

  // xử lý thêm building
  const handleAddBuilding = async () => {
    if (!formBuilding.branchId) {
      setPopupMessage("Vui lòng chọn chi nhánh!");
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    if (!formBuilding.building) {
      setPopupMessage("Vui lòng nhập tên tòa nhà!");
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    const newBuilding = {
      branchId: formBuilding.branchId,
      buildingName: formBuilding.building,
    };

    console.log(newBuilding);

    const response = await postBuilding(newBuilding);

    if (response) {
      setPopupMessage("Vị trí đã được thêm thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      handleCloseBuildingModal();
    } else {
      setPopupMessage("Thêm vị trí thất bại, vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // thêm location
  const {
    data,
    loading,
    error,
    postData: postLocation,
  } = usePost<any>(
    `http://localhost:8080/api/v1/location/addLocation?buildingId=${formData.building}&floor=${formData.floor}`
  );

  // xử lý thêm location
  const handleAddLocation = async () => {
    if (!formData.building) {
      setPopupMessage("Vui lòng chọn chi nhánh và tòa nhà!");
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    const newLocation = {
      building: formData.building,
      floor: formData.floor,
    };

    console.log(newLocation);

    // const response = await postLocation(newLocation);

    // if (response) {
    //   setPopupMessage("Vị trí đã được thêm thành công!");
    //   setPopupType("success");
    //   setIsPopupOpen(true);
    //   dispatch(fetchLocations());
    //   resetForm();
    // } else {
    //   setPopupMessage("Thêm vị trí thất bại, vui lòng thử lại.");
    //   setPopupType("error");
    //   setIsPopupOpen(true);
    // }
  };

  // Reset form sau khi thêm
  const resetForm = () => {
    setFormData({
      building: "",
      floor: "",
    });
    setBranchName("");
    setBuildings([]);
  };

  // xử lý khi thay đổi branch
  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBranch = e.target.value;
    setBranchName(selectedBranch);
    console.log(selectedBranch);
    if (selectedBranch === "") {
      setBuildings([]);
    }
  };

  // xử lý khi thay đổi building
  const handleInputBuildingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormBuilding((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm thay đổi của select tòa nhà
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSelectedBuilding(value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý thay đổi floor
  const handleFloorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= maxFloor) {
      setFloor(value);
      setFormData((prev) => ({
        ...prev,
        floor: value.toString(),
      }));
    }
  };

  // Hàm xử lý thay đổi của checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  // đóng popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className={cx("location-container")}>
      <div className={cx("location-header")}>
        <div className={cx("location-info")}>
          <div className={cx("form")}>
            <div className={cx("form-row")}>
              {/* branch */}
              <div className={cx("form-group")}>
                <label>Chi nhánh:</label>
                <div className={cx("form-select")}>
                  <select
                    name="branch"
                    value={branchName}
                    onChange={handleBranchChange}
                  >
                    <option value="">Chọn chi nhánh...</option>
                    {branchs?.map((branch) => (
                      <option key={branch.branchId} value={branch.branchName}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleOpenBranchModal}
                    disabled={isChecked}
                  >
                    Thêm chi nhánh
                  </button>
                </div>
              </div>

              {/* modal branch */}
              {openBranchModal && (
                <div className={cx("modal")}>
                  <div className={cx("modal-content")}>
                    <button
                      className={cx("close-btn")}
                      onClick={handleCloseBranchModal}
                    >
                      ✖
                    </button>
                    <h3>Thêm chi nhánh</h3>
                    <div className={cx("form")}>
                      <div className={cx("form-group")}>
                        <label>Tên chi nhánh:</label>
                        <input
                          type="text"
                          name="branch"
                          value={branchName}
                          onChange={(e) => setBranchName(e.target.value)}
                        />
                      </div>
                      <button
                        className={cx("btn-submit")}
                        onClick={handleAddBranch}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* building */}
              <div className={cx("form-group")}>
                <label>Tòa nhà:</label>
                <div className={cx("form-select")}>
                  <select
                    name="building"
                    value={formData.building}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn tòa nhà...</option>
                    {buildings.map((building: BuildingProps) => (
                      <option
                        key={building.buildingId}
                        value={building.buildingId}
                      >
                        {building.buildingName}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleOpenBuildingModal()}
                    disabled={isChecked}
                  >
                    Thêm tòa nhà
                  </button>
                </div>
              </div>

              {/* modal building */}
              {openBuildingModal && (
                <div className={cx("modal")}>
                  <div className={cx("modal-content")}>
                    <button
                      className={cx("close-btn")}
                      onClick={handleCloseBuildingModal}
                    >
                      ✖
                    </button>
                    <h3>Thêm tòa nhà</h3>
                    <div className={cx("form")}>
                      <div className={cx("form-group")}>
                        <label>Chi nhánh:</label>
                        <select
                          name="branchId"
                          value={formBuilding.branchId}
                          onChange={handleInputBuildingChange}
                        >
                          <option value="">Chọn chi nhánh...</option>
                          {branchs?.map((branch) => (
                            <option
                              key={branch.branchId}
                              value={branch.branchId}
                            >
                              {branch.branchName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={cx("form-group")}>
                        <label>Tên tòa nhà:</label>
                        <input
                          type="text"
                          name="building"
                          value={formBuilding.building}
                          onChange={handleInputBuildingChange}
                        />
                      </div>
                      <button
                        className={cx("btn-submit")}
                        onClick={() => handleAddBuilding()}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* floor */}
              <div className={cx("form-group")}>
                <label>Tầng:</label>
                <input
                  type="number"
                  name="floor"
                  min={maxFloor}
                  placeholder="Nhập tầng..."
                  value={floor}
                  onChange={handleFloorChange}
                />
              </div>
            </div>

            <div className={cx("btn-row")}>
              <div className={cx("search")}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label>Chọn chức năng tìm kiếm</label>
              </div>
              <div>
                <button
                  type="button"
                  className={cx("submit-btn")}
                  disabled={!isChecked}
                >
                  {"Tìm kiếm"}
                </button>
                <button
                  type="button"
                  className={cx("submit-btn")}
                  onClick={handleAddLocation}
                  disabled={isChecked}
                >
                  {"Tạo vị trí"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className={cx("location-list")}>
        <table className={cx("location-table")}>
          <thead>
            <tr>
              <th style={{ width: "70px" }}>STT</th>
              <th>Chi nhánh</th>
              <th>Tòa nhà</th>
              <th>Tầng</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className={cx("loading-message")}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : error || !locations || locations.length === 0 ? (
              <tr>
                <td colSpan={5}>Không có dữ liệu</td>
              </tr>
            ) : (
              locations.map((loc, index) => (
                <tr key={loc.locationId}>
                  <td>{index + 1}</td>
                  <td>{loc.branch}</td>
                  <td>{loc.building}</td>
                  <td>{loc.floor}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Hiển thị thông báo popup */}
      <PopupNotification
        message={popupMessage}
        type={popupType}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </div>
  );
}

export default Location;

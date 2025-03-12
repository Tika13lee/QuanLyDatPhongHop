import classNames from "classnames/bind";
import styles from "./Service.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import useFetch from "../../../hooks/useFetch";
import { useEffect, useState } from "react";
import PopupNotification from "../../../components/popup/PopupNotification";
import { ServiceProps } from "../../../data/data";
import usePost from "../../../hooks/usePost";

const cx = classNames.bind(styles);

function Service() {
  const {
    data: services,
    loading,
    error,
  } = useFetch<ServiceProps[]>(
    "http://localhost:8080/api/v1/service/getAllServices"
  );

  const [serviceList, setServiceList] = useState<any[]>(services || []);

  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    price: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  const { postData: addData } = usePost<any>(
    "http://localhost:8080/api/v1/service/addService"
  );
  const { postData: updateData } = usePost<any>(
    "http://localhost:8080/api/v1/service/updateService"
  );

  useEffect(() => {
    if (services) {
      setServiceList(services);
    }
  }, [services]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm thêm dịch vụ
  const handleAddService = async () => {
    if (isAdding) return;
    setIsAdding(true);

    const newService = {
      serviceName: formData.serviceName,
      description: formData.description,
      price: formData.price,
    };

    const response = await addData(newService, {}, "POST");

    if (response) {
      setPopupMessage("Dịch vụ đã được thêm thành công!");
      setPopupType("success");
      setIsPopupOpen(true);

      if (response.data) {
        setServiceList((prevServiceList) => [
          ...prevServiceList,
          response.data,
        ]);
      }

      resetForm();
    } else {
      setPopupMessage("Thêm dịch vụ thất bại, vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }

    setIsAdding(false);
  };

  // Hàm chỉnh sửa dịch vụ
  const handleUpdateService = async () => {
    if (isAdding) return;
    setIsAdding(true);

    const updatedService = {
      serviceId: selectedService.serviceId,
      serviceName: formData.serviceName,
      description: formData.description,
      priceId: formData.price,
    };  

    const response = await updateData(updatedService, {}, "PUT");

    if (response) {
      setPopupMessage("Dịch vụ đã được chỉnh sửa thành công!");
      setPopupType("success");
      setIsPopupOpen(true);
      // Cập nhật lại danh sách dịch vụ sau khi chỉnh sửa
      setServiceList(
        serviceList.map((service) =>
          service.serviceId === selectedService.serviceId ? response.data : service
        )
      );
      resetForm();
    } else {
      setPopupMessage("Chỉnh sửa dịch vụ thất bại, vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
    setIsAdding(false);
  };

  const resetForm = () => {
    setFormData({
      serviceName: "",
      description: "",
      price: "",
    });
    setSelectedService(null);
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setFormData({
      serviceName: service.serviceName,
      description: service.description,
      price: service.price.value,
    });
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };
  return (
    <div className={cx("service-container")}>
      <div className={cx("service-header")}>
        <div className={cx("service-info")}>
          <h3>Thông tin dịch vụ</h3>

          <form className={cx("form")}>
            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label>Tên dịch vụ:</label>
                <input
                  type="text"
                  name="serviceName"
                  placeholder="Nhập tên dịch vụ..."
                  value={formData.serviceName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={cx("form-group")}>
                <label>Giá:</label>
                <input
                  type="text"
                  name="price"
                  placeholder="Nhập giá..."
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={cx("form-row")}>
              <div className={cx("form-group")}>
                <label>Mô tả:</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Nhập mô tả..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={cx("btn-row")}>
              <button
                type="button"
                className={cx("submit-btn")}
                onClick={
                  selectedService ? handleUpdateService : handleAddService
                }
                disabled={isAdding}
              >
                {selectedService ? "Chỉnh sửa" : "Thêm dịch vụ"}
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
              <th>Tên dịch vụ</th>
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
            ) : error || !services || services.length === 0 ? (
              <tr>
                <td colSpan={4}>Không có dịch vụ nào</td>
              </tr>
            ) : (
              serviceList.map((service, index) => (
                <tr
                  key={service.serviceId}
                  onClick={() => handleEditService(service)}
                >
                  <td>{index + 1}</td>
                  <td>{service.serviceName}</td>
                  <td>{service.description}</td>
                  <td>{service.price?.value || "N/A"}</td>
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
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
}

export default Service;

import classNames from "classnames/bind";
import styles from "./Service.module.scss";
import useFetch from "../../../hooks/useFetch";
import { useEffect, useState } from "react";
import PopupNotification from "../../../components/popup/PopupNotification";
import { ServiceProps } from "../../../data/data";
import usePost from "../../../hooks/usePost";
import IconWrapper from "../../../components/icons/IconWrapper";
import { FaPlus, FiRefreshCw, MdSearch } from "../../../components/icons/icons";
import { formatCurrencyVND } from "../../../utilities";

const cx = classNames.bind(styles);

function Service() {
  const [openForm, setOpenForm] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceProps | null>();
  const [searchValue, setSearchValue] = useState("");

  // popup thông báo
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error" | "info">(
    "info"
  );

  const {
    data: services,
    loading,
    error,
  } = useFetch<ServiceProps[]>(
    "http://localhost:8080/api/v1/service/getAllServices"
  );

  const [serviceList, setServiceList] = useState<ServiceProps[]>(
    services || []
  );

  // Lọc danh sách dịch vụ theo tên
  const filteredServicetList = serviceList?.filter((service) =>
    service.serviceName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    price: "",
  });

  // render lại danh sách dịch vụ khi có thay đổi
  useEffect(() => {
    if (services) {
      setServiceList(services);
    }
  }, [services]);

  // Hàm xử lý khi thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm kiểm tra dữ liệu nhập vào form
  const validateForm = (formData: any) => {
    if (!formData.serviceName) {
      return { isValid: false, message: "Vui lòng nhập tên dịch vụ!" };
    }

    if (!formData.price) {
      return { isValid: false, message: "Vui lòng nhập giá dịch vụ!" };
    } else if (isNaN(Number(formData.price))) {
      return { isValid: false, message: "Giá dịch vụ phải là số!" };
    } else if (Number(formData.price) <= 0) {
      return { isValid: false, message: "Giá dịch vụ phải lớn hơn 0!" };
    }

    if (!formData.description) {
      return { isValid: false, message: "Vui lòng nhập mô tả dịch vụ!" };
    }

    return { isValid: true, message: "" };
  };

  // thêm dịch vụ
  const { postData: addData } = usePost<ServiceProps[]>(
    "http://localhost:8080/api/v1/service/addService"
  );

  // Xử lý thêm dịch vụ
  const handleAddService = async () => {
    const { isValid, message } = validateForm(formData);
    if (!isValid) {
      setPopupMessage(message);
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

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

      setServiceList((prevServiceList) => {
        const newData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        return [...prevServiceList, ...newData];
      });

      handleCloseForm();
    } else {
      setPopupMessage("Thêm dịch vụ thất bại, vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
  };

  // Hàm chọn dịch vụ để chỉnh sửa
  const handleEditService = (service: any) => {
    setOpenForm(true);
    setSelectedService(service);
    setFormData({
      serviceName: service.serviceName,
      description: service.description,
      price: service.priceService?.value,
    });
  };

  const { postData: updateData } = usePost<ServiceProps>(
    "http://localhost:8080/api/v1/service/upDateService"
  );

  // Xử lý chỉnh sửa dịch vụ
  const handleUpdateService = async () => {
    const { isValid, message } = validateForm(formData);
    if (!isValid) {
      setPopupMessage(message);
      setPopupType("error");
      setIsPopupOpen(true);
      return;
    }

    const updatedService = selectedService
      ? {
          serviceId: selectedService.serviceId,
          serviceName: formData.serviceName,
          description: formData.description,
          priceId: selectedService.priceService?.priceServiceId,
        }
      : null;

    const response = await updateData(updatedService, {}, "PUT");

    if (response) {
      setPopupMessage("Dịch vụ đã được chỉnh sửa thành công!");
      setPopupType("success");
      setIsPopupOpen(true);

      // Cập nhật lại danh sách dịch vụ sau khi chỉnh sửa
      setServiceList(
        serviceList.map((service) =>
          service.serviceId === selectedService?.serviceId
            ? response.data
            : service
        )
      );
      handleCloseForm();
    } else {
      setPopupMessage("Chỉnh sửa dịch vụ thất bại, vui lòng thử lại.");
      setPopupType("error");
      setIsPopupOpen(true);
    }
    // setIsAdding(false);
  };

  // Reset form sau khi thêm hoặc sửa
  const resetForm = () => {
    setFormData({
      serviceName: "",
      description: "",
      price: "",
    });
    setSelectedService(null);
  };

  // Hàm đóng form
  const handleCloseForm = () => {
    setOpenForm(false);
    resetForm();
  };

  return (
    <div className={cx("service-container")}>
      {/* Tìm kiếm */}
      <div className={cx("search-container")}>
        <div className={cx("search-box")}>
          <input
            type="search"
            placeholder="Tìm kiếm theo tên dịch vụ"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button>
            <IconWrapper icon={MdSearch} color="#fff" size={24} />
          </button>
        </div>
        <div
          onClick={() => {
            setSearchValue("");
            setServiceList(services || []);
          }}
        >
          <button>
            <IconWrapper icon={FiRefreshCw} color="#0d6efd" size={18} />
          </button>
        </div>
      </div>

      {/* chức năng */}
      <div className={cx("function-container")}>
        <p>Danh sách thiết bị</p>
        <div className={cx("function-btn")}>
          <button
            type="button"
            className={cx("submit-btn")}
            onClick={() => setOpenForm(true)}
          >
            Thêm
            <IconWrapper icon={FaPlus} color="#fff" size={18} />
          </button>
        </div>
      </div>

      {/* Form thêm mới */}
      {openForm && (
        <div className={cx("service-header")}>
          <div className={cx("service-info")}>
            <button className={cx("close-btn")} onClick={handleCloseForm}>
              ✖
            </button>
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
                    type="number"
                    name="price"
                    placeholder="Nhập giá..."
                    value={formData.price}
                    onChange={handleInputChange}
                    disabled={selectedService ? true : false}
                    min="1"
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
                >
                  {selectedService ? "Chỉnh sửa" : "Thêm dịch vụ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            ) : error ||
              !filteredServicetList ||
              filteredServicetList.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  Không có dịch vụ nào
                </td>
              </tr>
            ) : (
              filteredServicetList.map((service, index) => (
                <tr
                  key={service.serviceId}
                  onClick={() => handleEditService(service)}
                >
                  <td>{index + 1}</td>
                  <td>{service.serviceName}</td>
                  <td>{service.description}</td>
                  <td>
                    {service.priceService
                      ? formatCurrencyVND(service.priceService?.value)
                      : "Chưa có"}
                  </td>
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

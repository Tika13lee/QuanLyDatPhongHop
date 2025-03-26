import { parseISO, format } from "date-fns";

// load file ảnh lên cloudinary
const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "picture");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/drfbxuss6/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    console.log("Uploaded Image URL:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

// hàm tạo ds thời gian
const times = Array.from({ length: 23 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const minute = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

// định dạng ngày tháng năm, truyền vào là date
const formatDateDate = (date: Date) => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replace(/\//g, "-");
};

// định dang ngày tháng năm, truyền vào là string
const formatDateString = (date: string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(new Date(date))
    .replace(/\//g, "-");
};

// lấy giờ từ chuỗi thời gian
const getHourMinute = (isoString: string) => {
  const date = parseISO(isoString);
  return format(date, "HH:mm");
};

// định dạng tiền
const formatCurrencyVND = (amount: number) => {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export {
  getHourMinute,
  uploadImageToCloudinary,
  times,
  formatDateDate,
  formatDateString,
  formatCurrencyVND,
};

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
const times = Array.from({ length: ((18 - 7) * 60) / 10 + 1 }, (_, i) => {
  const totalMinutes = 7 * 60 + i * 10; // Bắt đầu từ 7:00
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
});

// định dạng ngày tháng năm, truyền vào là date
const formatDateDate = (date: Date) => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(date)
    .replace(/\//g, " - ");
};

// định dang ngày tháng năm, truyền vào là string
const formatDateString = (date: string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(new Date(date))
    .replace(/\//g, " - ");
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

// kiểm tra thời gian đặt phòng khi click cell
const validateBookingTime = (
  selectedDate: string,
  timeStart: string,
  showToast: (message: string) => void
): boolean => {
  const selectedDateTime = new Date(`${selectedDate}T${timeStart}:00`);
  selectedDateTime.setMinutes(selectedDateTime.getMinutes() + 30);

  const now = new Date();
  const isToday = now.toDateString() === selectedDateTime.toDateString();

  // Nếu là hôm nay
  if (isToday) {
    // kiểm tra nếu đã quá 17:30
    const afterFiveThirty =
      now.getHours() > 17 || (now.getHours() === 17 && now.getMinutes() >= 30);
    if (afterFiveThirty) {
      showToast(
        `Đã hết thời gian đặt lịch cho hôm nay. Vui lòng chọn ngày tiếp theo!`
      );
      return false;
    }

    // Thời gian hiện tại + 10 phút
    const threshold = new Date(now.getTime() + 10 * 60 * 1000);

    // Làm tròn lên mốc 10 phút
    let minutes = threshold.getMinutes();
    let roundedMinutes = Math.ceil(minutes / 10) * 10;
    let hours = threshold.getHours();

    if (roundedMinutes === 60) {
      roundedMinutes = 0;
      hours += 1;
    }

    const roundedThresholdMinutes = hours * 60 + roundedMinutes;

    // Chuyển timeStart thành phút
    const [hour, minute] = timeStart.split(":").map(Number);
    const selectedMinutes = hour * 60 + minute;

    if (selectedMinutes < roundedThresholdMinutes) {
      showToast(`Vui lòng chọn thời gian bắt đầu sau giờ hiện tại!`);
      return false;
    }
  } else {
    if (selectedDateTime < now) {
      showToast(
        `Ngày ${formatDateString(
          selectedDate
        )} đã qua. Vui lòng chọn ngày tiếp theo!`
      );
      return false;
    }
  }

  return true;
};

// hàm tạo ds thời gian bắt đầu cho ngày hôm nay
const generateStartTime = (selectedDate: string) => {
  const now = new Date();
  const selected = new Date(selectedDate);

  const isToday = selected.toDateString() === now.toDateString();
  if (!isToday) return times;

  // Thời gian hiện tại + 10 phút
  const threshold = new Date(now.getTime() + 10 * 60 * 1000);
  const thresholdStr = `${String(threshold.getHours()).padStart(
    2,
    "0"
  )}:${String(threshold.getMinutes()).padStart(2, "0")}`;

  // Giữ lại các mốc >= threshold
  return times.filter((time) => time >= thresholdStr);
};

const generateStartTime2 = (selectedDate: string) => {
  const now = new Date();
  let selected = new Date(selectedDate);

  // Kiểm tra nếu là hôm nay
  const isToday = selected.toDateString() === now.toDateString();

  if (isToday) {
    const afterFiveThirty =
      now.getHours() > 17 || (now.getHours() === 17 && now.getMinutes() >= 30);

    if (afterFiveThirty) {
      // Ép selectedDate thành ngày mai nếu đã quá 17:30
      selected.setDate(selected.getDate() + 1);
    }
  }

  // Sau khi chỉnh, kiểm tra lại có phải hôm nay không
  const isStillToday = selected.toDateString() === now.toDateString();

  let filteredTimes: string[];
  if (!isStillToday) {
    // Ngày khác hôm nay → giữ nguyên toàn bộ times
    filteredTimes = times;
  } else {
    // Ngày là hôm nay → lọc từ now + 10 phút
    const threshold = new Date(now.getTime() + 10 * 60 * 1000);
    const thresholdStr = `${String(threshold.getHours()).padStart(
      2,
      "0"
    )}:${String(threshold.getMinutes()).padStart(2, "0")}`;

    filteredTimes = times.filter((time) => time >= thresholdStr);
  }

  // Trả về cả danh sách thời gian hợp lệ và ngày đã điều chỉnh
  return {
    filteredTimes,
    adjustedDate: selected.toISOString().split("T")[0], // trả về dạng YYYY-MM-DD
  };
};

export {
  generateStartTime2,
  generateStartTime,
  validateBookingTime,
  getHourMinute,
  uploadImageToCloudinary,
  times,
  formatDateDate,
  formatDateString,
  formatCurrencyVND,
};

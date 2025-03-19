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

  export {
    uploadImageToCloudinary, times
  }
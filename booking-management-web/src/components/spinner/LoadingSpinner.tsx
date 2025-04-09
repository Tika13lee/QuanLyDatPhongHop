import React from "react";
import { ClipLoader } from "react-spinners";

const LoadingSpinner = ({ loading = true, size = 50, color = "#0d6efd" }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      <ClipLoader color={color} loading={loading} size={size} />
    </div>
  );
};

export default LoadingSpinner;

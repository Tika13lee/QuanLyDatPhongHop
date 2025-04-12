// src/components/routing/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const role = token ? JSON.parse(atob(token.split(".")[1])).role : null;

  if (!token || !role) {
    return <Navigate to="/" replace />; // chuyển về trang login nếu chưa login
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />; // không đúng quyền → chặn
  }

  return <>{children}</>;
};

export default ProtectedRoute;

import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthRoutes from "../auth/routes/AuthRoutes";
import AppRoutes from "../iot/routes/AppRoutes";
import { useAuthStore } from "../hooks";
import { Loading } from "../ui/components";

export const AppRouter = () => {
  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === "checking") {
    return <Loading />;
  }

  return (
    <Routes>
      {status === "not-authenticated" ? (
        <>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="*" element={<Navigate to="/auth/login" />} />
        </>
      ) : (
        <>
          <Route path="/*" element={<AppRoutes />} />
        </>
      )}
    </Routes>
  );
};

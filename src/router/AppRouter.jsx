import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthRoutes from "../auth/routes/AuthRoutes";
import IotRoutes from "../iot/routes/IotRoutes";
import { useAuthStore } from "../hooks";
import { Layout } from "../iot/layout";
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
          {/* <Route path="/*" element={<IotRoutes />} /> */}
          <Route path="/*" element={<Layout />} />
        </>
      )}
    </Routes>
  );
};

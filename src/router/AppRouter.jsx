import { Route, Routes } from "react-router-dom";
import AuthRoutes from "../auth/routes/AuthRoutes";
import IotRoutes from "../iot/routes/IotRoutes";

export const AppRouter = () => {
  return (
    <Routes>
      {/* LOGIN Y REGISTRO */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* IOT ROUTES */}
      <Route path="/*" element={<IotRoutes />} />
    </Routes>
  );
};
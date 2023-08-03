import { Routes, Route, Navigate } from "react-router-dom";
import { IotPage } from "../pages";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<IotPage />} />

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default AuthRoutes
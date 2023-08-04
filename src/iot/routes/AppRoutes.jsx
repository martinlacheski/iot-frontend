import { Routes, Route, Navigate } from "react-router-dom";
import { Main } from "../pages";
import { Layout } from "../layout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Main />} />
        <Route path="/dashboard" element={<h1>dashboard</h1>} />
        <Route path="/products" element={<h1>products</h1>} />
        <Route path="/customers" element={<h1>customers</h1>} />
        <Route path="/transactions" element={<h1>transactions</h1>} />
        <Route path="/geography" element={<h1>geography</h1>} />
        <Route path="/parameters" element={<h1>parameters</h1>} />
      </Route>

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default AppRoutes
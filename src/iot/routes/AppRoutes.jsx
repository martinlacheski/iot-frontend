import { Routes, Route, Navigate } from "react-router-dom";
import { CreateEnvironment, Main } from "../pages";
import { Layout } from "../layout";
import {
  Parameters,
  Countries,
  Provinces,
  Cities,
  Organization,
  Branches,
  EnvironmentTypes,
  Environments,
  EquipmentTypes,
  Equipments,
  SensorTypes,
  Sensors,
  BoardTypes,
  Boards,
  Users
} from "../pages";

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

        <Route path="/parameters" element={<Parameters />} />
        <Route path="/parameters/countries" element={<Countries />} />
        <Route path="/parameters/provinces" element={<Provinces />} />
        <Route path="/parameters/cities" element={<Cities />} />
        <Route path="/parameters/organization" element={<Organization />} />
        <Route path="/parameters/branches" element={<Branches />} />
        <Route path="/parameters/environment-types" element={<EnvironmentTypes />} />
        <Route path="/parameters/environments" element={<Environments />} />
        <Route path="/parameters/environments/create" element={<CreateEnvironment />} />
        <Route path="/parameters/equipment-types" element={<EquipmentTypes />} />
        <Route path="/parameters/equipments" element={<Equipments />} />
        <Route path="/parameters/sensor-types" element={<SensorTypes />} />
        <Route path="/parameters/sensors" element={<Sensors />} />
        <Route path="/parameters/board-types" element={<BoardTypes />} />
        <Route path="/parameters/boards" element={<Boards />} />
        <Route path="/parameters/users" element={<Users />} />

      </Route>

      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;

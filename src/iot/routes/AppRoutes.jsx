import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../layout";
import {
  BoardTypes,
  Boards,
  Branches,
  Cities,
  Countries,
  CreateEnvironment,
  EnvironmentTypes,
  Environments,
  EquipmentTypes,
  Equipments,
  Main,
  Organization,
  Parameters,
  Provinces,
  SensorTypes,
  Sensors,
  UpdateEnvironment,
  Users,
  EnergyConsumption,
  Dashboard,
  AirQuality,
  EnergyWaste,
  EnvironmentConditions,
  SecurityMovement,
  AdjustPeopleCounter,
} from "../pages";
import { useAuthStore } from "../../hooks";
import { useEffect } from "react";

const AppRoutes = () => {
  const { role, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* RUTAS PARA TODOS LOS USUARIOS */}
        {role === "BEDELIA" || role === "ADMINISTRATIVO" || role === "SUDO" ? (
          <>
            {/* <Route path="/main" element={<Main />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/adjust-people-counter"
              element={<AdjustPeopleCounter />}
            />
          </>
        ) : null}

        {/* RUTAS PARA ADMINISTRATIVOS Y SUDO */}
        {role === "ADMINISTRATIVO" || role === "SUDO" ? (
          <>
            <Route path="/energy-consumption" element={<EnergyConsumption />} />
            <Route path="/air-quality" element={<AirQuality />} />
            <Route path="/energy-waste" element={<EnergyWaste />} />
            <Route
              path="/environment-conditions"
              element={<EnvironmentConditions />}
            />
            <Route path="/security-movement" element={<SecurityMovement />} />
          </>
        ) : null}

        {/* RUTAS PARA SUDO */}
        {role === "SUDO" ? (
          <>
            <Route path="/parameters" element={<Parameters />} />
            <Route path="/parameters/countries" element={<Countries />} />
            <Route path="/parameters/provinces" element={<Provinces />} />
            <Route path="/parameters/cities" element={<Cities />} />
            <Route path="/parameters/organization" element={<Organization />} />
            <Route path="/parameters/branches" element={<Branches />} />
            <Route
              path="/parameters/environment-types"
              element={<EnvironmentTypes />}
            />
            <Route path="/parameters/environments" element={<Environments />} />
            <Route
              path="/parameters/environments/create"
              element={<CreateEnvironment />}
            />
            <Route
              path="/parameters/environments/update/:id"
              element={<UpdateEnvironment />}
            />
            <Route
              path="/parameters/equipment-types"
              element={<EquipmentTypes />}
            />
            <Route path="/parameters/equipments" element={<Equipments />} />
            <Route path="/parameters/sensor-types" element={<SensorTypes />} />
            <Route path="/parameters/sensors" element={<Sensors />} />
            <Route path="/parameters/board-types" element={<BoardTypes />} />
            <Route path="/parameters/boards" element={<Boards />} />
            <Route path="/parameters/users" element={<Users />} />
          </>
        ) : null}
      </Route>

      <Route path="/*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;

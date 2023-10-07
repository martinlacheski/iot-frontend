import React, { Fragment, useEffect, useState, useRef } from "react";
import { Header } from "../../components/Header";
import { ReportsNavBar } from "../../components/ReportsNavBar";
import iotApi from "../../../api/iotApi";
import { showSuccessToast, showErrorAlert } from "../../../utils";
import { getDatetimeString } from "../../../helpers/getDatetimeString";
import { EnergyWasteChart } from "../../components/charts";
import { Box, Typography, Grid, Divider } from "@mui/material";
import jsPDF from "jspdf";
import { getEnvVariables } from "../../../helpers";
const { VITE_BACKEND_URL } = getEnvVariables();
import { energyWastePDF } from "./pdf/energyWastePDF";
import { useSelector } from "react-redux";

export const EnergyWaste = () => {
  const { user } = useSelector((state) => state.auth);
  const [environments, setEnvironments] = useState([]);
  const [organization, setOrganization] = useState({});
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  const [isData, setIsData] = useState(false);

  const [energyWasteCanvas, setEnergyWasteCanvas] = useState(null);

  const fetchEnvironments = async () => {
    try {
      const { data } = await iotApi.get("/environments");
      setEnvironments(data.environments);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrganization = async () => {
    try {
      const { data } = await iotApi.get("/organization");
      setOrganization(data.organization);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEnvironments();
    fetchOrganization();
  }, []);

  // SUBMIT
  const handleSubmit = async () => {
    setLoading(true);

    // VALIDACIONES BÁSICAS
    if (!selectedEnvironment || !fromDate || !toDate) {
      showErrorAlert("¡Todos los campos son obligatorios!");
      return;
    }
    if (fromDate > toDate) {
      showErrorAlert(
        "¡La fecha de inicio no puede ser mayor a la fecha final!"
      );
      return;
    }

    const queryParams = new URLSearchParams({
      fromDate: getDatetimeString(new Date(fromDate)),
      toDate: getDatetimeString(new Date(toDate)),
    });

    try {
      setIsData(false);
      const { data } = await iotApi.get(
        `/reports/energy-waste/resume/?${queryParams}`
      );
      setChartData({
        labels: data.labels,
        dataAC: data.averagePowerAC,
        dataLighting: data.averagePowerLighting,
        dataDevices: data.averagePowerDevices,
        dataMotionDetection: data.motionDetection,
      });
      setIsData(true);
      setLoading(false);

      showSuccessToast("¡Reporte generado con éxito!");
      if (!data) return;
    } catch (error) {
      showErrorAlert("¡Ocurrió un error al generar el reporte!");
      console.log(error);
    }
  };

  const handleChangeFromDate = (date) => {
    setFromDate(date);
  };

  const handleChangeToDate = (date) => {
    setToDate(date);
  };

  const handleReset = () => {
    setSelectedEnvironment("");
    setFromDate(null);
    setToDate(null);
    setChartData({});
    setLoading(true);
    setIsData(false);
  };

  const handleExportPDF = () => {
    if (!isData) {
      showErrorAlert("¡No hay datos para exportar!");
      return;
    } else if (!energyWasteCanvas) {
      showErrorAlert("¡No hay datos para exportar!");
      return;
    }

    const pdf = energyWastePDF(
      user,
      organization,
      selectedEnvironment,
      fromDate,
      toDate,
      energyWasteCanvas
    );

    pdf.save("Reporte de uso ineficiente de energía eléctrica.pdf");
  };

  return (
    <Fragment>
      <Header
        title="Reporte de uso ineficiente de energía eléctrica"
        subtitle="Desde esta sección podrá generar reportes de uso ineficiente de energía eléctrica de los ambientes de su organización."
      />

      <ReportsNavBar
        environments={environments}
        setSelectedEnvironment={setSelectedEnvironment}
        selectedEnvironment={selectedEnvironment}
        fromDate={fromDate}
        handleChangeFromDate={handleChangeFromDate}
        toDate={toDate}
        handleChangeToDate={handleChangeToDate}
        handleSubmit={handleSubmit}
        handleReset={handleReset}
        handleExportPDF={handleExportPDF}
      />

      {!loading && (
        <Fragment>
          <Box
            sx={{
              backgroundColor: "white",
              px: "2rem",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Reporte de uso ineficiente de energía eléctrica
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <EnergyWasteChart
              chartData={chartData}
              setEnergyWasteCanvas={setEnergyWasteCanvas}
            />
          </Box>
        </Fragment>
      )}
    </Fragment>
  );
};

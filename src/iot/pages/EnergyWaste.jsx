import React, { Fragment, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { ReportsNavBar } from "../components/ReportsNavBar";
import iotApi from "../../api/iotApi";
import { showSuccessToast, showErrorAlert } from "../../utils";
import { getDatetimeString } from "../../helpers/getDateTimeString";
import { EnergyWasteChart } from "../components/charts";
import { Box, Typography, Grid, Divider } from "@mui/material";

export const EnergyWaste = () => {
  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});

  const fetchEnvironments = async () => {
    try {
      const { data } = await iotApi.get("/environments");
      setEnvironments(data.environments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEnvironments();
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
      const { data } = await iotApi.get(
        `/reports/energy-waste/resume/?${queryParams}`
      );

        console.log(data);

      setChartData({
        labels: data.labels,
        dataAC: data.averagePowerAC,
        dataLighting: data.averagePowerLighting,
        dataDevices: data.averagePowerDevices,
        dataMotionDetection: data.motionDetection,
      });
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
      />

      {!loading && (
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
          <EnergyWasteChart chartData={chartData} />
        </Box>
      )}
    </Fragment>
  );
};

import React, { Fragment, useEffect, useState } from "react";
import { Header } from "../components/Header";
import { ReportsNavBar } from "../components/ReportsNavBar";
import iotApi from "../../api/iotApi";
import { showSuccessToast, showErrorAlert } from "../../utils";
import { getDatetimeString } from "../../helpers/getDateTimeString";
import {
  TemperatureChart,
  HumidityChart,
  PressureChart,
  LuminosityChart,
} from "../components/charts";
import { Box, Typography, Grid, Divider } from "@mui/material";
import { AmbientNoiseChart } from "../components/charts/AmbientNoiseChart";

export const EnvironmentConditions = () => {
  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tempData, setTempData] = useState({});
  const [humData, setHumData] = useState({});
  const [presData, setPresData] = useState({});
  const [noiseData, setNoiseData] = useState({});
  const [internalLumData, setInternalLumData] = useState({});
  const [externalLumData, setExternalLumData] = useState({});

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
        `/reports/environment-conditions/resume/?${queryParams}`
      );
      console.log(data);
      setTempData(
        {
          labels: data.tempAndHumidityData.labels,
          minTemp: data.tempAndHumidityData.minTemp,
          maxTemp: data.tempAndHumidityData.maxTemp,
        } || {}
      );
      setHumData(
        {
          labels: data.tempAndHumidityData.labels,
          minHum: data.tempAndHumidityData.minHum,
          maxHum: data.tempAndHumidityData.maxHum,
        } || {}
      );
      setPresData(
        {
          labels: data.pressureAndTempData.labels,
          minPres: data.pressureAndTempData.minPres,
          maxPres: data.pressureAndTempData.maxPres,
        } || {}
      );  
      setNoiseData(
        {
          labels: data.ambientNoiseData.labels,
          values: data.ambientNoiseData.averageNoise,
        } || {}
      );
      setInternalLumData(
        {
          title: "Niveles de luminosidad interna",
          labels: data.internalLuminosityData.labels,
          mins: data.internalLuminosityData.minLevel,
          maxs: data.internalLuminosityData.maxLevel,
        } || {}
      );
      setExternalLumData(
        {
          title: "Niveles de luminosidad externa",
          labels: data.externalLuminosityData.labels,
          mins: data.externalLuminosityData.minLevel,
          maxs: data.externalLuminosityData.maxLevel,
        } || {}
      );

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
    setLoading(true);
    setTempData({});
    setHumData({});
    setPresData({});
  };

  return (
    <Fragment>
      <Header
        title="Reporte de condiciones del ambiente"
        subtitle="Desde esta sección podrá generar reportes de las condiciones del ambiente."
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
          <Fragment>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Reporte de condiciones climáticas
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TemperatureChart tempData={tempData} />
              </Grid>
              <Grid item xs={12} md={6}>
                <HumidityChart humData={humData} />
              </Grid>
              <Grid item xs={12} md={6}>
                <PressureChart presData={presData} />
              </Grid>
              <Grid item xs={12} md={6}>
                <AmbientNoiseChart noiseData={noiseData} />
              </Grid>
              <Grid item xs={12} md={6}>
                <LuminosityChart data={internalLumData} />
              </Grid>
              <Grid item xs={12} md={6}>
                <LuminosityChart data={externalLumData} />
              </Grid>
            </Grid>
          </Fragment>
        </Box>
      )}
    </Fragment>
  );
};

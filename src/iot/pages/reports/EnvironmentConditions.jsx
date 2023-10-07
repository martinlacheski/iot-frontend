import React, { Fragment, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { ReportsNavBar } from "../../components/ReportsNavBar";
import iotApi from "../../../api/iotApi";
import { showSuccessToast, showErrorAlert } from "../../../utils";
import { getDatetimeString } from "../../../helpers/getDatetimeString";
import {
  TemperatureChart,
  HumidityChart,
  PressureChart,
  LuminosityChart,
} from "../../components/charts";
import { Box, Typography, Grid, Divider } from "@mui/material";
import { AmbientNoiseChart } from "../../components/charts/AmbientNoiseChart";
import { environmentConditionsPDF } from "./pdf/environmentConditionsPDF";
import { useSelector } from "react-redux";

export const EnvironmentConditions = () => {
  const { user } = useSelector((state) => state.auth);

  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isData, setIsData] = useState(false);

  const [tempData, setTempData] = useState({});
  const [humData, setHumData] = useState({});
  const [presData, setPresData] = useState({});
  const [noiseData, setNoiseData] = useState({});
  const [internalLumData, setInternalLumData] = useState({});
  const [externalLumData, setExternalLumData] = useState({});

  const [organization, setOrganization] = useState({});
  const [temperaturaCanvas, setTemperaturaCanvas] = useState(null);
  const [humedadCanvas, setHumedadCanvas] = useState(null);
  const [presionCanvas, setPresionCanvas] = useState(null);
  const [ruidoCanvas, setRuidoCanvas] = useState(null);
  const [iluminacionIntCanvas, setIluminacionIntCanvas] = useState(null);
  const [iluminacionExtCanvas, setIluminacionExtCanvas] = useState(null);

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
        `/reports/environment-conditions/resume/?${queryParams}`
      );
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
    setLoading(true);
    setTempData({});
    setHumData({});
    setPresData({});
    setNoiseData({});
    setInternalLumData({});
    setExternalLumData({});
    setIsData(false);
  };

  const handleExportPDF = () => {
    if (!isData) {
      showErrorAlert("¡No hay datos para exportar!");
      return;
    } else if (
      !temperaturaCanvas ||
      !humedadCanvas ||
      !presionCanvas ||
      !ruidoCanvas ||
      !iluminacionIntCanvas ||
      !iluminacionExtCanvas
    ) {
      showErrorAlert("¡No hay datos para exportar!");
      return;
    }

    const pdf = environmentConditionsPDF(
      user,
      organization,
      selectedEnvironment,
      fromDate,
      toDate,
      temperaturaCanvas,
      humedadCanvas,
      presionCanvas,
      ruidoCanvas,
      iluminacionIntCanvas,
      iluminacionExtCanvas
    );

    pdf.save("Reporte de condiciones del ambiente.pdf");
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
        handleExportPDF={handleExportPDF}
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
              <Grid item xs={12}>
                <TemperatureChart
                  tempData={tempData}
                  setTemperaturaCanvas={setTemperaturaCanvas}
                />
              </Grid>
              <Grid item xs={12}>
                <HumidityChart
                  humData={humData}
                  setHumedadCanvas={setHumedadCanvas}
                />
              </Grid>
              <Grid item xs={12}>
                <PressureChart
                  presData={presData}
                  setPresionCanvas={setPresionCanvas}
                />
              </Grid>
              <Grid item xs={12}>
                <AmbientNoiseChart
                  noiseData={noiseData}
                  setRuidoCanvas={setRuidoCanvas}
                />
              </Grid>
              <Grid item xs={12}>
                <LuminosityChart
                  data={internalLumData}
                  setIluminacionCanvas={setIluminacionIntCanvas}
                />
              </Grid>
              <Grid item xs={12}>
                <LuminosityChart
                  data={externalLumData}
                  setIluminacionCanvas={setIluminacionExtCanvas}
                />
              </Grid>
            </Grid>
          </Fragment>
        </Box>
      )}
    </Fragment>
  );
};

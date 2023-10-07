import React, { Fragment, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Box, Typography, Grid, Divider } from "@mui/material";
import iotApi from "../../../api/iotApi";
import { showSuccessToast, showErrorAlert } from "../../../utils";
import { getDatetimeString } from "../../../helpers/getDatetimeString";
import { ReportsNavBar } from "../../components/ReportsNavBar";
import { MQChart } from "../../components/charts";
import { airQualityPDF } from "./pdf/airQualityPDF";
import { useSelector } from "react-redux";

export const AirQuality = () => {
  const { user } = useSelector((state) => state.auth);
  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [mq2, setMQ2] = useState({});
  const [mq4, setMQ4] = useState({});
  const [mq7, setMQ7] = useState({});
  const [mq135, setMQ135] = useState({});
  const [loading, setLoading] = useState(true);
  const [isData, setIsData] = useState(false);

  const [organization, setOrganization] = useState({});
  const [mq2Canvas, setMQ2Canvas] = useState(null);
  const [mq4Canvas, setMQ4Canvas] = useState(null);
  const [mq7Canvas, setMQ7Canvas] = useState(null);
  const [mq135Canvas, setMQ135Canvas] = useState(null);

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
        `/reports/gases/resume/?${queryParams}`
      );
      setMQ2(data.mq2);
      setMQ4(data.mq4);
      setMQ7(data.mq7);
      setMQ135(data.mq135);
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
    setMQ2({});
    setMQ4({});
    setMQ7({});
    setMQ135({});
    setLoading(true);
    setIsData(false);
  };

  const handleExportPDF = () => {
    if (!isData) {
      showErrorAlert("¡No hay datos para exportar!");
      return;
    } else if (!mq2Canvas || !mq4Canvas || !mq7Canvas || !mq135Canvas) {
      showErrorAlert("¡No hay datos para exportar!");
      return;
    }

    const pdf = airQualityPDF(
      user,
      organization,
      selectedEnvironment,
      fromDate,
      toDate,
      mq2Canvas,
      mq4Canvas,
      mq7Canvas,
      mq135Canvas
    );

    pdf.save("Reporte de calidad del aire.pdf");
  };

  return (
    <Fragment>
      <Header
        title="Reporte de calidad de aire"
        subtitle="Desde esta sección podrá generar reportes de calidad de aire de los ambientes de su organización."
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
              Reporte de calidad de aire
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} lg={12}>
                <MQChart data={mq2} setCanvas={setMQ2Canvas} />
              </Grid>
              <Grid item xs={12} lg={12}>
                <MQChart data={mq4} setCanvas={setMQ4Canvas} />
              </Grid>
              <Grid item xs={12} lg={12}>
                <MQChart data={mq7} setCanvas={setMQ7Canvas} />
              </Grid>
              <Grid item xs={12} lg={12}>
                <MQChart data={mq135} setCanvas={setMQ135Canvas} />
              </Grid>
            </Grid>
          </Fragment>
        </Box>
      )}
    </Fragment>
  );
};

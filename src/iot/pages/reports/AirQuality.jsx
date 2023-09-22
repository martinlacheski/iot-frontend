import React, { Fragment, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Box, Typography, Grid, Divider } from "@mui/material";
import iotApi from "../../../api/iotApi";
import { showSuccessToast, showErrorAlert } from "../../../utils";
import { getDatetimeString } from "../../../helpers/getDatetimeString";
import { ReportsNavBar } from "../../components/ReportsNavBar";
import { MQChart } from "../../components/charts";

export const AirQuality = () => {
  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [mq2, setMQ2] = useState({});
  const [mq4, setMQ4] = useState({});
  const [mq7, setMQ7] = useState({});
  const [mq135, setMQ135] = useState({});
  const [loading, setLoading] = useState(true);

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
        `/reports/gases/resume/?${queryParams}`
      );
      setMQ2(data.mq2);
      setMQ4(data.mq4);
      setMQ7(data.mq7);
      setMQ135(data.mq135);
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
              <Grid item xs={12} md={6}>
                <MQChart data={mq2} />
              </Grid>
              <Grid item xs={12} md={6}>
                <MQChart data={mq4} />
              </Grid>
              <Grid item xs={12} md={6}>
                <MQChart data={mq7} />
              </Grid>
              <Grid item xs={12} md={6}>
                <MQChart data={mq135} />
              </Grid>
            </Grid>
          </Fragment>
        </Box>
      )}
    </Fragment>
  );
};

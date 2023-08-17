import React, { Fragment, useEffect, useState } from "react";
import { Header } from "../components/Header";

// Graficos
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { FlexBetween } from "../components/FlexBetween";
import iotApi from "../../api/iotApi";
import {
  EditNoteOutlined,
  RestartAltOutlined,
  AcUnitOutlined,
  LightModeOutlined,
  PowerOutlined,
  PictureAsPdfOutlined,
} from "@mui/icons-material";
import {
  showSuccessToast,
  showErrorAlert,
} from "../../utils";
import { getDatetimeString } from "../../helpers/getDateTimeString";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const voltageChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Tensión (V)",
    },
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      ticks: {
        callback: function (value, index, values) {
          return value + " V";
        },
      },
      min: 200,
      max: 250,
    },
  },
};

const currentChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Corriente (A)",
    },
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      ticks: {
        callback: function (value, index, values) {
          return value + " A";
        },
      },
    },
  },
};

const powerChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Potencia (W)",
    },
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      ticks: {
        callback: function (value, index, values) {
          return value + " W";
        },
      },
    },
  },
};

const pfChartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Factor de potencia",
    },
    legend: {
      position: "top",
    },
  },
};

export const EnergyConsumption = () => {
  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // VARIABLES PARA LOS GRÁFICOS
  const [labels, setLabels] = useState([]);
  const [voltageChartData, setVoltageChartData] = useState({});
  const [currentChartData, setCurrentChartData] = useState({});
  const [powerChartData, setPowerChartData] = useState({});
  const [pfChartData, setPfChartData] = useState({});
  const [timeLapse, setTimeLapse] = useState("");
  const [consumption, setConsumption] = useState({});

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
    setTimeLapse("");
    setVoltageChartData({});
    setCurrentChartData({});
    setPowerChartData({});
    setPfChartData({});
    setConsumption({});
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

    const params = {
      fromDate: getDatetimeString(new Date(fromDate)),
      toDate: getDatetimeString(new Date(toDate)),
      diffInHours: Math.abs(toDate - fromDate) / 36e5,
    };

    try {
      const { data } = await iotApi.get("/reports/energy-consumption/resume", {
        params,
      });
      showSuccessToast("¡Reporte generado con éxito!");
      if (!data) return;

      // ACTUALIZAR LOS DATOS DE LOS GRÁFICOS
      setLabels(data.labels);
      const voltageChart = {
        labels: data.labels,
        datasets: [
          {
            label: "Aire acondicionado",
            data: data.averagedVoltageDataAC,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "Tomas de corriente",
            data: data.averagedVoltageDataDevices,
            fill: false,
            borderColor: "rgb(75, 142, 192)",
            tension: 0.1,
          },
          {
            label: "Iluminación",
            data: data.averagedVoltageDataLighting,
            fill: false,
            borderColor: "rgb(75, 92, 192)",
          },
        ],
      };

      const currentChart = {
        labels: data.labels,
        datasets: [
          {
            label: "Aire acondicionado",
            data: data.averagedCurrentDataAC,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "Tomas de corriente",
            data: data.averagedCurrentDataDevices,
            fill: false,
            borderColor: "rgb(75, 142, 192)",
            tension: 0.1,
          },
          {
            label: "Iluminación",
            data: data.averagedCurrentDataLighting,
            fill: false,
            borderColor: "rgb(75, 92, 192)",
          },
        ],
      };

      const powerChart = {
        labels: data.labels,
        datasets: [
          {
            label: "Aire acondicionado",
            data: data.averagedPowerDataAC,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "Tomas de corriente",
            data: data.averagedPowerDataDevices,
            fill: false,
            borderColor: "rgb(75, 142, 192)",
            tension: 0.1,
          },
          {
            label: "Iluminación",
            data: data.averagedPowerDataLighting,
            fill: false,
            borderColor: "rgb(75, 92, 192)",
          },
        ],
      };

      const pfChart = {
        labels: data.labels,
        datasets: [
          {
            label: "Aire acondicionado",
            data: data.averagedPfDataAC,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "Tomas de corriente",
            data: data.averagedPfDataDevices,
            fill: false,
            borderColor: "rgb(75, 142, 192)",
            tension: 0.1,
          },
          {
            label: "Iluminación",
            data: data.averagedPfDataLighting,
            fill: false,
            borderColor: "rgb(75, 92, 192)",
          },
        ],
      };

      setVoltageChartData(voltageChart);
      setCurrentChartData(currentChart);
      setPowerChartData(powerChart);
      setPfChartData(pfChart);

      setTimeLapse(data.diff);

      const consumption = [
        {
          title: "Aire acondicionado",
          total: data.totalEnergyConsumptionAC,
          hourly: data.hourlyEnergyConsumptionAC,
          icon: <AcUnitOutlined />,
        },
        {
          title: "Tomas de corriente",
          total: data.totalEnergyConsumptionDevices,
          hourly: data.hourlyEnergyConsumptionDevices,
          icon: <PowerOutlined />,
        },
        {
          title: "Iluminación",
          total: data.totalEnergyConsumptionLighting,
          hourly: data.hourlyEnergyConsumptionLighting,
          icon: <LightModeOutlined />,
        },
      ];

      setConsumption(consumption);
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
    setVoltageChartData({});
    setCurrentChartData({});
    setPowerChartData({});
    setPfChartData({});
    setTimeLapse("");
    setConsumption({});
  };

  return (
    <Fragment>
      <Header
        title="Reporte de consumo energético"
        subtitle="Desde esta sección podrá generar reportes del consumo de energía eléctrica en un determinado ambiente."
      />

      <Box sx={{ p: "0.5rem 2rem 1rem 2rem", backgroundColor: "white" }}>
        <FlexBetween>
          <Grid container spacing={1} sx={{ width: "100%" }}>
            <Grid item xs={12} md={5}>
              <FormControl fullWidth>
                <InputLabel>Seleccione un ambiente de la lista</InputLabel>
                <Select
                  name="environment"
                  value={selectedEnvironment}
                  onChange={(e) => setSelectedEnvironment(e.target.value)}
                  placeholder="Seleccione un ambiente de la lista"
                  sx={{ backgroundColor: "white" }}
                >
                  {environments.map((environment) => (
                    <MenuItem key={environment._id} value={environment._id}>
                      {environment.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <DateTimePicker
                format="DD/MM/YYYY HH:mm:ss"
                ampm={false}
                value={fromDate}
                onChange={handleChangeFromDate}
                label="Desde fecha"
                sx={{ width: "100%", backgroundColor: "white" }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <DateTimePicker
                format="DD/MM/YYYY HH:mm:ss"
                ampm={false}
                value={toDate}
                onChange={handleChangeToDate}
                label="Hasta fecha"
                sx={{ width: "100%", backgroundColor: "white" }}
              />
            </Grid>
            <Grid item xs={4} md={1}>
              <Button
                title="Generar reporte"
                variant="contained"
                onClick={handleSubmit}
                sx={{ height: "100%", width: "100%", gap: 0.5 }}
                size="small"
              >
                <EditNoteOutlined fontSize="small" />
                Generar
              </Button>
            </Grid>
            <Grid item xs={4} md={1}>
              <Button
                title="Limpiar campos"
                variant="contained"
                onClick={handleReset}
                color="secondary"
                sx={{ height: "100%", width: "100%", gap: 0.5 }}
                size="small"
              >
                <RestartAltOutlined fontSize="small" />
                Limpiar
              </Button>
            </Grid>
            <Grid item xs={4} md={1}>
              <Button
                title="Exportar reporte"
                variant="contained" 
                color="error"
                sx={{ height: "100%", width: "100%", gap: 0.5 }}
                size="small"
              >
                <PictureAsPdfOutlined fontSize="small" />
                Exportar
              </Button>
            </Grid>
          </Grid>
        </FlexBetween>

        {/* ESTADÍSTICAS */}
        {consumption.length > 0 && (
          <Grid container spacing={1} sx={{ my: "1rem" }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: "1rem" }}>
                Consumo energético
                {timeLapse && (
                  <span>
                    {" "}
                    en <strong>{timeLapse}</strong>
                  </span>
                )}
              </Typography>
              <Grid container spacing={1}>
                {consumption.map((item, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Box
                      sx={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        p: ".5rem",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: ".5rem",
                        }}
                      >
                        {item.icon}
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {item.title}
                        </Typography>
                      </Box>
                      <FlexBetween
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body4">
                          <strong>Consumo total:</strong> {item.total} kW
                        </Typography>
                        <Typography variant="body4">
                          <strong>Consumo promedio/hora:</strong> {item.hourly}{" "}
                          kWh
                        </Typography>
                      </FlexBetween>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              {
                // MOSTRAR LOS GRÁFICOS SI YA SE GENERÓ EL REPORTE
                powerChartData.labels && (
                  <Line data={powerChartData} options={powerChartOptions} />
                )
              }
            </Grid>
            <Grid item xs={12} md={6}>
              {
                // MOSTRAR LOS GRÁFICOS SI YA SE GENERÓ EL REPORTE
                voltageChartData.labels && (
                  <Line data={voltageChartData} options={voltageChartOptions} />
                )
              }
            </Grid>
            <Grid item xs={12} md={6}>
              {
                // MOSTRAR LOS GRÁFICOS SI YA SE GENERÓ EL REPORTE
                currentChartData.labels && (
                  <Line data={currentChartData} options={currentChartOptions} />
                )
              }
            </Grid>
            <Grid item xs={12} md={6}>
              {
                // MOSTRAR LOS GRÁFICOS SI YA SE GENERÓ EL REPORTE
                pfChartData.labels && (
                  <Line data={pfChartData} options={pfChartOptions} />
                )
              }
            </Grid>
          </Grid>
        )}
      </Box>
    </Fragment>
  );
};

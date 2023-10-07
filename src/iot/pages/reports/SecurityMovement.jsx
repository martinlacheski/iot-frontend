import React, { Fragment, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { ReportsNavBar } from "../../components/ReportsNavBar";
import iotApi from "../../../api/iotApi";
import { showSuccessToast, showErrorAlert } from "../../../utils";
import { getDatetimeString } from "../../../helpers/getDatetimeString";
import { Box, Typography, Grid, Divider } from "@mui/material";
import { SecurityMovementChart } from "../../components/charts";
import { securityMovementPDF } from "./pdf/securityMovementPDF";

export const SecurityMovement = () => {
  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  const [organization, setOrganization] = useState({});

  const fetchEnvironments = async () => {
    try {
      const { data } = await iotApi.get("/environments");
      setEnvironments(data.environments);
    } catch (error) {
      console.log(error);
      showErrorAlert("¡Ocurrió un error al cargar los ambientes!");
    }
  };

  const fetchOrganization = async () => {
    try {
      const { data } = await iotApi.get("/organization");
      setOrganization(data.organization);
    } catch (error) {
      console.log(error);
    }
  }

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
      const { data } = await iotApi.get(
        `/reports/security-movement/resume/?${queryParams}`
      );
      setTableData(data);
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
  };

  const handleExportPDF = () => {
    console.log('make pdf');
    if (!tableData) return;
    const pdf = securityMovementPDF(
      organization,
      selectedEnvironment,
      fromDate,
      toDate,
      tableData
    );

    pdf.save(`Reporte de movimiento de personas y estado de puertas y ventanas.pdf`);
  }

  return (
    <Fragment>
      <Header
        title="Reporte de movimiento de personas y estado de puertas y ventanas"
        subtitle="Desde esta sección podrá generar reportes de movimientos y estado de puertas y ventanas de los ambientes."
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
              Reporte de movimiento de personas y estado de puertas y ventanas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <SecurityMovementChart data={tableData} />
          </Fragment>
        </Box>
      )}
    </Fragment>
  );
};

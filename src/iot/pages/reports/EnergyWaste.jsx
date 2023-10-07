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

export const EnergyWaste = () => {
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

    const canvas = energyWasteCanvas;
    const pngUrl = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "px", "a4", "false");

    // Encabezado
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${organization.name}`, pdf.internal.pageSize.width / 2, 20, {
      align: "center",
    });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(
      `${organization.address} - ${organization.city.name}`,
      pdf.internal.pageSize.width / 2,
      30,
      { align: "center" }
    );

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(8);
    pdf.text(
      `Teléfono: ${organization.phone} - ${organization.email} - ${organization.webpage}`,
      pdf.internal.pageSize.width / 2,
      38,
      { align: "center" }
    );

    const logo = new Image();
    logo.src = `${VITE_BACKEND_URL}/${organization.logo}`;
    pdf.addImage(logo, "PNG", 20, 10, 40, 30);

    // hr
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(20, 45, pdf.internal.pageSize.width - 20, 45);

    // Título
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(
      "Reporte de uso ineficiente de energía eléctrica",
      pdf.internal.pageSize.width / 2,
      60,
      { align: "center" }
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(`Ambiente: ${selectedEnvironment.name}`, 20, 75, {
      align: "left",
    });

    pdf.text(`Desde: ${getDatetimeString(new Date(fromDate))}`, 20, 85, {
      align: "left",
    });

    pdf.text(`Hasta: ${getDatetimeString(new Date(toDate))}`, 20, 95, {
      align: "left",
    });

    // Adjust the size of the chart to the PDF width
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(pngUrl, "PNG", 20, 105, pdfWidth - 40, pdfHeight);

    // Footer con número de página, fecha y hora
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(
      `Reporte generado el ${getDatetimeString(
        new Date()
      )}   -   Página ${pdf.internal.getNumberOfPages()}`,
      pdf.internal.pageSize.width - 20,
      pdf.internal.pageSize.height - 10,
      { align: "right" }
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
              organization={organization}
              setEnergyWasteCanvas={setEnergyWasteCanvas}
            />
          </Box>
        </Fragment>
      )}
    </Fragment>
  );
};

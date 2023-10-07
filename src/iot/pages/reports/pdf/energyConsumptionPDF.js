import jsPDF from "jspdf";
import { getEnvVariables, getDatetimeString, getLocaleDatetimeString } from "../../../../helpers";
const { VITE_BACKEND_URL } = getEnvVariables();

export const energyConsumptionPDF = (
    user,
    organization,
    selectedEnvironment,
    fromDate,
    toDate,
    potenciaCanvas,
    tensionCanvas,
    corrienteCanvas,
    factorPotenciaCanvas,
    consumption
) => {
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
        "Reporte de consumo de energía eléctrica",
        pdf.internal.pageSize.width / 2,
        60,
        { align: "center" }
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(`Ambiente: ${selectedEnvironment.name}`, 20, 75, {
        align: "left",
    });

    pdf.text(`Desde: ${getLocaleDatetimeString(new Date(fromDate))}`, 20, 85, {
        align: "left",
    });

    pdf.text(`Hasta: ${getLocaleDatetimeString(new Date(toDate))}`, 20, 95, {
        align: "left",
    });


    // CONSUMOS
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(
        "Consumos",
        pdf.internal.pageSize.width / 2,
        110,
        { align: "center" }
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    let text = 'Línea: ' + consumption[0].title + ' - Consumo total: ' + consumption[0].total + ' kWh - Consumo promedio por hora: ' + consumption[0].hourly + ' kWh';
    pdf.text(text, 20, 125, {
        align: "left",
    });

    text = 'Línea: ' + consumption[1].title + ' - Consumo total: ' + consumption[1].total + ' kWh - Consumo promedio por hora: ' + consumption[1].hourly + ' kWh';
    pdf.text(text, 20, 135, {
        align: "left",
    });

    text = 'Línea: ' + consumption[2].title + ' - Consumo total: ' + consumption[2].total + ' kWh - Consumo promedio por hora: ' + consumption[2].hourly + ' kWh';
    pdf.text(text, 20, 145, {
        align: "left",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();

    const potenciaImg = potenciaCanvas.toDataURL("image/png");
    const potenciaHeight = 100 * potenciaCanvas.width / potenciaCanvas.height;
    pdf.addImage(potenciaImg, "PNG", 20, 165, pdfWidth - 40, potenciaHeight);

    const tensionImg = tensionCanvas.toDataURL("image/png");
    const tensionHeight = 100 * tensionCanvas.width / tensionCanvas.height;
    pdf.addImage(tensionImg, "PNG", 20, 165 + potenciaHeight + 10, pdfWidth - 40, tensionHeight);

    // Footer con número de página, fecha y hora
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(
        `Reporte generado el ${getLocaleDatetimeString(
            new Date()
        )} por ${user?.name} - Página ${pdf.internal.getNumberOfPages()} de 2`,
        pdf.internal.pageSize.width - 20,
        pdf.internal.pageSize.height - 10,
        { align: "right" }
    );

    // Nueva página
    pdf.addPage();

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

    pdf.addImage(logo, "PNG", 20, 10, 40, 30);

    // hr
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(20, 45, pdf.internal.pageSize.width - 20, 45);

    const corrienteImg = corrienteCanvas.toDataURL("image/png");
    const corrienteHeight = 100 * corrienteCanvas.width / corrienteCanvas.height;
    pdf.addImage(corrienteImg, "PNG", 20, 60, pdfWidth - 40, corrienteHeight);

    // Saltar dos líneas
    pdf.text("", 20, 60 + corrienteHeight + 10);

    const factorPotenciaImg = factorPotenciaCanvas.toDataURL("image/png");
    const factorPotenciaHeight = 100 * factorPotenciaCanvas.width / factorPotenciaCanvas.height;
    pdf.addImage(factorPotenciaImg, "PNG", 20, 60 + corrienteHeight + 20, pdfWidth - 40, factorPotenciaHeight);

    // Footer con número de página, fecha y hora
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(
        `Reporte generado el ${getDatetimeString(
            new Date()
        )} por ${user?.name} - Página ${pdf.internal.getNumberOfPages()} de 2 `,
        pdf.internal.pageSize.width - 20,
        pdf.internal.pageSize.height - 10,
        { align: "right" }
    );

    return pdf;
}
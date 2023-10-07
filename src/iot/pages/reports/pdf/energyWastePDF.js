import jsPDF from "jspdf";
import { getEnvVariables, getDatetimeString, getLocaleDatetimeString } from "../../../../helpers";
const { VITE_BACKEND_URL } = getEnvVariables();

export const energyWastePDF = (
    user,
    organization,
    selectedEnvironment,
    fromDate,
    toDate,
    energyWasteCanvas,
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

    pdf.text(`Desde: ${getLocaleDatetimeString(fromDate)}`, 20, 85, {
        align: "left",
    });

    pdf.text(`Hasta: ${getLocaleDatetimeString(toDate)}`, 20, 95, {
        align: "left",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();

    // Gráficas
    const energyWasteImg = energyWasteCanvas.toDataURL("image/png");
    const energyWasteImgHeigth = (energyWasteCanvas.height * pdfWidth) / energyWasteCanvas.width;
    pdf.addImage(energyWasteImg, "PNG", 20, 100, pdfWidth - 40, energyWasteImgHeigth);

    // Footer con número de página, fecha y hora
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(
        `Reporte generado el ${
            getLocaleDatetimeString(new Date())
        } por ${user?.name} - Página ${pdf.internal.getNumberOfPages()} de ${pdf.internal.getNumberOfPages()}`,
        pdf.internal.pageSize.width - 20,
        pdf.internal.pageSize.height - 10,
        { align: "right" }
    );

    return pdf;
}
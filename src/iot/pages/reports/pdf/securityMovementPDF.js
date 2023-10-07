import jsPDF from "jspdf";
import "jspdf-autotable";
import { getEnvVariables, getDatetimeString } from "../../../../helpers";
const { VITE_BACKEND_URL } = getEnvVariables();

export const securityMovementPDF = (
    organization,
    selectedEnvironment,
    fromDate,
    toDate,
    tableData
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
        "Reporte de movimientos. Estado de las puertas y ventanas.",
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

    const columns = ["DESDE", "HASTA", "DETECTADO", "MOVIMIENTOS", "INICIAL", "FINAL", "MÍNIMO", "MÁXIMO", "PUERTAS", "VENTANAS"];

    const data = Object.values(tableData.data);
    console.log(data);
    const rows = data.map((row) => {
        return [
            row.dateRange.initial,
            row.dateRange.final,
            row.motionDetection.wasDetected ? "SI" : "NO",
            row.motionDetection.count,
            row.countPeople.initial,
            row.countPeople.final,
            row.countPeople.min,
            row.countPeople.max,
            row.windowsStatus.wereOpen ? "Abiertas" : "Cerradas",
            row.doorsStatus.wereOpen ? "Abiertas" : "Cerradas",
        ];
    });
    // Fill two rows with empty data


    console.log(tableData);
    pdf.autoTable({
        startY: 110,
        head: [columns],
        body: rows,
        theme: "grid",
        // Make head and foot bold
        headStyles: {
            fillColor: [41, 128, 186],
            fontSize: 7,
            halign: "center",
            valign: "middle",
        },
        styles: { fontSize: 7 },
    });

    return pdf;
}
import jsPDF from "jspdf";
import { getEnvVariables, getDatetimeString } from "../../../../helpers";
const { VITE_BACKEND_URL } = getEnvVariables();

export const environmentConditionsPDF = (
    organization,
    selectedEnvironment,
    fromDate,
    toDate,
    temperaturaCanvas,
    humedadCanvas,
    presionCanvas,
    ruidoCanvas,
    iluminacionIntCanvas,
    iluminacionExtCanvas,
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
        "Reporte de condiciones ambientales",
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

   
    const pdfWidth = pdf.internal.pageSize.getWidth();

    // Gráficas
    const temperaturaImg = temperaturaCanvas.toDataURL("image/png");
    const temperaturaHeight = 100 * temperaturaCanvas.width / temperaturaCanvas.height;
    pdf.addImage(temperaturaImg, "PNG", 20, 100, pdfWidth - 40, temperaturaHeight);

    // Saltar dos líneas
    pdf.text("", 20, 100 + temperaturaHeight + 10);

    const humedadImg = humedadCanvas.toDataURL("image/png");
    const humedadHeight = 100 * humedadCanvas.width / humedadCanvas.height;
    pdf.addImage(humedadImg, "PNG", 20, 100 + temperaturaHeight + 20, pdfWidth - 40, humedadHeight);
    
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

    // Gráficas
    const presionImg = presionCanvas.toDataURL("image/png");
    const presionHeight = 100 * presionCanvas.width / presionCanvas.height;
    pdf.addImage(presionImg, "PNG", 20, 100, pdfWidth - 40, presionHeight);

    // Saltar dos líneas
    pdf.text("", 20, 100 + presionHeight + 10);

    const ruidoImg = ruidoCanvas.toDataURL("image/png");
    const ruidoHeight = 100 * ruidoCanvas.width / ruidoCanvas.height;
    pdf.addImage(ruidoImg, "PNG", 20, 100 + presionHeight + 20, pdfWidth - 40, ruidoHeight);

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

    // Gráficas
    const iluminacionIntImg = iluminacionIntCanvas.toDataURL("image/png");
    const iluminacionIntHeight = 100 * iluminacionIntCanvas.width / iluminacionIntCanvas.height;
    pdf.addImage(iluminacionIntImg, "PNG", 20, 100, pdfWidth - 40, iluminacionIntHeight);

    // Saltar dos líneas
    pdf.text("", 20, 100 + iluminacionIntHeight + 10);

    const iluminacionExtImg = iluminacionExtCanvas.toDataURL("image/png");
    const iluminacionExtHeight = 100 * iluminacionExtCanvas.width / iluminacionExtCanvas.height;
    pdf.addImage(iluminacionExtImg, "PNG", 20, 100 + iluminacionIntHeight + 20, pdfWidth - 40, iluminacionExtHeight);

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

    return pdf;
}
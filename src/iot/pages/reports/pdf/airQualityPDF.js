import jsPDF from "jspdf";
import { getEnvVariables, getDatetimeString, getLocaleDatetimeString } from "../../../../helpers";
const { VITE_BACKEND_URL } = getEnvVariables();

export const airQualityPDF = (
    user,
    organization,
    selectedEnvironment,
    fromDate,
    toDate,
    mq2Canvas,
    mq4Canvas,
    mq7Canvas,
    mq135Canvas
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
        "Reporte de calidad del aire",
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

    const pdfWidth = pdf.internal.pageSize.getWidth();

    // Gráficas
    const mq2Img = mq2Canvas.toDataURL("image/png");
    const mq2Height = 100 * mq2Canvas.width / mq2Canvas.height;
    pdf.addImage(mq2Img, "PNG", 20, 100, pdfWidth - 40, mq2Height);

    // Saltar dos líneas
    pdf.text("", 20, 100 + mq2Height + 10);

    const mq4Img = mq4Canvas.toDataURL("image/png");
    const mq4Height = 100 * mq4Canvas.width / mq4Canvas.height;
    pdf.addImage(mq4Img, "PNG", 20, 100 + mq2Height + 20, pdfWidth - 40, mq4Height);

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

    // Gráficas
    const mq7Img = mq7Canvas.toDataURL("image/png");
    const mq7Height = 100 * mq7Canvas.width / mq7Canvas.height;
    pdf.addImage(mq7Img, "PNG", 20, 100, pdfWidth - 40, mq7Height);

    // Saltar dos líneas
    pdf.text("", 20, 100 + mq7Height + 10);

    const mq135Img = mq135Canvas.toDataURL("image/png");
    const mq135Height = 100 * mq135Canvas.width / mq135Canvas.height;
    pdf.addImage(mq135Img, "PNG", 20, 100 + mq7Height + 20, pdfWidth - 40, mq135Height);

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

    return pdf;
}
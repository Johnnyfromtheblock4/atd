import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* PDF Exporter */
const ExportWeekPDF = ({ tableRef, settimanaCorrente, formatDate }) => {
  const esportaSettimanaPDF = async () => {
    if (!tableRef?.current) return;

    tableRef.current.classList.add("pdf-export");

    // Cattura tabella
    const canvas = await html2canvas(tableRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    // Rimuove gli stili PDF-only dopo la cattura
    tableRef.current.classList.remove("pdf-export");

    const imgData = canvas.toDataURL("image/png");

    // PDF landscape
    const pdf = new jsPDF("landscape", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    /* LOGO */
    const logo = new Image();
    logo.src = "/atd-logo.png";

    // Attendi caricamento logo
    await new Promise((resolve) => {
      logo.onload = resolve;
    });

    pdf.addImage(logo, "PNG", 10, 10, 30, 30);

    /* TITOLO */
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(
      "Servizi Associazione Trasporto Disabili Busnago",
      pageWidth / 2,
      22,
      { align: "center" }
    );

    /* SOTTOTITOLO */
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(13);
    pdf.text(
      `Settimana del ${formatDate(settimanaCorrente)}`,
      pageWidth / 2,
      30,
      { align: "center" }
    );

    /* POSIZIONE TABELLA */
    const tableY = 40;
    const marginX = 10;
    const usableWidth = pageWidth - marginX * 2;
    const imgHeight = (canvas.height * usableWidth) / canvas.width;

    let remainingHeight = imgHeight;
    let positionY = tableY;
    let pageOffset = 0;

    while (remainingHeight > 0) {
      pdf.addImage(
        imgData,
        "PNG",
        marginX,
        positionY - pageOffset,
        usableWidth,
        imgHeight
      );

      remainingHeight -= pageHeight - positionY;

      if (remainingHeight > 0) {
        pdf.addPage();
        pageOffset += pageHeight - positionY;
        positionY = 10;
      }
    }

    /* SALVATAGGIO */
    const nomeFile = `servizi_settimana_${formatDate(
      settimanaCorrente
    ).replaceAll("/", "-")}.pdf`;

    pdf.save(nomeFile);
  };

  return (
    <div className="text-end mt-3 col-12 text-center">
      <button className="btn btn-success" onClick={esportaSettimanaPDF}>
        Esporta settimana in PDF
      </button>
    </div>
  );
};

export default ExportWeekPDF;

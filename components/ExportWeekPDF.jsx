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
      useCORS: true,
    });

    // Rimuove gli stili PDF-only dopo la cattura
    tableRef.current.classList.remove("pdf-export");

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
      logo.onerror = resolve; // evita blocchi se il logo non carica
    });

    /* HEADER (solo prima pagina) */
    const drawHeader = () => {
      pdf.addImage(logo, "PNG", 10, 10, 30, 30);

      /* TITOLO */
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text(
        "Servizi Associazione Trasporto Disabili Busnago",
        pageWidth / 2,
        22,
        { align: "center" },
      );

      /* SOTTOTITOLO */
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(13);
      pdf.text(
        `Settimana del ${formatDate(settimanaCorrente)}`,
        pageWidth / 2,
        30,
        { align: "center" },
      );
    };

    /* POSIZIONE TABELLA */
    const headerHeight = 40; // dove inizia la tabella sotto header (solo pag.1)
    const topYFirstPage = headerHeight;
    const topYOtherPages = 10; // sulle altre pagine niente header: usiamo più spazio
    const marginX = 10;
    const bottomMargin = 14; // un po' più spazio per il numero pagina

    const usableWidthMm = pageWidth - marginX * 2;

    // Conversione px -> mm (in base a quanto scalata l'immagine nel PDF)
    const mmPerPx = usableWidthMm / canvas.width;

    let yPx = 0;
    let pageIndex = 0;

    while (yPx < canvas.height) {
      const isFirstPage = pageIndex === 0;

      // nuova pagina (non per la prima)
      if (pageIndex > 0) {
        pdf.addPage();
      }

      // header SOLO in prima pagina
      const topY = isFirstPage ? topYFirstPage : topYOtherPages;
      const usableHeightMm = pageHeight - topY - bottomMargin;

      const sliceHeightPx = Math.floor(usableHeightMm / mmPerPx);

      // crea una fetta di canvas per questa pagina
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = Math.min(sliceHeightPx, canvas.height - yPx);

      const ctx = sliceCanvas.getContext("2d");
      ctx.drawImage(
        canvas,
        0,
        yPx,
        canvas.width,
        sliceCanvas.height,
        0,
        0,
        canvas.width,
        sliceCanvas.height,
      );

      const imgData = sliceCanvas.toDataURL("image/png");
      const sliceHeightMm = sliceCanvas.height * mmPerPx;

      // disegna header solo prima pagina
      if (isFirstPage) {
        drawHeader();
      }

      // disegna immagine tabella
      pdf.addImage(imgData, "PNG", marginX, topY, usableWidthMm, sliceHeightMm);

      yPx += sliceHeightPx;
      pageIndex += 1;
    }

    /* NUMERO PAGINA (tutte le pagine, in basso centrato) */
    const totalPages = pdf.getNumberOfPages();
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.text(`${i} / ${totalPages}`, pageWidth / 2, pageHeight - 7, {
        align: "center",
      });
    }

    /* SALVATAGGIO */
    const nomeFile = `servizi_settimana_${formatDate(
      settimanaCorrente,
    ).replaceAll("/", "-")}.pdf`;

    pdf.save(nomeFile);
  };

  return (
    <div className="text-end my-5 col-12 text-center">
      <button className="btn btn-success" onClick={esportaSettimanaPDF}>
        Esporta settimana in PDF
      </button>
    </div>
  );
};

export default ExportWeekPDF;

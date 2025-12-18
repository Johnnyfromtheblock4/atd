import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/*
  Componente responsabile dell'esportazione della settimana selezionata in PDF.
  Cattura la tabella tramite ref e genera un PDF in formato landscape.
*/
const ExportWeekPDF = ({ tableRef, settimanaCorrente, formatDate }) => {
  const esportaSettimanaPDF = async () => {
    if (!tableRef?.current) return;

    // Cattura della tabella come canvas
    const canvas = await html2canvas(tableRef.current, {
      scale: 2, // migliora la qualità del PDF
    });

    const imgData = canvas.toDataURL("image/png");

    // Creazione PDF in formato orizzontale
    const pdf = new jsPDF("landscape", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Inserimento immagine nel PDF
    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);

    // Nome file basato sulla settimana corrente
    const nomeFile = `servizi_settimana_${formatDate(
      settimanaCorrente
    ).replaceAll("/", "-")}.pdf`;

    pdf.save(nomeFile);
  };

  return (
    <div className="text-end mt-3 col-12 text-center">
      <button className="btn btn-outline-success" onClick={esportaSettimanaPDF}>
        Esporta settimana in PDF
      </button>
    </div>
  );
};

export default ExportWeekPDF;

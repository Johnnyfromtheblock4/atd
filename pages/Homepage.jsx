import React, { useState, useRef } from "react";
import volontari from "../data/volontari.json";

import WeekNavigator from "../components/WeekNavigator";
import ServiceForm from "../components/ServiceForm";
import ServicesTable from "../components/ServiceTable";
import ExportWeekPDF from "../components/ExportWeekPDF";

/* UTILITIES */
const getFascia = (orario) => {
  const ora = parseInt(orario.split(":")[0], 10);
  return ora < 12 ? "mattina" : "pomeriggio";
};

const getLunedi = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const formatDate = (date) =>
  date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

/* COMPONENTE */
const Homepage = () => {
  const [servizi, setServizi] = useState([]);
  const [settimanaCorrente, setSettimanaCorrente] = useState(
    getLunedi(new Date())
  );

  // Servizio in modifica
  const [editingService, setEditingService] = useState(null);

  // Ref per tabella (necessario per export PDF)
  const tableRef = useRef(null);

  /* AGGIUNGI / MODIFICA SERVIZIO */
  const salvaServizio = (form) => {
    if (editingService) {
      setServizi((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? {
                ...editingService,
                ...form,
                fascia: getFascia(form.orario),
              }
            : s
        )
      );
      setEditingService(null);
    } else {
      setServizi([
        ...servizi,
        {
          id: Date.now(),
          ...form,
          fascia: getFascia(form.orario),
          settimana: settimanaCorrente.toISOString(),
        },
      ]);
    }
  };

  /* ELIMINA SERVIZIO */
  const eliminaServizio = (id) => {
    if (!window.confirm("Vuoi eliminare questo servizio?")) return;
    setServizi(servizi.filter((s) => s.id !== id));
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-3">Calendario Servizi Settimanali</h1>

      {/* NAVIGAZIONE SETTIMANA */}
      <WeekNavigator
        settimanaCorrente={settimanaCorrente}
        setSettimanaCorrente={setSettimanaCorrente}
        formatDate={formatDate}
      />

      {/* FORM INSERIMENTO / MODIFICA */}
      <ServiceForm
        volontari={volontari}
        onSave={salvaServizio}
        editingService={editingService}
        onCancelEdit={() => setEditingService(null)}
      />

      {/* TABELLA */}
      <div ref={tableRef}>
        <ServicesTable
          servizi={servizi}
          settimanaCorrente={settimanaCorrente}
          formatDate={formatDate}
          onEdit={setEditingService}
          onDelete={eliminaServizio}
        />
      </div>

      {/* ESPORTA SETTIMANA PDF */}
      <ExportWeekPDF
        tableRef={tableRef}
        settimanaCorrente={settimanaCorrente}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Homepage;

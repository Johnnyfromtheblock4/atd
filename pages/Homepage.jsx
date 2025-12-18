import React, { useState } from "react";
import volontari from "../data/volontari.json";

import WeekNavigator from "../components/WeekNavigator";
import ServiceForm from "../components/ServiceForm";
import ServicesTable from "../components/ServiceTable";

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

  /* AGGIUNGI SERVIZIO */
  const aggiungiServizio = (form) => {
    setServizi([
      ...servizi,
      {
        id: Date.now(),
        ...form,
        fascia: getFascia(form.orario),
        settimana: settimanaCorrente.toISOString(),
      },
    ]);
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

      {/* FORM INSERIMENTO */}
      <ServiceForm volontari={volontari} onAdd={aggiungiServizio} />

      {/* TABELLA */}
      <ServicesTable
        servizi={servizi}
        settimanaCorrente={settimanaCorrente}
        formatDate={formatDate}
      />
    </div>
  );
};

export default Homepage;

import React, { useState, useRef, useEffect } from "react";
import volontari from "../data/volontari.json";

import WeekNavigator from "../components/WeekNavigator";
import WeekSheet from "../components/WeekSheet";
import ExportWeekPDF from "../components/ExportWeekPDF";

/* FIREBASE */
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  addServizio,
  updateServizio,
  deleteServizio,
} from "../firebase/services";

/* UTILITIES */
const getFascia = (orario) => {
  const [hStr = "0", mStr = "0"] = (orario || "").split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const total = h * 60 + m;

  return total < 13 * 60 ? "mattina" : "pomeriggio";
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

const normalizeLunedi = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

/* COMPONENTE */
const Homepage = () => {
  const [servizi, setServizi] = useState([]);
  const [settimanaCorrente, setSettimanaCorrente] = useState(
    getLunedi(new Date()),
  );

  // Servizio in modifica
  const [editingService, setEditingService] = useState(null);

  // Ref per tabella (necessario per export PDF)
  const tableRef = useRef(null);

  /* LETTURA SERVIZI DA FIRESTORE (REALTIME) */
  useEffect(() => {
    const settimanaKey = normalizeLunedi(settimanaCorrente);

    const q = query(
      collection(db, "servizi"),
      where("settimana", "==", settimanaKey),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dati = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServizi(dati);
    });

    return () => unsubscribe();
  }, [settimanaCorrente]);

  /* AGGIUNGI / MODIFICA SERVIZIO */
  const salvaServizio = async (form) => {
    const payload = {
      ...form,
      fascia: getFascia(form.orario),
      settimana: normalizeLunedi(settimanaCorrente),
    };

    try {
      if (editingService) {
        await updateServizio(editingService.id, payload);
        setEditingService(null);
      } else {
        await addServizio(payload);
      }
    } catch (error) {
      console.error(error);
      alert("Errore nel salvataggio del servizio");
    }
  };

  /* ELIMINA SERVIZIO */
  const eliminaServizio = async (id) => {
    try {
      await deleteServizio(id);
    } catch (error) {
      console.error(error);
      alert("Errore nell'eliminazione del servizio");
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center my-5">Calendario Servizi Settimanali</h1>

      {/* NAVIGAZIONE SETTIMANA */}
      <WeekNavigator
        settimanaCorrente={settimanaCorrente}
        setSettimanaCorrente={setSettimanaCorrente}
        formatDate={formatDate}
      />

      {/* 
        FORM INSERIMENTO / MODIFICA
      */}
      <div ref={tableRef}>
        <WeekSheet
          servizi={servizi}
          settimanaCorrente={settimanaCorrente}
          formatDate={formatDate}
          volontari={volontari}
          onAdd={addServizio}
          onUpdate={updateServizio}
          onDelete={deleteServizio}
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

// Calendrier public : affiche libre / demande en cours / réservé, et remplit les dates du formulaire
(function () {
  const BUNGALOWS = ["SR Plage", "SR Rivière", "SR Tradition"];
  const sel = document.getElementById("bungalow");
  const di = document.getElementById("date-in");
  const dout = document.getElementById("date-out");
  window.sarmezEvents = [];

  const today = new Date().toISOString().slice(0, 10);
  di.min = today; dout.min = today;

  const cal = SarmezCalendar.create(document.getElementById("cal-root"), {
    bungalows: BUNGALOWS,
    onBungalow: b => { sel.value = b; sel.dispatchEvent(new Event("input")); },
    onDayClick: pickDay
  });

  function sync() {
    cal.setSelection(di.value, dout.value);
    di.dispatchEvent(new Event("input"));
  }

  function pickDay(day, state) {
    if (state === "past") return;
    const b = cal.getBungalow();
    if (!sel.value) sel.value = b;

    // 1er clic (ou nouveau départ de sélection) = arrivée, doit être libre
    if (!di.value || dout.value || day <= di.value) {
      if (state === "booked") return alert("Cette nuit n'est pas disponible.");
      di.value = day; dout.value = "";
      cal.setSelection(day, null);
      return;
    }
    // 2e clic = départ
    if (SarmezCalendar.overlaps(window.sarmezEvents, b, di.value, day)) {
      alert("Des nuits de cette période sont déjà réservées. Choisissez d'autres dates.");
      di.value = ""; dout.value = "";
      return cal.setSelection(null, null);
    }
    dout.value = day;
    sync();
  }

  sel.addEventListener("change", () => { if (sel.value) cal.setBungalow(sel.value); });
  [di, dout].forEach(el => el.addEventListener("change", () => cal.setSelection(di.value, dout.value)));

  function start() {
    window.firebaseOnSnapshot(
      window.firebaseCollection(window.firebaseDb, "bloquages"),
      snap => { window.sarmezEvents = snap.docs.map(d => d.data()); cal.setEvents(window.sarmezEvents); },
      err => console.error("Calendrier :", err)
    );
  }
  if (window.firebaseDb) start(); else window.addEventListener("firebase-ready", start);
})();

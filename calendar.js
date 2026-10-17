// Calendrier partagé Sarmèz Retreats (client + prestataire). Aucune dépendance.
(function () {
  const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const DAYS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  const pad = n => String(n).padStart(2, "0");
  const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  const todayIso = () => { const t = new Date(); return iso(t.getFullYear(), t.getMonth(), t.getDate()); };

  // Une nuit "d" est occupée si date_in <= d < date_out (le jour de départ reste libre)
  function eventsOn(events, bungalow, d) {
    return events.filter(e => e.bungalow === bungalow && e.date_in <= d && e.date_out > d &&
      (e.statut === "accepte" || e.statut === "en_attente"));
  }
  function overlaps(events, bungalow, din, dout, statuts) {
    const st = statuts || ["accepte"];
    return events.some(e => e.bungalow === bungalow && e.date_in < dout && e.date_out > din && st.includes(e.statut));
  }

  function create(root, opts) {
    const state = {
      bungalow: opts.bungalow || opts.bungalows[0],
      events: opts.events || [],
      cur: new Date(),
      sel: [null, null],
      badges: {}
    };
    state.cur.setDate(1);

    root.innerHTML = `
      <div class="cal-tabs"></div>
      <div class="cal-nav">
        <button type="button" class="cal-prev">‹</button>
        <strong class="cal-title"></strong>
        <button type="button" class="cal-next">›</button>
      </div>
      <div class="cal-grid"></div>`;
    const tabs = root.querySelector(".cal-tabs");
    const title = root.querySelector(".cal-title");
    const grid = root.querySelector(".cal-grid");

    function draw() {
      tabs.innerHTML = "";
      opts.bungalows.forEach(b => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = b;
        btn.className = "cal-tab" + (b === state.bungalow ? " active" : "");
        if (state.badges[b] > 0) {
          const badge = document.createElement("span");
          badge.className = "cal-badge";
          badge.textContent = state.badges[b];
          btn.appendChild(badge);
        }
        btn.onclick = () => { state.bungalow = b; draw(); opts.onBungalow && opts.onBungalow(b); };
        tabs.appendChild(btn);
      });

      const y = state.cur.getFullYear(), m = state.cur.getMonth();
      title.textContent = `${MONTHS[m]} ${y}`;
      const offset = (new Date(y, m, 1).getDay() + 6) % 7;
      const n = new Date(y, m + 1, 0).getDate();
      const today = todayIso();

      let html = DAYS.map(d => `<div class="cal-dow">${d}</div>`).join("");
      for (let i = 0; i < offset; i++) html += `<div class="cal-cell empty"></div>`;
      for (let d = 1; d <= n; d++) {
        const di = iso(y, m, d);
        const evs = eventsOn(state.events, state.bungalow, di);
        let s = "free";
        if (evs.some(e => e.statut === "accepte")) s = "booked";
        else if (evs.length) s = "pending";
        if (!opts.admin && di < today) s = "past";
        const inSel = state.sel[0] && di >= state.sel[0] && (state.sel[1] ? di < state.sel[1] : di === state.sel[0]);
        const label = opts.admin && evs.length ? `<small>${(evs[0].label || "").replace(/</g, "&lt;")}</small>` : "";
        html += `<div class="cal-cell ${s}${inSel ? " sel" : ""}" data-d="${di}" data-s="${s}"><span>${d}</span>${label}</div>`;
      }
      grid.innerHTML = html;
      grid.querySelectorAll(".cal-cell[data-d]").forEach(c => {
        c.onclick = () => opts.onDayClick && opts.onDayClick(c.dataset.d, c.dataset.s,
          eventsOn(state.events, state.bungalow, c.dataset.d));
      });
    }

    root.querySelector(".cal-prev").onclick = () => { state.cur.setMonth(state.cur.getMonth() - 1); draw(); };
    root.querySelector(".cal-next").onclick = () => { state.cur.setMonth(state.cur.getMonth() + 1); draw(); };
    draw();

    return {
      setEvents(ev) { state.events = ev; draw(); },
      setBungalow(b) { state.bungalow = b; draw(); },
      setBadges(obj) { state.badges = obj || {}; draw(); },
      getBungalow() { return state.bungalow; },
      setSelection(a, b) { state.sel = [a || null, b || null]; draw(); }
    };
  }

  window.SarmezCalendar = { create, overlaps, eventsOn };
})();

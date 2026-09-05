// ---------- Data ----------
const JOB_TYPES = [
  { id: "flip", label: "Flip" },
  { id: "rental", label: "Rental repair" },
  { id: "job", label: "Client job" },
];

const TRADES = [
  "Flooring",
  "Paint & Drywall",
  "Windows, Doors & Trim",
  "Cabinetry & Countertops",
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliances",
  "Fixtures & Hardware",
  "Roofing",
  "Siding & Exterior",
  "Decking & Fencing",
  "General Labor",
  "Equipment & Disposal",
];

const UNITS = ["sq ft", "linear ft", "each", "hour", "day", "sheet", "gallon", "lump sum"];

const ROOM_SUGGESTIONS = [
  "Kitchen", "Primary Bath", "Bathroom", "Bedroom", "Living Room", "Dining Room",
  "Laundry", "Hallway", "Basement", "Garage", "Exterior / Whole House", "Roof",
];

const uid = () => Math.random().toString(36).slice(2, 10);

function defaultLibrary() {
  return [
    { id: uid(), name: "Vinyl plank flooring, install", trade: "Flooring", unit: "sq ft", cost: 4.25 },
    { id: uid(), name: "Carpet, install", trade: "Flooring", unit: "sq ft", cost: 2.50 },
    { id: uid(), name: "Interior paint, walls + trim", trade: "Paint & Drywall", unit: "sq ft", cost: 1.75 },
    { id: uid(), name: "Drywall sheet, hung + finished", trade: "Paint & Drywall", unit: "sheet", cost: 38 },
    { id: uid(), name: "Exterior paint", trade: "Paint & Drywall", unit: "sq ft", cost: 1.60 },
    { id: uid(), name: "Standard window swap", trade: "Windows, Doors & Trim", unit: "each", cost: 425 },
    { id: uid(), name: "Interior door, hung", trade: "Windows, Doors & Trim", unit: "each", cost: 210 },
    { id: uid(), name: "Base molding, install", trade: "Windows, Doors & Trim", unit: "linear ft", cost: 2.50 },
    { id: uid(), name: "Door trim/casing, install", trade: "Windows, Doors & Trim", unit: "linear ft", cost: 2.75 },
    { id: uid(), name: "Countertops (stone/quartz), install", trade: "Cabinetry & Countertops", unit: "sq ft", cost: 55 },
    { id: uid(), name: "Cabinets, install", trade: "Cabinetry & Countertops", unit: "linear ft", cost: 150 },
    { id: uid(), name: "Bathroom vanity", trade: "Cabinetry & Countertops", unit: "each", cost: 450 },
    { id: uid(), name: "Water heater, installed", trade: "Plumbing", unit: "each", cost: 1200 },
    { id: uid(), name: "Plumbing fixture swap (sink/faucet)", trade: "Plumbing", unit: "each", cost: 165 },
    { id: uid(), name: "Light fixture, install", trade: "Electrical", unit: "each", cost: 120 },
    { id: uid(), name: "Exterior light fixture, install", trade: "Electrical", unit: "each", cost: 140 },
    { id: uid(), name: "Electrician, licensed", trade: "Electrical", unit: "hour", cost: 95 },
    { id: uid(), name: "Mini split heat/air system, per zone", trade: "HVAC", unit: "each", cost: 4500 },
    { id: uid(), name: "Range/oven", trade: "Appliances", unit: "each", cost: 900 },
    { id: uid(), name: "Refrigerator", trade: "Appliances", unit: "each", cost: 1200 },
    { id: uid(), name: "Dishwasher", trade: "Appliances", unit: "each", cost: 650 },
    { id: uid(), name: "Microwave / range hood", trade: "Appliances", unit: "each", cost: 350 },
    { id: uid(), name: "Drawer pulls", trade: "Fixtures & Hardware", unit: "each", cost: 6 },
    { id: uid(), name: "Interior door handle", trade: "Fixtures & Hardware", unit: "each", cost: 35 },
    { id: uid(), name: "Deadbolt", trade: "Fixtures & Hardware", unit: "each", cost: 60 },
    { id: uid(), name: "Roof, asphalt shingle, tear-off + install", trade: "Roofing", unit: "sq ft", cost: 5.50 },
    { id: uid(), name: "Siding, install", trade: "Siding & Exterior", unit: "sq ft", cost: 6.50 },
    { id: uid(), name: "Stone veneer, install", trade: "Siding & Exterior", unit: "sq ft", cost: 22 },
    { id: uid(), name: "Fence, install", trade: "Decking & Fencing", unit: "linear ft", cost: 35 },
    { id: uid(), name: "Decking, install", trade: "Decking & Fencing", unit: "sq ft", cost: 28 },
    { id: uid(), name: "General labor", trade: "General Labor", unit: "hour", cost: 55 },
    { id: uid(), name: "Dumpster / haul-away", trade: "Equipment & Disposal", unit: "lump sum", cost: 450 },
  ];
}

function currency(n) {
  n = parseFloat(n);
  if (Number.isNaN(n) || n === null || n === undefined) return "$0.00";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}

function makeJob(name, jobType) {
  return {
    id: uid(),
    name: name || "Untitled",
    jobType,
    rooms: [],
    bids: {},
    markupPct: 20,
    taxPct: 8.7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ---------- App state ----------
const state = {
  library: [],
  jobs: [],
  libraryLoaded: false,
  jobsLoaded: false,
  configOk: false,
  authError: null,
  currentJobId: null,
  view: "list",
  step: "walkthrough",
  openRoomId: null,
  customFormFor: null,
  saveNote: "",
};

let db = null;
let jobsUnsub = null;
let libraryUnsub = null;
const dirtyTimers = {}; // jobId -> setTimeout handle, i.e. "has unsaved local edits pending"
const DEBOUNCE_MS = 500;

function getCurrentJob() {
  return state.jobs.find((j) => j.id === state.currentJobId) || null;
}

// ---------- Firebase init ----------
function configLooksReal() {
  return firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE_");
}

async function initFirebase() {
  if (!configLooksReal()) {
    state.authError = "config";
    render();
    return;
  }
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    try { await db.enablePersistence({ synchronizeTabs: true }); } catch (e) { /* fine, e.g. multiple tabs */ }

    await firebase.auth().signInAnonymously();

    await ensureLibrarySeeded();

    libraryUnsub = db.collection("library").onSnapshot(
      (snap) => {
        state.library = snap.docs.map((d) => d.data()).sort((a, b) => a.trade.localeCompare(b.trade) || a.name.localeCompare(b.name));
        state.libraryLoaded = true;
        render();
      },
      (err) => { state.authError = "rules"; render(); }
    );

    jobsUnsub = db.collection("jobs").onSnapshot(
      (snap) => {
        const remoteJobs = snap.docs.map((d) => d.data());
        const remoteIds = new Set(remoteJobs.map((j) => j.id));
        remoteJobs.forEach((rj) => {
          if (dirtyTimers[rj.id]) return; // local edits pending — don't clobber
          const idx = state.jobs.findIndex((j) => j.id === rj.id);
          if (idx >= 0) state.jobs[idx] = rj; else state.jobs.push(rj);
        });
        state.jobs = state.jobs.filter((j) => remoteIds.has(j.id) || dirtyTimers[j.id]);
        state.jobs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        state.jobsLoaded = true;
        render();
      },
      (err) => { state.authError = "rules"; render(); }
    );
  } catch (e) {
    state.authError = "auth";
    render();
  }
}

async function ensureLibrarySeeded() {
  const snap = await db.collection("library").limit(1).get();
  if (snap.empty) {
    const batch = db.batch();
    defaultLibrary().forEach((item) => batch.set(db.collection("library").doc(item.id), item));
    await batch.commit();
  }
}

// ---------- Save plumbing ----------
function scheduleSave(jobId) {
  clearTimeout(dirtyTimers[jobId]);
  dirtyTimers[jobId] = setTimeout(() => {
    delete dirtyTimers[jobId];
    const job = state.jobs.find((j) => j.id === jobId);
    if (job && db) {
      const toSave = { ...job, updatedAt: new Date().toISOString() };
      db.collection("jobs").doc(job.id).set(toSave)
        .then(() => flashSave("Saved"))
        .catch(() => flashSave("Save failed — will retry when online"));
    }
  }, DEBOUNCE_MS);
}

function flushSave(jobId) {
  // Force an immediate write (used before navigating away from a job)
  clearTimeout(dirtyTimers[jobId]);
  delete dirtyTimers[jobId];
  const job = state.jobs.find((j) => j.id === jobId);
  if (job && db) {
    db.collection("jobs").doc(job.id).set({ ...job, updatedAt: new Date().toISOString() }).catch(() => {});
  }
}

let saveNoteTimer = null;
function flashSave(msg) {
  state.saveNote = msg;
  const el = document.getElementById("save-note");
  if (el) el.textContent = state.saveNote;
  clearTimeout(saveNoteTimer);
  saveNoteTimer = setTimeout(() => {
    state.saveNote = "";
    const el2 = document.getElementById("save-note");
    if (el2) el2.textContent = "";
  }, 1500);
}

// ---------- Actions ----------
function goList() {
  if (state.currentJobId) flushSave(state.currentJobId);
  state.view = "list";
  state.currentJobId = null;
  render();
}

function createJob() {
  const nameInput = document.getElementById("new-job-name");
  const typeInput = document.getElementById("new-job-type");
  const name = nameInput.value.trim();
  if (!name) { nameInput.focus(); return; }
  const job = makeJob(name, typeInput.value);
  state.jobs.unshift(job);
  db.collection("jobs").doc(job.id).set(job).catch(() => flashSave("Save failed — check connection"));
  state.currentJobId = job.id;
  state.view = "job";
  state.step = "walkthrough";
  state.openRoomId = null;
  render();
}

function openJob(id) {
  state.currentJobId = id;
  const job = getCurrentJob();
  state.view = "job";
  state.step = "walkthrough";
  state.openRoomId = job && job.rooms[0] ? job.rooms[0].id : null;
  render();
}

function deleteJob(id) {
  if (!confirm("Delete this job? This can't be undone.")) return;
  state.jobs = state.jobs.filter((j) => j.id !== id);
  db.collection("jobs").doc(id).delete().catch(() => {});
  render();
}

function setStep(step) {
  state.step = step;
  render();
}

function addRoom() {
  const input = document.getElementById("new-room-name");
  const name = input.value.trim();
  if (!name) { input.focus(); return; }
  const job = getCurrentJob();
  const room = { id: uid(), name, items: [] };
  job.rooms.push(room);
  state.openRoomId = room.id;
  scheduleSave(job.id);
  render();
}

function removeRoom(roomId) {
  const job = getCurrentJob();
  job.rooms = job.rooms.filter((r) => r.id !== roomId);
  scheduleSave(job.id);
  render();
}

function toggleOpenRoom(roomId) {
  state.openRoomId = state.openRoomId === roomId ? null : roomId;
  render();
}

function toggleItem(roomId, libItemId) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  const libItem = state.library.find((i) => i.id === libItemId);
  const existingIdx = room.items.findIndex((i) => i.itemId === libItemId);
  if (existingIdx >= 0) {
    room.items.splice(existingIdx, 1);
  } else {
    room.items.push({ itemId: libItem.id, name: libItem.name, trade: libItem.trade, unit: libItem.unit, cost: libItem.cost, qty: 1 });
  }
  scheduleSave(job.id);
  render();
}

function updateItemQty(roomId, itemId, qty) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  const item = room.items.find((i) => i.itemId === itemId);
  if (item) item.qty = qty;
  scheduleSave(job.id);
  updateWalkthroughTotals();
}

function removeItem(roomId, itemId) {
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  room.items = room.items.filter((i) => i.itemId !== itemId);
  scheduleSave(job.id);
  render();
}

function openCustomForm(roomId) {
  state.customFormFor = roomId;
  render();
}

function addCustomItem(roomId) {
  const name = document.getElementById("custom-name").value.trim();
  if (!name) return;
  const trade = document.getElementById("custom-trade").value;
  const unit = document.getElementById("custom-unit").value;
  const qty = parseFloat(document.getElementById("custom-qty").value) || 1;
  const cost = parseFloat(document.getElementById("custom-cost").value) || 0;
  const job = getCurrentJob();
  const room = job.rooms.find((r) => r.id === roomId);
  room.items.push({ itemId: uid(), name, trade, unit, cost, qty });
  state.customFormFor = null;
  scheduleSave(job.id);
  render();
}

function updateBid(trade, field, value) {
  const job = getCurrentJob();
  if (!job.bids[trade]) job.bids[trade] = {};
  job.bids[trade][field] = value;
  scheduleSave(job.id);
  if (field === "amount") updateQuoteTotals();
}

function updateJobField(field, value) {
  const job = getCurrentJob();
  job[field] = value;
  scheduleSave(job.id);
  updateQuoteTotals();
}

function updateJobName(value) {
  const job = getCurrentJob();
  job.name = value;
  scheduleSave(job.id);
}

function doPrint() { window.print(); }

// ---------- Computation ----------
function computeTradeGroups(job) {
  const groups = {};
  job.rooms.forEach((room) => {
    room.items.forEach((item) => {
      if (!groups[item.trade]) groups[item.trade] = { lines: [], estTotal: 0 };
      groups[item.trade].lines.push({ ...item, roomName: room.name });
      groups[item.trade].estTotal += (parseFloat(item.qty) || 0) * (parseFloat(item.cost) || 0);
    });
  });
  return groups;
}

function computeInternalTotal(groups) {
  return Object.values(groups).reduce((s, g) => s + g.estTotal, 0);
}

function computeQuoteTotals(job, groups) {
  const subtotal = Object.keys(groups).reduce((sum, trade) => {
    const bid = job.bids[trade] || {};
    const amt = bid.amount !== undefined && bid.amount !== "" ? parseFloat(bid.amount) || 0 : groups[trade].estTotal;
    return sum + amt;
  }, 0);
  const markupAmount = (subtotal * (parseFloat(job.markupPct) || 0)) / 100;
  const taxAmount = ((subtotal + markupAmount) * (parseFloat(job.taxPct) || 0)) / 100;
  const total = subtotal + markupAmount + taxAmount;
  return { subtotal, markupAmount, taxAmount, total };
}

function updateWalkthroughTotals() {
  const job = getCurrentJob();
  if (!job) return;
  const groups = computeTradeGroups(job);
  const countEl = document.getElementById("wt-item-count");
  if (countEl) {
    const total = job.rooms.reduce((s, r) => s + r.items.length, 0);
    countEl.textContent = `${total} item${total !== 1 ? "s" : ""} checked across ${job.rooms.length} room${job.rooms.length !== 1 ? "s" : ""}`;
  }
  const estEl = document.getElementById("wt-est-total");
  if (estEl) estEl.textContent = "Est. internal cost: " + currency(computeInternalTotal(groups));
}

function updateQuoteTotals() {
  const job = getCurrentJob();
  if (!job || job.jobType !== "job") return;
  const groups = computeTradeGroups(job);
  const t = computeQuoteTotals(job, groups);
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("q-subtotal", currency(t.subtotal));
  set("q-markup", currency(t.markupAmount));
  set("q-tax", currency(t.taxAmount));
  set("q-total", currency(t.total));
}

// ---------- Render ----------
function render() {
  const activeEl = document.activeElement;
  const activeId = activeEl && activeEl.id;
  const selStart = activeEl && typeof activeEl.selectionStart === "number" ? activeEl.selectionStart : null;

  const app = document.getElementById("app");

  if (state.authError) {
    app.innerHTML = renderSetupScreen();
    return;
  }
  if (!state.libraryLoaded || !state.jobsLoaded) {
    app.innerHTML = `<div style="padding:40px;color:var(--ink-soft);">Connecting…</div>`;
    return;
  }

  app.innerHTML = state.view === "list" ? renderListView() : renderJobView();

  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) {
      el.focus();
      if (selStart !== null && el.setSelectionRange) {
        try { el.setSelectionRange(selStart, selStart); } catch (e) {}
      }
    }
  }
}

function renderSetupScreen() {
  if (state.authError === "config") {
    return `
      <div style="padding:40px 20px;max-width:560px;">
        <h1>Setup needed</h1>
        <p style="color:var(--ink-soft);line-height:1.6;margin-top:14px;">
          This app syncs jobs across devices using Firebase, but it hasn't been
          connected to a Firebase project yet. Open <code>firebase-config.js</code>
          and paste in your project's config — see README.txt for the exact steps
          (about 5 minutes, free).
        </p>
      </div>`;
  }
  return `
    <div style="padding:40px 20px;max-width:560px;">
      <h1>Can't connect</h1>
      <p style="color:var(--ink-soft);line-height:1.6;margin-top:14px;">
        The app couldn't reach Firebase. Double-check the values in
        <code>firebase-config.js</code>, that Firestore is created in your Firebase
        project, and that Anonymous sign-in is enabled under Authentication —
        see README.txt.
      </p>
    </div>`;
}

function ticks() {
  const line = `<path d="M0 0 H14 M0 0 V14" stroke="#1B3A5C" stroke-width="1.5"/>`;
  return `<div class="ticks">
    <div class="tick tl"><svg viewBox="0 0 14 14">${line}</svg></div>
    <div class="tick tr"><svg viewBox="0 0 14 14">${line}</svg></div>
    <div class="tick bl"><svg viewBox="0 0 14 14">${line}</svg></div>
    <div class="tick br"><svg viewBox="0 0 14 14">${line}</svg></div>
  </div>`;
}

function renderListView() {
  const jobRows = state.jobs.map((j) => `
    <div class="panel job-card">
      ${ticks()}
      <div>
        <div class="name">${esc(j.name)}</div>
        <div class="meta">${JOB_TYPES.find((t) => t.id === j.jobType).label} · updated ${new Date(j.updatedAt).toLocaleDateString()}</div>
      </div>
      <div class="row">
        <button class="btn-primary" style="padding:6px 14px;" onclick="openJob('${j.id}')">Open</button>
        <button class="btn-danger-ghost" onclick="deleteJob('${j.id}')">Delete</button>
      </div>
    </div>
  `).join("");

  return `
    <h1>Scope of Work</h1>
    <div style="height:20px"></div>
    <div class="panel" style="margin-bottom:20px;">
      ${ticks()}
      <div style="font-weight:700;font-size:14px;margin-bottom:10px;">Start a new job</div>
      <div class="row wrap">
        <input id="new-job-name" placeholder="Property address / job name" style="flex:1;min-width:220px;" onkeydown="if(event.key==='Enter')createJob()" />
        <select id="new-job-type">
          ${JOB_TYPES.map((jt) => `<option value="${jt.id}">${jt.label}</option>`).join("")}
        </select>
        <button class="btn-primary" onclick="createJob()">Start walkthrough</button>
      </div>
    </div>
    <div style="font-weight:700;font-size:14px;margin-bottom:10px;">Jobs</div>
    ${state.jobs.length === 0 ? `<div class="empty-note">No jobs yet — start one above.</div>` : `<div class="grid">${jobRows}</div>`}
  `;
}

function renderJobView() {
  const job = getCurrentJob();
  if (!job) { state.view = "list"; return renderListView(); }
  const jobTypeLabel = JOB_TYPES.find((t) => t.id === job.jobType).label;

  let stepHtml = "";
  if (state.step === "walkthrough") stepHtml = renderWalkthrough(job);
  else if (state.step === "bids") stepHtml = renderBids(job);
  else if (state.step === "quote") stepHtml = renderQuote(job);

  return `
    <div class="row between no-print" style="margin-bottom:16px;">
      <button class="btn-ghost" onclick="goList()">&larr; All jobs</button>
      <span class="save-note" id="save-note">${esc(state.saveNote)}</span>
    </div>
    <div class="eyebrow">${jobTypeLabel}</div>
    <input id="job-name-input" value="${esc(job.name)}" oninput="updateJobName(this.value)"
      style="font-family:var(--font-head);font-weight:700;font-size:24px;color:var(--navy-deep);border:none;background:none;padding:0;width:100%;margin-bottom:16px;" />
    <div class="tabs no-print">
      <button class="tab ${state.step === "walkthrough" ? "active" : ""}" onclick="setStep('walkthrough')">1. Walkthrough</button>
      <button class="tab ${state.step === "bids" ? "active" : ""}" onclick="setStep('bids')">2. Bid packages</button>
      ${job.jobType === "job" ? `<button class="tab ${state.step === "quote" ? "active" : ""}" onclick="setStep('quote')">3. Client quote</button>` : ""}
    </div>
    ${stepHtml}
  `;
}

function renderWalkthrough(job) {
  const roomsHtml = job.rooms.map((room) => {
    const isOpen = state.openRoomId === room.id;
    const tradesHtml = TRADES.map((trade) => {
      const items = state.library.filter((i) => i.trade === trade);
      if (items.length === 0) return "";
      const itemsHtml = items.map((libItem) => {
        const checked = room.items.find((i) => i.itemId === libItem.id);
        return `
          <div class="item-row">
            <input type="checkbox" ${checked ? "checked" : ""} onchange="toggleItem('${room.id}','${libItem.id}')" />
            <span class="item-name">${esc(libItem.name)}</span>
            ${checked
              ? `<input type="number" value="${checked.qty}" oninput="updateItemQty('${room.id}','${libItem.id}', this.value)" />
                 <span class="unit-label">${esc(libItem.unit)}</span>`
              : `<span class="unit-label" style="width:122px;">${esc(libItem.unit)}</span>`}
          </div>`;
      }).join("");
      return `<div class="trade-group"><div class="trade-label">${esc(trade)}</div>${itemsHtml}</div>`;
    }).join("");

    const customFormHtml = state.customFormFor === room.id
      ? `<div class="custom-form no-print">
          <input id="custom-name" placeholder="Description" />
          <select id="custom-trade">${TRADES.map((t) => `<option value="${t}">${t}</option>`).join("")}</select>
          <input id="custom-qty" type="number" placeholder="Qty" value="1" style="max-width:60px;" />
          <select id="custom-unit">${UNITS.map((u) => `<option value="${u}">${u}</option>`).join("")}</select>
          <input id="custom-cost" type="number" placeholder="$/unit (optional)" style="max-width:120px;" />
          <button class="btn-primary" style="padding:8px 12px;" onclick="addCustomItem('${room.id}')">Add</button>
        </div>`
      : `<button class="dashed-add no-print" onclick="openCustomForm('${room.id}')">+ Add item not on the list</button>`;

    const checkedList = room.items.length > 0
      ? `<div style="margin-top:10px;font-size:12px;color:var(--ink-soft);">Checked: ${room.items.map((i) => esc(i.name)).join(", ")}</div>`
      : "";

    return `
      <div class="panel room-card">
        <div class="room-head" onclick="toggleOpenRoom('${room.id}')">
          <div class="name">${esc(room.name)}</div>
          <div class="row">
            <span class="count">${room.items.length} item${room.items.length !== 1 ? "s" : ""}</span>
            <button class="btn-danger-ghost no-print" onclick="event.stopPropagation();removeRoom('${room.id}')">Remove</button>
            <span style="font-size:12px;">${isOpen ? "&#9650;" : "&#9660;"}</span>
          </div>
        </div>
        ${isOpen ? `<div class="room-body">${tradesHtml}${customFormHtml}${checkedList}</div>` : ""}
      </div>
    `;
  }).join("");

  const groups = computeTradeGroups(job);
  const totalItems = job.rooms.reduce((s, r) => s + r.items.length, 0);

  return `
    <div class="row no-print" style="margin-bottom:14px;">
      <input id="new-room-name" list="room-suggestions" placeholder="Add a room (e.g. Kitchen, Bath 1)" style="flex:1;" onkeydown="if(event.key==='Enter')addRoom()" />
      <datalist id="room-suggestions">${ROOM_SUGGESTIONS.map((r) => `<option value="${r}">`).join("")}</datalist>
      <button class="btn-primary" onclick="addRoom()">+ Add room</button>
    </div>
    ${job.rooms.length === 0 ? `<div class="panel empty-note">No rooms yet. Add each room or area as you walk it — the checklist appears once a room is added.</div>` : `<div class="grid">${roomsHtml}</div>`}
    ${job.rooms.length > 0 ? `
      <div class="panel row between" style="margin-top:16px;">
        <div id="wt-item-count" style="font-size:13px;">${totalItems} item${totalItems !== 1 ? "s" : ""} checked across ${job.rooms.length} room${job.rooms.length !== 1 ? "s" : ""}</div>
        ${job.jobType !== "job" ? `<div id="wt-est-total" style="font-weight:700;font-size:16px;">Est. internal cost: ${currency(computeInternalTotal(groups))}</div>` : ""}
      </div>` : ""}
  `;
}

function renderBids(job) {
  const groups = computeTradeGroups(job);
  const trades = Object.keys(groups);
  if (trades.length === 0) {
    return `<div class="panel empty-note">Nothing to package yet — check off items in the walkthrough first.</div>`;
  }
  const groupsHtml = trades.map((trade) => {
    const group = groups[trade];
    const bid = job.bids[trade] || {};
    const linesHtml = group.lines.map((line) => `
      <tr>
        <td>${esc(line.name)}</td>
        <td style="color:var(--ink-soft);">${esc(line.roomName)}</td>
        <td class="num">${line.qty}</td>
        <td style="color:var(--ink-soft);">${esc(line.unit)}</td>
      </tr>`).join("");
    return `
      <div class="panel" style="margin-bottom:12px;">
        ${ticks()}
        <div class="row between" style="margin-bottom:10px;">
          <div style="font-weight:700;font-size:15px;">${esc(trade)}</div>
          <div class="no-print" style="font-size:11.5px;color:var(--ink-soft);">internal est. ${currency(group.estTotal)}</div>
        </div>
        <table style="margin-bottom:12px;">
          <thead><tr><th>Item</th><th>Room</th><th class="num">Qty</th><th>Unit</th></tr></thead>
          <tbody>${linesHtml}</tbody>
        </table>
        <div class="row wrap no-print" style="border-top:1px solid var(--line-soft);padding-top:10px;">
          <input placeholder="Sub/supplier name" value="${esc(bid.sub || "")}" oninput="updateBid('${trade}','sub',this.value)" style="flex:1;min-width:160px;" />
          <input type="number" placeholder="Bid amount $" value="${bid.amount !== undefined ? bid.amount : ""}" oninput="updateBid('${trade}','amount',this.value)" style="width:130px;" />
          <input placeholder="Notes" value="${esc(bid.notes || "")}" oninput="updateBid('${trade}','notes',this.value)" style="flex:1;min-width:160px;" />
        </div>
      </div>`;
  }).join("");

  return `${groupsHtml}<div class="no-print" style="margin-top:14px;"><button class="btn-secondary" onclick="doPrint()">Print this page</button></div>`;
}

function renderQuote(job) {
  const groups = computeTradeGroups(job);
  const trades = Object.keys(groups);
  const t = computeQuoteTotals(job, groups);

  const rows = trades.map((trade) => {
    const bid = job.bids[trade] || {};
    const hasBid = bid.amount !== undefined && bid.amount !== "";
    const amt = hasBid ? parseFloat(bid.amount) || 0 : groups[trade].estTotal;
    return `
      <tr>
        <td>${esc(trade)}</td>
        <td style="color:var(--ink-soft);font-size:12px;">${hasBid ? "Sub bid" + (bid.sub ? " — " + esc(bid.sub) : "") : "Internal estimate (no bid yet)"}</td>
        <td class="num">
          <input class="no-print" type="number" value="${bid.amount !== undefined ? bid.amount : ""}" placeholder="${currency(groups[trade].estTotal)}"
            oninput="updateBid('${trade}','amount',this.value)" style="width:110px;text-align:right;" />
          <span class="print-only" style="display:none;">${currency(amt)}</span>
        </td>
      </tr>`;
  }).join("");

  return `
    <div class="panel">
      ${ticks()}
      <table>
        <thead><tr><th>Trade</th><th>Source</th><th class="num" style="width:130px;">Amount</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="totals-box" style="margin-top:20px;">
        <div class="totals-row"><span>Subtotal</span><span id="q-subtotal">${currency(t.subtotal)}</span></div>
        <div class="totals-row">
          <span class="no-print">Markup <input type="number" value="${job.markupPct}" oninput="updateJobField('markupPct',this.value)" style="width:44px;padding:2px 4px;font-size:12px;" />%</span>
          <span id="q-markup">${currency(t.markupAmount)}</span>
        </div>
        <div class="totals-row">
          <span class="no-print">Tax <input type="number" value="${job.taxPct}" oninput="updateJobField('taxPct',this.value)" style="width:44px;padding:2px 4px;font-size:12px;" />%</span>
          <span id="q-tax">${currency(t.taxAmount)}</span>
        </div>
        <div class="totals-final"><span>Total due</span><span id="q-total">${currency(t.total)}</span></div>
      </div>
      <div class="no-print" style="margin-top:20px;border-top:1px solid var(--line-soft);padding-top:16px;">
        <button class="btn-accent" onclick="doPrint()">Print / export PDF</button>
      </div>
    </div>
  `;
}

// ---------- Install prompt (Android/desktop Chrome) ----------
let deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const banner = document.getElementById("install-banner");
  if (banner) banner.style.display = "flex";
});
function doInstall() {
  const banner = document.getElementById("install-banner");
  if (banner) banner.style.display = "none";
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt = null;
  }
}
function dismissInstall() {
  const banner = document.getElementById("install-banner");
  if (banner) banner.style.display = "none";
}

// ---------- Online/offline banner ----------
function updateOnlineBanner() {
  const banner = document.getElementById("offline-banner");
  if (banner) banner.style.display = navigator.onLine ? "none" : "block";
}
window.addEventListener("online", updateOnlineBanner);
window.addEventListener("offline", updateOnlineBanner);

// ---------- Service worker ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

updateOnlineBanner();
initFirebase();

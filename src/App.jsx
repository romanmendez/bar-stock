import React, { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:      #0d0a08;
    --near-black: #161210;
    --surface:    #201a15;
    --surface2:   #2a231c;
    --border:     #3e3228;
    --amber:      #e8a838;
    --amber-dim:  #b8821c;
    --cream:      #f0e6d0;
    --cream-dim:  #b8a888;
    --red:        #c0392b;
    --red-dim:    #8b1a0d;
    --text:       #ede6d8;
    --text-dim:   #8a7a65;
    --mono: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
    --sans: 'Open Sans', system-ui, -apple-system, sans-serif;
  }

  body {
    background: var(--black);
    color: var(--text);
    font-family: var(--sans);
    font-size: 15px;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── Header ── */
  .header {
    padding: 22px 40px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 20px;
    background: var(--near-black);
  }

  .header-title {
    font-size: 18px;
    font-weight: 800;
    color: var(--amber);
    letter-spacing: 4px;
    text-transform: uppercase;
  }

  .header-sep {
    width: 1px;
    height: 16px;
    background: var(--border);
    flex-shrink: 0;
  }

  .header-sub {
    font-size: 12px;
    font-weight: 400;
    color: var(--text-dim);
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  /* ── Tabs ── */
  .tabs { display: flex; border-bottom: 1px solid var(--border); background: var(--near-black); }

  .tab {
    padding: 14px 30px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-dim);
    cursor: pointer;
    border: none;
    background: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 0.15s, border-color 0.15s;
  }

  .tab:hover { color: var(--cream); }
  .tab.active { color: var(--amber); border-bottom-color: var(--amber); }

  .main { flex: 1; padding: 36px 40px; overflow-x: hidden; }

  /* ── Category badge ── */
  .cat-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    background: var(--surface2);
    border: 1px solid var(--border);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-dim);
    letter-spacing: 0.3px;
    white-space: nowrap;
  }

  /* ── Buttons ── */
  .btn {
    padding: 9px 20px;
    border-radius: 5px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    cursor: pointer;
    border: 2px solid var(--border);
    transition: all 0.15s;
  }

  .btn-primary { background: var(--amber); color: var(--black); border-color: var(--amber); }
  .btn-primary:hover:not(:disabled) { background: var(--cream); border-color: var(--cream); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-ghost { background: none; color: var(--text-dim); border-color: transparent; }
  .btn-ghost:hover { color: var(--red); border-color: var(--red-dim); }

  .btn-outline { background: none; color: var(--amber); border-color: var(--amber-dim); }
  .btn-outline:hover { background: var(--amber); color: var(--black); }

  /* ── Forms ── */
  .add-form {
    background: var(--near-black);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 24px 28px;
    margin-bottom: 28px;
  }

  .add-form-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--amber);
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .form-row { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; }
  .form-field { display: flex; flex-direction: column; gap: 6px; }
  .form-field.grow { flex: 1; min-width: 160px; }

  .form-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    color: var(--text-dim);
    text-transform: uppercase;
  }

  .form-input {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 5px;
    color: var(--text);
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 400;
    padding: 9px 12px;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
  }

  .form-input:focus { border-color: var(--amber-dim); }

  select.form-input {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238a7a65'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-color: var(--surface);
    padding-right: 30px;
    cursor: pointer;
  }

  /* ── Table ── */
  .table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: 8px; }

  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  thead { background: var(--surface2); }

  thead th {
    padding: 12px 16px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.2px;
    color: var(--text-dim);
    text-transform: uppercase;
    text-align: left;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--surface); }

  tbody td { padding: 12px 16px; color: var(--text); vertical-align: middle; }
  tbody td.mono { font-family: var(--mono); font-size: 13px; }

  .delete-btn {
    background: none;
    border: none;
    color: var(--text-dim);
    cursor: pointer;
    font-size: 15px;
    padding: 4px 7px;
    border-radius: 4px;
    line-height: 1;
    transition: color 0.15s, background 0.15s;
  }

  .delete-btn:hover { color: var(--red); background: rgba(192, 57, 43, 0.1); }

  .section-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 16px;
  }

  /* ── Editable par ── */
  .par-span {
    font-family: var(--mono);
    font-size: 14px;
    color: var(--text-dim);
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid transparent;
    display: inline-block;
    transition: border-color 0.15s, background 0.15s;
  }

  .par-span:hover { border-color: var(--border); background: var(--surface2); color: var(--cream); }

  .par-input {
    width: 62px;
    background: var(--surface);
    border: 1px solid var(--amber-dim);
    border-radius: 4px;
    color: var(--text);
    font-family: var(--mono);
    font-size: 14px;
    padding: 4px 8px;
    outline: none;
  }

  /* ── Categories manager ── */
  .categories-section {
    background: var(--near-black);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 24px 28px;
    margin-bottom: 28px;
  }

  .categories-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }

  .category-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 10px 5px 14px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
  }

  .category-chip-remove {
    background: none;
    border: none;
    color: var(--text-dim);
    cursor: pointer;
    font-size: 12px;
    padding: 0;
    line-height: 1;
    transition: color 0.15s;
  }

  .category-chip-remove:not(:disabled):hover { color: var(--red); }
  .category-chip-remove:disabled { opacity: 0.25; cursor: default; }

  .category-add-row { display: flex; gap: 10px; align-items: center; }

  /* ── Shift tab ── */
  .shift-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }

  .shift-count-badge {
    font-size: 12px;
    font-weight: 600;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 4px 12px;
    color: var(--text-dim);
    letter-spacing: 0.3px;
  }

  .shift-spacer { flex: 1; }

  .show-all-toggle {
    background: none;
    border: 2px solid var(--border);
    border-radius: 5px;
    color: var(--text-dim);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 7px 14px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }

  .show-all-toggle:hover { color: var(--cream); border-color: var(--cream-dim); }
  .show-all-toggle.active { color: var(--amber); border-color: var(--amber-dim); }

  .shift-list {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .shift-group-header {
    padding: 8px 20px;
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  .shift-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--near-black);
    transition: background 0.1s;
  }

  .shift-row:last-child { border-bottom: none; }
  .shift-row:hover { background: var(--surface); }

  .shift-row .cat-badge { width: 96px; text-align: center; flex-shrink: 0; }

  .shift-row-name {
    font-weight: 600;
    font-size: 15px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Stepper ── */
  .stepper { display: flex; align-items: center; }

  .stepper-btn {
    width: 32px;
    height: 32px;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text-dim);
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s, background 0.15s;
    flex-shrink: 0;
  }

  .stepper-btn:first-child { border-radius: 5px 0 0 5px; }
  .stepper-btn:last-child  { border-radius: 0 5px 5px 0; }
  .stepper-btn:hover { background: var(--surface); color: var(--cream); }

  .stepper-count {
    min-width: 40px;
    text-align: center;
    font-family: var(--mono);
    font-size: 16px;
    font-weight: 700;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 6px 10px;
    background: var(--surface2);
    color: var(--text-dim);
    transition: color 0.15s;
  }

  .stepper-count.below-par { color: var(--amber); }
  .stepper-count.empty { color: var(--red); }

  /* ── Stocked button ── */
  .stocked-btn {
    background: none;
    border: 2px solid var(--border);
    border-radius: 5px;
    color: var(--text-dim);
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.3px;
    padding: 5px 0;
    width: 128px;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
  }

  .stocked-btn.needs-restock { color: var(--amber); border-color: var(--amber-dim); }
  .stocked-btn.needs-restock:hover { background: rgba(232, 168, 56, 0.1); }
  .stocked-btn:not(.needs-restock) { opacity: 0.3; cursor: default; }

  /* ── Order flag button ── */
  .order-flag-btn {
    background: none;
    border: 2px solid var(--border);
    border-radius: 5px;
    color: var(--text-dim);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 5px 0;
    width: 96px;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
  }

  .order-flag-btn:hover { color: var(--amber); border-color: var(--amber-dim); }
  .order-flag-btn.flagged { color: var(--amber); border-color: var(--amber-dim); background: rgba(232, 168, 56, 0.08); }

  /* ── Order qty mini-stepper ── */
  .order-qty-stepper { display: flex; align-items: center; flex-shrink: 0; }

  .order-qty-btn {
    width: 26px;
    height: 28px;
    background: var(--surface2);
    border: 1px solid var(--amber-dim);
    color: var(--amber);
    font-size: 15px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    flex-shrink: 0;
  }

  .order-qty-btn:first-child { border-radius: 5px 0 0 5px; }
  .order-qty-btn:last-child  { border-radius: 0 5px 5px 0; }
  .order-qty-btn:hover { background: rgba(232, 168, 56, 0.15); }

  .order-qty-count {
    min-width: 34px;
    text-align: center;
    font-family: var(--mono);
    font-size: 14px;
    font-weight: 700;
    border-top: 1px solid var(--amber-dim);
    border-bottom: 1px solid var(--amber-dim);
    padding: 4px 6px;
    background: var(--surface2);
    color: var(--amber);
  }

  /* ── Trash button ── */
  .trash-btn {
    background: none;
    border: none;
    color: var(--text-dim);
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s, background 0.15s;
  }

  .trash-btn:hover { color: var(--red); background: rgba(192, 57, 43, 0.1); }

  /* ── Shift empty states ── */
  .shift-empty { padding: 64px 0; text-align: center; }
  .shift-empty-text {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-dim);
    letter-spacing: 0.3px;
  }

  /* ── Order list ── */
  .order-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
  .order-title { font-size: 18px; font-weight: 700; color: var(--cream); flex: 1; }

  .order-empty { padding: 64px 0; text-align: center; }
  .order-empty-icon { font-size: 40px; opacity: 0.35; margin-bottom: 14px; }
  .order-empty-text { font-size: 14px; font-weight: 500; color: var(--text-dim); letter-spacing: 0.3px; }

  /* ── View toggle (stats) ── */
  .view-toggle { display: flex; border: 2px solid var(--border); border-radius: 5px; overflow: hidden; }

  .view-toggle-btn {
    padding: 7px 16px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    background: none;
    border: none;
    color: var(--text-dim);
    cursor: pointer;
    transition: all 0.15s;
  }

  .view-toggle-btn + .view-toggle-btn { border-left: 1px solid var(--border); }
  .view-toggle-btn.active { background: var(--surface2); color: var(--amber); cursor: default; }
  .view-toggle-btn:not(.active):hover { color: var(--cream); background: var(--surface); }

  /* ── Stats tab ── */
  .stats-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
  .stats-title { font-size: 18px; font-weight: 700; color: var(--cream); flex: 1; }

  .stats-nav {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 20px;
    background: var(--near-black);
    border: 1px solid var(--border);
    border-radius: 8px;
    margin-bottom: 24px;
  }

  .stats-nav-label {
    flex: 1;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    color: var(--cream);
    letter-spacing: 0.2px;
  }

  .stats-nav-btn {
    background: none;
    border: 2px solid var(--border);
    border-radius: 5px;
    color: var(--text-dim);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 6px 14px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
  }

  .stats-nav-btn:hover:not(:disabled) { color: var(--cream); border-color: var(--cream-dim); }
  .stats-nav-btn:disabled { opacity: 0.25; cursor: default; }

  .stats-empty { padding: 64px 0; text-align: center; }
  .stats-empty-text { font-size: 14px; font-weight: 500; color: var(--text-dim); letter-spacing: 0.3px; }

  /* ── Print ── */
  .print-date { display: none; }
  .print-heading { display: none; }

  @media print {
    .no-print { display: none !important; }
    .main { padding: 0; }
    .order-print-region { background: white; color: black; padding: 32px; }
    .order-print-region .table-wrap { border: 1px solid #ccc; border-radius: 0; }
    .order-print-region table { color: black; }
    .order-print-region thead { background: #f0f0f0; }
    .order-print-region thead th { color: #333; border-bottom: 1px solid #ccc; }
    .order-print-region tbody tr { border-bottom: 1px solid #e0e0e0; }
    .order-print-region tbody td { color: black; }
    .order-print-region .cat-badge { background: #eee; color: #333; border: none; }
    .print-date { display: block; font-family: monospace; font-size: 12px; color: #555; margin-bottom: 8px; }
    .print-heading { display: block; font-size: 24px; font-weight: 700; color: black; margin-bottom: 20px; }
    body { background: white; }
    .header, .tabs { display: none !important; }
  }
`;

const ITEMS_KEY = "bar-stock-items";
const RECORDS_KEY = "bar-stock-records";
const CATEGORIES_KEY = "bar-stock-categories";
const UNITS = ["bottles", "cans", "kegs", "boxes", "cases", "litres", "units"];
const DEFAULT_CATEGORIES = ["Spirits", "Wine", "Beer", "Mixers", "Soft Drinks", "Other"];

function load(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Migrate items from old schemas
function loadItems() {
  return load(ITEMS_KEY).map(item => ({
    ...item,
    stockUnit: item.stockUnit ?? item.unit ?? "units",
    orderUnit: item.orderUnit ?? item.unit ?? "units",
    orderQty: item.orderQty ?? 0,
  }));
}

// --- TrashIcon ---
const TrashIcon = () => (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" aria-hidden="true">
    <path d="M1 3.5h12M4.5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M5.5 6.5v5M8.5 6.5v5M2.5 3.5l.5 9a.5.5 0 00.5.5h7a.5.5 0 00.5-.5l.5-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// --- EditablePar ---
function EditablePar({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);

  function start() {
    setDraft(String(value));
    setEditing(true);
  }

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.select();
  }, [editing]);

  function commit() {
    const n = parseInt(draft, 10);
    if (!isNaN(n) && n >= 1) onSave(n);
    setEditing(false);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="par-input"
        type="number"
        min="1"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKeyDown}
      />
    );
  }

  return (
    <span className="par-span" onClick={start} title="Click to edit">
      {value}
    </span>
  );
}

// --- ShiftRow ---
function ShiftRow({ item, onIncrement, onDecrement, onStocked, onAddToOrder }) {
  const belowPar = item.left < item.par;
  const empty = item.left === 0;
  const ordered = (item.orderQty ?? 0) > 0;

  const countClass = empty ? "stepper-count empty"
    : belowPar ? "stepper-count below-par"
    : "stepper-count";

  return (
    <div className="shift-row">
      <span className="shift-row-name">{item.name}</span>
      <span className="cat-badge">{item.category}</span>
      <div className="stepper">
        <button className="stepper-btn" onClick={() => onDecrement(item.id)}>−</button>
        <span className={countClass}>{item.left}</span>
        <button className="stepper-btn" onClick={() => onIncrement(item.id)}>+</button>
      </div>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)", flexShrink: 0 }}>
        {item.stockUnit}
      </span>
      <button
        className={`stocked-btn${belowPar ? " needs-restock" : ""}`}
        onClick={() => belowPar && onStocked(item.id)}
        title={belowPar ? `Reset to par (${item.par})` : "Already at par"}
      >
        {belowPar ? `${item.par - item.left} Stocked` : "Stocked"}
      </button>
      <button
        className={`order-flag-btn${ordered ? " flagged" : ""}`}
        onClick={() => onAddToOrder(item.id)}
      >
        {ordered ? `⊕ ${item.orderQty}` : "⊕ Order"}
      </button>
    </div>
  );
}

// --- Shift ---
function Shift({ items, categories, onIncrement, onDecrement, onStocked, onAddToOrder, onRestockAll }) {
  const [showAll, setShowAll] = useState(true);

  const belowParItems = items.filter(i => i.left < i.par);
  const visibleItems = showAll ? items : belowParItems;

  const knownCatSet = new Set(categories);
  const groups = [
    ...categories
      .map(cat => ({ cat, items: visibleItems.filter(i => i.category === cat) }))
      .filter(g => g.items.length > 0),
    ...[...new Set(visibleItems.filter(i => !knownCatSet.has(i.category)).map(i => i.category))]
      .map(cat => ({ cat, items: visibleItems.filter(i => i.category === cat) })),
  ];

  function renderEmpty() {
    if (items.length === 0) {
      return (
        <div className="shift-empty">
          <div className="shift-empty-text">Add items in the Items tab</div>
        </div>
      );
    }
    return (
      <div className="shift-empty">
        <div className="shift-empty-text">All items at or above par</div>
      </div>
    );
  }

  return (
    <div>
      <div className="shift-header no-print">
        <span className="shift-count-badge">{belowParItems.length} below par</span>
        <span className="shift-spacer" />
        <button
          className={`show-all-toggle${showAll ? " active" : ""}`}
          onClick={() => setShowAll(v => !v)}
        >
          {showAll ? "Below par" : "Show all"}
        </button>
        <button className="btn btn-ghost" onClick={onRestockAll}>Restock all</button>
      </div>

      {groups.length === 0 ? renderEmpty() : (
        <div className="shift-list">
          {groups.map(({ cat, items: groupItems }) => (
            <React.Fragment key={cat}>
              <div className="shift-group-header">{cat}</div>
              {groupItems.map(item => (
                <ShiftRow
                  key={item.id}
                  item={item}
                  onIncrement={onIncrement}
                  onDecrement={onDecrement}
                  onStocked={onStocked}
                  onAddToOrder={onAddToOrder}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

// --- CategoriesManager ---
function CategoriesManager({ categories, items, onAdd, onDelete }) {
  const [name, setName] = useState("");

  function submit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    onAdd(trimmed);
    setName("");
  }

  return (
    <div className="categories-section">
      <div className="add-form-title">Categories</div>
      <div className="categories-chips">
        {categories.map(cat => {
          const inUse = items.some(i => i.category === cat);
          return (
            <div className="category-chip" key={cat}>
              <span>{cat}</span>
              <button
                className="category-chip-remove"
                disabled={inUse}
                onClick={() => onDelete(cat)}
                title={inUse ? "In use — reassign items first" : `Remove "${cat}"`}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
      <form onSubmit={submit} className="category-add-row">
        <input
          className="form-input"
          style={{ maxWidth: 200 }}
          placeholder="New category…"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!name.trim() || categories.includes(name.trim())}
        >
          + Add
        </button>
      </form>
    </div>
  );
}

// --- AddItemForm ---
function AddItemForm({ categories, onAdd }) {
  const EMPTY = { name: "", category: categories[0] ?? "", stockUnit: "bottles", orderUnit: "cases", par: 6 };
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(f => ({ ...f, category: categories[0] ?? "" }));
  }, [categories]);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd({ ...form, name: form.name.trim(), par: Number(form.par) || 1 });
    setForm(f => ({ ...EMPTY, category: f.category }));
  }

  return (
    <div className="add-form">
      <div className="add-form-title">Add Item</div>
      <form onSubmit={submit}>
        <div className="form-row">
          <div className="form-field grow">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              placeholder="e.g. Hendrick's Gin"
              value={form.name}
              onChange={e => set("name", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={e => set("category", e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Stock unit</label>
            <select className="form-input" value={form.stockUnit} onChange={e => set("stockUnit", e.target.value)}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Order unit</label>
            <select className="form-input" value={form.orderUnit} onChange={e => set("orderUnit", e.target.value)}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Par</label>
            <input
              className="form-input"
              style={{ width: 72 }}
              type="number"
              min="1"
              value={form.par}
              onChange={e => set("par", e.target.value)}
            />
          </div>
          <div className="form-field" style={{ justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary" disabled={!form.name.trim()}>
              + Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// --- ItemsTable ---
function ItemsTable({ items, onDelete, onEditPar }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Stock unit</th>
            <th>Order unit</th>
            <th>Par</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td
                colSpan={6}
                style={{ textAlign: "center", color: "var(--text-dim)", padding: "40px 0", fontFamily: "var(--mono)", fontSize: 12 }}
              >
                No items yet — add one above
              </td>
            </tr>
          )}
          {items.map(item => (
            <tr key={item.id}>
              <td style={{ fontWeight: 500 }}>{item.name}</td>
              <td><span className="cat-badge">{item.category}</span></td>
              <td className="mono" style={{ fontSize: 11, color: "var(--text-dim)" }}>{item.stockUnit}</td>
              <td className="mono" style={{ fontSize: 11, color: "var(--text-dim)" }}>{item.orderUnit}</td>
              <td>
                <EditablePar value={item.par} onSave={v => onEditPar(item.id, v)} />
              </td>
              <td>
                <button className="delete-btn" onClick={() => onDelete(item.id)} title="Delete item">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Items ---
function Items({ items, categories, onAdd, onDelete, onEditPar, onAddCategory, onDeleteCategory }) {
  return (
    <div>
      <CategoriesManager categories={categories} items={items} onAdd={onAddCategory} onDelete={onDeleteCategory} />
      <AddItemForm categories={categories} onAdd={onAdd} />
      <div className="section-title">All Items</div>
      <ItemsTable items={items} onDelete={onDelete} onEditPar={onEditPar} />
    </div>
  );
}

// --- OrderList ---
function OrderList({ items, onRemoveFromOrder, onIncrementOrderQty, onDecrementOrderQty }) {
  const flagged = items.filter(i => i.orderFlag);
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      <div className="order-header no-print">
        <div className="order-title">
          Order List — {flagged.length} item{flagged.length !== 1 ? "s" : ""}
        </div>
        <button className="btn btn-outline" onClick={() => window.print()}>
          ⎙ Export PDF
        </button>
      </div>

      <div className="order-print-region">
        <div className="print-date">{today}</div>
        <div className="print-heading">Bar Stock — Order List</div>

        {flagged.length === 0 ? (
          <div className="order-empty">
            <div className="order-empty-icon">✓</div>
            <div className="order-empty-text">Nothing flagged for order</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th className="no-print">Qty</th>
                  <th>Order unit</th>
                  <th className="no-print"></th>
                </tr>
              </thead>
              <tbody>
                {flagged.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td><span className="cat-badge">{item.category}</span></td>
                    <td className="no-print">
                      <div className="order-qty-stepper">
                        <button className="order-qty-btn" onClick={() => onDecrementOrderQty(item.id)}>−</button>
                        <span className="order-qty-count">{item.orderQty}</span>
                        <button className="order-qty-btn" onClick={() => onIncrementOrderQty(item.id)}>+</button>
                      </div>
                    </td>
                    <td className="mono" style={{ fontSize: 11, color: "var(--text-dim)" }}>{item.orderUnit}</td>
                    <td className="no-print">
                      <button
                        className="trash-btn"
                        onClick={() => onRemoveFromOrder(item.id)}
                        title="Remove from order"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Period helpers ---
function getPeriodBounds(period, offset) {
  const now = new Date();

  if (period === "day") {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    return {
      start: d.getTime(),
      end: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime(),
    };
  }

  if (period === "week") {
    // Monday-based week
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6, 23, 59, 59, 999);
    return { start: monday.getTime(), end: sunday.getTime() };
  }

  // month
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return {
    start: d.getTime(),
    end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).getTime(),
  };
}

function getPeriodLabel(period, offset) {
  const { start, end } = getPeriodBounds(period, offset);
  const s = new Date(start);
  const e = new Date(end);

  if (period === "day") {
    return s.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }
  if (period === "week") {
    const from = s.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    const to   = e.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    return `${from} – ${to}`;
  }
  return s.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

// --- Stats ---
function Stats({ records, onClear }) {
  const [period, setPeriod] = useState("week");
  const [offset, setOffset] = useState(0);

  function changePeriod(p) {
    setPeriod(p);
    setOffset(0);
  }

  const { start, end } = getPeriodBounds(period, offset);
  const label = getPeriodLabel(period, offset);

  const filtered = records.filter(r => r.timestamp >= start && r.timestamp <= end);

  const totals = Object.values(
    filtered.reduce((acc, r) => {
      if (!acc[r.itemId]) acc[r.itemId] = { itemId: r.itemId, itemName: r.itemName, category: r.category, unit: r.unit, total: 0, count: 0 };
      acc[r.itemId].total += r.used;
      acc[r.itemId].count++;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);

  return (
    <div>
      <div className="stats-header">
        <div className="stats-title">Usage History</div>
        <div className="view-toggle">
          <button className={`view-toggle-btn${period === "day"   ? " active" : ""}`} onClick={() => changePeriod("day")}>Day</button>
          <button className={`view-toggle-btn${period === "week"  ? " active" : ""}`} onClick={() => changePeriod("week")}>Week</button>
          <button className={`view-toggle-btn${period === "month" ? " active" : ""}`} onClick={() => changePeriod("month")}>Month</button>
        </div>
        <button className="btn btn-ghost" onClick={onClear}>Clear history</button>
      </div>

      <div className="stats-nav">
        <button className="stats-nav-btn" onClick={() => setOffset(o => o - 1)}>← Prev</button>
        <span className="stats-nav-label">{label}</span>
        <button className="stats-nav-btn" disabled={offset >= 0} onClick={() => setOffset(o => o + 1)}>Next →</button>
      </div>

      {records.length === 0 ? (
        <div className="stats-empty">
          <div className="stats-empty-text">No records yet — use Stocked or Restock all after a shift</div>
        </div>
      ) : totals.length === 0 ? (
        <div className="stats-empty">
          <div className="stats-empty-text">No usage recorded for this {period}</div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Used</th>
                <th>Unit</th>
                <th>Restocks</th>
              </tr>
            </thead>
            <tbody>
              {totals.map(row => (
                <tr key={row.itemId}>
                  <td style={{ fontWeight: 500 }}>{row.itemName}</td>
                  <td><span className="cat-badge">{row.category}</span></td>
                  <td className="mono" style={{ color: "var(--amber)", fontWeight: 600 }}>{row.total}</td>
                  <td className="mono" style={{ fontSize: 11, color: "var(--text-dim)" }}>{row.unit}</td>
                  <td className="mono" style={{ color: "var(--text-dim)" }}>{row.count}×</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- App ---
export default function App() {
  const [tab, setTab] = useState("shift");
  const [items, setItems] = useState(loadItems);
  const [records, setRecords] = useState(() => load(RECORDS_KEY));
  const [categories, setCategories] = useState(() => load(CATEGORIES_KEY, DEFAULT_CATEGORIES));

  useEffect(() => { save(ITEMS_KEY, items); }, [items]);
  useEffect(() => { save(RECORDS_KEY, records); }, [records]);
  useEffect(() => { save(CATEGORIES_KEY, categories); }, [categories]);

  function makeRecord(item) {
    return {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      unit: item.stockUnit,
      used: item.par - item.left,
      left: item.left,
      par: item.par,
    };
  }

  function addItem({ name, category, stockUnit, orderUnit, par }) {
    setItems(prev => [...prev, { id: crypto.randomUUID(), name, category, stockUnit, orderUnit, par, left: par, orderFlag: false, orderQty: 0 }]);
  }

  function addToOrder(id) {
    setItems(prev => prev.map(i => i.id === id
      ? { ...i, orderFlag: true, orderQty: (i.orderQty ?? 0) + 1 }
      : i
    ));
  }

  function removeFromOrder(id) {
    setItems(prev => prev.map(i => i.id === id
      ? { ...i, orderFlag: false, orderQty: 0 }
      : i
    ));
  }

  function incrementOrderQty(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, orderQty: (i.orderQty ?? 0) + 1 } : i));
  }

  function decrementOrderQty(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, orderQty: Math.max(1, (i.orderQty ?? 1) - 1) } : i));
  }

  function deleteItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function editPar(id, value) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, par: value } : i));
  }

  function addCategory(name) {
    setCategories(prev => [...prev, name]);
  }

  function deleteCategory(name) {
    setCategories(prev => prev.filter(c => c !== name));
  }

  function increment(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, left: i.left + 1 } : i));
  }

  function decrement(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, left: Math.max(0, i.left - 1) } : i));
  }

  function stocked(id) {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item && item.left < item.par) {
        setRecords(r => [...r, makeRecord(item)]);
      }
      return prev.map(i => i.id === id ? { ...i, left: i.par } : i);
    });
  }


  function restockAll() {
    setItems(prev => {
      const belowPar = prev.filter(i => i.left < i.par);
      if (belowPar.length > 0) {
        const now = Date.now();
        setRecords(r => [...r, ...belowPar.map(item => ({ ...makeRecord(item), timestamp: now }))]);
      }
      return prev.map(i => ({ ...i, left: i.par }));
    });
  }

  function clearHistory() {
    setRecords([]);
  }

  const TABS = [
    { id: "shift", label: "01 / SHIFT" },
    { id: "items", label: "02 / ITEMS" },
    { id: "order", label: "03 / ORDER LIST" },
    { id: "stats", label: "04 / STATS" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="header no-print">
          <div className="header-title">Bar Stock</div>
          <div className="header-sub">Shift Tracking · Order Management</div>
        </div>

        <div className="tabs no-print">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="main">
          {tab === "shift" && (
            <Shift
              items={items}
              categories={categories}
              onIncrement={increment}
              onDecrement={decrement}
              onStocked={stocked}
              onAddToOrder={addToOrder}
              onRestockAll={restockAll}
            />
          )}
          {tab === "items" && (
            <Items
              items={items}
              categories={categories}
              onAdd={addItem}
              onDelete={deleteItem}
              onEditPar={editPar}
              onAddCategory={addCategory}
              onDeleteCategory={deleteCategory}
            />
          )}
          {tab === "order" && (
            <OrderList
              items={items}
              onRemoveFromOrder={removeFromOrder}
              onIncrementOrderQty={incrementOrderQty}
              onDecrementOrderQty={decrementOrderQty}
            />
          )}
          {tab === "stats" && (
            <Stats records={records} onClear={clearHistory} />
          )}
        </div>
      </div>
    </>
  );
}

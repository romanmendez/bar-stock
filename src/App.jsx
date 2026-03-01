import React, { useState, useEffect, useRef } from "react";
import { supabase, rowToItem, itemToRow, rowToRecord, recordToRow } from "./supabase";

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
    font-size: 16px;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── Header ── */
  .header {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 20px;
    background: var(--near-black);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .header-title {
    font-size: 22px;
    font-weight: 800;
    color: var(--amber);
    letter-spacing: 2px;
    text-transform: uppercase;
    flex: 1;
  }

  .header-btn {
    background: none;
    border: none;
    color: var(--text-dim);
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s, background 0.15s;
  }

  .header-btn:hover { color: var(--cream); background: var(--surface2); }
  .header-btn.active { color: var(--amber); }

  .main { flex: 1; padding: 16px 16px calc(72px + env(safe-area-inset-bottom)); overflow-x: hidden; }

  /* ── Category badge ── */
  .cat-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    background: var(--surface2);
    border: 1px solid var(--border);
    font-size: 13px;
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
    font-size: 13px;
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
    font-size: 13px;
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
    font-size: 12px;
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
    font-size: 15px;
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

  table { width: 100%; border-collapse: collapse; font-size: 15px; }
  thead { background: var(--surface2); }

  thead th {
    padding: 12px 16px;
    font-size: 12px;
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
  tbody td.mono { font-family: var(--mono); font-size: 14px; }

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
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 16px;
  }

  /* ── Editable par ── */
  .par-span {
    font-family: var(--mono);
    font-size: 15px;
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
    font-size: 15px;
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
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
  }

  .category-chip-remove {
    background: none;
    border: none;
    color: var(--text-dim);
    cursor: pointer;
    font-size: 13px;
    padding: 0;
    line-height: 1;
    transition: color 0.15s;
  }

  .category-chip-remove:not(:disabled):hover { color: var(--red); }
  .category-chip-remove:disabled { opacity: 0.25; cursor: default; }

  .category-add-row { display: flex; gap: 10px; align-items: center; }

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

  /* ── Bottom nav ── */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    background: var(--near-black);
    border-top: 1px solid var(--border);
    padding-bottom: env(safe-area-inset-bottom);
    z-index: 100;
    min-height: 56px;
  }

  .bottom-nav-btn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background: none;
    border: none;
    color: var(--text-dim);
    cursor: pointer;
    padding: 10px 4px;
    transition: color 0.15s;
  }

  .bottom-nav-btn.active { color: var(--amber); }

  .bottom-nav-badge {
    position: absolute;
    top: 6px;
    right: calc(50% - 18px);
    background: var(--amber);
    color: var(--black);
    border-radius: 10px;
    font-size: 12px;
    font-weight: 800;
    min-width: 18px;
    text-align: center;
    line-height: 16px;
    padding: 0 4px;
  }

  /* ── Shift group ── */
  .shift-group { margin-bottom: 20px; }

  .shift-group-label {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 8px;
    padding-left: 2px;
  }

  /* ── Shift card ── */
  .shift-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 10px;
    overflow: hidden;
  }

  .shift-card.below-par { border-color: var(--amber-dim); }

  .shift-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px 12px;
  }

  .shift-card-name {
    font-size: 18px;
    font-weight: 600;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Card stepper ── */
  .shift-card-stepper {
    display: flex;
    align-items: stretch;
    padding: 0 16px 14px;
  }

  .card-stepper-btn {
    width: 52px;
    height: 52px;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text-dim);
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: var(--sans);
  }

  .card-stepper-btn:first-child { border-radius: 10px 0 0 10px; }
  .card-stepper-btn:last-child  { border-radius: 0 10px 10px 0; }

  .card-stepper-middle {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--surface2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    min-height: 52px;
  }

  .card-stepper-count {
    font-family: var(--mono);
    font-size: 22px;
    font-weight: 700;
    color: var(--text-dim);
  }

  .card-stepper-count.below-par { color: var(--amber); }
  .card-stepper-count.empty { color: var(--red); }

  .card-stepper-unit {
    font-size: 13px;
    color: var(--text-dim);
    margin-top: 3px;
  }

  /* ── Stocked button ── */
  .shift-card-footer { padding: 0 16px 14px; }

  .stocked-btn-full {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 2px solid var(--amber-dim);
    background: rgba(232,168,56,0.08);
    color: var(--amber);
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    font-family: var(--sans);
  }

  .stocked-btn-full:hover { background: rgba(232,168,56,0.18); }

  /* ── Order pill ── */
  .order-pill {
    padding: 6px 12px;
    border: 2px solid var(--border);
    border-radius: 20px;
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
    background: none;
    color: var(--text-dim);
    cursor: pointer;
  }

  .order-pill.flagged {
    border-color: var(--amber-dim);
    color: var(--amber);
    background: rgba(232,168,56,0.08);
  }

  /* ── Shift empty states ── */
  .shift-empty { padding: 64px 0; text-align: center; }
  .shift-empty-text { font-size: 15px; font-weight: 500; color: var(--text-dim); letter-spacing: 0.3px; }

  /* ── Item cards ── */
  .item-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 10px;
  }

  .item-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px 10px;
  }

  .item-card-name { font-size: 18px; font-weight: 600; flex: 1; }

  .item-card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 0 16px 14px;
    font-size: 13px;
    color: var(--text-dim);
  }

  /* ── Par stepper (item card) ── */
  .par-stepper { display: flex; align-items: stretch; }

  .par-stepper-btn {
    width: 36px;
    height: 36px;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text-dim);
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: var(--sans);
  }

  .par-stepper-btn:first-child { border-radius: 8px 0 0 8px; }
  .par-stepper-btn:last-child  { border-radius: 0 8px 8px 0; }

  .par-stepper-count {
    min-width: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    font-family: var(--mono);
    font-size: 16px;
    font-weight: 700;
    color: var(--text-dim);
  }

  /* ── Order cards ── */
  .order-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 10px;
  }

  .order-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
  }

  .order-card-name {
    font-size: 18px;
    font-weight: 600;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .order-card-controls {
    display: flex;
    align-items: stretch;
    padding: 0 16px 14px;
  }

  .order-qty-btn {
    width: 48px;
    height: 48px;
    background: var(--surface2);
    border: 1px solid var(--amber-dim);
    color: var(--amber);
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: var(--sans);
  }

  .order-qty-btn:first-child { border-radius: 10px 0 0 10px; }
  .order-qty-btn:last-child  { border-radius: 0 10px 10px 0; }

  .order-qty-middle {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--surface2);
    border-top: 1px solid var(--amber-dim);
    border-bottom: 1px solid var(--amber-dim);
    min-height: 48px;
  }

  .order-qty-count {
    font-family: var(--mono);
    font-size: 20px;
    font-weight: 700;
    color: var(--amber);
  }

  .order-qty-unit { font-size: 13px; color: var(--amber-dim); margin-top: 2px; }

  .order-card-print-row {
    display: none;
    padding: 0 16px 12px;
    font-size: 15px;
    color: #333;
  }

  /* ── Order header ── */
  .order-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .order-title { font-size: 18px; font-weight: 700; color: var(--cream); flex: 1; }
  .order-empty { padding: 64px 0; text-align: center; }
  .order-empty-icon { font-size: 40px; opacity: 0.35; margin-bottom: 14px; }
  .order-empty-text { font-size: 15px; font-weight: 500; color: var(--text-dim); letter-spacing: 0.3px; }

  /* ── View toggle (stats) ── */
  .view-toggle { display: flex; border: 2px solid var(--border); border-radius: 5px; overflow: hidden; }

  .view-toggle-btn {
    padding: 7px 16px;
    font-family: var(--sans);
    font-size: 13px;
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
  .stats-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; flex-wrap: wrap; }
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
    font-size: 16px;
    font-weight: 600;
    color: var(--cream);
    letter-spacing: 0.2px;
  }

  .stats-nav-btn {
    background: none;
    border: 2px solid var(--border);
    border-radius: 5px;
    color: var(--text-dim);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 6px 14px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
    font-family: var(--sans);
  }

  .stats-nav-btn:hover:not(:disabled) { color: var(--cream); border-color: var(--cream-dim); }
  .stats-nav-btn:disabled { opacity: 0.25; cursor: default; }

  .stats-empty { padding: 64px 0; text-align: center; }
  .stats-empty-text { font-size: 15px; font-weight: 500; color: var(--text-dim); letter-spacing: 0.3px; }

  /* ── Print ── */
  .print-date { display: none; }
  .print-heading { display: none; }

  @media print {
    .bottom-nav { display: none !important; }
    .header { display: none !important; }
    .main { padding: 0; }
    .order-card { background: white; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px; }
    .order-card-header { border-bottom: 1px solid #eee; }
    .order-card-name { color: black; }
    .cat-badge { background: #eee; color: #333; border: none; }
    .order-card-controls { display: none; }
    .order-card-print-row { display: block; }
    .print-date { display: block; font-family: monospace; font-size: 12px; color: #555; margin-bottom: 8px; }
    .print-heading { display: block; font-size: 24px; font-weight: 700; color: black; margin-bottom: 20px; }
    body { background: white; }
    .no-print { display: none !important; }
  }
`;

const UNITS = ["bottles", "cans", "kegs", "boxes", "cases", "litres", "units"];
const DEFAULT_CATEGORIES = ["Spirits", "Wine", "Beer", "Mixers", "Soft Drinks", "Other"];

// --- TrashIcon ---
const TrashIcon = () => (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" aria-hidden="true">
    <path d="M1 3.5h12M4.5 3.5V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1M5.5 6.5v5M8.5 6.5v5M2.5 3.5l.5 9a.5.5 0 00.5.5h7a.5.5 0 00.5-.5l.5-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// --- Nav Icons ---
const ShiftIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="3" width="14" height="18" rx="2"/>
    <path d="M9 3v2h6V3"/>
    <path d="M9 10h6M9 14h4"/>
  </svg>
);

const ItemsIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const OrderIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 001.96 1.61h9.72a2 2 0 001.96-1.61L23 6H6"/>
  </svg>
);

const StatsIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const RestockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
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

// --- ShiftCard ---
function ShiftCard({ item, onIncrement, onDecrement, onStocked, onAddToOrder }) {
  const belowPar = item.left < item.par;
  const empty = item.left === 0;
  const ordered = (item.orderQty ?? 0) > 0;
  const countClass = `card-stepper-count${empty ? " empty" : belowPar ? " below-par" : ""}`;
  return (
    <div className={`shift-card${belowPar ? " below-par" : ""}`}>
      <div className="shift-card-header">
        <span className="shift-card-name">{item.name}</span>
        <button className={`order-pill${ordered ? " flagged" : ""}`} onClick={() => onAddToOrder(item.id)}>
          {ordered ? `⊕ ${item.orderQty}` : "⊕ Order"}
        </button>
      </div>
      <div className="shift-card-stepper">
        <button className="card-stepper-btn" onClick={() => onDecrement(item.id)}>−</button>
        <div className="card-stepper-middle">
          <span className={countClass}>{item.left}</span>
          <span className="card-stepper-unit">{item.stockUnit}</span>
        </div>
        <button className="card-stepper-btn" onClick={() => onIncrement(item.id)}>+</button>
      </div>
      {belowPar && (
        <div className="shift-card-footer">
          <button className="stocked-btn-full" onClick={() => onStocked(item.id)}>
            Stock {item.par - item.left}
          </button>
        </div>
      )}
    </div>
  );
}

// --- Shift ---
function Shift({ items, categories, showAll, onIncrement, onDecrement, onStocked, onAddToOrder }) {
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
      {groups.length === 0 ? renderEmpty() : (
        groups.map(({ cat, items: groupItems }) => (
          <div className="shift-group" key={cat}>
            <div className="shift-group-label">{cat}</div>
            {groupItems.map(item => (
              <ShiftCard
                key={item.id}
                item={item}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onStocked={onStocked}
                onAddToOrder={onAddToOrder}
              />
            ))}
          </div>
        ))
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

// --- ItemCard ---
function ItemCard({ item, onDelete, onEditPar }) {
  return (
    <div className="item-card">
      <div className="item-card-header">
        <span className="item-card-name">{item.name}</span>
        <button className="trash-btn" onClick={() => onDelete(item.id)}><TrashIcon /></button>
      </div>
      <div className="item-card-meta">
        <span className="cat-badge">{item.category}</span>
        <span>·</span><span>{item.stockUnit}</span>
        <span>·</span><span>{item.orderUnit}</span>
        <span>· par</span>
        <div className="par-stepper">
          <button className="par-stepper-btn" onClick={() => onEditPar(item.id, Math.max(1, item.par - 1))}>−</button>
          <span className="par-stepper-count">{item.par}</span>
          <button className="par-stepper-btn" onClick={() => onEditPar(item.id, item.par + 1)}>+</button>
        </div>
      </div>
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
      {items.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--text-dim)", padding: "40px 0", fontFamily: "var(--mono)", fontSize: 12 }}>
          No items yet — add one above
        </div>
      ) : (
        items.map(item => (
          <ItemCard key={item.id} item={item} onDelete={onDelete} onEditPar={onEditPar} />
        ))
      )}
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

      <div className="print-date">{today}</div>
      <div className="print-heading">Bar Stock — Order List</div>

      {flagged.length === 0 ? (
        <div className="order-empty">
          <div className="order-empty-icon">✓</div>
          <div className="order-empty-text">Nothing flagged for order</div>
        </div>
      ) : (
        flagged.map(item => (
          <div className="order-card" key={item.id}>
            <div className="order-card-header">
              <span className="order-card-name">{item.name}</span>
              <span className="cat-badge">{item.category}</span>
              <button className="trash-btn" onClick={() => onRemoveFromOrder(item.id)} title="Remove from order">
                <TrashIcon />
              </button>
            </div>
            <div className="order-card-controls">
              <button className="order-qty-btn" onClick={() => onDecrementOrderQty(item.id)}>−</button>
              <div className="order-qty-middle">
                <span className="order-qty-count">{item.orderQty}</span>
                <span className="order-qty-unit">{item.orderUnit}</span>
              </div>
              <button className="order-qty-btn" onClick={() => onIncrementOrderQty(item.id)}>+</button>
            </div>
            <div className="order-card-print-row">{item.orderQty} × {item.orderUnit}</div>
          </div>
        ))
      )}
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
  const [showAll, setShowAll] = useState(true);
  const [items, setItems] = useState([]);
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      const [
        { data: itemRows },
        { data: recordRows },
        { data: categoryRows },
      ] = await Promise.all([
        supabase.from("items").select("*").order("name"),
        supabase.from("records").select("*").order("timestamp"),
        supabase.from("categories").select("*").order("name"),
      ]);

      setItems((itemRows ?? []).map(rowToItem));
      setRecords((recordRows ?? []).map(rowToRecord));

      if (categoryRows && categoryRows.length > 0) {
        setCategories(categoryRows.map(r => r.name));
      } else {
        // Seed defaults on first run
        await supabase.from("categories").insert(DEFAULT_CATEGORIES.map(name => ({ name })));
      }

      setLoading(false);
    }
    loadAll();
  }, []);

  function makeRecord(item) {
    return {
      id:        crypto.randomUUID(),
      timestamp: Date.now(),
      itemId:    item.id,
      itemName:  item.name,
      category:  item.category,
      unit:      item.stockUnit,
      used:      item.par - item.left,
      left:      item.left,
      par:       item.par,
    };
  }

  function addItem({ name, category, stockUnit, orderUnit, par }) {
    const newItem = { id: crypto.randomUUID(), name, category, stockUnit, orderUnit, par, left: par, orderFlag: false, orderQty: 0 };
    setItems(prev => [...prev, newItem]);
    supabase.from("items").insert(itemToRow(newItem));
  }

  function addToOrder(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newQty = (item.orderQty ?? 0) + 1;
    setItems(prev => prev.map(i => i.id === id ? { ...i, orderFlag: true, orderQty: newQty } : i));
    supabase.from("items").update({ order_flag: true, order_qty: newQty }).eq("id", id);
  }

  function removeFromOrder(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, orderFlag: false, orderQty: 0 } : i));
    supabase.from("items").update({ order_flag: false, order_qty: 0 }).eq("id", id);
  }

  function incrementOrderQty(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newQty = (item.orderQty ?? 0) + 1;
    setItems(prev => prev.map(i => i.id === id ? { ...i, orderQty: newQty } : i));
    supabase.from("items").update({ order_qty: newQty }).eq("id", id);
  }

  function decrementOrderQty(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, (item.orderQty ?? 1) - 1);
    setItems(prev => prev.map(i => i.id === id ? { ...i, orderQty: newQty } : i));
    supabase.from("items").update({ order_qty: newQty }).eq("id", id);
  }

  function deleteItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
    supabase.from("items").delete().eq("id", id);
  }

  function editPar(id, value) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, par: value } : i));
    supabase.from("items").update({ par: value }).eq("id", id);
  }

  function addCategory(name) {
    setCategories(prev => [...prev, name]);
    supabase.from("categories").insert({ name });
  }

  function deleteCategory(name) {
    setCategories(prev => prev.filter(c => c !== name));
    supabase.from("categories").delete().eq("name", name);
  }

  function increment(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newLeft = item.left + 1;
    setItems(prev => prev.map(i => i.id === id ? { ...i, left: newLeft } : i));
    supabase.from("items").update({ left_count: newLeft }).eq("id", id);
  }

  function decrement(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newLeft = Math.max(0, item.left - 1);
    setItems(prev => prev.map(i => i.id === id ? { ...i, left: newLeft } : i));
    supabase.from("items").update({ left_count: newLeft }).eq("id", id);
  }

  function stocked(id) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (item.left < item.par) {
      const record = makeRecord(item);
      setRecords(prev => [...prev, record]);
      supabase.from("records").insert(recordToRow(record));
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, left: i.par } : i));
    supabase.from("items").update({ left_count: item.par }).eq("id", id);
  }

  function restockAll() {
    const belowPar = items.filter(i => i.left < i.par);
    const now = Date.now();
    if (belowPar.length > 0) {
      const newRecords = belowPar.map(item => ({ ...makeRecord(item), timestamp: now }));
      setRecords(prev => [...prev, ...newRecords]);
      supabase.from("records").insert(newRecords.map(recordToRow));
    }
    setItems(prev => prev.map(i => ({ ...i, left: i.par })));
    supabase.from("items").upsert(items.map(i => ({ ...itemToRow(i), left_count: i.par })));
  }

  function clearHistory() {
    setRecords([]);
    supabase.from("records").delete().gte("timestamp", 0);
  }

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="app" style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "var(--text-dim)", fontSize: 14, letterSpacing: 2, textTransform: "uppercase" }}>
            Loading…
          </div>
        </div>
      </>
    );
  }

  const belowParCount = items.filter(i => i.left < i.par).length;
  const orderCount = items.filter(i => i.orderFlag).length;

  const TABS = [
    { id: "shift", label: "Shift",  icon: <ShiftIcon /> },
    { id: "items", label: "Items",  icon: <ItemsIcon /> },
    { id: "order", label: "Order",  icon: <OrderIcon /> },
    { id: "stats", label: "Stats",  icon: <StatsIcon /> },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="header no-print">
          <div className="header-title">{TABS.find(t => t.id === tab)?.label}</div>
          {tab === "shift" && (
            <>
              <button
                className={`header-btn${!showAll ? " active" : ""}`}
                onClick={() => setShowAll(v => !v)}
                title={showAll ? "Show below par only" : "Show all"}
              >
                <FilterIcon />
              </button>
              <button className="header-btn" onClick={restockAll} title="Restock all">
                <RestockIcon />
              </button>
            </>
          )}
        </div>

        <div className="main">
          {tab === "shift" && (
            <Shift
              items={items}
              categories={categories}
              showAll={showAll}
              onIncrement={increment}
              onDecrement={decrement}
              onStocked={stocked}
              onAddToOrder={addToOrder}
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

        <nav className="bottom-nav no-print">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`bottom-nav-btn${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.id === "shift" && belowParCount > 0 && (
                <span className="bottom-nav-badge">{belowParCount}</span>
              )}
              {t.id === "order" && orderCount > 0 && (
                <span className="bottom-nav-badge">{orderCount}</span>
              )}
              {t.icon}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

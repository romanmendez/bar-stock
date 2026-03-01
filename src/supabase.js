import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

// ── Row mappers ────────────────────────────────────────────────────────────

export function rowToItem(row) {
  return {
    id:        row.id,
    name:      row.name,
    category:  row.category,
    stockUnit: row.stock_unit,
    orderUnit: row.order_unit,
    par:       row.par,
    left:      row.left_count,
    orderFlag: row.order_flag,
    orderQty:  row.order_qty,
  };
}

export function itemToRow(item) {
  return {
    id:         item.id,
    name:       item.name,
    category:   item.category,
    stock_unit: item.stockUnit,
    order_unit: item.orderUnit,
    par:        item.par,
    left_count: item.left,
    order_flag: item.orderFlag,
    order_qty:  item.orderQty,
  };
}

export function rowToRecord(row) {
  return {
    id:        row.id,
    timestamp: row.timestamp,
    itemId:    row.item_id,
    itemName:  row.item_name,
    category:  row.category,
    unit:      row.unit,
    used:      row.used,
    left:      row.left_count,
    par:       row.par,
  };
}

export function recordToRow(record) {
  return {
    id:         record.id,
    timestamp:  record.timestamp,
    item_id:    record.itemId,
    item_name:  record.itemName,
    category:   record.category,
    unit:       record.unit,
    used:       record.used,
    left_count: record.left,
    par:        record.par,
  };
}

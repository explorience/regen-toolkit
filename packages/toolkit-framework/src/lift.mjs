// SP7 — crosswalk-driven resource lift (the reusable ETL). Supersedes the old
// scripts/lift-resources.mjs. The framework owns the ETL; its OUTPUT is instance data.
// Honors the V3 DB caveats: raw leads are NEVER auto-promoted to reviewed/public.

/** Minimal dependency-free CSV parser (quoted fields, embedded commas/newlines, "" escapes). */
export function parseCsv(text) {
  const rows = [];
  let field = '', record = [], inQuotes = false;
  const pushField = () => { record.push(field); field = ''; };
  const pushRecord = () => { if (record.length > 1 || record[0] !== '') rows.push(record); record = []; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') pushField();
    else if (c === '\n') { pushField(); pushRecord(); }
    else if (c !== '\r') field += c;
  }
  if (field.length || record.length) { pushField(); pushRecord(); }
  const header = rows.shift() || [];
  return rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

/** Map one crosswalk/registry row -> a `resource` object (provenance + state preserved, never auto-promoted). */
export function liftRow(row) {
  const route = String(row.toolkit_route || '').trim();
  return {
    title: row.name || row.resource_name || row.global_id || '(untitled)',
    type: 'resource',
    url: row.url || '',
    resource_type: row.primary_type || row.resource_type || '',
    toolkit_route: route,
    maturity: 'raw',              // never auto-promote (V3 DB caveat)
    lifecycle_state: 'raw-lead',
    public_use: 'raw-lead',
    ai_assisted: /ai|adjacent expansion/i.test(row.source_origin || ''),
    original_source: row.source_origin || row.tab_location || '',
    notes: row.review_status || '',
  };
}

/** Lift many rows; returns { resources, skipped } (skips rows with tweet-noise in the route). */
export function liftRows(rows) {
  const resources = [];
  const skipped = [];
  for (const row of rows) {
    const route = String(row.toolkit_route || '');
    if (route.includes('http') || route.length > 60) { skipped.push(row); continue; } // noise guard
    resources.push(liftRow(row));
  }
  return { resources, skipped };
}

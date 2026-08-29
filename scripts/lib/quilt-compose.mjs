/**
 * QUILT organic composer — pure geometry, no I/O.
 * Containment tiers: organism ╔═╗ ⊃ organ ┏━┓ ⊃ patch ╭─╮ ⊃ pod (…).
 * Spec: docs/superpowers/specs/2026-07-19-quilt-visualization-design.md (rev b).
 */

// Display width = code-point count. Assumes single-column BMP glyphs (box-drawing,
// shade blocks █▓▒░, ⊕ ☓ ✓); NOT full wcwidth-aware (wide/emoji chars would misalign).
export const len = (s) => [...s].length;
export const pad = (s, w) => s + " ".repeat(Math.max(0, w - len(s)));

/** Small bordered box sized to its content. Returns array of lines. */
export function patch(title, lines) {
  const w = Math.max(len(title) + 4, ...lines.map((l) => len(l) + 2), 6);
  const out = ["╭─" + title + "─".repeat(w - 3 - len(title)) + "╮"];
  for (const l of lines) out.push("│" + pad(l, w - 2) + "│");
  out.push("╰" + "─".repeat(w - 2) + "╯");
  return out;
}

/**
 * Greedy row-packer. Blocks are arrays of lines; rows wrap at `width`,
 * shorter blocks in a row are padded with blank space below (ragged
 * bottoms are intentional — organic, not squared off).
 */
export function pack(blocks, width, gap = 1) {
  const rows = [];
  let row = [], used = 0;
  for (const b of blocks) {
    const w = Math.max(...b.map(len));
    if (row.length && used + gap + w > width) { rows.push(row); row = []; used = 0; }
    used += (row.length ? gap : 0) + w;
    row.push(b.map((l) => pad(l, w)));
  }
  if (row.length) rows.push(row);
  const lines = [];
  for (const r of rows) {
    const h = Math.max(...r.map((b) => b.length));
    for (let i = 0; i < h; i++)
      lines.push(
        r.map((b) => b[i] ?? " ".repeat(len(b[0]))).join(" ".repeat(gap)).replace(/\s+$/, ""),
      );
  }
  return lines;
}

export const ORGANISM_INNER = 84;

/**
 * Single-breath tokens wrapped under a hanging label: `label ─ (a) (b)…`
 * Assumes label + individual tokens fit within `inner` (caller's responsibility;
 * no overflow guard here, unlike organ/organism).
 */
export function pods(label, tokens, inner) {
  const lines = [];
  let cur = label + " ─";
  const indent = " ".repeat(len(label) + 2);
  for (const t of tokens) {
    if (len(cur) + 1 + len(t) > inner) { lines.push(cur); cur = indent; }
    cur += " " + t;
  }
  lines.push(cur);
  return lines;
}

/** Heavy-bordered subsystem container. Every output line is exactly `width`. */
export function organ(title, contentLines, width) {
  const inner = width - 4;
  const dashes = width - 6 - len(title);
  if (dashes < 1) throw new Error(`organ "${title}" title overflow (${len(title)} too long for width ${width})`);
  const out = ["┏━ " + title + " " + "━".repeat(dashes) + "━┓"];
  for (const l of contentLines) {
    if (len(l) > inner) throw new Error(`organ "${title}" overflow (${len(l)}>${inner}): ${l}`);
    out.push("┃ " + pad(l, inner) + " ┃");
  }
  out.push("┗" + "━".repeat(width - 2) + "┛");
  return out;
}

/** Center a stitch/narration line within the organism. */
export const stitch = (s) =>
  " ".repeat(Math.max(0, Math.floor((ORGANISM_INNER - len(s)) / 2))) + s;

/**
 * Outer membrane. `rows` entries are either an array of organ blocks
 * (packed side by side with the same packer patches use) or a raw string.
 * Returns the full quilt as one string.
 */
export function organism(title, rows) {
  const OW = ORGANISM_INNER;
  const dashes = OW - 2 - len(title);
  if (dashes < 1) throw new Error(`organism title overflow (${len(title)} too long)`);
  const out = ["╔═ " + title + " " + "═".repeat(dashes) + "═╗"];
  for (const r of rows) {
    const lines = Array.isArray(r) ? pack(r, OW, 1) : [r];
    for (const l of lines) {
      if (len(l) > OW) throw new Error(`organism overflow (${len(l)}>${OW}): ${l}`);
      out.push("║ " + pad(l, OW) + " ║");
    }
  }
  out.push("╚" + "═".repeat(OW + 2) + "╝");
  return out.join("\n");
}

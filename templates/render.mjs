// render.mjs — minimal Mustache-style template renderer.
//
// Supports:
//   {{ variable }}         — interpolate (HTML-safe is NOT applied; assumes markdown output)
//   {{ object.path }}      — nested lookup
//   {{ #if condition }} ... {{ /if }}
//   {{ #each items }} ... {{ /each }}   — exposes `this` as the current item, plus parent scope
//   {{> partial-name }}    — include partial from partialsDir
//
// Deliberately minimal: no escaping, no helpers, no inverted sections. The
// generated artifacts are markdown READMEs, not HTML.
//
// Usage:
//   import { render } from "./templates/render.mjs";
//   render(templateString, data, { partialsDir, partials })

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

function lookup(scope, expr) {
  // `this` resolves to scope.this if set (each-iteration item), else scope itself
  if (expr === "this") return scope && scope.this !== undefined ? scope.this : scope;
  const parts = expr.split(".");
  let cur = scope;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function isTruthy(v) {
  if (v == null || v === false) return false;
  if (Array.isArray(v) && v.length === 0) return false;
  if (typeof v === "string" && v.trim() === "") return false;
  return true;
}

function loadPartial(name, opts) {
  if (opts.partials && Object.prototype.hasOwnProperty.call(opts.partials, name)) {
    return opts.partials[name];
  }
  if (opts.partialsDir) {
    const p = path.join(opts.partialsDir, `${name}.md`);
    if (existsSync(p)) return readFileSync(p, "utf-8");
  }
  return null;
}

export function render(template, data, opts = {}) {
  function r(tmpl, scope) {
    // Process #each FIRST (outer-most). The body is then recursed with the
    // per-iteration child scope, where any nested #if can see iteration vars.
    let out = tmpl;

    // #each blocks (process before #if so nested #if sees child scope)
    out = out.replace(
      /\{\{\s*#each\s+([\w.]+)\s*\}\}([\s\S]*?)\{\{\s*\/each\s*\}\}/g,
      (_, listExpr, body) => {
        const list = lookup(scope, listExpr);
        if (!Array.isArray(list)) return "";
        return list
          .map((item) => {
            const childScope = typeof item === "object" && item !== null
              ? { ...scope, ...item, this: item }
              : { ...scope, this: item };
            return r(body, childScope);
          })
          .join("");
      },
    );

    // #if blocks
    out = out.replace(
      /\{\{\s*#if\s+([\w.]+)\s*\}\}([\s\S]*?)\{\{\s*\/if\s*\}\}/g,
      (_, cond, body) => (isTruthy(lookup(scope, cond)) ? r(body, scope) : ""),
    );

    // Partials
    out = out.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (m, name) => {
      const p = loadPartial(name, opts);
      if (p == null) return m; // leave as-is if partial missing
      return r(p, scope);
    });

    // Interpolations
    out = out.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, expr) => {
      const v = lookup(scope, expr);
      return v == null ? "" : String(v);
    });

    return out;
  }

  return r(template, data);
}

// src/util.mjs — dependency-free helpers shared across the package.

/** Stable, file-safe slug from a title. */
export function slugify(s) {
  return String(s).toLowerCase().normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics (combining marks)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

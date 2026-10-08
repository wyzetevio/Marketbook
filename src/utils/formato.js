// Formatos de presentación compartidos por las pantallas.

/** 25 -> "S/ 25.00" */
export function formatearPrecio(valor) {
  const n = Number(valor);
  return `S/ ${(Number.isFinite(n) ? n : 0).toFixed(2)}`;
}

/** "Ana María Pérez" -> "AP" · "ana" -> "A" · sin nombre usa la primera letra del correo. */
export function iniciales(nombre, correo = '') {
  const palabras = String(nombre ?? '').trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return (String(correo).trim()[0] ?? '?').toUpperCase();
  const primera = palabras[0][0];
  const ultima = palabras.length > 1 ? palabras[palabras.length - 1][0] : '';
  return `${primera}${ultima}`.toUpperCase();
}

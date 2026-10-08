// Formatos de presentación compartidos por las pantallas.

/** 25 -> "S/ 25.00" */
export function formatearPrecio(valor) {
  const n = Number(valor);
  return `S/ ${(Number.isFinite(n) ? n : 0).toFixed(2)}`;
}

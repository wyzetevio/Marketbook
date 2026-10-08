// Estilos de texto. No incluyen color: el color sale de t.colors para respetar el modo oscuro.
// Uso: { ...t.typography.titulo, color: t.colors.texto }
export const typography = {
  titulo: { fontSize: 24, fontWeight: '700', lineHeight: 30 },     // "¡Bienvenido de nuevo!"
  encabezado: { fontSize: 17, fontWeight: '600', lineHeight: 22 }, // título centrado del Header
  subtitulo: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
  cuerpo: { fontSize: 15, fontWeight: '400', lineHeight: 21 },
  etiqueta: { fontSize: 13, fontWeight: '600', lineHeight: 18 },   // labels de inputs
  pequeno: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  boton: { fontSize: 15, fontWeight: '600', lineHeight: 20 },
  precio: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
};

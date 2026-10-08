// Paletas de color de Marketbook (basadas en el diseño de Figma; el modo oscuro es derivado).
// Las pantallas NO usan estos objetos directo: leen `t.colors` desde useAppTheme() / useEstilos()
// para respetar el modo oscuro. Ambas paletas tienen exactamente las mismas claves.

export const claro = {
  fondo: '#FFFFFF',              // fondo de pantallas
  superficie: '#FFFFFF',         // tarjetas, tab bar, modales
  superficieAlt: '#F5F5F7',      // fondo de inputs, chips, botón secundario
  texto: '#1A1A1A',
  textoSecundario: '#6E6E73',
  textoTenue: '#8E8E93',         // placeholders, ayudas, iconos inactivos
  borde: '#E8E8EB',
  primario: '#1E1E1E',           // botones principales (negro)
  textoSobrePrimario: '#FFFFFF',
  acento: '#5B3DF5',             // links, precios, tab activa (morado)
  acentoSuave: '#EEEAFF',
  peligro: '#D93036',            // "Cerrar sesión", errores
  peligroSuave: '#FDECEC',
  exito: '#17703F',
  exitoSuave: '#E3F5EA',
  aviso: '#A35200',
  avisoSuave: '#FFF0DE',
  overlay: 'rgba(0, 0, 0, 0.4)', // fondo detrás de modales
};

export const oscuro = {
  fondo: '#121212',
  superficie: '#1C1C1E',
  superficieAlt: '#2C2C2E',
  texto: '#F5F5F7',
  textoSecundario: '#AEAEB2',
  textoTenue: '#8E8E93',
  borde: '#38383A',
  primario: '#F5F5F7',           // en oscuro los botones principales son blancos
  textoSobrePrimario: '#121212',
  acento: '#A493FF',
  acentoSuave: '#2B2550',
  peligro: '#FF6B6B',
  peligroSuave: '#3A1D1F',
  exito: '#4CC38A',
  exitoSuave: '#16301F',
  aviso: '#F5A524',
  avisoSuave: '#3A2A12',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

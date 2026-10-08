// Paletas de color de Marketbook. Las pantallas NO usan estos objetos directo:
// leen `t.colors` desde useAppTheme() / useEstilos() para respetar el modo oscuro.
// Ambas paletas tienen exactamente las mismas claves.

export const claro = {
  fondo: '#F7F4EF',              // fondo general (papel)
  superficie: '#FFFFFF',         // tarjetas, inputs, tab bar
  superficieAlt: '#EFEAE2',      // chips, fondos secundarios
  texto: '#1F1B16',
  textoSecundario: '#6B635A',
  textoTenue: '#9A9188',         // placeholders, ayudas
  borde: '#E2DBD0',
  primario: '#2F5D50',           // verde tinta: botones y elementos activos
  primarioPresionado: '#244A40',
  primarioSuave: '#DCE9E4',
  textoSobrePrimario: '#FFFFFF',
  acento: '#A35A1F',             // precios y detalles
  peligro: '#B3261E',
  peligroSuave: '#F9DEDC',
  exito: '#256B42',
  exitoSuave: '#DDF0E3',
  aviso: '#8A5A00',
  avisoSuave: '#FBEFD5',
  overlay: 'rgba(0, 0, 0, 0.4)',
  sombra: '#000000',
};

export const oscuro = {
  fondo: '#14120F',
  superficie: '#1E1B17',
  superficieAlt: '#29251F',
  texto: '#F2EDE6',
  textoSecundario: '#B5ACA1',
  textoTenue: '#857D73',
  borde: '#3A342C',
  primario: '#6FB8A0',
  primarioPresionado: '#5AA38B',
  primarioSuave: '#1F3530',
  textoSobrePrimario: '#0E1A16',
  acento: '#E39A5C',
  peligro: '#F2B8B5',
  peligroSuave: '#3D1F1D',
  exito: '#7FD1A0',
  exitoSuave: '#1C3324',
  aviso: '#E8C36A',
  avisoSuave: '#3A2F14',
  overlay: 'rgba(0, 0, 0, 0.6)',
  sombra: '#000000',
};

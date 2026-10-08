import React from 'react';
import { Text, View } from 'react-native';
import { useAppTheme, useEstilos } from '../theme';

/**
 * Etiqueta pequeña de estado o categoría.
 *   <Badge texto="Como nuevo" tono="acento" />
 *   <Badge texto="Entregado" tono="exito" />
 *
 * tono: 'neutro' (default) | 'acento' (morado) | 'exito' (verde) | 'aviso' (naranja) | 'peligro' (rojo)
 */
export default function Badge({ texto, tono = 'neutro' }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  const { fondo, color } = coloresDe(t.colors, tono);
  return (
    <View style={[styles.badge, { backgroundColor: fondo }]}>
      <Text style={[styles.texto, { color }]} numberOfLines={1}>{texto}</Text>
    </View>
  );
}

function coloresDe(c, tono) {
  switch (tono) {
    case 'acento': return { fondo: c.acentoSuave, color: c.acento };
    case 'exito': return { fondo: c.exitoSuave, color: c.exito };
    case 'aviso': return { fondo: c.avisoSuave, color: c.aviso };
    case 'peligro': return { fondo: c.peligroSuave, color: c.peligro };
    default: return { fondo: c.superficieAlt, color: c.textoSecundario };
  }
}

const crearEstilos = (t) => ({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: t.spacing.sm,
    paddingVertical: 2,
    borderRadius: t.radius.sm - 4,
  },
  texto: { ...t.typography.pequeno, fontSize: 11, fontWeight: '600' },
});

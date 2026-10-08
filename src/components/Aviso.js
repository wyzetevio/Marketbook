import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, useEstilos } from '../theme';

const TONOS = {
  peligro: { icono: 'alert-circle', fondo: 'peligroSuave', color: 'peligro' },
  exito: { icono: 'checkmark-circle', fondo: 'exitoSuave', color: 'exito' },
  info: { icono: 'information-circle', fondo: 'acentoSuave', color: 'acento' },
};

/**
 * Mensaje dentro de la pantalla (errores de una acción, confirmaciones). Funciona igual en web y móvil.
 *   {errorEnvio ? <Aviso mensaje={errorEnvio} /> : null}
 *   <Aviso tono="exito" mensaje="Nombre actualizado." />
 *
 * tono: 'peligro' (default) | 'exito' | 'info'
 */
export default function Aviso({ mensaje, tono = 'peligro', estilo }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  if (!mensaje) return null;
  const { icono, fondo, color } = TONOS[tono] ?? TONOS.peligro;
  return (
    <View style={[styles.aviso, { backgroundColor: t.colors[fondo] }, estilo]} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Ionicons name={icono} size={18} color={t.colors[color]} style={styles.icono} />
      <Text style={[styles.texto, { color: t.colors[color] }]}>{mensaje}</Text>
    </View>
  );
}

const crearEstilos = (t) => ({
  aviso: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: t.spacing.md,
    borderRadius: t.radius.sm,
    marginBottom: t.spacing.md,
  },
  icono: { marginRight: t.spacing.sm, marginTop: 1 },
  texto: { ...t.typography.cuerpo, fontSize: 14, flex: 1 },
});

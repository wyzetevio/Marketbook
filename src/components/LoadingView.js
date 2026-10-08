import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAppTheme, useEstilos } from '../theme';

/**
 * Pantalla de carga a pantalla completa.
 *   if (cargando) return <LoadingView />;
 *   if (cargando) return <LoadingView mensaje="Cargando tus compras..." />;
 */
export default function LoadingView({ mensaje = 'Cargando...' }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  return (
    <View style={styles.contenedor} accessibilityRole="progressbar" accessibilityLabel={mensaje}>
      <ActivityIndicator size="large" color={t.colors.primario} />
      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
    </View>
  );
}

const crearEstilos = (t) => ({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: t.spacing.lg,
    backgroundColor: t.colors.fondo,
  },
  mensaje: { ...t.typography.cuerpo, color: t.colors.textoSecundario, marginTop: t.spacing.md, textAlign: 'center' },
});

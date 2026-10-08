import React from 'react';
import { Text, View } from 'react-native';
import { useEstilos } from '../theme';
import Button from './Button';

/**
 * Error a pantalla completa con botón de reintento.
 *   if (error) return <ErrorView mensaje={error} onReintentar={refrescar} />;
 *
 * mensaje: texto del error (normalmente el `error` del hook o e.message)
 * onReintentar: si se pasa, muestra el botón "Reintentar"
 * titulo / textoBoton: opcionales
 */
export default function ErrorView({ mensaje, onReintentar, titulo = 'Algo salió mal', textoBoton = 'Reintentar' }) {
  const styles = useEstilos(crearEstilos);
  return (
    <View style={styles.contenedor} accessibilityRole="alert">
      <Text style={styles.icono}>⚠️</Text>
      <Text style={styles.titulo}>{titulo}</Text>
      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
      {onReintentar ? <Button titulo={textoBoton} onPress={onReintentar} estilo={styles.boton} /> : null}
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
  icono: { fontSize: 40, marginBottom: t.spacing.sm },
  titulo: { ...t.typography.subtitulo, color: t.colors.texto, textAlign: 'center' },
  mensaje: { ...t.typography.cuerpo, color: t.colors.peligro, textAlign: 'center', marginTop: t.spacing.sm },
  boton: { marginTop: t.spacing.lg, minWidth: 160 },
});

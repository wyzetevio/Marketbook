import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, useEstilos } from '../theme';
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
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  return (
    <View style={styles.contenedor} accessibilityRole="alert">
      <Ionicons name="cloud-offline-outline" size={72} color={t.colors.borde} />
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
  titulo: { ...t.typography.subtitulo, color: t.colors.texto, textAlign: 'center', marginTop: t.spacing.md },
  mensaje: { ...t.typography.cuerpo, color: t.colors.textoSecundario, textAlign: 'center', marginTop: t.spacing.sm },
  boton: { marginTop: t.spacing.lg, minWidth: 180 },
});

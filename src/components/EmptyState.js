import React from 'react';
import { Text, View } from 'react-native';
import { useEstilos } from '../theme';
import Button from './Button';

/**
 * Estado vacío (lista sin resultados, carrito vacío, etc.).
 *   <EmptyState icono="🛒" titulo="Tu carrito está vacío" mensaje="Explora libros y agrégalos aquí." />
 *   <FlatList ... ListEmptyComponent={<EmptyState titulo="Sin resultados" textoAccion="Limpiar filtros" onAccion={limpiar} />} />
 *
 * icono: emoji (default 📚) · titulo · mensaje (opcional)
 * textoAccion + onAccion: botón opcional
 */
export default function EmptyState({ icono = '📚', titulo, mensaje, textoAccion, onAccion }) {
  const styles = useEstilos(crearEstilos);
  return (
    <View style={styles.contenedor}>
      <Text style={styles.icono}>{icono}</Text>
      {titulo ? <Text style={styles.titulo}>{titulo}</Text> : null}
      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
      {textoAccion && onAccion ? (
        <Button titulo={textoAccion} onPress={onAccion} variante="secundario" estilo={styles.boton} />
      ) : null}
    </View>
  );
}

const crearEstilos = (t) => ({
  // flexGrow (no flex) para que también funcione dentro de ListEmptyComponent.
  contenedor: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: t.spacing.xxl,
    paddingHorizontal: t.spacing.lg,
  },
  icono: { fontSize: 48, marginBottom: t.spacing.sm },
  titulo: { ...t.typography.subtitulo, color: t.colors.texto, textAlign: 'center' },
  mensaje: { ...t.typography.cuerpo, color: t.colors.textoSecundario, textAlign: 'center', marginTop: t.spacing.xs },
  boton: { marginTop: t.spacing.lg },
});

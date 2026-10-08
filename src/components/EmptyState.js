import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, useEstilos } from '../theme';
import Button from './Button';

/**
 * Estado vacío con icono grande gris (como "Mi carrito" vacío en Figma).
 *   <EmptyState icono="cart" titulo="No hay productos." />
 *   <FlatList ... ListEmptyComponent={<EmptyState icono="search" titulo="Sin resultados"
 *       mensaje="Prueba con otra búsqueda." textoAccion="Limpiar filtros" onAccion={limpiar} />} />
 *
 * icono: nombre de Ionicons (default 'book') · titulo · mensaje (opcional)
 * textoAccion + onAccion: botón opcional
 */
export default function EmptyState({ icono = 'book', titulo, mensaje, textoAccion, onAccion }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  return (
    <View style={styles.contenedor}>
      <Ionicons name={icono} size={96} color={t.colors.borde} />
      {titulo ? <Text style={styles.titulo}>{titulo}</Text> : null}
      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
      {textoAccion && onAccion ? <Button titulo={textoAccion} onPress={onAccion} estilo={styles.boton} /> : null}
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
  titulo: { ...t.typography.etiqueta, fontSize: 15, color: t.colors.texto, textAlign: 'center', marginTop: t.spacing.md },
  mensaje: { ...t.typography.cuerpo, color: t.colors.textoSecundario, textAlign: 'center', marginTop: t.spacing.xs },
  boton: { marginTop: t.spacing.lg, minWidth: 180 },
});

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useEstilos } from '../theme';
import { formatearPrecio } from '../utils/formato';
import Badge from './Badge';

const TONO_ESTADO = { activa: 'exito', vendida: 'aviso', retirada: 'neutro' };

/**
 * Tarjeta de libro para listas (Explorar, Mis libros, Carrito...).
 *   <BookCard libro={item} onPress={() => navigation.navigate('Detalle', { id: item.id })} />
 *   <BookCard libro={item} mostrarEstado />                       // Mis libros: activa / vendida / retirada
 *   <BookCard libro={item} pie={<Button titulo="Quitar" variante="texto" tamano="pequeno" onPress={...} />} />
 *
 * libro: objeto de usePublicaciones / usePublicacion / useCarrito
 *   (usa titulo, autor, precio, categoria, estado_libro, estado_publicacion, vendedor_nombre si existen)
 * onPress: opcional; si no se pasa la tarjeta no es pulsable
 * mostrarEstado: muestra el estado de la publicación
 * mostrarVendedor: muestra "Vendedor: ..." (default true)
 * pie: elemento opcional al final de la tarjeta (botones de acción)
 */
export default function BookCard({ libro, onPress, mostrarEstado = false, mostrarVendedor = true, pie }) {
  const styles = useEstilos(crearEstilos);
  if (!libro) return null;
  const { titulo, autor, precio, categoria, estado_libro, estado_publicacion, vendedor_nombre } = libro;

  const contenido = (
    <>
      <View style={styles.fila}>
        <View style={styles.portada}>
          <Text style={styles.portadaIcono}>📖</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.titulo} numberOfLines={2}>{titulo}</Text>
          {autor ? <Text style={styles.autor} numberOfLines={1}>{autor}</Text> : null}
          <View style={styles.etiquetas}>
            {categoria ? <Badge texto={categoria} tono="primario" /> : null}
            {estado_libro ? <Badge texto={estado_libro} /> : null}
            {mostrarEstado && estado_publicacion ? (
              <Badge texto={estado_publicacion} tono={TONO_ESTADO[estado_publicacion] ?? 'neutro'} />
            ) : null}
          </View>
          <View style={styles.filaInferior}>
            <Text style={styles.precio}>{formatearPrecio(precio)}</Text>
            {mostrarVendedor && vendedor_nombre !== undefined ? (
              <Text style={styles.vendedor} numberOfLines={1}>{vendedor_nombre || 'Vendedor'}</Text>
            ) : null}
          </View>
        </View>
      </View>
      {pie ? <View style={styles.pie}>{pie}</View> : null}
    </>
  );

  if (!onPress) return <View style={styles.tarjeta}>{contenido}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}${autor ? `, de ${autor}` : ''}, ${formatearPrecio(precio)}`}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
    >
      {contenido}
    </Pressable>
  );
}

const crearEstilos = (t) => ({
  tarjeta: {
    backgroundColor: t.colors.superficie,
    borderWidth: 1,
    borderColor: t.colors.borde,
    borderRadius: t.radius.lg,
    padding: t.spacing.md,
    marginBottom: t.spacing.md,
  },
  presionada: { opacity: 0.85 },
  fila: { flexDirection: 'row' },
  portada: {
    width: 64,
    height: 88,
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.superficieAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: t.spacing.md,
  },
  portadaIcono: { fontSize: 28 },
  info: { flex: 1 },
  titulo: { ...t.typography.subtitulo, fontSize: 16, color: t.colors.texto },
  autor: { ...t.typography.cuerpo, fontSize: 14, color: t.colors.textoSecundario, marginTop: 2 },
  etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.xs, marginTop: t.spacing.sm },
  filaInferior: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: t.spacing.sm },
  precio: { ...t.typography.precio, color: t.colors.acento },
  vendedor: { ...t.typography.pequeno, color: t.colors.textoTenue, flexShrink: 1, marginLeft: t.spacing.sm },
  pie: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: t.spacing.sm,
    marginTop: t.spacing.sm,
    paddingTop: t.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: t.colors.borde,
  },
});

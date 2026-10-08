import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, useEstilos } from '../theme';
import { formatearPrecio } from '../utils/formato';
import Badge from './Badge';

const TONO_ESTADO_LIBRO = { Nuevo: 'acento', 'Como nuevo': 'acento', Bueno: 'exito', Regular: 'aviso' };
const ESTADO_PUBLICACION = {
  activa: { texto: 'Activa', tono: 'exito' },
  vendida: { texto: 'Vendida', tono: 'acento' },
  retirada: { texto: 'Retirada', tono: 'neutro' },
};

/**
 * Tarjeta de libro, en dos variantes del Figma.
 *
 * variante="lista" (default) — fila con portada a la izquierda (Mis publicaciones, Carrito, Mis compras):
 *   <BookCard libro={item} onPress={() => navigation.navigate('Detalle', { id: item.id })} />
 *   <BookCard libro={item} mostrarEstado derecha={<Ionicons name="ellipsis-vertical" ... />} />
 *   <BookCard libro={item} pie={<Button titulo="Quitar" variante="texto" tamano="pequeno" onPress={...} />} />
 *
 * variante="grid" — tarjeta vertical para una cuadrícula de 2 columnas (Marketplace):
 *   <FlatList numColumns={2} columnWrapperStyle={{ gap: 12 }} renderItem={({ item }) => (
 *     <BookCard variante="grid" libro={item} onPress={...} onAgregar={() => agregar(item)} agregado={estaEnCarrito(item.id)} />
 *   )} />
 *
 * Props:
 *   libro: objeto de usePublicaciones / usePublicacion / useCarrito
 *          (usa titulo, autor, precio, categoria, estado_libro, estado_publicacion, vendedor_nombre si existen)
 *   onPress: opcional; sin él la tarjeta no es pulsable
 *   mostrarEstado: muestra Activa / Vendida / Retirada
 *   mostrarVendedor: (lista) muestra el nombre del vendedor, default true
 *   derecha: (lista) elemento a la derecha, p. ej. un chevron o menú
 *   pie: (lista) elemento al final de la tarjeta, p. ej. botones de acción
 *   onAgregar / agregado: (grid) botón circular "+" para el carrito; si agregado=true muestra ✓
 */
export default function BookCard({
  libro,
  variante = 'lista',
  onPress,
  mostrarEstado = false,
  mostrarVendedor = true,
  derecha,
  pie,
  onAgregar,
  agregado = false,
}) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  if (!libro) return null;

  const { titulo, autor, precio, categoria, estado_libro, estado_publicacion, vendedor_nombre } = libro;
  const estado = mostrarEstado ? ESTADO_PUBLICACION[estado_publicacion] : null;
  const badges = (
    <View style={styles.badges}>
      {estado_libro ? <Badge texto={estado_libro} tono={TONO_ESTADO_LIBRO[estado_libro] ?? 'neutro'} /> : null}
      {estado ? <Badge texto={estado.texto} tono={estado.tono} /> : null}
    </View>
  );
  const etiqueta = `${titulo}${autor ? `, de ${autor}` : ''}, ${formatearPrecio(precio)}`;
  const envolver = (contenido, estiloBase) => (onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={etiqueta}
      style={({ pressed }) => [estiloBase, pressed && styles.presionada]}>
      {contenido}
    </Pressable>
  ) : <View style={estiloBase}>{contenido}</View>);

  if (variante === 'grid') {
    return envolver(
      <>
        <View style={styles.portadaGrid}>
          <Ionicons name="book" size={40} color={t.colors.textoTenue} />
        </View>
        <Text style={styles.titulo} numberOfLines={1}>{titulo}</Text>
        {autor ? <Text style={styles.autor} numberOfLines={1}>{autor}</Text> : null}
        {badges}
        <View style={styles.filaPrecio}>
          <Text style={styles.precio}>{formatearPrecio(precio)}</Text>
          {onAgregar ? (
            <Pressable
              onPress={onAgregar}
              disabled={agregado}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={agregado ? 'Ya está en el carrito' : 'Agregar al carrito'}
              style={({ pressed }) => [styles.botonAgregar, pressed && styles.presionada]}
            >
              <Ionicons name={agregado ? 'checkmark' : 'add'} size={18} color={t.colors.textoSobrePrimario} />
            </Pressable>
          ) : null}
        </View>
      </>,
      styles.tarjetaGrid,
    );
  }

  return envolver(
    <>
      <View style={styles.fila}>
        <View style={styles.portadaLista}>
          <Ionicons name="book" size={26} color={t.colors.textoTenue} />
        </View>
        <View style={styles.info}>
          <Text style={styles.titulo} numberOfLines={2}>{titulo}</Text>
          {autor ? <Text style={styles.autor} numberOfLines={1}>{autor}</Text> : null}
          {categoria ? <Text style={styles.meta} numberOfLines={1}>{categoria}</Text> : null}
          {badges}
          <Text style={[styles.precio, styles.precioLista]}>{formatearPrecio(precio)}</Text>
          {mostrarVendedor && vendedor_nombre !== undefined ? (
            <Text style={styles.meta} numberOfLines={1}>Vendedor: {vendedor_nombre || 'Vendedor'}</Text>
          ) : null}
        </View>
        {derecha ? <View style={styles.derecha}>{derecha}</View> : null}
      </View>
      {pie ? <View style={styles.pie}>{pie}</View> : null}
    </>,
    styles.tarjetaLista,
  );
}

const crearEstilos = (t) => ({
  presionada: { opacity: 0.8 },
  // --- lista ---
  tarjetaLista: {
    backgroundColor: t.colors.superficie,
    borderWidth: 1,
    borderColor: t.colors.borde,
    borderRadius: t.radius.md,
    padding: t.spacing.md,
    marginBottom: t.spacing.md,
  },
  fila: { flexDirection: 'row' },
  portadaLista: {
    width: 64,
    height: 92,
    borderRadius: t.radius.sm - 4,
    backgroundColor: t.colors.superficieAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: t.spacing.md,
  },
  info: { flex: 1 },
  derecha: { marginLeft: t.spacing.sm, justifyContent: 'center' },
  precioLista: { marginTop: t.spacing.xs },
  pie: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: t.spacing.sm,
    marginTop: t.spacing.md,
    paddingTop: t.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: t.colors.borde,
  },
  // --- grid ---
  tarjetaGrid: { flex: 1, marginBottom: t.spacing.lg },
  portadaGrid: {
    aspectRatio: 0.7,
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.superficieAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: t.spacing.sm,
  },
  filaPrecio: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: t.spacing.xs },
  botonAgregar: {
    width: 28,
    height: 28,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.primario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // --- comunes ---
  titulo: { ...t.typography.etiqueta, fontSize: 14, color: t.colors.texto },
  autor: { ...t.typography.pequeno, color: t.colors.textoSecundario, marginTop: 2 },
  meta: { ...t.typography.pequeno, color: t.colors.textoTenue, marginTop: 2 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: t.spacing.xs, marginTop: t.spacing.xs },
  precio: { ...t.typography.precio, color: t.colors.acento },
});

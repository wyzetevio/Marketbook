import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, useEstilos } from '../theme';

/**
 * Botón de la app (píldora, estilo Figma).
 *   <Button titulo="Iniciar sesión" onPress={entrar} cargando={enviando} />
 *   <Button titulo="Cancelar" variante="secundario" onPress={cerrar} />
 *   <Button titulo="Retirar publicación" variante="peligro" onPress={retirar} />
 *   <Button titulo="Agregar al carrito" icono="cart-outline" onPress={agregar} />
 *
 * variante:
 *   'primario'   (default) fondo negro (blanco en modo oscuro)
 *   'secundario' fondo gris claro
 *   'contorno'   borde gris, fondo de la pantalla
 *   'peligro'    borde y texto rojo
 *   'texto'      solo texto morado (tipo link)
 * tamano: 'normal' (default) | 'pequeno'
 * cargando: muestra un spinner y bloquea el botón · deshabilitado: lo bloquea
 * icono: nombre de Ionicons (https://icons.expo.fyi) antes del texto
 * estilo: estilos extra del contenedor (márgenes, ancho, flex)
 */
export default function Button({
  titulo,
  onPress,
  variante = 'primario',
  tamano = 'normal',
  cargando = false,
  deshabilitado = false,
  icono,
  estilo,
  accessibilityLabel,
}) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  const bloqueado = cargando || deshabilitado;
  const colores = coloresDe(t.colors, variante);
  const pequeno = tamano === 'pequeno';

  return (
    <Pressable
      onPress={onPress}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? titulo}
      accessibilityState={{ disabled: bloqueado, busy: cargando }}
      style={({ pressed }) => [
        styles.base,
        pequeno && styles.pequeno,
        variante === 'texto' && styles.sinRelleno,
        { backgroundColor: colores.fondo, borderColor: colores.borde },
        pressed && styles.presionado,
        deshabilitado && styles.deshabilitado,
        estilo,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={colores.texto} />
      ) : (
        <View style={styles.contenido}>
          {icono ? <Ionicons name={icono} size={pequeno ? 16 : 18} color={colores.texto} style={styles.icono} /> : null}
          <Text style={[pequeno ? styles.textoPequeno : styles.texto, { color: colores.texto }]} numberOfLines={1}>
            {titulo}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function coloresDe(c, variante) {
  switch (variante) {
    case 'secundario': return { fondo: c.superficieAlt, borde: c.superficieAlt, texto: c.texto };
    case 'contorno': return { fondo: c.fondo, borde: c.borde, texto: c.texto };
    case 'peligro': return { fondo: c.fondo, borde: c.peligro, texto: c.peligro };
    case 'texto': return { fondo: 'transparent', borde: 'transparent', texto: c.acento };
    default: return { fondo: c.primario, borde: c.primario, texto: c.textoSobrePrimario };
  }
}

const crearEstilos = (t) => ({
  base: {
    minHeight: 48,
    paddingHorizontal: t.spacing.lg,
    borderRadius: t.radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pequeno: { minHeight: 36, paddingHorizontal: t.spacing.md },
  sinRelleno: { minHeight: 0, paddingVertical: t.spacing.sm, paddingHorizontal: t.spacing.sm },
  presionado: { opacity: 0.8 },
  deshabilitado: { opacity: 0.4 },
  contenido: { flexDirection: 'row', alignItems: 'center' },
  icono: { marginRight: t.spacing.sm },
  texto: { ...t.typography.boton },
  textoPequeno: { ...t.typography.etiqueta },
});

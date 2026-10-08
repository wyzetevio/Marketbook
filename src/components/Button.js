import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { useAppTheme, useEstilos } from '../theme';

/**
 * Botón de la app.
 *   <Button titulo="Guardar" onPress={guardar} cargando={guardando} />
 *   <Button titulo="Eliminar" variante="peligro" onPress={eliminar} />
 *   <Button titulo="Ver más" variante="texto" tamano="pequeno" onPress={...} />
 *
 * variante: 'primario' (default) | 'secundario' | 'peligro' | 'texto'
 * tamano: 'normal' (default) | 'pequeno'
 * cargando: muestra un spinner y bloquea el botón
 * deshabilitado: bloquea el botón
 * icono: emoji opcional antes del texto
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

  return (
    <Pressable
      onPress={onPress}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? titulo}
      accessibilityState={{ disabled: bloqueado, busy: cargando }}
      style={({ pressed }) => [
        styles.base,
        tamano === 'pequeno' && styles.pequeno,
        { backgroundColor: colores.fondo, borderColor: colores.borde },
        pressed && styles.presionado,
        deshabilitado && styles.deshabilitado,
        estilo,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={colores.texto} />
      ) : (
        <Text style={[styles.texto, tamano === 'pequeno' && styles.textoPequeno, { color: colores.texto }]} numberOfLines={1}>
          {icono ? `${icono}  ` : ''}{titulo}
        </Text>
      )}
    </Pressable>
  );
}

function coloresDe(c, variante) {
  switch (variante) {
    case 'secundario':
      return { fondo: c.superficie, borde: c.primario, texto: c.primario };
    case 'peligro':
      return { fondo: c.peligro, borde: c.peligro, texto: c.fondo };
    case 'texto':
      return { fondo: 'transparent', borde: 'transparent', texto: c.primario };
    default:
      return { fondo: c.primario, borde: c.primario, texto: c.textoSobrePrimario };
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
  presionado: { opacity: 0.8 },
  deshabilitado: { opacity: 0.45 },
  texto: { ...t.typography.boton },
  textoPequeno: { ...t.typography.etiqueta },
});

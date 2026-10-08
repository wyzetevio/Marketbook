import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTema } from '../hooks';
import { claro, oscuro } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';

/*
 * Theme de Marketbook.
 *
 * Forma del theme (t):
 *   { esOscuro, colors, spacing, radius, typography, statusBar }
 *
 * Uso recomendado en pantallas y componentes:
 *
 *   import { StyleSheet } from 'react-native';
 *   import { useEstilos } from '../../theme';
 *
 *   // Fuera del componente, para que la función sea estable:
 *   const crearEstilos = (t) => ({
 *     contenedor: { flex: 1, backgroundColor: t.colors.fondo, padding: t.spacing.md },
 *     titulo: { ...t.typography.titulo, color: t.colors.texto },
 *   });
 *
 *   export default function MiPantalla() {
 *     const styles = useEstilos(crearEstilos);
 *     return <View style={styles.contenedor}>...</View>;
 *   }
 *
 * Si necesitas un valor suelto (p. ej. color de un ActivityIndicator):
 *   const t = useAppTheme();  <ActivityIndicator color={t.colors.primario} />
 *
 * No escribas colores fijos (#fff, 'black', ...) en pantallas: el modo oscuro dejaría de funcionar.
 */

const crear = (esOscuro) => Object.freeze({
  esOscuro,
  colors: esOscuro ? oscuro : claro,
  spacing,
  radius,
  typography,
  statusBar: esOscuro ? 'light' : 'dark', // para <StatusBar style={t.statusBar} /> de expo-status-bar
});

// Se crean una sola vez: así el objeto es estable y los useMemo no se recalculan sin necesidad.
const temaClaro = crear(false);
const temaOscuro = crear(true);

export function getTheme(esOscuro) {
  return esOscuro ? temaOscuro : temaClaro;
}

/** Theme actual según la preferencia guardada en useTema(). */
export function useAppTheme() {
  const { esOscuro } = useTema();
  return getTheme(esOscuro);
}

/**
 * Crea estilos a partir del theme actual y los recalcula solo cuando cambia el modo.
 * crearEstilos: (t) => ({ ...objeto de estilos... }), declarada FUERA del componente.
 */
export function useEstilos(crearEstilos) {
  const t = useAppTheme();
  return useMemo(() => StyleSheet.create(crearEstilos(t)), [crearEstilos, t]);
}

export { claro, oscuro, spacing, radius, typography };
export { getNavigationTheme } from './navegacion';

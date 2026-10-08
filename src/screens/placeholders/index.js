/*
 * PANTALLAS TEMPORALES (placeholders) — Bloque A solo las usa para armar las tabs.
 *
 * Cada compañero las REEMPLAZA por su pantalla real en src/navigation/AppNavigator.js
 * (cambiando el `component` de la tab correspondiente) y luego puede borrar su placeholder:
 *   - ExplorarPlaceholder  -> Bloque B (Piero): Explorar / Marketplace
 *   - MisLibrosPlaceholder -> Bloque B (Piero): Mis publicaciones
 *   - CarritoPlaceholder   -> Bloque C (Jesús): Carrito
 *   - MisComprasPlaceholder / MisVentasPlaceholder -> Bloque C (Jesús): Mis compras / Mis ventas
 *     (se abren desde Perfil; están en el Stack, no en las tabs)
 */
import React from 'react';
import { View } from 'react-native';
import { useEstilos } from '../../theme';
import { EmptyState, Header } from '../../components';

function Placeholder({ titulo, icono, bloque, onAtras }) {
  const styles = useEstilos(crearEstilos);
  return (
    <View style={styles.pantalla}>
      <Header titulo={titulo} onAtras={onAtras} />
      <EmptyState icono={icono} titulo="En construcción" mensaje={bloque} />
    </View>
  );
}

export function ExplorarPlaceholder() {
  return <Placeholder titulo="Explorar" icono="home-outline" bloque="Bloque B — Piero" />;
}

export function MisLibrosPlaceholder() {
  return <Placeholder titulo="Mis libros" icono="book-outline" bloque="Bloque B — Piero" />;
}

export function CarritoPlaceholder() {
  return <Placeholder titulo="Mi carrito" icono="cart-outline" bloque="Bloque C — Jesús" />;
}

export function MisComprasPlaceholder({ navigation }) {
  return <Placeholder titulo="Mis compras" icono="bag-handle-outline" bloque="Bloque C — Jesús" onAtras={navigation.goBack} />;
}

export function MisVentasPlaceholder({ navigation }) {
  return <Placeholder titulo="Mis ventas" icono="pricetag-outline" bloque="Bloque C — Jesús" onAtras={navigation.goBack} />;
}

const crearEstilos = (t) => ({
  pantalla: { flex: 1, backgroundColor: t.colors.fondo },
});

import React, { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useAppTheme, useEstilos } from '../theme';

/**
 * Encabezado de pantalla con título centrado (estilo Figma).
 *   <Header titulo="Perfil" />
 *   <Header titulo="Detalle" onAtras={() => navigation.goBack()} />
 *   <Header titulo="Mi carrito" derecha={<Pressable onPress={...}><Ionicons name="trash-outline" ... /></Pressable>} />
 *
 * onAtras: si se pasa, muestra la flecha ← a la izquierda
 * derecha: elemento opcional a la derecha (icono o botón pequeño)
 * Respeta el notch / barra de estado automáticamente.
 */
export default function Header({ titulo, onAtras, derecha }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  // Se lee el contexto directamente para no fallar si no hay SafeAreaProvider.
  const insets = useContext(SafeAreaInsetsContext);

  return (
    <View style={[styles.contenedor, { paddingTop: (insets?.top ?? 0) + t.spacing.sm }]}>
      <View style={styles.lado}>
        {onAtras ? (
          <Pressable onPress={onAtras} hitSlop={12} accessibilityRole="button" accessibilityLabel="Volver">
            <Ionicons name="arrow-back" size={24} color={t.colors.texto} />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.titulo} numberOfLines={1} accessibilityRole="header">{titulo}</Text>
      <View style={[styles.lado, styles.ladoDerecho]}>{derecha}</View>
    </View>
  );
}

const crearEstilos = (t) => ({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.spacing.md,
    paddingBottom: t.spacing.md,
    backgroundColor: t.colors.fondo,
  },
  lado: { minWidth: 40, flexDirection: 'row', alignItems: 'center' },
  ladoDerecho: { justifyContent: 'flex-end' },
  titulo: { ...t.typography.encabezado, flex: 1, textAlign: 'center', color: t.colors.texto },
});

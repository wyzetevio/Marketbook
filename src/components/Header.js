import React, { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useAppTheme, useEstilos } from '../theme';

/**
 * Encabezado de pantalla (para pantallas sin el header de React Navigation, como las tabs).
 *   <Header titulo="Mi perfil" />
 *   <Header titulo="Explorar" subtitulo="Encuentra tu próxima lectura" />
 *   <Header titulo="Detalle" onAtras={() => navigation.goBack()} derecha={<Button ... tamano="pequeno" />} />
 *
 * onAtras: si se pasa, muestra la flecha ← · derecha: elemento opcional a la derecha
 * Respeta el notch / barra de estado automáticamente.
 */
export default function Header({ titulo, subtitulo, onAtras, derecha }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  // Se lee el contexto directamente para no fallar si no hay SafeAreaProvider.
  const insets = useContext(SafeAreaInsetsContext);

  return (
    <View style={[styles.contenedor, { paddingTop: (insets?.top ?? 0) + t.spacing.md }]}>
      {onAtras ? (
        <Pressable onPress={onAtras} hitSlop={12} accessibilityRole="button" accessibilityLabel="Volver" style={styles.atras}>
          <Text style={styles.flecha}>←</Text>
        </Pressable>
      ) : null}
      <View style={styles.textos}>
        <Text style={styles.titulo} numberOfLines={1} accessibilityRole="header">{titulo}</Text>
        {subtitulo ? <Text style={styles.subtitulo} numberOfLines={1}>{subtitulo}</Text> : null}
      </View>
      {derecha ? <View style={styles.derecha}>{derecha}</View> : null}
    </View>
  );
}

const crearEstilos = (t) => ({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.spacing.md,
    paddingBottom: t.spacing.md,
    backgroundColor: t.colors.superficie,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.borde,
  },
  atras: { marginRight: t.spacing.sm, paddingVertical: t.spacing.xs, paddingRight: t.spacing.xs },
  flecha: { fontSize: 24, color: t.colors.texto },
  textos: { flex: 1 },
  titulo: { ...t.typography.titulo, fontSize: 22, color: t.colors.texto },
  subtitulo: { ...t.typography.pequeno, color: t.colors.textoSecundario, marginTop: 2 },
  derecha: { marginLeft: t.spacing.sm },
});

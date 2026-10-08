import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, useEstilos } from '../theme';

/**
 * Pantalla de bienvenida (Splash del Figma) mientras se comprueba la sesión y el tema guardado.
 * La usa AppNavigator; las demás pantallas deben usar LoadingView.
 */
export default function SplashView() {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  return (
    <View style={styles.contenedor} accessibilityLabel="Cargando Marketbook">
      <View style={styles.marca}>
        <Ionicons name="book" size={30} color={t.colors.textoSobrePrimario} />
        <Text style={styles.nombre}>Marketbook</Text>
      </View>
      <ActivityIndicator color={t.colors.textoSobrePrimario} style={styles.spinner} />
    </View>
  );
}

const crearEstilos = (t) => ({
  contenedor: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.primario },
  marca: { flexDirection: 'row', alignItems: 'center' },
  nombre: { ...t.typography.titulo, color: t.colors.textoSobrePrimario, marginLeft: t.spacing.sm },
  spinner: { marginTop: t.spacing.xl },
});

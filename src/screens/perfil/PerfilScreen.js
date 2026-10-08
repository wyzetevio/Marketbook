// Versión mínima para probar la navegación (paso 4). La pantalla completa de Perfil llega en el paso 5.
import React, { useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../../hooks';
import { useEstilos } from '../../theme';
import { Button, Header } from '../../components';
import { confirmAction, showMessage } from '../../utils/dialogs';

export default function PerfilScreen() {
  const { signOut } = useAuth();
  const styles = useEstilos(crearEstilos);
  const [saliendo, setSaliendo] = useState(false);

  const cerrarSesion = () => confirmAction('Cerrar sesión', '¿Seguro que quieres salir?', async () => {
    setSaliendo(true);
    try {
      await signOut();
    } catch (e) {
      setSaliendo(false);
      showMessage('No se pudo cerrar sesión', e.message);
    }
  });

  return (
    <View style={styles.pantalla}>
      <Header titulo="Perfil" />
      <View style={styles.contenido}>
        <Button titulo="Cerrar sesión" variante="peligro" onPress={cerrarSesion} cargando={saliendo} />
      </View>
    </View>
  );
}

const crearEstilos = (t) => ({
  pantalla: { flex: 1, backgroundColor: t.colors.fondo },
  contenido: { padding: t.spacing.lg },
});

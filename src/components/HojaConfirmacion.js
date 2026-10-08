import React, { useContext } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useAppTheme, useEstilos } from '../theme';
import Aviso from './Aviso';
import Button from './Button';

/**
 * Modal inferior de confirmación (estilo Figma). Funciona igual en web y Android, sin Alert.alert.
 *   <HojaConfirmacion
 *     visible={confirmando}
 *     titulo="Cerrar sesión"
 *     mensaje="¿Seguro que quieres cerrar sesión?"
 *     textoConfirmar="Sí, cerrar sesión"
 *     variante="peligro"
 *     cargando={saliendo}
 *     error={errorSalir}
 *     onConfirmar={salir}
 *     onCancelar={() => setConfirmando(false)}
 *   />
 *
 * variante: 'peligro' (default, botón rojo) | 'primario'
 * cargando: bloquea los botones y no deja cerrar la hoja mientras se ejecuta la acción
 * error: mensaje (e.message) que se muestra dentro de la hoja si la acción falla
 */
export default function HojaConfirmacion({
  visible,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'peligro',
  cargando = false,
  error,
  onConfirmar,
  onCancelar,
}) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  const insets = useContext(SafeAreaInsetsContext);
  const cancelar = () => { if (!cargando) onCancelar?.(); };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={cancelar}>
      <View style={styles.overlay}>
        {/* Tocar fuera de la hoja equivale a cancelar */}
        <Pressable style={styles.fondo} onPress={cancelar} accessibilityLabel="Cerrar" />
        <View style={[styles.hoja, { paddingBottom: (insets?.bottom ?? 0) + t.spacing.md }]}>
          <View style={styles.asa} />
          <Text style={[styles.titulo, variante === 'peligro' && styles.tituloPeligro]} accessibilityRole="header">
            {titulo}
          </Text>
          <View style={styles.separador} />
          {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
          <Aviso mensaje={error} />
          <View style={styles.botones}>
            <Button
              titulo={textoCancelar}
              variante="secundario"
              onPress={cancelar}
              deshabilitado={cargando}
              estilo={styles.boton}
            />
            <Button
              titulo={textoConfirmar}
              variante={variante === 'peligro' ? 'peligroRelleno' : 'primario'}
              onPress={onConfirmar}
              cargando={cargando}
              estilo={[styles.boton, styles.botonDerecho]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const crearEstilos = (t) => ({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: t.colors.overlay },
  fondo: { flex: 1 },
  hoja: {
    width: '100%',
    maxWidth: 430, // en web coincide con el marco de teléfono de AppNavigator
    alignSelf: 'center',
    paddingHorizontal: t.spacing.lg,
    paddingTop: t.spacing.md,
    backgroundColor: t.colors.superficie,
    borderTopLeftRadius: t.radius.lg,
    borderTopRightRadius: t.radius.lg,
  },
  asa: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.borde,
    marginBottom: t.spacing.md,
  },
  titulo: { ...t.typography.subtitulo, fontSize: 18, color: t.colors.texto, textAlign: 'center' },
  tituloPeligro: { color: t.colors.peligro },
  separador: { height: 1, backgroundColor: t.colors.borde, marginVertical: t.spacing.md },
  mensaje: { ...t.typography.cuerpo, color: t.colors.texto, textAlign: 'center', marginBottom: t.spacing.lg },
  botones: { flexDirection: 'row' },
  boton: { flex: 1 },
  botonDerecho: { marginLeft: t.spacing.sm },
});

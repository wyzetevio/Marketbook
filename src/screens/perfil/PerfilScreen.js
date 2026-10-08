import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, usePerfil, useTema } from '../../hooks';
import { useAppTheme, useEstilos } from '../../theme';
import { Button, Header, HojaConfirmacion, LoadingView } from '../../components';
import { iniciales } from '../../utils/formato';

// Fila de la lista de opciones: icono, texto y, a la derecha, una flecha o un control (Switch).
function Fila({ icono, titulo, onPress, derecha, deshabilitado = false, peligro = false, ultima = false }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  const color = peligro ? t.colors.peligro : t.colors.texto;
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado || !onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: deshabilitado }}
      style={({ pressed }) => [styles.fila, !ultima && styles.filaBorde, pressed && styles.presionada, deshabilitado && styles.deshabilitada]}
    >
      <Ionicons name={icono} size={22} color={color} style={styles.filaIcono} />
      <Text style={[styles.filaTexto, { color }]} numberOfLines={1}>{titulo}</Text>
      {derecha ?? (peligro ? null : <Ionicons name="chevron-forward" size={20} color={t.colors.textoTenue} />)}
    </Pressable>
  );
}

export default function PerfilScreen({ navigation }) {
  const { signOut } = useAuth();
  const { perfil, cargando, error, refrescar } = usePerfil();
  const { esOscuro, alternarModo } = useTema();
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);

  const [refrescando, setRefrescando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  const [errorSalir, setErrorSalir] = useState('');
  const montado = useRef(true);

  // Al cerrar sesión AppNavigator desmonta esta pantalla: no actualizamos estado después.
  useEffect(() => {
    montado.current = true;
    return () => { montado.current = false; };
  }, []);

  // Deslizar hacia abajo recarga el perfil (usePerfil además recarga solo al volver a la pestaña).
  const alRefrescar = useCallback(async () => {
    setRefrescando(true);
    await refrescar();
    if (montado.current) setRefrescando(false);
  }, [refrescar]);

  const abrirConfirmacion = () => {
    setErrorSalir('');
    setConfirmando(true);
  };

  const cerrarSesion = async () => {
    setSaliendo(true);
    setErrorSalir('');
    try {
      await signOut();
      // No se navega a mano: AppNavigator detecta que ya no hay sesión y muestra el Login.
    } catch (e) {
      if (montado.current) {
        setErrorSalir(e.message);
        setSaliendo(false);
      }
    }
  };

  // Solo la primera carga ocupa toda la pantalla; al volver a la pestaña se siguen viendo los datos.
  if (cargando && !perfil && !error) {
    return (
      <View style={styles.pantalla}>
        <Header titulo="Perfil" />
        <LoadingView mensaje="Cargando tu perfil..." />
      </View>
    );
  }

  const nombre = perfil?.nombre?.trim() ?? '';

  return (
    <View style={styles.pantalla}>
      <Header titulo="Perfil" />
      <ScrollView
        contentContainerStyle={styles.contenido}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={alRefrescar} tintColor={t.colors.acento} colors={[t.colors.acento]} />}
      >
        {perfil ? (
          <View style={styles.encabezado}>
            <View style={styles.avatar} accessibilityLabel={`Avatar de ${nombre || perfil.correo}`}>
              <Text style={styles.avatarTexto}>{iniciales(nombre, perfil.correo)}</Text>
            </View>
            <View style={styles.datos}>
              {/* Estado vacío: el perfil existe pero todavía no tiene nombre */}
              <Text style={[styles.nombre, !nombre && styles.sinNombre]} numberOfLines={1}>
                {nombre || 'Sin nombre'}
              </Text>
              <Text style={styles.correo} numberOfLines={1}>{perfil.correo}</Text>
            </View>
          </View>
        ) : null}

        {error ? (
          // Sin perfil no se puede editar el nombre, pero Modo oscuro y Cerrar sesión siguen disponibles.
          <View style={[styles.errorCaja, !perfil && styles.errorSinPerfil]} accessibilityRole="alert">
            <Ionicons name="cloud-offline-outline" size={perfil ? 20 : 40} color={t.colors.peligro} />
            <Text style={styles.errorTexto}>
              {perfil ? `No se pudo actualizar tu perfil: ${error}` : error}
            </Text>
            <Button titulo="Reintentar" tamano="pequeno" variante="contorno" onPress={refrescar} cargando={cargando} />
          </View>
        ) : null}

        {perfil && !nombre ? (
          <Text style={styles.ayuda}>Agrega tu nombre en "Mi cuenta" para que los compradores te reconozcan.</Text>
        ) : null}

        <View style={styles.seccion}>
          <Fila icono="person-outline" titulo="Mi cuenta" onPress={() => navigation.navigate('MiCuenta')} deshabilitado={!perfil} />
          <Fila icono="bag-handle-outline" titulo="Mis compras" onPress={() => navigation.navigate('MisCompras')} />
          <Fila icono="pricetag-outline" titulo="Mis ventas" onPress={() => navigation.navigate('MisVentas')} />
          {/* Solo el Switch alterna el modo: si la fila también fuera pulsable, en web el clic contaría dos veces */}
          <Fila
            icono={esOscuro ? 'moon' : 'moon-outline'}
            titulo="Modo oscuro"
            ultima
            derecha={
              <Switch
                value={esOscuro}
                onValueChange={alternarModo}
                trackColor={{ false: t.colors.borde, true: t.colors.acento }}
                thumbColor={esOscuro ? t.colors.texto : t.colors.superficie}
                accessibilityLabel="Modo oscuro"
              />
            }
          />
        </View>

        <View style={styles.seccion}>
          <Fila icono="log-out-outline" titulo="Cerrar sesión" onPress={abrirConfirmacion} peligro ultima />
        </View>
      </ScrollView>

      <HojaConfirmacion
        visible={confirmando}
        titulo="Cerrar sesión"
        mensaje="¿Seguro que quieres cerrar sesión?"
        textoConfirmar="Sí, cerrar sesión"
        cargando={saliendo}
        error={errorSalir}
        onConfirmar={cerrarSesion}
        onCancelar={() => setConfirmando(false)}
      />
    </View>
  );
}

const crearEstilos = (t) => ({
  pantalla: { flex: 1, backgroundColor: t.colors.fondo },
  contenido: { padding: t.spacing.md, paddingBottom: t.spacing.xl },
  encabezado: { flexDirection: 'row', alignItems: 'center', paddingVertical: t.spacing.md },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.acentoSuave,
  },
  avatarTexto: { ...t.typography.titulo, fontSize: 22, color: t.colors.acento },
  datos: { flex: 1, marginLeft: t.spacing.md },
  nombre: { ...t.typography.subtitulo, fontSize: 18, color: t.colors.texto },
  sinNombre: { color: t.colors.textoTenue, fontStyle: 'italic' },
  correo: { ...t.typography.cuerpo, fontSize: 14, color: t.colors.textoSecundario, marginTop: 2 },
  ayuda: { ...t.typography.pequeno, color: t.colors.textoSecundario, marginBottom: t.spacing.sm },
  errorCaja: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: t.spacing.md,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.peligroSuave,
    marginBottom: t.spacing.md,
  },
  errorSinPerfil: { flexDirection: 'column', paddingVertical: t.spacing.lg },
  errorTexto: { ...t.typography.cuerpo, fontSize: 14, color: t.colors.peligro, flexShrink: 1, marginHorizontal: t.spacing.sm, marginVertical: t.spacing.sm, textAlign: 'center' },
  seccion: {
    marginTop: t.spacing.md,
    borderRadius: t.radius.md,
    borderWidth: 1,
    borderColor: t.colors.borde,
    backgroundColor: t.colors.superficie,
    overflow: 'hidden',
  },
  fila: { flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingHorizontal: t.spacing.md },
  filaBorde: { borderBottomWidth: 1, borderBottomColor: t.colors.borde },
  presionada: { backgroundColor: t.colors.superficieAlt },
  deshabilitada: { opacity: 0.4 },
  filaIcono: { marginRight: t.spacing.md },
  filaTexto: { ...t.typography.cuerpo, flex: 1 },
});

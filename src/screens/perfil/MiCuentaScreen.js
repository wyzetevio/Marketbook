import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { usePerfil } from '../../hooks';
import { useEstilos } from '../../theme';
import { Aviso, Button, ErrorView, Header, Input, LoadingView } from '../../components';

const MAX_NOMBRE = 80;

function validarNombre(nombre) {
  const limpio = nombre.trim();
  if (limpio.length < 1) return 'Ingresa tu nombre.';
  if (limpio.length > MAX_NOMBRE) return `El nombre no puede tener más de ${MAX_NOMBRE} caracteres.`;
  return '';
}

export default function MiCuentaScreen({ navigation }) {
  const { perfil, cargando, error, actualizar, refrescar } = usePerfil();
  const styles = useEstilos(crearEstilos);
  const [nombre, setNombre] = useState('');
  const [inicializado, setInicializado] = useState(false);
  const [intentoGuardar, setIntentoGuardar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState('');
  const [exito, setExito] = useState('');
  const montado = useRef(true);

  useEffect(() => {
    montado.current = true;
    return () => { montado.current = false; };
  }, []);

  // El formulario se llena una sola vez: si el perfil se recarga, no se pisa lo que el usuario escribió.
  useEffect(() => {
    if (perfil && !inicializado) {
      setNombre(perfil.nombre ?? '');
      setInicializado(true);
    }
  }, [perfil, inicializado]);

  const errorNombre = useMemo(() => (intentoGuardar ? validarNombre(nombre) : ''), [intentoGuardar, nombre]);
  const sinCambios = nombre.trim() === (perfil?.nombre ?? '').trim();

  const cambiarNombre = (valor) => {
    setNombre(valor);
    // Al editar, los mensajes del guardado anterior dejan de aplicar.
    setErrorGuardar('');
    setExito('');
  };

  const guardar = async () => {
    setIntentoGuardar(true);
    if (validarNombre(nombre) || sinCambios || guardando) return;
    setGuardando(true);
    setErrorGuardar('');
    setExito('');
    try {
      const nuevo = await actualizar({ nombre });
      if (!montado.current) return;
      setNombre(nuevo?.nombre ?? nombre.trim());
      setIntentoGuardar(false);
      setExito('Tu nombre se actualizó correctamente.');
    } catch (e) {
      if (montado.current) setErrorGuardar(e.message);
    } finally {
      if (montado.current) setGuardando(false);
    }
  };

  const volver = () => navigation.goBack();

  if (cargando && !perfil) {
    return (
      <View style={styles.pantalla}>
        <Header titulo="Mi cuenta" onAtras={volver} />
        <LoadingView mensaje="Cargando tus datos..." />
      </View>
    );
  }

  if (!perfil) {
    return (
      <View style={styles.pantalla}>
        <Header titulo="Mi cuenta" onAtras={volver} />
        <ErrorView titulo="No se pudo cargar tu cuenta" mensaje={error} onReintentar={refrescar} />
      </View>
    );
  }

  return (
    <View style={styles.pantalla}>
      <Header titulo="Mi cuenta" onAtras={volver} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
          {/* Si falla una recarga posterior, se avisa pero se puede seguir editando */}
          {error ? <Aviso mensaje={`No se pudieron actualizar tus datos: ${error}`} /> : null}
          {errorGuardar ? <Aviso mensaje={errorGuardar} /> : <Aviso tono="exito" mensaje={exito} />}

          <Input
            label="Nombre"
            placeholder="Tu nombre"
            value={nombre}
            onChangeText={cambiarNombre}
            maxLength={MAX_NOMBRE}
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="done"
            onSubmitEditing={guardar}
            editable={!guardando}
            error={errorNombre}
            ayuda={`${nombre.trim().length}/${MAX_NOMBRE} caracteres`}
          />
          <Input
            label="Correo electrónico"
            value={perfil.correo}
            editable={false}
            ayuda="El correo no se puede cambiar."
          />

          <Button
            titulo="Guardar cambios"
            onPress={guardar}
            cargando={guardando}
            deshabilitado={sinCambios}
            estilo={styles.boton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const crearEstilos = (t) => ({
  pantalla: { flex: 1, backgroundColor: t.colors.fondo },
  flex: { flex: 1 },
  contenido: { padding: t.spacing.lg },
  boton: { marginTop: t.spacing.sm },
});

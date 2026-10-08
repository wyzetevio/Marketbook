import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks';
import { useEstilos } from '../../theme';
import { Aviso, Button, Input } from '../../components';
import { esCorreoValido } from '../../utils/validaciones';
import { mensajeErrorAuth } from '../../utils/erroresAuth';

function validar({ correo, password }) {
  const errores = {};
  if (!correo.trim()) errores.correo = 'Ingresa tu correo electrónico.';
  else if (!esCorreoValido(correo)) errores.correo = 'Ingresa un correo válido.';
  if (!password) errores.password = 'Ingresa tu contraseña.';
  return errores;
}

export default function LoginScreen({ navigation, route }) {
  const { signIn } = useAuth();
  const styles = useEstilos(crearEstilos);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const montado = useRef(true);
  const passwordRef = useRef(null);

  // Mensaje que deja Registro cuando la cuenta requiere confirmar el correo.
  const avisoRegistro = route.params?.aviso ?? '';

  // Los errores se muestran tras el primer intento y se recalculan mientras el usuario corrige.
  const errores = useMemo(
    () => (intentoEnviar ? validar({ correo, password }) : {}),
    [intentoEnviar, correo, password]
  );

  // Si Registro nos envía el correo, se precarga en el formulario.
  useEffect(() => {
    if (route.params?.correo) setCorreo(route.params.correo);
  }, [route.params?.correo]);

  // Al editar los datos, el error anterior del servidor deja de aplicar.
  useEffect(() => {
    setErrorEnvio('');
  }, [correo, password]);

  // Al iniciar sesión AppNavigator desmonta esta pantalla: no actualizamos estado después.
  useEffect(() => {
    montado.current = true;
    return () => { montado.current = false; };
  }, []);

  const iniciarSesion = async () => {
    setIntentoEnviar(true);
    if (Object.keys(validar({ correo, password })).length > 0) return;
    setEnviando(true);
    try {
      await signIn(correo, password);
      // No se navega a mano: AppNavigator detecta la sesión con useAuth() y muestra la app.
    } catch (e) {
      if (montado.current) setErrorEnvio(mensajeErrorAuth(e));
    } finally {
      if (montado.current) setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.pantalla} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>¡Bienvenido de nuevo! 👋</Text>
          <Text style={styles.subtitulo}>Inicia sesión en tu cuenta</Text>

          {errorEnvio ? <Aviso mensaje={errorEnvio} /> : <Aviso tono="info" mensaje={avisoRegistro} />}

          <Input
            label="Correo electrónico"
            placeholder="Tu correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            error={errores.correo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            editable={!enviando}
          />
          <Input
            ref={passwordRef}
            label="Contraseña"
            placeholder="Tu contraseña"
            value={password}
            onChangeText={setPassword}
            error={errores.password}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={iniciarSesion}
            editable={!enviando}
          />

          <Button titulo="Iniciar sesión" onPress={iniciarSesion} cargando={enviando} estilo={styles.boton} />
          <Button
            titulo="¿No tienes una cuenta? Regístrate"
            variante="texto"
            onPress={() => navigation.navigate('Register')}
            deshabilitado={enviando}
            estilo={styles.link}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const crearEstilos = (t) => ({
  pantalla: { flex: 1, backgroundColor: t.colors.fondo },
  flex: { flex: 1 },
  contenido: { flexGrow: 1, paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.xxl, paddingBottom: t.spacing.lg },
  titulo: { ...t.typography.titulo, color: t.colors.texto },
  subtitulo: { ...t.typography.cuerpo, fontSize: 14, color: t.colors.textoSecundario, marginTop: t.spacing.xs, marginBottom: t.spacing.xl },
  boton: { marginTop: t.spacing.md },
  link: { alignSelf: 'center', marginTop: t.spacing.md },
});

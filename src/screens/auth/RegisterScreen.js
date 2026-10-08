import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks';
import { useAppTheme, useEstilos } from '../../theme';
import { Aviso, Button, Header, Input } from '../../components';
import { esCorreoValido, requisitosPassword } from '../../utils/validaciones';
import { mensajeErrorAuth } from '../../utils/erroresAuth';

const MAX_NOMBRE = 80; // mismo límite que usuarios.nombre en la base de datos

function validar({ nombre, correo, password }) {
  const errores = {};
  if (!nombre.trim()) errores.nombre = 'Ingresa tu nombre.';
  else if (nombre.trim().length > MAX_NOMBRE) errores.nombre = `Máximo ${MAX_NOMBRE} caracteres.`;
  if (!correo.trim()) errores.correo = 'Ingresa tu correo electrónico.';
  else if (!esCorreoValido(correo)) errores.correo = 'Ingresa un correo válido.';
  if (!password) errores.password = 'Crea una contraseña.';
  else if (!requisitosPassword(password).every((r) => r.cumple)) errores.password = 'La contraseña no cumple los requisitos.';
  return errores;
}

export default function RegisterScreen({ navigation }) {
  const { signUp } = useAuth();
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const montado = useRef(true);
  const correoRef = useRef(null);
  const passwordRef = useRef(null);

  const requisitos = useMemo(() => requisitosPassword(password), [password]);
  const errores = useMemo(
    () => (intentoEnviar ? validar({ nombre, correo, password }) : {}),
    [intentoEnviar, nombre, correo, password]
  );

  // Al editar los datos, el error anterior del servidor deja de aplicar.
  useEffect(() => {
    setErrorEnvio('');
  }, [nombre, correo, password]);

  // Si el registro abre sesión, AppNavigator desmonta esta pantalla: no actualizamos estado después.
  useEffect(() => {
    montado.current = true;
    return () => { montado.current = false; };
  }, []);

  const registrar = async () => {
    setIntentoEnviar(true);
    if (Object.keys(validar({ nombre, correo, password })).length > 0) return;
    setEnviando(true);
    try {
      const data = await signUp(nombre, correo, password);
      if (!data?.session && montado.current) {
        // El proyecto de Supabase exige confirmar el correo: se vuelve al Login con un aviso.
        navigation.navigate('Login', {
          correo: correo.trim(),
          aviso: 'Te enviamos un correo de confirmación. Confírmalo y luego inicia sesión.',
        });
      }
      // Si hay sesión, AppNavigator detecta el cambio con useAuth() y muestra la app.
    } catch (e) {
      if (montado.current) setErrorEnvio(mensajeErrorAuth(e));
    } finally {
      if (montado.current) setEnviando(false);
    }
  };

  const mostrarRequisitos = password.length > 0 || intentoEnviar;

  return (
    <SafeAreaView style={styles.pantalla} edges={['bottom']}>
      <Header titulo="" onAtras={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>Registrarse</Text>
          <Text style={styles.subtitulo}>Crea una cuenta y descubre tu próxima lectura</Text>

          <Aviso mensaje={errorEnvio} />

          <Input
            label="Nombre"
            placeholder="Tu nombre"
            value={nombre}
            onChangeText={setNombre}
            error={errores.nombre}
            maxLength={MAX_NOMBRE}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            onSubmitEditing={() => correoRef.current?.focus()}
            editable={!enviando}
          />
          <Input
            ref={correoRef}
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
            error={mostrarRequisitos ? undefined : errores.password}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={registrar}
            editable={!enviando}
            estilo={mostrarRequisitos ? styles.inputConRequisitos : undefined}
          />

          {mostrarRequisitos ? (
            <View style={styles.requisitos} accessibilityLabel="Requisitos de la contraseña">
              {requisitos.map(({ texto, cumple }) => (
                <View key={texto} style={styles.requisito}>
                  <Ionicons
                    name={cumple ? 'checkmark' : 'close'}
                    size={14}
                    color={cumple ? t.colors.acento : t.colors.peligro}
                  />
                  <Text style={[styles.requisitoTexto, { color: cumple ? t.colors.textoSecundario : t.colors.peligro }]}>
                    {texto}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <Button titulo="Registrarse" onPress={registrar} cargando={enviando} estilo={styles.boton} />
          <Button
            titulo="¿Tienes una cuenta? Inicia sesión"
            variante="texto"
            onPress={() => navigation.navigate('Login')}
            deshabilitado={enviando}
            estilo={styles.link}
          />

          <Text style={styles.terminos}>
            Al hacer clic en Registrarse, aceptas nuestros Términos y nuestra Política de datos.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const crearEstilos = (t) => ({
  pantalla: { flex: 1, backgroundColor: t.colors.fondo },
  flex: { flex: 1 },
  contenido: { flexGrow: 1, paddingHorizontal: t.spacing.lg, paddingBottom: t.spacing.lg },
  titulo: { ...t.typography.titulo, color: t.colors.texto },
  subtitulo: { ...t.typography.cuerpo, fontSize: 14, color: t.colors.textoSecundario, marginTop: t.spacing.xs, marginBottom: t.spacing.xl },
  inputConRequisitos: { marginBottom: t.spacing.sm },
  requisitos: { marginBottom: t.spacing.md },
  requisito: { flexDirection: 'row', alignItems: 'center', marginBottom: t.spacing.xs },
  requisitoTexto: { ...t.typography.pequeno, marginLeft: t.spacing.xs },
  boton: { marginTop: t.spacing.md },
  link: { alignSelf: 'center', marginTop: t.spacing.md },
  // marginTop 'auto' empuja el texto legal al fondo de la pantalla, como en el diseño.
  terminos: {
    ...t.typography.pequeno,
    color: t.colors.textoSecundario,
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: t.spacing.xl,
    paddingHorizontal: t.spacing.lg,
  },
});

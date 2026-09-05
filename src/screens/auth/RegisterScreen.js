import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';

export default function RegisterScreen({ navigation }) {
  // ESTADOS
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // VALIDACIONES DE CONTRASEÑA
  const tieneMinimo8 = password.length >= 8;
  const tieneNumero = /\d/.test(password);
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneMinuscula = /[a-z]/.test(password);

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  // EVENTO PRINCIPAL
  const registrarUsuario = () => {
    if (!nombre.trim() || !correo.trim() || !password.trim()) {
      Alert.alert(
        'Campos incompletos',
        'Por favor, completa todos los campos.'
      );
      return;
    }

    if (!correoValido) {
      Alert.alert(
        'Correo inválido',
        'Ingresa un correo electrónico válido.'
      );
      return;
    }

    if (
      !tieneMinimo8 ||
      !tieneNumero ||
      !tieneMayuscula ||
      !tieneMinuscula
    ) {
      Alert.alert(
        'Contraseña inválida',
        'La contraseña no cumple todos los requisitos.'
      );
      return;
    }

    Alert.alert(
      'Registro exitoso',
      'Tu cuenta fue registrada correctamente.',
      [
        {
          text: 'Continuar',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  };

  const limpiarFormulario = () => {
    setNombre('');
    setCorreo('');
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>

          {/* Flecha superior */}
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          {/* Título */}
          <Text style={styles.titulo}>Crear cuenta</Text>

          <Text style={styles.subtitulo}>
            Crea tu cuenta y comienza a descubrir tu próxima lectura
          </Text>

          {/* NOMBRE */}
          <Text style={styles.label}>Nombre</Text>

          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            placeholderTextColor="#b5b5b5"
            value={nombre}
            onChangeText={setNombre}
          />

          {/* CORREO */}
          <Text style={styles.label}>Correo electrónico</Text>

          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#b5b5b5"
            keyboardType="email-address"
            autoCapitalize="none"
            value={correo}
            onChangeText={setCorreo}
          />

          {/* CONTRASEÑA */}
          <Text style={styles.label}>Contraseña</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Tu contraseña"
              placeholderTextColor="#b5b5b5"
              secureTextEntry={!mostrarPassword}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() => setMostrarPassword(!mostrarPassword)}
            >
              <Text style={styles.mostrar}>
                {mostrarPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* VALIDACIONES COMO EN FIGMA */}
          {password.length > 0 && (
            <View style={styles.validaciones}>

              <Text
                style={
                  tieneMinimo8
                    ? styles.validacionCorrecta
                    : styles.validacionIncorrecta
                }
              >
                {tieneMinimo8 ? '✓' : '×'} Mínimo 8 caracteres
              </Text>

              <Text
                style={
                  tieneNumero
                    ? styles.validacionCorrecta
                    : styles.validacionIncorrecta
                }
              >
                {tieneNumero ? '✓' : '×'} Al menos 1 número (0-9)
              </Text>

              <Text
                style={
                  tieneMayuscula
                    ? styles.validacionCorrecta
                    : styles.validacionIncorrecta
                }
              >
                {tieneMayuscula ? '✓' : '×'} Al menos 1 letra mayúscula
              </Text>

              <Text
                style={
                  tieneMinuscula
                    ? styles.validacionCorrecta
                    : styles.validacionIncorrecta
                }
              >
                {tieneMinuscula ? '✓' : '×'} Al menos 1 letra minúscula
              </Text>

            </View>
          )}

          {/* BOTÓN PRINCIPAL */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={registrarUsuario}
          >
            <Text style={styles.registerText}>Registrarme</Text>
          </TouchableOpacity>

          {/* INICIAR SESIÓN */}
          <View style={styles.loginRow}>
            <Text style={styles.loginNormal}>
              ¿Ya tienes una cuenta?{' '}
            </Text>

            <TouchableOpacity>
              <Text style={styles.loginBold}>
                Iniciar sesión
              </Text>
            </TouchableOpacity>
          </View>

          {/* BUTTON - PARA CUMPLIR LA ACTIVIDAD */}
          <View style={styles.buttonNative}>
            <Button
              title="Limpiar formulario"
              color="#202020"
              onPress={limpiarFormulario}
            />
          </View>

          {/* TEXTO INFERIOR */}
          <Text style={styles.terminos}>
            Al registrarte, aceptas nuestros
          </Text>

          <Text style={styles.terminosNegrita}>
            Términos y Política de privacidad.
          </Text>

          {/* IDENTIDAD DEL PROYECTO */}
          <Text style={styles.marca}>
            📚 Marketplace de Libros
          </Text>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scroll: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 28,
    paddingTop: 25,
    paddingBottom: 35,
  },

  backButton: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    marginBottom: 22,
  },

  backText: {
    fontSize: 25,
    color: '#202020',
  },

  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f1f1f',
    marginBottom: 7,
  },

  subtitulo: {
    fontSize: 13,
    color: '#a0a0a0',
    lineHeight: 19,
    marginBottom: 28,
    maxWidth: 320,
  },

  label: {
    fontSize: 13,
    color: '#202020',
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 7,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#202020',
    marginBottom: 20,
  },

  passwordContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: '#aaaaaa',
    borderRadius: 7,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: '#202020',
  },

  mostrar: {
    fontSize: 11,
    color: '#777777',
    fontWeight: '600',
  },

  validaciones: {
    marginBottom: 18,
  },

  validacionCorrecta: {
    fontSize: 11,
    color: '#6d66aa',
    marginVertical: 2,
  },

  validacionIncorrecta: {
    fontSize: 11,
    color: '#d85c5c',
    marginVertical: 2,
  },

  registerButton: {
    height: 50,
    backgroundColor: '#202020',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  registerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  loginNormal: {
    fontSize: 12,
    color: '#a0a0a0',
  },

  loginBold: {
    fontSize: 12,
    color: '#202020',
    fontWeight: '700',
  },

  buttonNative: {
    marginTop: 26,
    marginHorizontal: 20,
  },

  terminos: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#aaaaaa',
  },

  terminosNegrita: {
    textAlign: 'center',
    fontSize: 10,
    color: '#333333',
    fontWeight: '600',
    marginTop: 3,
  },

  marca: {
    textAlign: 'center',
    fontSize: 12,
    color: '#777777',
    fontWeight: '600',
    marginTop: 30,
  },
});
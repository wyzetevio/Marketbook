import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const iniciarSesion = () => {
    if (!correo.trim() || !password.trim()) {
      Alert.alert(
        'Campos incompletos',
        'Completa tu correo y contraseña.'
      );
      return;
    }

    if (!correo.includes('@')) {
      Alert.alert(
        'Correo inválido',
        'Ingresa un correo electrónico válido.'
      );
      return;
    }

    // Login simulado para el APF1
    navigation.replace('Marketplace');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido 👋</Text>

      <Text style={styles.subtitle}>
        Inicia sesión para continuar
      </Text>

      <Text style={styles.label}>Correo electrónico</Text>

      <TextInput
        style={styles.input}
        placeholder="correo@ejemplo.com"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={iniciarSesion}
      >
        <Text style={styles.buttonText}>
          Iniciar sesión
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.link}>
          ¿No tienes una cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 28,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    color: '#999999',
    marginBottom: 30,
  },

  label: {
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#202020',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  link: {
    textAlign: 'center',
    marginTop: 22,
    fontWeight: '600',
  },
});
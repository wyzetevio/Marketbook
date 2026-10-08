import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signIn } from '../../services/supabase/authService';
import { showMessage } from '../../utils/dialogs';

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async () => {
    if (!correo.trim() || !password) return showMessage('Campos incompletos', 'Completa correo y contraseña.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) return showMessage('Correo inválido', 'Ingresa un correo válido.');
    try {
      setCargando(true);
      await signIn(correo, password);
      // AppNavigator detecta la sesión real y abre Marketplace automáticamente.
    } catch (e) { showMessage('No se pudo iniciar sesión', e.message); }
    finally { setCargando(false); }
  };

  return <View style={styles.container}>
    <Text style={styles.title}>Bienvenido 👋</Text>
    <Text style={styles.subtitle}>Inicia sesión para continuar en Marketbook</Text>
    <Text style={styles.label}>Correo electrónico</Text>
    <TextInput style={styles.input} placeholder="correo@ejemplo.com" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
    <Text style={styles.label}>Contraseña</Text>
    <TextInput style={styles.input} placeholder="Tu contraseña" value={password} onChangeText={setPassword} secureTextEntry />
    <TouchableOpacity style={styles.button} disabled={cargando} onPress={iniciarSesion}>
      {cargando ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Iniciar sesión</Text>}
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={styles.link}>¿No tienes una cuenta? Regístrate</Text></TouchableOpacity>
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#fff', padding: 28 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#999', marginBottom: 30 },
  label: { fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#f7f7f7', padding: 14, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: '#202020', padding: 15, borderRadius: 25, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { textAlign: 'center', marginTop: 22, fontWeight: '600' },
});

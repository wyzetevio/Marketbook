import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signUp } from '../../services/supabase/authService';
import { showMessage } from '../../utils/dialogs';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const requisitos = [
    ['Mínimo 8 caracteres', password.length >= 8],
    ['Al menos 1 número', /\d/.test(password)],
    ['Al menos 1 mayúscula', /[A-Z]/.test(password)],
    ['Al menos 1 minúscula', /[a-z]/.test(password)],
  ];

  const registrar = async () => {
    if (!nombre.trim() || !correo.trim() || !password) return showMessage('Campos incompletos', 'Completa el formulario.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) return showMessage('Correo inválido', 'Revisa tu correo electrónico.');
    if (!requisitos.every((r) => r[1])) return showMessage('Contraseña inválida', 'Cumple todos los requisitos indicados.');
    try {
      setCargando(true);
      const data = await signUp(nombre, correo, password);
      if (!data.session) {
        showMessage('Registro solicitado', 'Si tu proyecto requiere confirmar correo, verifica tu bandeja y luego inicia sesión.', () => navigation.navigate('Login'));
      } else {
        showMessage('Registro correcto', 'La sesión se ha iniciado en Supabase.');
      }
    } catch (e) { showMessage('No se pudo registrar', e.message); }
    finally { setCargando(false); }
  };

  return <ScrollView style={styles.safeArea} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Text style={styles.backText}>←</Text></TouchableOpacity>
    <Text style={styles.titulo}>Crear cuenta</Text>
    <Text style={styles.subtitulo}>Crea tu cuenta y comienza a descubrir tu próxima lectura</Text>
    <Text style={styles.label}>Nombre</Text>
    <TextInput style={styles.input} placeholder="Tu nombre" value={nombre} onChangeText={setNombre} />
    <Text style={styles.label}>Correo electrónico</Text>
    <TextInput style={styles.input} placeholder="ejemplo@correo.com" keyboardType="email-address" autoCapitalize="none" value={correo} onChangeText={setCorreo} />
    <Text style={styles.label}>Contraseña</Text>
    <View style={styles.passwordRow}>
      <TextInput style={styles.passwordInput} placeholder="Tu contraseña" secureTextEntry={!mostrar} value={password} onChangeText={setPassword} />
      <TouchableOpacity onPress={() => setMostrar(v => !v)}><Text style={styles.toggle}>{mostrar ? 'Ocultar' : 'Mostrar'}</Text></TouchableOpacity>
    </View>
    {password.length > 0 && requisitos.map(([label, valid]) => <Text key={label} style={{ color: valid ? '#187b55' : '#c34c4c', marginBottom: 3, fontSize: 12 }}>
      {valid ? '✓' : '×'} {label}
    </Text>)}
    <TouchableOpacity style={styles.button} disabled={cargando} onPress={registrar}>
      {cargando ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Registrarme</Text>}
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.link}>¿Ya tienes una cuenta? Iniciar sesión</Text></TouchableOpacity>
    <Text style={styles.footer}>📚 Marketplace de Libros</Text>
  </ScrollView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 25, paddingBottom: 35 },
  backButton: { width: 35, height: 35, justifyContent: 'center', marginBottom: 22 },
  backText: { fontSize: 25 },
  titulo: { fontSize: 26, fontWeight: '700', marginBottom: 7 },
  subtitulo: { fontSize: 13, color: '#999', lineHeight: 19, marginBottom: 28 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: { height: 50, backgroundColor: '#f8f8f8', borderRadius: 7, paddingHorizontal: 15, marginBottom: 20 },
  passwordRow: { height: 50, borderWidth: 1, borderColor: '#aaa', borderRadius: 7, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  passwordInput: { flex: 1 },
  toggle: { fontSize: 11, color: '#777', fontWeight: '600' },
  button: { height: 50, backgroundColor: '#202020', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 18 },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { textAlign: 'center', marginTop: 22, fontWeight: '600' },
  footer: { textAlign: 'center', marginTop: 30, color: '#777', fontSize: 12 },
});

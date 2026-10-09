import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { publicacionesService } from '../../services/publicacionesService';
import { supabase } from '../../services/supabase/client';
import { showMessage } from '../../utils/dialogs';

const ESTADOS = ['Nuevo', 'Como nuevo', 'Bueno', 'Regular'];

export default function CreatePublicationScreen({ navigation, route }) {
  const original = route.params?.libro;
  const editando = Boolean(original);
  const [titulo, setTitulo] = useState(original?.titulo || '');
  const [autor, setAutor] = useState(original?.autor || '');
  const [categoria, setCategoria] = useState(original?.categoria || '');
  const [isbn, setIsbn] = useState(original?.isbn || '');
  const [precio, setPrecio] = useState(original ? String(original.precio) : '');
  const [estado, setEstado] = useState(original?.estado_libro || 'Bueno');
  const [descripcion, setDescripcion] = useState(original?.descripcion || '');
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    const valor = Number(precio.replace(',', '.'));
    if (!titulo.trim() || !autor.trim() || !Number.isFinite(valor) || valor <= 0) {
      return showMessage('Verifica los datos', 'Título, autor y precio mayor que cero son obligatorios.');
    }
    try {
      setGuardando(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw new Error('Debes iniciar sesión.');
      const payload = {
        titulo: titulo.trim(), autor: autor.trim(), categoria: categoria.trim() || null,
        isbn: isbn.trim() || null, precio: valor, estado_libro: estado, descripcion: descripcion.trim(),
      };
      if (editando) {
        if (original.vendedor_id !== user.id) throw new Error('Esta publicación no es tuya.');
        await publicacionesService.actualizar(original.id, payload, user.id);
      } else {
        await publicacionesService.crear(payload, user.id);
      }
      showMessage(editando ? 'Publicación actualizada' : 'Publicación creada', editando ? 'PATCH completado en la API REST.' : 'POST completado en la API REST.', () => navigation.goBack());
    } catch (e) { showMessage('No se pudo guardar', e.message); }
    finally { setGuardando(false); }
  };

  return <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>{editando ? 'Editar publicación' : 'Vender libro'}</Text>
    <Text style={styles.subtitle}>{editando ? 'Modifica tu publicación con PATCH' : 'Registra tu ejemplar en Marketbook con POST'}</Text>
    <TextInput style={styles.input} placeholder="Título *" value={titulo} onChangeText={setTitulo} maxLength={120} />
    <TextInput style={styles.input} placeholder="Autor *" value={autor} onChangeText={setAutor} maxLength={100} />
    <TextInput style={styles.input} placeholder="Categoría" value={categoria} onChangeText={setCategoria} maxLength={80} />
    <TextInput style={styles.input} placeholder="ISBN (opcional)" value={isbn} onChangeText={setIsbn} maxLength={20} />
    <TextInput style={styles.input} placeholder="Precio S/ *" value={precio} onChangeText={setPrecio} keyboardType="decimal-pad" />
    <Text style={styles.label}>Estado del ejemplar</Text>
    <View style={styles.chips}>{ESTADOS.map(value => <TouchableOpacity key={value} onPress={() => setEstado(value)} style={[styles.chip, estado === value && styles.chipActive]}><Text style={[styles.chipText, estado === value && styles.chipTextActive]}>{value}</Text></TouchableOpacity>)}</View>
    <TextInput style={[styles.input, styles.description]} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} multiline maxLength={1000} />
    <TouchableOpacity style={[styles.button, guardando && { opacity: 0.6 }]} disabled={guardando} onPress={guardar}>{guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{editando ? 'Guardar cambios (PATCH)' : 'Publicar libro (POST)'}</Text>}</TouchableOpacity>
    <Text style={styles.note}>Fotografías propias: integración con Supabase Storage prevista para la siguiente etapa.</Text>
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }, content: { padding: 25, paddingBottom: 38 },
  title: { fontSize: 25, fontWeight: '700', marginTop: 18 }, subtitle: { color: '#777', marginBottom: 22, marginTop: 5 },
  input: { backgroundColor: '#f7f7f7', borderRadius: 9, padding: 14, marginBottom: 14, color: '#222' },
  description: { minHeight: 110, textAlignVertical: 'top' }, label: { fontWeight: '700', marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 }, chip: { borderWidth: 1, borderColor: '#bbb', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 8 },
  chipActive: { backgroundColor: '#202020', borderColor: '#202020' }, chipText: { color: '#444', fontSize: 12 }, chipTextActive: { color: '#fff' },
  button: { backgroundColor: '#202020', padding: 15, borderRadius: 24, alignItems: 'center', marginTop: 7 }, buttonText: { color: '#fff', fontWeight: '700' },
  note: { color: '#888', fontSize: 11, marginTop: 18 },
});

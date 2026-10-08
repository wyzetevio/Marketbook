import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { publicacionesService } from '../../services/publicacionesService';
import { supabase } from '../../services/supabase/client';
import { confirmAction, showMessage } from '../../utils/dialogs';

export default function PublicationDetailScreen({ navigation, route }) {
  const id = route.params.publicacionId;
  const [libro, setLibro] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(useCallback(() => {
    let active = true;
    setCargando(true);
    Promise.all([publicacionesService.obtener(id), supabase.auth.getUser()])
      .then(([book, auth]) => {
        if (!active) return;
        if (auth.error || !auth.data.user) throw new Error('Debes iniciar sesión.');
        setLibro(book); setUserId(auth.data.user.id); setError('');
      })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setCargando(false); });
    return () => { active = false; };
  }, [id]));

  const esPropia = !!libro && !!userId && libro.vendedor_id === userId;

  const eliminar = () => confirmAction('Eliminar publicación', `¿Eliminar definitivamente "${libro.titulo}"?`, async () => {
    try {
      setGuardando(true);
      await publicacionesService.eliminar(id, userId);
      showMessage('Publicación eliminada', 'DELETE completado en la API REST.', () => navigation.goBack());
    } catch (e) { showMessage('No se pudo eliminar', e.message); }
    finally { setGuardando(false); }
  });

  const retirar = () => confirmAction('Retirar publicación', 'Dejará de aparecer en Explorar, pero seguirá en Mis publicaciones.', async () => {
    try {
      setGuardando(true);
      await publicacionesService.actualizar(id, { estado_publicacion: 'retirada' }, userId);
      showMessage('Retirada', 'Estado actualizado mediante PATCH.', () => navigation.goBack());
    } catch (e) { showMessage('No se pudo retirar', e.message); }
    finally { setGuardando(false); }
  });

  if (cargando) return <View style={styles.center}><ActivityIndicator/><Text>Consultando publicación (GET)...</Text></View>;
  if (error || !libro) return <View style={styles.center}><Text style={styles.error}>{error || 'Publicación no encontrada.'}</Text><TouchableOpacity onPress={() => navigation.goBack()}><Text>Volver</Text></TouchableOpacity></View>;

  return <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
    <Text style={styles.title}>{libro.titulo}</Text>
    <Text style={styles.author}>{libro.autor}</Text>
    <Text style={styles.label}>Categoría</Text><Text>{libro.categoria || 'Sin especificar'}</Text>
    <Text style={styles.label}>Estado del libro</Text><Text>{libro.estado_libro}</Text>
    <Text style={styles.label}>Precio</Text><Text style={styles.price}>S/ {Number(libro.precio).toFixed(2)}</Text>
    <Text style={styles.label}>Descripción</Text><Text style={styles.description}>{libro.descripcion || 'Sin descripción.'}</Text>
    <Text style={styles.label}>Estado de publicación</Text><Text>{libro.estado_publicacion}</Text>
    <Text style={styles.endpoint}>Datos leídos mediante GET /rest/v1/publicaciones</Text>
    {esPropia ? <>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreatePublication', { libro })}><Text style={styles.buttonText}>Editar publicación (PATCH)</Text></TouchableOpacity>
      {libro.estado_publicacion === 'activa' && <TouchableOpacity disabled={guardando} style={[styles.button, styles.secondary]} onPress={retirar}><Text style={styles.buttonText}>Retirar publicación (PATCH)</Text></TouchableOpacity>}
      <TouchableOpacity disabled={guardando} style={[styles.button, styles.danger]} onPress={eliminar}><Text style={styles.buttonText}>{guardando ? 'Procesando...' : 'Eliminar publicación (DELETE)'}</Text></TouchableOpacity>
    </> : <Text style={styles.notice}>Solo el vendedor puede modificar o eliminar esta publicación.</Text>}
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 28 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
  title: { fontSize: 25, fontWeight: '700', marginTop: 25 }, author: { color: '#777', marginBottom: 20, marginTop: 4 },
  label: { fontWeight: '700', marginTop: 16, marginBottom: 4 }, price: { fontSize: 24, fontWeight: '700', color: '#187b55' },
  description: { color: '#555', lineHeight: 22 }, endpoint: { color: '#777', fontSize: 11, marginTop: 16 },
  button: { backgroundColor: '#202020', padding: 15, borderRadius: 24, alignItems: 'center', marginTop: 16 },
  secondary: { backgroundColor: '#8a630a' }, danger: { backgroundColor: '#bb3333' }, buttonText: { color: '#fff', fontWeight: '700' },
  notice: { color: '#777', marginTop: 18 }, error: { color: '#b22222', textAlign: 'center' },
});

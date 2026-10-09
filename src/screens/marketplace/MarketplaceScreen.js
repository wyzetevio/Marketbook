import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { publicacionesService } from '../../services/publicacionesService';
import { signOut } from '../../services/supabase/authService';
import { supabase } from '../../services/supabase/client';
import { showMessage } from '../../utils/dialogs';

export default function MarketplaceScreen({ navigation }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [modo, setModo] = useState('activas');
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  const cargar = useCallback(async (refresh = false) => {
    if (refresh) setActualizando(true); else setCargando(true);
    setError('');
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('No se encontró la sesión. Inicia sesión otra vez.');
      setUserId(user.id);
      const libros = modo === 'mias'
        ? await publicacionesService.listarMias(user.id)
        : await publicacionesService.listarActivas();
      setPublicaciones(libros);
    } catch (e) { setError(e.message); }
    finally { setCargando(false); setActualizando(false); }
  }, [modo]);

  useFocusEffect(useCallback(() => {
    let active = true;
    // La carga se cancela lógicamente al desmontar mediante el próximo render;
    // se consulta de nuevo al volver desde crear/editar/eliminar.
    if (active) cargar();
    return () => { active = false; };
  }, [cargar]));

  const salir = async () => {
    try { await signOut(); }
    catch (e) { showMessage('No se pudo cerrar sesión', e.message); }
  };

  return <View style={styles.container}>
    <View style={styles.head}>
      <View style={{ flex: 1 }}><Text style={styles.title}>Marketbook 📚</Text><Text style={styles.subtitle}>Compra y vende libros físicos</Text></View>
      <TouchableOpacity onPress={salir}><Text style={styles.logout}>Salir</Text></TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.sellButton} onPress={() => navigation.navigate('CreatePublication')}>
      <Text style={styles.sellText}>+ Publicar un libro</Text>
    </TouchableOpacity>
    <View style={styles.tabs}>
      <TouchableOpacity onPress={() => setModo('activas')} style={[styles.tab, modo === 'activas' && styles.tabActive]}><Text style={modo === 'activas' ? styles.tabActiveText : styles.tabText}>Explorar</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => setModo('mias')} style={[styles.tab, modo === 'mias' && styles.tabActive]}><Text style={modo === 'mias' ? styles.tabActiveText : styles.tabText}>Mis publicaciones</Text></TouchableOpacity>
    </View>
    {cargando ? <View style={styles.center}><ActivityIndicator/><Text>Consultando API REST (GET)...</Text></View> : error ? <View style={styles.center}><Text style={styles.error}>{error}</Text><TouchableOpacity style={styles.retry} onPress={() => cargar()}><Text style={styles.retryText}>Reintentar</Text></TouchableOpacity></View> : <FlatList
      data={publicaciones}
      keyExtractor={item => String(item.id)}
      refreshControl={<RefreshControl refreshing={actualizando} onRefresh={() => cargar(true)} />}
      ListHeaderComponent={<Text style={styles.sectionTitle}>{modo === 'mias' ? 'Mis libros' : 'Libros disponibles'} ({publicaciones.length}) · GET</Text>}
      ListEmptyComponent={<Text style={styles.empty}>Todavía no hay publicaciones en esta sección.</Text>}
      renderItem={({ item }) => <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PublicationDetail', { publicacionId: item.id, userId })}>
        <Text style={styles.bookTitle}>{item.titulo}</Text>
        <Text style={styles.meta}>{item.autor} · {item.estado_libro}</Text>
        <Text style={styles.price}>S/ {Number(item.precio).toFixed(2)}</Text>
        {modo === 'mias' && <Text style={styles.status}>{item.estado_publicacion}</Text>}
        <Text style={styles.hint}>Ver detalle →</Text>
      </TouchableOpacity>}
    />}
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 22, paddingTop: 16 },
  head: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 25, fontWeight: '700' }, subtitle: { color: '#777', marginTop: 5, marginBottom: 18 },
  logout: { fontSize: 13, fontWeight: '700', color: '#943737', padding: 7 },
  sellButton: { backgroundColor: '#202020', padding: 15, borderRadius: 25, alignItems: 'center', marginBottom: 17 },
  sellText: { color: '#fff', fontWeight: '700' },
  tabs: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  tab: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 18, backgroundColor: '#f3f3f3' },
  tabActive: { backgroundColor: '#202020' }, tabActiveText: { color: '#fff', fontWeight: '700' }, tabText: { color: '#444' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#555', marginBottom: 12 },
  card: { borderWidth: 1, borderColor: '#e9e9e9', borderRadius: 13, padding: 16, marginBottom: 12 },
  bookTitle: { fontWeight: '700', fontSize: 17 }, meta: { color: '#707070', marginTop: 6 },
  price: { fontWeight: '700', fontSize: 17, marginTop: 8, color: '#187b55' },
  hint: { color: '#777', marginTop: 10, fontSize: 12 }, status: { color: '#8a630a', marginTop: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
  error: { color: '#b22222', textAlign: 'center' }, retry: { backgroundColor: '#202020', padding: 12, borderRadius: 12 }, retryText: { color: '#fff' },
  empty: { color: '#777' },
});

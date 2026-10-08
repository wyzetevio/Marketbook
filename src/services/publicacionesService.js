import { supabase, supabaseKey, supabaseUrl } from './supabase/client';

// El cliente consume directamente la Data REST API (PostgREST) de Supabase.
const RESOURCE = `${supabaseUrl}/rest/v1/publicaciones`;
const FIELDS = 'id,vendedor_id,titulo,autor,categoria,isbn,estado_libro,precio,descripcion,estado_publicacion,fecha_publicacion';

async function request(method, query = '', body) {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error(sessionError.message);
  if (!session?.access_token) throw new Error('Tu sesión terminó. Vuelve a iniciar sesión.');

  const response = await fetch(`${RESOURCE}${query}`, {
    method,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(method !== 'GET' ? { Prefer: 'return=representation' } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const raw = await response.text();
  let data = null;
  if (raw) {
    try { data = JSON.parse(raw); } catch { throw new Error('La API devolvió una respuesta no válida.'); }
  }
  if (!response.ok) {
    throw new Error(data?.message || data?.hint || `Error HTTP ${response.status}`);
  }
  return data;
}

const select = `select=${encodeURIComponent(FIELDS)}`;

export const publicacionesService = {
  async listarActivas() {
    return await request('GET', `?${select}&estado_publicacion=eq.activa&order=fecha_publicacion.desc`);
  },
  async listarMias(vendedorId) {
    return await request('GET', `?${select}&vendedor_id=eq.${encodeURIComponent(vendedorId)}&order=fecha_publicacion.desc`);
  },
  async obtener(id) {
    const rows = await request('GET', `?${select}&id=eq.${encodeURIComponent(id)}&limit=1`);
    if (!rows?.length) throw new Error('Publicación no encontrada o sin acceso.');
    return rows[0];
  },
  async crear(payload, vendedorId) {
    const rows = await request('POST', `?${select}`, {
      ...payload, vendedor_id: vendedorId, estado_publicacion: 'activa',
    });
    if (!rows?.length) throw new Error('La API no devolvió la publicación creada.');
    return rows[0];
  },
  async actualizar(id, payload, vendedorId) {
    const rows = await request('PATCH', `?${select}&id=eq.${encodeURIComponent(id)}&vendedor_id=eq.${encodeURIComponent(vendedorId)}`, payload);
    if (!rows?.length) throw new Error('No se actualizó la publicación. Verifica que seas su propietario.');
    return rows[0];
  },
  async eliminar(id, vendedorId) {
    const rows = await request('DELETE', `?${select}&id=eq.${encodeURIComponent(id)}&vendedor_id=eq.${encodeURIComponent(vendedorId)}`);
    if (!rows?.length) throw new Error('No se eliminó la publicación. Verifica que seas su propietario.');
    return rows[0];
  },
};

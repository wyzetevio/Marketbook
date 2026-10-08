import { apiRequest } from './apiClient';

// CRUD de publicaciones sobre la Data REST API de Supabase.
const RECURSO = '/publicaciones';
const CAMPOS = 'id,vendedor_id,titulo,autor,categoria,isbn,estado_libro,precio,descripcion,estado_publicacion,fecha_publicacion';
const SELECT_ESCRITURA = `select=${encodeURIComponent(CAMPOS)}`;
// En lecturas se trae también el nombre del vendedor (relación publicaciones -> usuarios).
const SELECT_LECTURA = `select=${encodeURIComponent(`${CAMPOS},vendedor:usuarios(nombre)`)}`;
const LIMITE = 200;

function normalizar(fila) {
  const { vendedor, ...resto } = fila;
  return { ...resto, precio: Number(resto.precio), vendedor_nombre: vendedor?.nombre ?? null };
}
const id_ = (v) => encodeURIComponent(v);

export const publicacionesService = {
  // GET: libros disponibles para todos
  async listarActivas() {
    const filas = await apiRequest(RECURSO, {
      query: `?${SELECT_LECTURA}&estado_publicacion=eq.activa&order=fecha_publicacion.desc&limit=${LIMITE}`,
    });
    return filas.map(normalizar);
  },

  // GET: todos los libros del vendedor (activos, vendidos y retirados)
  async listarMias(vendedorId) {
    const filas = await apiRequest(RECURSO, {
      query: `?${SELECT_LECTURA}&vendedor_id=eq.${id_(vendedorId)}&order=fecha_publicacion.desc&limit=${LIMITE}`,
    });
    return filas.map(normalizar);
  },

  // GET: un libro
  async obtener(id) {
    const filas = await apiRequest(RECURSO, { query: `?${SELECT_LECTURA}&id=eq.${id_(id)}&limit=1` });
    if (!filas?.length) throw new Error('Publicación no encontrada o ya no está disponible.');
    return normalizar(filas[0]);
  },

  // POST: publicar un libro
  async crear(payload, vendedorId) {
    const filas = await apiRequest(RECURSO, {
      method: 'POST',
      query: `?${SELECT_ESCRITURA}`,
      body: { ...payload, vendedor_id: vendedorId, estado_publicacion: 'activa' },
    });
    if (!filas?.length) throw new Error('La API no devolvió la publicación creada.');
    return normalizar(filas[0]);
  },

  // PATCH: editar o retirar (solo el dueño y solo si no está vendida)
  async actualizar(id, payload, vendedorId) {
    const filas = await apiRequest(RECURSO, {
      method: 'PATCH',
      query: `?${SELECT_ESCRITURA}&id=eq.${id_(id)}&vendedor_id=eq.${id_(vendedorId)}`,
      body: payload,
    });
    if (!filas?.length) {
      throw new Error('No se pudo actualizar. Solo el dueño puede editar y un libro vendido ya no se modifica.');
    }
    return normalizar(filas[0]);
  },

  // DELETE: eliminar (solo el dueño y solo si no está vendida)
  async eliminar(id, vendedorId) {
    const filas = await apiRequest(RECURSO, {
      method: 'DELETE',
      query: `?${SELECT_ESCRITURA}&id=eq.${id_(id)}&vendedor_id=eq.${id_(vendedorId)}`,
    });
    if (!filas?.length) {
      throw new Error('No se pudo eliminar. Solo el dueño puede borrar y un libro vendido se conserva en el historial.');
    }
    return normalizar(filas[0]);
  },
};

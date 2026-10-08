import { supabase, supabaseKey, supabaseUrl } from './supabase/client';

// Cliente único para la Data REST API de Supabase (PostgREST).
// Centraliza: token de la sesión, tiempo máximo de espera, errores de red,
// sesión vencida (401) y mensajes de error en español.

const BASE = `${supabaseUrl}/rest/v1`;
const TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(message, { status = 0, code = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const POR_CODIGO = {
  '23514': 'Algún dato no cumple las reglas permitidas. Revisa los campos e inténtalo otra vez.',
  '23505': 'Ese registro ya existe.',
  '23503': 'La operación hace referencia a un dato que no existe.',
  '42501': 'No tienes permiso para realizar esta acción.',
  '42883': 'Falta crear una función en Supabase. Ejecuta la migración SQL.',
  PGRST202: 'Falta crear una función en Supabase. Ejecuta la migración SQL.',
  PGRST205: 'Falta crear una tabla en Supabase. Ejecuta la migración SQL.',
  '42P01': 'Falta crear una tabla en Supabase. Ejecuta la migración SQL.',
};

function mensajeDe(data, status) {
  // Los errores lanzados por las funciones SQL (raise exception) ya vienen en español.
  if (data?.code === 'P0001' && data?.message) return data.message;
  if (data?.code && POR_CODIGO[data.code]) return POR_CODIGO[data.code];
  if (status === 403) return 'No tienes permiso para realizar esta acción.';
  if (status >= 500) return 'El servidor tuvo un problema. Inténtalo de nuevo en unos minutos.';
  return data?.message || data?.hint || `Error HTTP ${status}`;
}

/**
 * apiRequest('/publicaciones', { method, query, body })
 *  path:  ruta bajo /rest/v1 (ej. '/publicaciones' o '/rpc/crear_pedido')
 *  query: texto que empieza con '?' (filtros PostgREST)
 *  body:  objeto JS (se envía como JSON)
 * Devuelve el JSON de la respuesta. Lanza ApiError con mensaje legible.
 */
export async function apiRequest(path, { method = 'GET', query = '', body } = {}) {
  const { data: { session } = {}, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.access_token) {
    throw new ApiError('Tu sesión terminó. Vuelve a iniciar sesión.', { status: 401 });
  }

  const esEscrituraDeTabla = method !== 'GET' && !path.startsWith('/rpc/');
  const controller = new AbortController();
  const temporizador = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${BASE}${path}${query}`, {
      method,
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(esEscrituraDeTabla ? { Prefer: 'return=representation' } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: controller.signal,
    });
  } catch (e) {
    if (e?.name === 'AbortError') {
      throw new ApiError('El servidor tardó demasiado en responder. Inténtalo de nuevo.');
    }
    throw new ApiError('No hay conexión con el servidor. Revisa tu internet.');
  } finally {
    clearTimeout(temporizador);
  }

  const raw = await response.text();
  let data = null;
  if (raw) {
    try { data = JSON.parse(raw); }
    catch { throw new ApiError('La API devolvió una respuesta no válida.', { status: response.status }); }
  }

  if (response.status === 401) {
    // Sesión vencida o token inválido: se cierra y la app vuelve al Login sola.
    try { await supabase.auth.signOut(); } catch { /* nada que hacer */ }
    throw new ApiError('Tu sesión venció. Inicia sesión otra vez.', { status: 401, code: data?.code });
  }
  if (!response.ok) {
    throw new ApiError(mensajeDe(data, response.status), { status: response.status, code: data?.code });
  }
  return data;
}

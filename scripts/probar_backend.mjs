// ============================================================================
// Marketbook - Prueba automática del BACKEND (Supabase REST + RLS + crear_pedido)
//
// Qué hace: entra con 2 cuentas reales (A = vendedor, B = comprador) y ejecuta
// ~25 comprobaciones contra TU proyecto de Supabase. Al final imprime una
// tabla OK / FALLÓ que sirve como evidencia para la profesora.
//
// Requisitos: Node 18 o superior (usa fetch nativo). No instala nada.
//
// Uso (PowerShell, desde la carpeta del proyecto):
//   $env:EMAIL_A="vendedor@correo.com";  $env:PASS_A="Clave1234"
//   $env:EMAIL_B="comprador@correo.com"; $env:PASS_B="Clave1234"
//   node scripts/probar_backend.mjs
//
// La URL y la publishable key se leen del .env (cualquier variable que
// contenga SUPABASE_URL y SUPABASE_..._KEY), o de las variables de entorno
// SUPABASE_URL y SUPABASE_KEY. NUNCA uses la service_role key.
//
// Las dos cuentas deben existir ya (regístralas desde la app). Cada ejecución
// deja 1 libro "[PRUEBA]" vendido (un libro vendido no se puede borrar, por diseño).
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

// ---------- configuración ----------
function leerEnvArchivo() {
  const salida = {};
  if (!existsSync('.env')) return salida;
  for (const linea of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) salida[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return salida;
}
const envArchivo = leerEnvArchivo();
function buscar(patron, ...directas) {
  for (const k of directas) if (process.env[k]) return process.env[k];
  const clave = Object.keys(envArchivo).find((k) => patron.test(k));
  return clave ? envArchivo[clave] : '';
}
const URL_BASE = (process.env.SUPABASE_URL || buscar(/SUPABASE_URL$/i)).replace(/\/+$/, '');
const KEY = process.env.SUPABASE_KEY || buscar(/(PUBLISHABLE|ANON).*KEY$|SUPABASE_KEY$/i);
const CUENTA_A = { email: process.env.EMAIL_A, pass: process.env.PASS_A };
const CUENTA_B = { email: process.env.EMAIL_B, pass: process.env.PASS_B };

function salirConError(texto) {
  console.error(`\n✗ ${texto}\n`);
  process.exit(2);
}
if (!URL_BASE || !KEY) salirConError('No encontré la URL o la publishable key de Supabase (revisa tu .env).');
if (KEY.includes('service_role')) salirConError('Esa clave parece ser service_role. Usa SOLO la publishable/anon key.');
if (!CUENTA_A.email || !CUENTA_A.pass || !CUENTA_B.email || !CUENTA_B.pass) {
  salirConError('Faltan EMAIL_A, PASS_A, EMAIL_B o PASS_B (ver instrucciones al inicio del archivo).');
}
if (CUENTA_A.email.toLowerCase() === CUENTA_B.email.toLowerCase()) salirConError('Las cuentas A y B deben ser distintas.');

// ---------- utilidades HTTP ----------
async function http(metodo, ruta, { token, body, headers = {} } = {}) {
  const cabeceras = { apikey: KEY, 'Content-Type': 'application/json', Accept: 'application/json', ...headers };
  if (token) cabeceras.Authorization = `Bearer ${token}`;
  let respuesta;
  try {
    respuesta = await fetch(`${URL_BASE}${ruta}`, {
      method: metodo, headers: cabeceras, body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (e) {
    salirConError(`No se pudo conectar con ${URL_BASE}. ¿Hay internet? ¿El proyecto de Supabase está pausado? (${e.message})`);
  }
  const texto = await respuesta.text();
  let data = null;
  try { data = texto ? JSON.parse(texto) : null; } catch { data = { message: texto }; }
  return { status: respuesta.status, data };
}
const rest = (metodo, ruta, token, body) =>
  http(metodo, `/rest/v1${ruta}`, { token, body, headers: metodo === 'GET' || ruta.startsWith('/rpc/') ? {} : { Prefer: 'return=representation' } });

async function iniciarSesion({ email, pass }) {
  const r = await http('POST', '/auth/v1/token?grant_type=password', { body: { email, password: pass } });
  if (r.status !== 200 || !r.data?.access_token) {
    const motivo = r.data?.msg || r.data?.error_description || r.data?.message || `HTTP ${r.status}`;
    salirConError(`No pude iniciar sesión con ${email}: ${motivo}\n  (¿La cuenta existe? ¿"Confirm email" está desactivado? ¿La clave es correcta?)`);
  }
  return { token: r.data.access_token, id: r.data.user.id };
}

const mensaje = (r) => (r.data && (r.data.message || r.data.msg)) || '';
const filas = (r) => (Array.isArray(r.data) ? r.data : []);
const rechazada = (r) => r.status >= 400 || (Array.isArray(r.data) && r.data.length === 0);
const unico = Date.now().toString(36);

// ---------- motor de pruebas ----------
const resultados = [];
async function prueba(grupo, nombre, fn, { aviso = false } = {}) {
  let ok = false;
  let detalle = '';
  try {
    const r = await fn();
    ok = r === true || (r && r.ok === true);
    detalle = (r && r.detalle) || '';
  } catch (e) {
    detalle = `Error inesperado: ${e.message}`;
  }
  resultados.push({ grupo, nombre, ok, detalle, aviso });
  const marca = ok ? '✓ OK    ' : aviso ? '⚠ AVISO ' : '✗ FALLÓ ';
  console.log(`${marca} ${nombre}${ok || !detalle ? '' : `\n          → ${detalle}`}`);
}

async function main() {
  console.log(`\nMarketbook · prueba del backend · ${new Date().toLocaleString()}`);
  console.log(`Proyecto: ${URL_BASE}\n`);

  // --- sesión ---
  const A = await iniciarSesion(CUENTA_A);
  const B = await iniciarSesion(CUENTA_B);
  if (A.id === B.id) salirConError('A y B resultaron ser el mismo usuario.');
  console.log('— 1. Cuentas —');
  await prueba('Cuentas', 'Las dos cuentas inician sesión (Supabase Auth)', async () => true);

  const perfiles = await rest('GET', `/usuarios?select=id,nombre&id=in.(${A.id},${B.id})`, A.token);
  await prueba('Cuentas', 'Ambas cuentas tienen su fila en "usuarios" (trigger de perfil)', async () => ({
    ok: filas(perfiles).length === 2,
    detalle: `Se encontraron ${filas(perfiles).length} de 2 filas. Si falta alguna, registra la cuenta otra vez o crea la fila a mano (ver docs/BACKEND.md §8). ${mensaje(perfiles)}`,
  }));

  // --- CRUD de la venta (publicaciones) ---
  console.log('\n— 2. Venta: CRUD de publicaciones —');
  const datosLibro = (n, precio, isbn) => ({
    titulo: `[PRUEBA ${unico}] Libro ${n}`, autor: 'Autor de Prueba', categoria: 'Pruebas', isbn,
    precio, estado_libro: 'Bueno', descripcion: 'Libro creado por scripts/probar_backend.mjs',
  });
  let L1; let L2;

  await prueba('Venta', 'POST: A publica el libro 1', async () => {
    const r = await rest('POST', '/publicaciones', A.token, { ...datosLibro(1, 10.5, '9780306406157'), vendedor_id: A.id, estado_publicacion: 'activa' });
    L1 = filas(r)[0];
    return { ok: r.status === 201 && !!L1?.id, detalle: `HTTP ${r.status} ${mensaje(r)}` };
  });
  await prueba('Venta', 'POST: A publica el libro 2', async () => {
    const r = await rest('POST', '/publicaciones', A.token, { ...datosLibro(2, 20, '9780140449136'), vendedor_id: A.id, estado_publicacion: 'activa' });
    L2 = filas(r)[0];
    return { ok: r.status === 201 && !!L2?.id, detalle: `HTTP ${r.status} ${mensaje(r)}` };
  });
  if (!L1?.id || !L2?.id) {
    console.log('\nNo se pudieron crear los libros de prueba: se detienen las pruebas que dependen de ellos.');
    return terminar();
  }

  await prueba('Venta', 'GET: A ve sus libros (publicaciones?vendedor_id=eq.A)', async () => {
    const r = await rest('GET', `/publicaciones?select=id,estado_publicacion&vendedor_id=eq.${A.id}&id=in.(${L1.id},${L2.id})`, A.token);
    return { ok: filas(r).length === 2, detalle: `Vio ${filas(r).length} de 2. ${mensaje(r)}` };
  });
  await prueba('Venta', 'PATCH: A edita el precio de su libro 1', async () => {
    const r = await rest('PATCH', `/publicaciones?id=eq.${L1.id}&vendedor_id=eq.${A.id}`, A.token, { precio: 12 });
    return { ok: r.status === 200 && Number(filas(r)[0]?.precio) === 12, detalle: `HTTP ${r.status} ${mensaje(r)}` };
  });
  await prueba('Venta', 'PATCH: A retira y vuelve a activar su libro 2', async () => {
    const r1 = await rest('PATCH', `/publicaciones?id=eq.${L2.id}`, A.token, { estado_publicacion: 'retirada' });
    const r2 = await rest('PATCH', `/publicaciones?id=eq.${L2.id}`, A.token, { estado_publicacion: 'activa' });
    return {
      ok: filas(r1)[0]?.estado_publicacion === 'retirada' && filas(r2)[0]?.estado_publicacion === 'activa',
      detalle: `retirar: ${r1.status} ${mensaje(r1)} | activar: ${r2.status} ${mensaje(r2)}`,
    };
  });

  // --- lectura por comprador ---
  console.log('\n— 3. Explorar (lectura por otro usuario) —');
  await prueba('Explorar', 'GET: B ve los libros activos de A, con el nombre del vendedor', async () => {
    const r = await rest('GET', `/publicaciones?select=id,titulo,estado_publicacion,vendedor:usuarios(nombre)&estado_publicacion=eq.activa&id=in.(${L1.id},${L2.id})`, B.token);
    const nombres = filas(r).map((f) => f.vendedor?.nombre).filter(Boolean);
    return {
      ok: filas(r).length === 2 && nombres.length === 2,
      detalle: `Vio ${filas(r).length} libros, ${nombres.length} con nombre de vendedor. Si falta el nombre, falta la clave foránea publicaciones.vendedor_id -> usuarios(id). ${mensaje(r)}`,
    };
  });

  // --- seguridad (RLS) ---
  console.log('\n— 4. Seguridad (RLS) —');
  await prueba('Seguridad', 'B NO puede editar el libro de A', async () => {
    const r = await rest('PATCH', `/publicaciones?id=eq.${L1.id}`, B.token, { precio: 1 });
    const comprobar = await rest('GET', `/publicaciones?select=precio&id=eq.${L1.id}`, A.token);
    return { ok: rechazada(r) && Number(filas(comprobar)[0]?.precio) === 12, detalle: `HTTP ${r.status}, precio actual ${filas(comprobar)[0]?.precio}` };
  });
  await prueba('Seguridad', 'B NO puede borrar el libro de A', async () => {
    const r = await rest('DELETE', `/publicaciones?id=eq.${L1.id}`, B.token);
    const comprobar = await rest('GET', `/publicaciones?select=id&id=eq.${L1.id}`, A.token);
    return { ok: rechazada(r) && filas(comprobar).length === 1, detalle: `HTTP ${r.status}, el libro ${filas(comprobar).length ? 'sigue existiendo' : 'DESAPARECIÓ'}` };
  });
  await prueba('Seguridad', 'B NO puede publicar un libro a nombre de A', async () => {
    const r = await rest('POST', '/publicaciones', B.token, { ...datosLibro(9, 5, '9780306406157'), vendedor_id: A.id, estado_publicacion: 'activa' });
    return { ok: r.status >= 400, detalle: `HTTP ${r.status}: se aceptó una publicación con vendedor_id ajeno. Revisa la política INSERT de S08.` };
  });
  await prueba('Seguridad', 'A NO puede marcar su libro como "vendida" a mano', async () => {
    const r = await rest('PATCH', `/publicaciones?id=eq.${L2.id}`, A.token, { estado_publicacion: 'vendida' });
    const comprobar = await rest('GET', `/publicaciones?select=estado_publicacion&id=eq.${L2.id}`, A.token);
    return { ok: rechazada(r) && filas(comprobar)[0]?.estado_publicacion === 'activa', detalle: `HTTP ${r.status}, estado actual: ${filas(comprobar)[0]?.estado_publicacion}. Revisa que no haya políticas UPDATE duplicadas en publicaciones.` };
  });
  await prueba('Seguridad', 'El correo de otros usuarios es privado', async () => {
    const r = await rest('GET', `/usuarios?select=correo&id=eq.${A.id}`, B.token);
    return { ok: r.status >= 400, detalle: `HTTP ${r.status}: B pudo leer el correo de A. Falta ejecutar la migración S09 (permisos por columna).` };
  });
  await prueba('Seguridad', 'B NO puede escribir directo en "pedidos"', async () => {
    const r = await rest('POST', '/pedidos', B.token, { comprador_id: B.id, total: 1, direccion_envio: 'Calle falsa 123' });
    return { ok: r.status >= 400, detalle: `HTTP ${r.status}: la tabla pedidos acepta escrituras directas.` };
  });
  await prueba('Seguridad', 'Un visitante sin sesión NO puede comprar', async () => {
    const r = await rest('POST', '/rpc/crear_pedido', null, { p_publicaciones: [L2.id], p_direccion: 'Av. Prueba 123', p_metodo_pago: 'simulado' });
    return { ok: r.status >= 400, detalle: `HTTP ${r.status}` };
  });
  await prueba('Seguridad', 'Un visitante sin sesión no ve publicaciones', async () => {
    const r = await rest('GET', `/publicaciones?select=id&id=eq.${L2.id}`, null);
    return { ok: rechazada(r), detalle: 'Un visitante pudo leer publicaciones. Es decisión de diseño (S08), no bloquea la compra y venta.' };
  }, { aviso: true });

  // --- reglas de la compra ---
  console.log('\n— 5. Compra: reglas de crear_pedido() —');
  const comprar = (token, ids, direccion = 'Av. Prueba 123, San Isidro') =>
    rest('POST', '/rpc/crear_pedido', token, { p_publicaciones: ids, p_direccion: direccion, p_metodo_pago: 'simulado' });

  await prueba('Compra', 'Carrito vacío -> error claro', async () => {
    const r = await comprar(B.token, []);
    return { ok: r.status >= 400 && /vac[ií]o/i.test(mensaje(r)), detalle: `HTTP ${r.status}: ${mensaje(r)}` };
  });
  await prueba('Compra', 'Dirección inválida -> error claro', async () => {
    const r = await comprar(B.token, [L2.id], 'ab');
    return { ok: r.status >= 400 && /direcci[oó]n/i.test(mensaje(r)), detalle: `HTTP ${r.status}: ${mensaje(r)}` };
  });
  await prueba('Compra', 'Libro inexistente -> error claro', async () => {
    const r = await comprar(B.token, [999999999]);
    return { ok: r.status >= 400 && /no existe/i.test(mensaje(r)), detalle: `HTTP ${r.status}: ${mensaje(r)}` };
  });
  await prueba('Compra', 'A NO puede comprar su propio libro', async () => {
    const r = await comprar(A.token, [L2.id]);
    return { ok: r.status >= 400 && /propio/i.test(mensaje(r)), detalle: `HTTP ${r.status}: ${mensaje(r)}` };
  });

  let pedido;
  await prueba('Compra', 'B compra el libro 1 (POST /rpc/crear_pedido)', async () => {
    const r = await comprar(B.token, [L1.id]);
    pedido = r.data;
    return {
      ok: r.status === 200 && pedido?.id && Number(pedido.total) === 12 && pedido.items?.length === 1,
      detalle: `HTTP ${r.status}: ${mensaje(r) || JSON.stringify(pedido)?.slice(0, 120)}`,
    };
  });
  await prueba('Compra', 'El libro 1 queda "vendida"', async () => {
    const r = await rest('GET', `/publicaciones?select=estado_publicacion&id=eq.${L1.id}`, A.token);
    return { ok: filas(r)[0]?.estado_publicacion === 'vendida', detalle: `Estado actual: ${filas(r)[0]?.estado_publicacion}` };
  });
  await prueba('Compra', 'Comprar el mismo libro otra vez -> "Ya no está disponible"', async () => {
    const r = await comprar(B.token, [L1.id]);
    return { ok: r.status >= 400 && /disponible/i.test(mensaje(r)), detalle: `HTTP ${r.status}: ${mensaje(r)}` };
  });
  await prueba('Compra', 'Compra con un libro inválido no deja nada a medias (todo o nada)', async () => {
    const r = await comprar(B.token, [L2.id, 999999999]);
    const comprobar = await rest('GET', `/publicaciones?select=estado_publicacion&id=eq.${L2.id}`, A.token);
    return { ok: r.status >= 400 && filas(comprobar)[0]?.estado_publicacion === 'activa', detalle: `HTTP ${r.status}; libro 2 quedó ${filas(comprobar)[0]?.estado_publicacion}` };
  });
  await prueba('Compra', 'Un libro vendido no se puede editar ni borrar (el historial se conserva)', async () => {
    const e = await rest('PATCH', `/publicaciones?id=eq.${L1.id}`, A.token, { titulo: 'Cambiado' });
    const d = await rest('DELETE', `/publicaciones?id=eq.${L1.id}`, A.token);
    const comprobar = await rest('GET', `/publicaciones?select=titulo&id=eq.${L1.id}`, A.token);
    return { ok: rechazada(e) && rechazada(d) && filas(comprobar).length === 1 && filas(comprobar)[0].titulo !== 'Cambiado', detalle: `editar HTTP ${e.status}, borrar HTTP ${d.status}` };
  });

  // --- historiales ---
  console.log('\n— 6. Historial de compras y ventas —');
  await prueba('Historial', 'B ve su compra en "Mis compras" con el detalle', async () => {
    const r = await rest('GET', `/pedidos?select=id,total,estado,direccion_envio,detalle_pedido(titulo,precio)&order=fecha.desc`, B.token);
    const mio = filas(r).find((p) => p.id === pedido?.id);
    return { ok: !!mio && mio.detalle_pedido?.length === 1, detalle: `Pedidos visibles: ${filas(r).length}. ${mensaje(r)}` };
  });
  await prueba('Historial', 'A NO ve las compras de B', async () => {
    const r = await rest('GET', `/pedidos?select=id&id=eq.${pedido?.id}`, A.token);
    return { ok: filas(r).length === 0 && r.status < 400, detalle: `A vio ${filas(r).length} pedidos de B` };
  });
  await prueba('Historial', 'A ve la venta en "Mis ventas" con el nombre del comprador', async () => {
    const r = await rest('POST', '/rpc/mis_ventas', A.token, {});
    const venta = filas(r).find((v) => v.pedido_id === pedido?.id);
    return { ok: !!venta && !!venta.comprador_nombre, detalle: `HTTP ${r.status}: ${mensaje(r)} | ventas: ${filas(r).length}` };
  });
  await prueba('Historial', 'B NO ve esa venta en sus ventas', async () => {
    const r = await rest('POST', '/rpc/mis_ventas', B.token, {});
    return { ok: r.status === 200 && !filas(r).some((v) => v.pedido_id === pedido?.id), detalle: `HTTP ${r.status}` };
  });

  // --- eliminar ---
  console.log('\n— 7. Venta: eliminar —');
  await prueba('Venta', 'DELETE: A elimina su libro 2 (no vendido)', async () => {
    const r = await rest('DELETE', `/publicaciones?id=eq.${L2.id}&vendedor_id=eq.${A.id}`, A.token);
    const comprobar = await rest('GET', `/publicaciones?select=id&id=eq.${L2.id}`, A.token);
    return { ok: filas(r).length === 1 && filas(comprobar).length === 0, detalle: `HTTP ${r.status} ${mensaje(r)}` };
  });

  return terminar();
}

function terminar() {
  const fallos = resultados.filter((r) => !r.ok && !r.aviso);
  const avisos = resultados.filter((r) => !r.ok && r.aviso);
  const okCount = resultados.filter((r) => r.ok).length;
  console.log('\n' + '='.repeat(60));
  console.log(`RESULTADO: ${okCount} OK · ${fallos.length} fallaron · ${avisos.length} avisos (de ${resultados.length})`);
  console.log(fallos.length === 0 ? '✓ El backend pasó todas las pruebas críticas.' : '✗ Hay pruebas críticas fallidas: copia el mensaje exacto y revísalo.');
  console.log('='.repeat(60) + '\n');
  try {
    const lineas = resultados.map((r) => `${r.ok ? 'OK    ' : r.aviso ? 'AVISO ' : 'FALLÓ '} [${r.grupo}] ${r.nombre}${r.ok || !r.detalle ? '' : ` -> ${r.detalle}`}`);
    writeFileSync('scripts/ultimo_resultado.txt', `Marketbook - prueba del backend - ${new Date().toISOString()}\n${URL_BASE}\n\n${lineas.join('\n')}\n\nTOTAL: ${okCount} OK, ${fallos.length} fallaron, ${avisos.length} avisos\n`);
    console.log('Resultado guardado en scripts/ultimo_resultado.txt');
  } catch { /* si no se puede guardar, no importa */ }
  process.exit(fallos.length === 0 ? 0 : 1);
}

main().catch((e) => salirConError(`Error inesperado: ${e.message}`));

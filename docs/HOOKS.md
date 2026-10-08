# Hooks de Marketbook (guía para el frontend)

Las pantallas **no** llaman a `supabase` ni a `fetch`. Solo usan estos hooks (`import { ... } from '../hooks'`).
Todos funcionan dentro de `AppProviders` (ya envuelto en `App.js`).

| Hook | Estado hoy |
|---|---|
| `useAuth` | Real (Supabase Auth) |
| `usePublicaciones`, `usePublicacion`, `usePublicacionesActions` | Real (API REST de Supabase) |
| `useCarrito` | Real (guardado en AsyncStorage por usuario) |
| `useTema` | Real (guardado en AsyncStorage por usuario; sin sesión, modo claro) |
| `usePedidos` | Real (compra con función SQL `crear_pedido`, historial de compras y ventas) |
| `usePerfil` | Real (nombre editable) |

Todas las acciones lanzan `Error` con mensaje en español: úsalo con `try/catch` y muéstralo al usuario.

## useAuth()
`{ user, session, loading, signIn(correo, password), signUp(nombre, correo, password), signOut() }`
`user` es `null` si no hay sesión; `loading` es `true` mientras se comprueba.

## usePublicaciones({ modo, busqueda, categoria })
- `modo`: `'activas'` (Explorar) o `'mias'` (Mis publicaciones)
- Devuelve `{ publicaciones, categorias, cargando, error, refrescar() }`
- `categorias` es la lista de categorías disponibles, útil para los chips de filtro.
- Se recarga sola cada vez que la pantalla vuelve a estar en foco.

## usePublicacion(id)
`{ libro, esPropia, cargando, error, refrescar() }`

Campos de `libro`: `id, titulo, autor, categoria, isbn, estado_libro, precio, descripcion, estado_publicacion, vendedor_id, vendedor_nombre, fecha_publicacion`.
`vendedor_nombre` es el nombre del vendedor (si por algo llega `null`, muestra "Vendedor").

## usePublicacionesActions()
`{ crear(datos), actualizar(id, datos), retirar(id), eliminar(id) }`
`datos = { titulo, autor, categoria, isbn, precio (número), estado_libro, descripcion }`
`estado_libro` ∈ `'Nuevo' | 'Como nuevo' | 'Bueno' | 'Regular'`

## useCarrito()
`{ items, cantidad, total, cargando, agregar(libro), quitar(id), vaciar(), estaEnCarrito(id) }`
- `agregar` lanza Error si el libro es tuyo o ya no está disponible (usa `try/catch`).
- Cada libro es un ejemplar único: no se puede agregar dos veces.
- Después de una compra exitosa, llama a `vaciar()`.

## usePedidos()
`{ comprar(ids, { direccion, metodoPago }), misCompras, misVentas, cargando, error, refrescar() }`
- `comprar([1, 2], { direccion: 'Av. ...', metodoPago: 'simulado' })` devuelve el pedido creado.
- `misCompras`: `[{ id, fecha, total, estado, direccion_envio, metodo_pago, items: [{ publicacion_id, titulo, autor, precio }] }]`
- `misVentas`: `[{ id, pedido_id, fecha, titulo, autor, precio, estado }]`
- `misVentas` incluye además `comprador_nombre` y `direccion_envio`.
- Errores típicos que lanza `comprar`: carrito vacío, dirección inválida, "Ya no está disponible: …", "No puedes comprar tu propio libro". Muestra `e.message` tal cual.

## usePerfil()
`{ perfil, cargando, error, actualizar({ nombre }), refrescar() }`
`perfil = { id, nombre, foto_perfil, correo }`. El nombre debe tener entre 1 y 80 caracteres.

## useTema()
`{ modo ('claro' | 'oscuro'), esOscuro, cargando, alternarModo() }`
Los colores de cada modo los define el frontend en `src/theme`.

## Ejemplo mínimo
```js
import { usePublicaciones, useCarrito } from '../hooks';

export default function Explorar() {
  const { publicaciones, cargando, error, refrescar } = usePublicaciones({ modo: 'activas' });
  const { agregar } = useCarrito();
  if (cargando) return <LoadingView />;
  if (error) return <ErrorView mensaje={error} onReintentar={refrescar} />;
  // ...
}
```

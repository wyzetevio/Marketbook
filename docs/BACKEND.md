# Backend de Marketbook (Avance 2)

## 1. Arquitectura

```
App React Native (Expo)
  Pantallas -> Hooks (useAuth, usePublicaciones, useCarrito, usePedidos, usePerfil)
            -> Servicios (apiClient, publicacionesService, pedidosService, perfilService)
            -> HTTPS + JWT de Supabase Auth
Supabase
  Auth (registro / login / sesión)
  Data REST API (PostgREST)  <- el "backend REST"
  PostgreSQL + RLS + funciones SQL (crear_pedido, mis_ventas)
Dispositivo: AsyncStorage (sesión, carrito, tema)
```

**El backend es Supabase.** No se usa Spring Boot ni Node: el README del proyecto lo define así
("No hay un backend Node adicional") y la consigna pide persistencia con Supabase.
Las reglas de negocio viven en PostgreSQL (RLS + funciones), no solo en la app.

## 2. Modelo de datos

| Tabla | Para qué | Quién la lee |
|---|---|---|
| `usuarios` | Perfil (id = auth.users.id, nombre, correo, foto) | Todos ven `id, nombre, foto`; el correo es privado; cada uno edita solo el suyo |
| `publicaciones` | Libros en venta (activa / vendida / retirada) | Todos ven las activas; el dueño ve todas las suyas |
| `pedidos` | Cabecera de compra (comprador, total, dirección, pago simulado) | Solo el comprador |
| `detalle_pedido` | Libros del pedido, con copia de título, autor y precio | Solo el comprador (el vendedor usa `mis_ventas()`) |

## 3. Endpoints (Data REST API de Supabase)

| Operación | Método y ruta | Hook / pantalla |
|---|---|---|
| Listar libros activos | `GET /rest/v1/publicaciones?estado_publicacion=eq.activa` | `usePublicaciones` |
| Mis libros | `GET /rest/v1/publicaciones?vendedor_id=eq.<id>` | `usePublicaciones({modo:'mias'})` |
| Detalle | `GET /rest/v1/publicaciones?id=eq.<id>` | `usePublicacion` |
| Publicar | `POST /rest/v1/publicaciones` | `usePublicacionesActions().crear` |
| Editar / retirar | `PATCH /rest/v1/publicaciones?id=eq.<id>` | `.actualizar` / `.retirar` |
| Eliminar | `DELETE /rest/v1/publicaciones?id=eq.<id>` | `.eliminar` |
| **Comprar** | `POST /rest/v1/rpc/crear_pedido` | `usePedidos().comprar` |
| Mis compras | `GET /rest/v1/pedidos?select=...,detalle_pedido(...)` | `usePedidos().misCompras` |
| Mis ventas | `POST /rest/v1/rpc/mis_ventas` | `usePedidos().misVentas` |
| Ver / editar perfil | `GET` / `PATCH /rest/v1/usuarios?id=eq.<id>` | `usePerfil` |

Todas llevan `apikey` (publishable key) y `Authorization: Bearer <JWT del usuario>`.

## 4. Reglas de seguridad (RLS + funciones)

- Visitantes sin sesión: sin acceso a ninguna tabla ni función.
- Solo el dueño edita, retira o elimina su libro.
- Un libro **vendido** no se edita, no se reactiva y no se borra (el historial se conserva).
- El dueño no puede marcar un libro como "vendida" a mano: solo lo hace la compra.
- Nadie escribe directamente en `pedidos` ni `detalle_pedido`: solo `crear_pedido()`.
- `crear_pedido()` es una transacción: valida, bloquea los libros, crea el pedido y marca como vendidos. Si algo falla, no se guarda nada.
- No se puede comprar un libro propio, uno ya vendido, uno inexistente, con carrito vacío, con dirección inválida ni sin sesión.
- Dos personas comprando el mismo libro a la vez: la segunda recibe "Ya no está disponible".

## 5. Puesta en marcha (orden exacto)

1. Supabase > **SQL Editor** > New query > pegar `supabase/migrations/20261008_s09_compra_venta.sql` > **Run**. Debe decir "Success".
2. **Table Editor**: deben existir `pedidos` y `detalle_pedido` con RLS activado. **Database > Functions**: `crear_pedido` y `mis_ventas`.
3. **Authentication > Providers > Email**: para la presentación, desactivar **Confirm email** (así registrarse e ingresar es inmediato).
4. `.env` con la URL y la *publishable key* (nunca `service_role`).
5. Copiar el contenido del zip sobre el proyecto, luego `npx expo start --clear`.

## 6. Guion de prueba con 2 cuentas (sirve como evidencia)

Cuenta A = vendedor, cuenta B = comprador (abre B en otra ventana de incógnito o en el celular).

1. Registrar A y B. En Table Editor > `usuarios` aparecen las dos filas. *(captura)*
2. A: publicar 2 libros (POST). Editar el precio de uno (PATCH). *(capturas)*
3. B: ver los libros de A en Explorar (GET). B no ve botones de editar/eliminar en libros ajenos. *(captura)*
4. B: agregar al carrito, cerrar y abrir la app: el carrito sigue (AsyncStorage). *(captura)*
5. B: comprar con dirección. Aparece en Mis compras. *(captura)*
6. A: en Mis publicaciones el libro figura "vendida"; en Mis ventas aparece la venta con el nombre de B. *(captura)*
7. B intenta comprar el mismo libro otra vez o A intenta comprar el suyo: mensaje de error claro. *(captura)*
8. A elimina un libro no vendido (DELETE). *(captura)*
9. Supabase > Table Editor > `pedidos` y `detalle_pedido` con los datos. *(captura)*
10. Authentication > Policies: mostrar las políticas de cada tabla. *(captura)*

## 7. Cómo cubre la rúbrica

| Criterio | Evidencia |
|---|---|
| React Native | App con navegación, pantallas, flujo completo de compra y venta |
| Hooks | Hooks propios y contextos: `useAuth`, `usePublicaciones`, `useCarrito`, `usePedidos`, `usePerfil`, `useTema` |
| useState / useEffect | Estados y efectos con limpieza en los contextos y hooks (`useEffect`, `useFocusEffect`, evitar respuestas viejas) |
| APIs REST | CRUD completo sobre `/publicaciones` + `/rpc/crear_pedido` + historial; manejo de errores (red, tiempo agotado, 401, 403, RLS, reglas de negocio) |
| AsyncStorage | Sesión de Supabase, carrito por usuario y preferencia de tema |

## 8. Problemas frecuentes

| Mensaje / síntoma | Causa y solución |
|---|---|
| "Falta crear una función/tabla en Supabase" | No se ejecutó la migración 2 en ese proyecto |
| "No tienes permiso para realizar esta acción" | RLS bloqueó la operación: revisa sesión y propietario |
| Al publicar falla con error de clave foránea | El usuario no tiene fila en `usuarios` (se registró antes del trigger). Crearla a mano o registrar otra cuenta |
| "Tu sesión venció" | Normal: la app vuelve al Login |
| Cambié `.env` y no se refleja | `npx expo start --clear` |
| No puedo borrar un usuario en Supabase | Si tiene pedidos, primero se borran sus pedidos |

## 9. Prueba automática del backend (evidencia)

`node scripts/probar_backend.mjs` entra con dos cuentas reales (A = vendedor, B = comprador) y ejecuta
30 comprobaciones contra Supabase: CRUD de publicaciones, reglas de seguridad (RLS), compra con
`crear_pedido`, historial de compras y ventas. Al final imprime OK / FALLÓ y guarda
`scripts/ultimo_resultado.txt`. Instrucciones de uso al inicio del archivo.

# 📚 Marketbook — Marketplace de Libros

> **Compra. Vende. Encuentra tu próxima lectura.**

Proyecto grupal del curso **Desarrollo de Aplicaciones Móviles — UTP, Grupo 5**.

Marketbook es una aplicación móvil multiplataforma para **publicar, explorar, comprar y vender libros físicos**. El proyecto utiliza **React Native + Expo** en el frontend y **Supabase** como backend, incluyendo autenticación, PostgreSQL, API REST (PostgREST), RLS, funciones SQL y persistencia local con AsyncStorage.

> **Documento de referencia del proyecto — Avance 2 / Proyecto Final 2.**
>
> Este README describe tanto lo que ya está implementado como lo que todavía debe integrar el equipo. Una funcionalidad marcada como `⏳ Pendiente` no debe considerarse terminada aunque exista parte de su backend.

---

## 1. Estado actual del proyecto

### 🟢 Backend — S09 COMPLETADO

El backend de compra/venta ya está integrado en `main` y fue probado contra el proyecto real de Supabase.

**Resultado de `node scripts/probar_backend.mjs`:**

```text
30 OK · 0 fallaron · 0 avisos
```

Las pruebas cubren:

- Supabase Auth
- perfiles de usuarios
- CRUD de publicaciones
- exploración de publicaciones
- RLS y seguridad
- compra mediante `crear_pedido()`
- prevención de compras inválidas
- historial de compras
- historial de ventas
- conservación del historial de libros vendidos
- eliminación de publicaciones no vendidas
- manejo de errores
- transacciones de compra

### 🟡 Frontend — INTEGRACIÓN EN PROCESO

El backend y los hooks necesarios ya existen, pero las pantallas finales del Proyecto Final 2 se están implementando por bloques.

Los tres bloques de frontend son:

| Bloque | Responsable | Estado |
|---|---|---|
| A — Base visual, acceso y navegación | César Suárez Vargas | ⏳ En desarrollo |
| B — Marketplace y publicaciones | Piero Alessandro Ramírez Salazar | ⏳ En desarrollo |
| C — Compra e historial | Jesús Andres Sánchez Reyes | ⏳ En desarrollo |
| Backend, integración, pruebas y evidencias | Samuel Jeremy Torres Ayala | 🟢 Backend terminado / integración pendiente |

### 🎯 Objetivo de integración

El flujo final esperado es:

```text
Cuenta A
   ↓
Publica un libro
   ↓
Cuenta B
   ↓
Explora el libro
   ↓
Ve el detalle
   ↓
Agrega al carrito
   ↓
Checkout con pago SIMULADO
   ↓
Compra
   ↓
Libro pasa a "vendida"
   ↓
Cuenta B → Mis compras
   ↓
Cuenta A → Mis ventas
```

---

# 2. Rúbrica oficial — Avance de Proyecto Final 2

La evaluación tiene **20 puntos**, distribuidos en cinco criterios de 4 puntos cada uno.

| Criterio | Puntaje | Qué debe demostrar el proyecto |
|---|---:|---|
| Implementación de React Native | 4 pts | App funcional y bien estructurada |
| Integración de Hooks | 4 pts | Uso adecuado de hooks en los componentes |
| `useState` y `useEffect` | 4 pts | Manejo óptimo de estados y efectos |
| APIs REST | 4 pts | CRUD y manejo de errores correctos |
| AsyncStorage | 4 pts | Persistencia completa de datos |

## 2.1 Evidencia esperada

### React Native — 4 pts

Debe poder demostrarse la aplicación funcionando con navegación y flujo completo de compra/venta.

### Hooks — 4 pts

Las pantallas deben consumir los hooks de `src/hooks/`.

Las pantallas **no deben** llamar directamente a:

```text
supabase
fetch
src/services
```

La arquitectura esperada es:

```text
Pantalla
   ↓
Hook / Context
   ↓
Service
   ↓
API REST / RPC
   ↓
Supabase
```

### `useState` / `useEffect` — 4 pts

Las pantallas deben manejar correctamente:

- formularios
- carga
- errores
- estados vacíos
- datos recibidos
- actualización/refresco
- efectos asociados al ciclo de vida o foco

### APIs REST — 4 pts

Debe poder demostrarse:

- GET
- POST
- PATCH
- DELETE
- compra mediante RPC
- historial
- manejo de errores
- reglas de seguridad

### AsyncStorage — 4 pts

Debe demostrarse persistencia de:

- sesión
- carrito por usuario
- preferencia de tema

---

# 3. Arquitectura del sistema

```text
┌─────────────────────────────────────────────┐
│              React Native + Expo            │
│                                             │
│  Screens → Components → Hooks / Contexts    │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
              Services / apiClient
                       │
                       │ HTTPS + JWT
                       ▼
┌─────────────────────────────────────────────┐
│                  Supabase                   │
│                                             │
│  Auth                                       │
│  PostgreSQL                                 │
│  PostgREST / Data REST API                  │
│  RLS                                        │
│  SQL Functions                              │
│                                             │
│  crear_pedido()                             │
│  mis_ventas()                               │
└─────────────────────────────────────────────┘

Dispositivo:
AsyncStorage
 ├── sesión
 ├── carrito por usuario
 └── tema
```

### Importante

**No existe un backend Node.js ni Spring Boot en esta arquitectura.**

Supabase es el backend del proyecto.

No se utiliza un archivo JSON como base de datos.

---

# 4. Tecnologías

| Tecnología | Uso |
|---|---|
| React Native | Aplicación móvil |
| Expo | Desarrollo y ejecución |
| React Navigation | Navegación |
| JavaScript | Lenguaje principal |
| Supabase Auth | Registro, login y sesión |
| Supabase PostgreSQL | Base de datos |
| PostgREST | API REST |
| RLS | Seguridad y autorización |
| SQL Functions | Reglas de compra/venta |
| AsyncStorage | Persistencia local |
| Git / GitHub | Control de versiones |

---

# 5. Backend implementado

## 5.1 Tablas

### `usuarios`

Perfil asociado al usuario autenticado.

Campos principales:

```text
id
auth_id
nombre
correo
foto_perfil
```

El correo de otros usuarios no se expone públicamente.

### `publicaciones`

Representa un libro físico ofrecido por un usuario.

Campos principales:

```text
id
vendedor_id
titulo
autor
categoria
isbn
estado_libro
precio
descripcion
estado_publicacion
fecha_publicacion
```

Estados de publicación:

```text
activa
vendida
retirada
```

### `pedidos`

Cabecera de una compra.

Incluye:

```text
comprador
total
direccion_envio
metodo_pago
estado
fecha
```

### `detalle_pedido`

Detalle de los libros incluidos en un pedido.

Guarda información histórica del libro comprado.

---

# 6. API REST implementada

Los servicios de la aplicación utilizan la API REST de Supabase.

| Operación | Método | Ruta / función | Hook |
|---|---|---|---|
| Libros activos | GET | `/rest/v1/publicaciones` | `usePublicaciones` |
| Mis publicaciones | GET | `/rest/v1/publicaciones` | `usePublicaciones` |
| Detalle | GET | `/rest/v1/publicaciones` | `usePublicacion` |
| Crear | POST | `/rest/v1/publicaciones` | `usePublicacionesActions` |
| Editar | PATCH | `/rest/v1/publicaciones` | `usePublicacionesActions` |
| Retirar | PATCH | `/rest/v1/publicaciones` | `usePublicacionesActions` |
| Eliminar | DELETE | `/rest/v1/publicaciones` | `usePublicacionesActions` |
| Comprar | POST | `/rest/v1/rpc/crear_pedido` | `usePedidos` |
| Mis compras | GET | `/rest/v1/pedidos` | `usePedidos` |
| Mis ventas | POST | `/rest/v1/rpc/mis_ventas` | `usePedidos` |
| Perfil | GET/PATCH | `/rest/v1/usuarios` | `usePerfil` |

Las solicitudes autenticadas utilizan:

```text
apikey
Authorization: Bearer <JWT>
```

---

# 7. Reglas de negocio y seguridad

La seguridad no depende únicamente de la interfaz.

Supabase PostgreSQL + RLS aplica las reglas.

### Publicaciones

- Solo el propietario puede editar.
- Solo el propietario puede retirar.
- Solo el propietario puede eliminar.
- Un libro vendido no puede editarse.
- Un libro vendido no puede reactivarse.
- Un libro vendido no puede eliminarse.
- El vendedor no puede marcar manualmente un libro como `vendida`.

### Compras

- Se necesita sesión.
- No se puede comprar un libro propio.
- No se puede comprar un libro vendido.
- No se puede comprar un libro inexistente.
- El carrito no puede estar vacío.
- La dirección debe ser válida.
- La compra utiliza pago simulado.
- Un libro físico solo puede venderse una vez.
- La segunda persona que intente comprar un libro ya vendido recibe un error.
- La compra es transaccional: si falla una parte, no queda una compra incompleta.

### Pedidos

El frontend no inserta directamente en:

```text
pedidos
detalle_pedido
```

La compra se realiza mediante:

```text
crear_pedido()
```

---

# 8. Hooks disponibles para el frontend

Las pantallas deben usar los hooks existentes.

Documentación detallada:

```text
docs/HOOKS.md
```

## `useAuth()`

```js
{
  user,
  session,
  loading,
  signIn(),
  signUp(),
  signOut()
}
```

Uso:

- Login
- Registro
- Sesión
- Cierre de sesión
- Protección de navegación

---

## `usePublicaciones()`

Permite consultar publicaciones activas o propias.

```js
usePublicaciones({
  modo: 'activas'
})
```

o:

```js
usePublicaciones({
  modo: 'mias'
})
```

Devuelve:

```js
{
  publicaciones,
  categorias,
  cargando,
  error,
  refrescar
}
```

---

## `usePublicacion(id)`

Obtiene el detalle de una publicación.

Devuelve:

```js
{
  libro,
  esPropia,
  cargando,
  error,
  refrescar
}
```

---

## `usePublicacionesActions()`

Acciones:

```js
{
  crear(),
  actualizar(),
  retirar(),
  eliminar()
}
```

---

## `useCarrito()`

Devuelve:

```js
{
  items,
  cantidad,
  total,
  cargando,
  agregar(),
  quitar(),
  vaciar(),
  estaEnCarrito()
}
```

El carrito se guarda en AsyncStorage por usuario.

Un libro:

- no puede agregarse dos veces
- no puede ser comprado por su propio vendedor
- no puede agregarse si ya no está disponible

---

## `usePedidos()`

Devuelve:

```js
{
  comprar(),
  misCompras,
  misVentas,
  cargando,
  error,
  refrescar()
}
```

Compra:

```js
comprar(ids, {
  direccion,
  metodoPago: 'simulado'
})
```

Después de una compra exitosa:

```js
useCarrito().vaciar()
```

---

## `usePerfil()`

Permite:

- consultar perfil
- editar nombre
- refrescar perfil

---

## `useTema()`

Devuelve:

```js
{
  modo,
  esOscuro,
  cargando,
  alternarModo
}
```

El modo se guarda en AsyncStorage.

Los colores y estilos finales son responsabilidad del frontend.

---

# 9. Reglas para las pantallas

Las pantallas deben:

- utilizar hooks
- utilizar componentes reutilizables cuando corresponda
- manejar `loading`
- manejar `error`
- manejar estado vacío
- permitir reintentar cuando corresponda
- mostrar errores de acciones al usuario
- utilizar `e.message` cuando el hook lance un error

### ❌ No hacer

```js
supabase.from(...)
```

directamente en una pantalla.

Tampoco:

```js
fetch(...)
```

directamente desde una pantalla.

Tampoco:

```js
import ... from '../services/...'
```

desde una pantalla.

### ✅ Hacer

```js
const {
  publicaciones,
  cargando,
  error,
  refrescar
} = usePublicaciones({
  modo: 'activas'
});
```

---

# 10. Alcance del frontend — Proyecto Final 2

## 🟢 Bloque A — Base visual, acceso y navegación

**Responsable: César Suárez Vargas**

### Tema y componentes

- `src/theme/`
- Button
- Input
- BookCard
- Header
- EmptyState
- LoadingView
- ErrorView

### Autenticación

- Login
- Registro
- Integración con `useAuth`

### Navegación

- Login cuando no existe sesión
- Aplicación cuando existe sesión
- Navegación principal
- Explorar
- Carrito
- Mis libros
- Perfil

### Perfil

- Nombre
- Edición del nombre con `usePerfil`
- Cerrar sesión
- Modo claro/oscuro con `useTema`

---

## 🔵 Bloque B — Marketplace y publicaciones

**Responsable: Piero Alessandro Ramírez Salazar**

### Explorar

- Lista de libros activos
- Buscador
- Filtros por categoría
- Loading
- Error
- Estado vacío
- Reintentar

### Detalle

- Título
- Autor
- Categoría
- Estado
- Precio
- Descripción
- Vendedor
- Agregar al carrito
- Acciones del propietario

### Publicación

- Crear libro
- Editar libro
- Validaciones
- Errores
- Retirar
- Eliminar

### Mis publicaciones

Mostrar:

```text
activa
vendida
retirada
```

Un libro vendido debe conservarse en el historial.

---

## 🟣 Bloque C — Compra e historial

**Responsable: Jesús Andres Sánchez Reyes**

### Carrito

- Lista de libros
- Quitar
- Vaciar
- Cantidad
- Total
- Estado vacío

### Checkout

- Dirección
- Pago simulado
- Validación
- Loading
- Error

### Confirmación

Mostrar confirmación después de una compra exitosa.

### Mis compras

Mostrar:

- pedido
- fecha
- total
- estado
- dirección
- método de pago
- libros comprados

### Mis ventas

Mostrar:

- libro vendido
- fecha
- precio
- estado
- comprador según los datos permitidos por el backend

---

# 11. Responsabilidad de Samuel — Backend e integración

**Samuel Jeremy Torres Ayala**

Responsabilidades:

```text
src/hooks/
src/services/
supabase/
scripts/
```

Además:

- integración final
- revisión de Pull Requests
- pruebas del backend
- pruebas con dos cuentas
- revisión de RLS
- evidencia de la rúbrica
- resolución de errores de backend
- integración final en `main`

### Backend congelado

No forma parte del alcance obligatorio actual:

```text
Marcar enviado
```

Es una funcionalidad opcional y se deja fuera de la entrega salvo que el equipo decida incorporarla posteriormente.

---

# 12. Organización Git

La rama principal es:

```text
main
```

Nadie debe trabajar directamente sobre `main`.

Ramas previstas:

```text
feature/front-bloque-a
feature/front-bloque-b
feature/front-bloque-c
```

Flujo:

```text
main
  ↓
crear rama
  ↓
desarrollar
  ↓
commit
  ↓
push
  ↓
Pull Request
  ↓
revisión
  ↓
merge
  ↓
main
```

Antes de comenzar:

```bash
git checkout main
git pull origin main
npm install
```

---

# 13. Configuración de Supabase para cada integrante

Todos los integrantes utilizan **el mismo proyecto Supabase**, pero cada integrante tiene su propio `.env` local.

Cada `.env` contiene:

```env
EXPO_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU_PUBLISHABLE_KEY
```

### Importante

El `.env`:

- no se sube a GitHub
- no se incluye en commits
- no se reemplaza por credenciales de otra persona

No utilizar:

```text
service_role
secret key
contraseña de base de datos
```

Cada integrante puede utilizar su propia cuenta de prueba dentro del mismo proyecto Supabase.

Esto permite probar:

```text
Vendedor → publica
Comprador → explora
Comprador → compra
Vendedor → ve la venta
```

---

# 14. Configuración inicial

## 14.1 Obtener el proyecto

```bash
git clone https://github.com/wyzetevio/Marketbook.git
cd Marketbook
```

Actualizar:

```bash
git checkout main
git pull origin main
```

## 14.2 Instalar

```bash
npm install
```

## 14.3 Configurar `.env`

Copiar:

```text
.env.example
```

como:

```text
.env
```

y completar:

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

## 14.4 Ejecutar

```bash
npx expo start
```

Para limpiar caché:

```bash
npx expo start --clear
```

---

# 15. Supabase — configuración necesaria

En el proyecto Supabase debe estar aplicada la migración de S08:

```text
supabase/migrations/20260928_s08_publicaciones.sql
```

y la migración S09:

```text
supabase/migrations/20261008_s09_compra_venta.sql
```

S09 crea/configura:

```text
pedidos
detalle_pedido
crear_pedido()
mis_ventas()
```

También configura las políticas RLS correspondientes.

Para la demo, la configuración de Email debe permitir el registro/inicio de sesión que utiliza el equipo.

---

# 16. Prueba automática del backend

Archivo:

```text
scripts/probar_backend.mjs
```

Ejecutar:

```bash
node scripts/probar_backend.mjs
```

El script prueba dos cuentas reales:

```text
A = vendedor
B = comprador
```

Comprueba:

- autenticación
- perfiles
- POST
- GET
- PATCH
- DELETE
- exploración
- RLS
- compra
- errores
- historial
- ventas

Resultado esperado actual:

```text
30 OK · 0 fallaron · 0 avisos
```

Resultado guardado en:

```text
scripts/ultimo_resultado.txt
```

---

# 17. Guion de prueba final

Cuando los tres bloques de frontend estén integrados, se debe probar:

### Cuenta A — vendedor

1. Registrar/iniciar sesión.
2. Publicar un libro.
3. Publicar otro libro.
4. Editar uno.
5. Retirar uno.
6. Mantener otro activo.

### Cuenta B — comprador

7. Registrar/iniciar sesión.
8. Explorar libros de A.
9. Abrir detalle.
10. Agregar al carrito.
11. Comprobar persistencia del carrito.
12. Abrir Checkout.
13. Introducir dirección.
14. Seleccionar pago simulado.
15. Comprar.

### Después de comprar

16. B → comprobar `Mis compras`.
17. A → comprobar `Mis ventas`.
18. A → comprobar que el libro comprado aparece como `vendida`.
19. Intentar comprar el mismo libro nuevamente.
20. Comprobar mensaje de error.
21. A puede eliminar un libro que todavía no fue vendido.
22. Comprobar persistencia de sesión.
23. Comprobar persistencia del tema.
24. Ejecutar nuevamente las pruebas del backend.

---

# 18. Evidencias para la sustentación

## React Native

Capturas de:

- Login
- Registro
- Marketplace
- Detalle
- Carrito
- Checkout
- Mis compras
- Mis ventas
- Perfil
- navegación

## Hooks

Mostrar:

```text
src/hooks/
```

y la relación:

```text
Pantalla → Hook → Service → Supabase
```

Especialmente:

```text
useAuth
usePublicaciones
useCarrito
usePedidos
usePerfil
useTema
```

## `useState` / `useEffect`

Mostrar fragmentos de:

- formularios
- carga
- errores
- efectos
- actualización de datos

## APIs REST

Mostrar:

- GET
- POST
- PATCH
- DELETE
- compra
- historial

Además:

```text
scripts/ultimo_resultado.txt
```

con:

```text
30 OK · 0 fallaron · 0 avisos
```

## AsyncStorage

Demostrar:

- sesión persistente
- carrito persistente
- tema persistente

---

# 19. Estructura actual del proyecto

```text
Marketbook/
├── assets/
├── docs/
│   ├── BACKEND.md
│   └── HOOKS.md
├── scripts/
│   ├── probar_backend.mjs
│   └── ultimo_resultado.txt
├── src/
│   ├── components/
│   ├── hooks/
│   │   ├── AppProviders.js
│   │   ├── AuthContext.js
│   │   ├── CarritoContext.js
│   │   ├── TemaContext.js
│   │   ├── usePedidos.js
│   │   ├── usePerfil.js
│   │   └── usePublicaciones.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── auth/
│   │   ├── marketplace/
│   │   └── publications/
│   ├── services/
│   │   ├── apiClient.js
│   │   ├── pedidosService.js
│   │   ├── perfilService.js
│   │   ├── publicacionesService.js
│   │   └── supabase/
│   │       ├── authService.js
│   │       └── client.js
│   └── utils/
│       └── dialogs.js
├── supabase/
│   └── migrations/
│       ├── 20260928_s08_publicaciones.sql
│       └── 20261008_s09_compra_venta.sql
├── App.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

---

# 20. Documentación complementaria

### `docs/HOOKS.md`

Guía para los integrantes de frontend.

Explica:

- hooks disponibles
- parámetros
- valores devueltos
- acciones
- errores
- ejemplos de uso

### `docs/BACKEND.md`

Explica:

- arquitectura
- tablas
- endpoints
- RLS
- funciones SQL
- puesta en marcha
- guion de prueba
- relación con la rúbrica

### `scripts/probar_backend.mjs`

Prueba automática de compra/venta y seguridad.

### `scripts/ultimo_resultado.txt`

Último resultado de la prueba automática.

---

# 21. Funcionalidades futuras / fuera del alcance inmediato

Estas funcionalidades forman parte del alcance general previsto, pero **no deben considerarse terminadas si no aparecen implementadas en el código actual**:

- fotografías de libros
- cámara
- galería
- ubicación
- direcciones persistentes independientes
- notificaciones
- recuperación de contraseña personalizada
- seguimiento avanzado del pedido
- estado `enviado`
- pagos reales
- integración con plataformas de pago
- recomendaciones avanzadas

### Pago

El proyecto utiliza:

```text
PAGO SIMULADO
```

No se procesan pagos reales.

---

# 22. Decisiones técnicas importantes

### Supabase es el backend

No agregar Spring Boot, Node.js o Express como backend paralelo sin una decisión explícita del equipo.

### Hooks son la interfaz del frontend

Las pantallas deben depender de hooks y contextos, no directamente de Supabase.

### Seguridad en backend

La interfaz puede ocultar botones, pero la seguridad real debe permanecer en RLS y funciones SQL.

### Un libro físico = una venta

Una publicación representa un ejemplar físico. Una vez vendida, queda protegida para conservar el historial.

### El carrito es local

El carrito utiliza AsyncStorage y está separado por usuario autenticado.

---

# 23. Estado de cumplimiento de la rúbrica

| Criterio | Backend / base | Integración final |
|---|---|---|
| React Native | 🟢 Base existente | 🟡 Pendiente de integrar todos los bloques |
| Hooks | 🟢 Hooks implementados | 🟡 Pantallas finales deben consumirlos |
| `useState` / `useEffect` | 🟢 Implementados en hooks/contextos | 🟡 Completar integración en pantallas |
| APIs REST | 🟢 CRUD + compra + historial, 30/30 | 🟡 Demostrar desde la app |
| AsyncStorage | 🟢 Sesión + carrito + tema | 🟡 Demostrar persistencia desde la app |

> **Conclusión actual:** el backend crítico de Avance 2 está terminado y validado. El trabajo restante principal es la integración de los tres bloques de frontend, la prueba punta a punta y la preparación de evidencias.

---

# 24. Regla para cualquier integrante o IA que trabaje sobre el repositorio

Antes de modificar código:

1. Leer este `README.md`.
2. Leer `docs/HOOKS.md`.
3. Leer `docs/BACKEND.md`.
4. Revisar el estado actual de `main`.
5. No asumir que una funcionalidad marcada como `⏳ Pendiente` ya está implementada.
6. No modificar backend para resolver un problema de frontend sin comprobar primero si el hook existente ya proporciona el dato.
7. No crear otro backend.
8. No subir `.env`.
9. Trabajar mediante ramas y Pull Requests.
10. Actualizar esta documentación si el alcance o el estado real cambia.

### Fuente de verdad

Cuando exista una diferencia entre una descripción antigua y el código actual:

```text
código actual + docs/HOOKS.md + docs/BACKEND.md
```

son la referencia técnica para el comportamiento implementado.

El README describe el alcance y el estado general del proyecto; no debe utilizarse para afirmar que una funcionalidad `⏳ Pendiente` ya está terminada.

---

# 25. Equipo

**Grupo 5 — Desarrollo de Aplicaciones Móviles**

- Ramírez Salazar, Piero Alessandro — Bloque B
- Sánchez Reyes, Jesús Andres — Bloque C
- Suárez Vargas, Cesar Manuel — Bloque A
- Torres Ayala, Samuel Jeremy — Backend, integración y pruebas

---

## 🚀 Estado del proyecto

**S09 Backend:** ✅ COMPLETADO  
**Pruebas backend:** ✅ 30/30  
**Supabase:** ✅ Integrado  
**RLS:** ✅ Implementado  
**CRUD:** ✅ Implementado  
**Compra/venta:** ✅ Backend implementado y probado  
**Hooks:** ✅ Implementados  
**AsyncStorage:** ✅ Implementado  
**Frontend Proyecto Final 2:** ⏳ En integración  
**Prueba punta a punta desde la app:** ⏳ Pendiente  
**Evidencias finales:** ⏳ Pendiente  
**Sustentación:** ⏳ Pendiente

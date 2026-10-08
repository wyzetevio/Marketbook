# 📚 Marketbook — Marketplace de Libros

> Compra. Vende. Encuentra tu próxima lectura.

Proyecto grupal de **Desarrollo de Aplicaciones Móviles (UTP) — Grupo 5**. Aplicación móvil multiplataforma para compra y venta **simulada** de libros físicos nuevos o usados, implementada progresivamente con **React Native + Expo + Supabase (Auth, PostgreSQL/Data REST API y Storage)**.

**Repositorio base:** https://github.com/wyzetevio/Marketbook  
**Documento actualizado para:** S08.s2 — Implementación de una API REST en un proyecto de aplicaciones móviles.

> **Este README distingue el diseño objetivo del estado implementado.** No afirma que todos los módulos del proyecto final estén concluidos.

---

## 1. Descripción, problema y objetivo

Marketbook centraliza publicaciones de ejemplares físicos ofrecidos por usuarios. Frente a grupos de mensajería y plataformas generales, organiza datos del libro, su estado, el vendedor y el precio. El acceso a la funcionalidad principal requiere autenticación: **un solo tipo de usuario** puede comprar y vender desde la misma cuenta.

**Objetivo general:** desarrollar una aplicación móvil multiplataforma que permita publicar, explorar y comprar libros mediante un flujo simulado, con persistencia y control de acceso.

**Alcance final previsto:** registro y login; Marketplace y búsqueda; publicación y fotografías propias; carrito; checkout con pago simulado; historial de compras y ventas; direcciones; perfil; modo claro/oscuro; notificaciones. **No se procesan pagos reales.**

## 2. Tecnologías y responsabilidades

| Elemento | Responsabilidad |
|---|---|
| React Native + Expo | Aplicación cliente Android/iOS y vista de prueba web |
| React Navigation | Navegación y pantallas protegidas por sesión |
| Supabase Auth | Registro, login y persistencia de sesión |
| Supabase Data REST API (PostgREST) | Endpoints CRUD expuestos desde PostgreSQL |
| Supabase PostgreSQL | Persistencia de publicaciones y perfiles |
| Row Level Security (RLS) | Autorizar acceso y modificaciones por propietario |
| Supabase Storage | Fotos propias de ejemplares (integración posterior) |
| AsyncStorage | Persistencia de sesión en el dispositivo; preferencias en etapa posterior |
| Módulos Expo | Cámara, galería, ubicación y notificaciones (etapas posteriores) |

**No hay un backend Node adicional ni un archivo JSON usado como base de datos.** La app llama a la API REST alojada en Supabase mediante `fetch`, enviando el token de la sesión real.

## 3. Arquitectura

```text
                     USUARIO AUTENTICADO
                             │
                       React Native + Expo
                             │
             ┌───────────────┴────────────────┐
             │                                │
       Pantallas / Hooks                 Expo Modules
             │                        (funciones futuras)
             ▼
         Services
  authService / publicacionesService
             │
     Supabase Auth + JWT
             │
     Data REST API (PostgREST)
             │
         PostgreSQL
       ┌─────┴──────┐
       │            │
    usuarios    publicaciones
       └─────┬──────┘
             │
       Políticas RLS

En etapas posteriores: Storage, carrito, pedidos y AsyncStorage
para preferencias. No se añaden como funcionalidades terminadas.
```

### Regla de acceso

- Visitantes sin sesión: solo login y registro.
- Usuario autenticado: consulta publicaciones activas y las suyas.
- El mismo usuario puede actuar como comprador o vendedor.
- Solamente el vendedor puede modificar, retirar o eliminar sus propias publicaciones.
- La interfaz **y** PostgreSQL aplican esa restricción; no depende solo de ocultar botones.

## 4. Módulos planificados (se preserva la arquitectura original)

| Código | Módulo | Alcance |
|---|---|---|
| M01 | Autenticación | Registro, inicio, recuperación, sesión, cierre |
| M02 | Marketplace | Lista, búsqueda, filtros, detalle |
| M03 | Gestión de publicaciones | Crear, consultar, editar, retirar, fotos |
| M04 | Carrito | Agregar/quitar ejemplares y total |
| M05 | Checkout | Dirección y pago simulado |
| M06 | Compras y pedidos | Historial y estados |
| M07 | Ventas | Historial de ejemplares vendidos |
| M08 | Perfil | Datos personales y fotografía |
| M09 | Configuración/notificaciones | Preferencias y alertas locales |

### Funcionalidades de dispositivo previstas

- Cámara y galería para fotos **propias del ejemplar** (no Google Books).
- Expo Location para facilitar la selección de una dirección.
- Notificaciones locales; modo claro/oscuro.
- No son requisitos de entrega de **S08.s2** y no se declaran implementadas aquí.

## 5. Modelo conceptual de datos

```text
AUTH.USERS (Supabase Auth)
      │
      └── USUARIOS (id, auth_id, nombre, correo, foto_perfil)
               │
               ├── DIRECCIONES (planeado)
               ├── PUBLICACIONES ── IMAGENES_PUBLICACION (planeado)
               ├── CARRITO (planeado)
               └── PEDIDOS ── DETALLE_PEDIDO (planeado)
```

**Convención implementada en esta entrega:** `usuarios.id = usuarios.auth_id = auth.users.id`, evitando una búsqueda intermedia para obtener el propietario. `publicaciones.vendedor_id` referencia `usuarios.id`. Se conservan ambos campos del modelo original. Si el grupo ya tiene un modelo diferente en Supabase, debe reconciliarse **antes** de ejecutar la migración.

### Tabla `publicaciones`

| Campo | Descripción |
|---|---|
| id | Identificador |
| vendedor_id | Usuario propietario |
| titulo / autor | Datos del libro |
| categoria | Clasificación opcional |
| isbn | Opcional |
| estado_libro | Nuevo / Como nuevo / Bueno / Regular |
| precio | Precio positivo en soles |
| descripcion | Texto descriptivo |
| estado_publicacion | activa / vendida / retirada |
| fecha_publicacion | Fecha de creación |

**Retirar ≠ eliminar:** retirar es `PATCH estado_publicacion='retirada'` y preserva el registro. `DELETE` es eliminación física para demostrar el método solicitado en S08.s2; se restringe al propietario.

## 6. S08.s2 — Integración de API REST y CRUD

**Consigna:** integrar y consumir una API REST en el proyecto móvil existente para crear, leer, actualizar y eliminar información. Se implementa sobre **publicaciones de libros**, no como otro proyecto independiente.

**URL de la API generada por Supabase:**

```text
https://TU_PROYECTO.supabase.co/rest/v1/publicaciones
```

| Acción | Método HTTP | Pantalla |
|---|---|---|
| Listar publicaciones activas | GET | Marketplace → Explorar |
| Consultar propias o detalle | GET | Mis publicaciones / Detalle |
| Crear publicación propia | POST | Vender libro |
| Editar o retirar propia | PATCH | Detalle → Editar / Retirar |
| Eliminar propia (prueba) | DELETE | Detalle → Eliminar |

Se usa `fetch()` en `src/services/publicacionesService.js` con cabeceras `apikey` y `Authorization: Bearer <JWT de Supabase Auth>`. El backend real lo proporciona PostgREST; **`useState`, `useEffect`/`useFocusEffect`** gestionan estados y recarga de datos.

### Evidencia funcional mínima

1. Registrarse e iniciar sesión realmente con Supabase Auth.
2. GET: abrir Explorar (puede empezar vacío).
3. POST: crear un libro de prueba y comprobar que aparece.
4. PATCH: cambiar su precio; comprobar el nuevo valor tras volver.
5. DELETE: eliminar ese libro y comprobar que desaparece.
6. Cerrar sesión y volver a entrar: el resultado debe persistir.
7. Opcional: comprobar que otra cuenta no puede editarlo ni eliminarlo.

Las capturas deben obtenerse ejecutando **tu propia app**. No se incluyen capturas ficticias.

## 7. Seguridad y privacidad

- El archivo `.env` **no debe subirse a GitHub**; se incluye `.env.example`.
- Las variables `EXPO_PUBLIC_` se empaquetan en el cliente y **no son secretos**. Se usa solamente Project URL y **publishable key**.
- Nunca incluir `service_role`, secret key, contraseña de base de datos ni credenciales privadas en el código.
- RLS está habilitado en tablas expuestas; una sesión puede insertar/actualizar/eliminar solo publicaciones con `vendedor_id = auth.uid()`.
- Visitantes anónimos no reciben privilegios de lectura o escritura sobre estas tablas.
- Las contraseñas las gestiona Supabase Auth, no la tabla pública `usuarios`.
- La política de lectura muestra publicaciones activas y, adicionalmente, las del propio vendedor.
- Las fotografías y datos adicionales tendrán políticas independientes cuando se implementen.

## 8. Estructura real del proyecto

```text
Marketbook/
├── assets/                           # Conservar del repositorio original
├── src/
│   ├── components/                   # Evolución futura
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── marketplace/
│   │   │   ├── MarketplaceScreen.js
│   │   │   └── PublicationDetailScreen.js
│   │   └── publications/
│   │       └── CreatePublicationScreen.js
│   ├── services/
│   │   ├── supabase/
│   │   │   ├── client.js
│   │   │   └── authService.js
│   │   └── publicacionesService.js
│   └── utils/
│       └── dialogs.js
├── supabase/
│   └── migrations/
│       └── 20260928_s08_publicaciones.sql
├── App.js
├── index.js
├── app.json
├── package.json
├── package-lock.json                # Regenerar con npm install
├── .env.example                     # Se copia a .env
├── .gitignore
└── README.md
```

La versión distribuida para S08.s2 es un **paquete de integración**. Debe copiarse sobre una copia del repositorio original: así conserva `assets`, `App.js`, `index.js` y las carpetas originales no reemplazadas.

## 9. Instalación paso a paso

### Paso 1. Respaldar tu versión

Desde la carpeta del proyecto original, crea una copia antes de reemplazar archivos. También puedes usar otra rama en Git. **No mezclar** el antiguo parche `api/server.js`/`books.json`: pertenecía a un prototipo descartado.

### Paso 2. Integrar el ZIP nuevo

Descomprime **Marketbook_S08_Grupo5_Integracion_Supabase.zip** y copia **su contenido**, no la carpeta contenedora, sobre tu copia local de Marketbook. Acepta reemplazar `README.md`, `package.json`, `.gitignore` y las pantallas listadas. No borres los archivos originales que el parche no trae.

Si antes copiaste el prototipo antiguo, elimina exclusivamente estos componentes obsoletos de ese prototipo:

```text
api/
src/services/booksApi.js
README_S08.md
```

No elimines otras carpetas de tu proyecto que no sean las del prototipo antiguo.

### Paso 3. Crear proyecto Supabase y tabla

1. Entra a tu proyecto Supabase existente o crea uno **de pruebas**.
2. Si ya hay tablas `usuarios`/`publicaciones`, compara su esquema primero; **no ejecutes a ciegas** la migración sobre datos existentes.
3. En un proyecto vacío, abre SQL Editor.
4. Copia y ejecuta `supabase/migrations/20260928_s08_publicaciones.sql`.
5. Comprueba en Table Editor que aparecen `usuarios` y `publicaciones` con RLS habilitado.

El SQL crea el perfil al registrarse, las claves foráneas, validaciones y políticas de acceso. **No crea** todavía las tablas planificadas para carrito, pedidos o fotografías.

### Paso 4. Configurar variables

Copia `.env.example` y renómbralo `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICA
```

Obtén ambos valores de las opciones de conexión/API de tu propio proyecto Supabase. No incluyas una clave secreta.

### Paso 5. Instalar dependencias

En VS Code, terminal **dentro de la carpeta Marketbook**:

```bash
npm install
```

Esto actualiza `package-lock.json` según el `package.json` nuevo y reconstruye `node_modules`. Si Expo indica incompatibilidad de alguna dependencia nativa, ejecuta:

```bash
npx expo install --check
```

y aplica la versión sugerida para tu SDK antes de entregar.

### Paso 6. Ejecutar

```bash
npx expo start
```

- `w`: web en el navegador. Si falla la compilación web, revisar `react-dom` y `react-native-web`.
- `a`: Android Emulator, después de encenderlo desde Android Studio → Device Manager.
- También puedes abrir Expo Go desde un celular compatible.

La API es remota y utiliza HTTPS; **no hay que encender un servidor local**.

### Paso 7. Verificar registro y CRUD

- Registra una cuenta con correo y contraseña.
- Si Supabase tiene confirmación de correo activa, revisa la bandeja y confirma antes de iniciar sesión.
- Prueba GET → POST → PATCH → DELETE en las pantallas y toma capturas.
- Para verificar seguridad, prueba con otra cuenta autenticada.

## 10. Problemas frecuentes

| Problema | Revisión |
|---|---|
| Falta URL o clave pública | Configura `.env` y reinicia Metro |
| Login no entra | Verifica correo/contraseña y confirmación de email |
| Tabla no encontrada | Ejecuta migración en el proyecto indicado en `.env` |
| 401 / 403 / error RLS | Revisa sesión, permisos y políticas del SQL |
| Marketplace vacío | Es normal inicialmente: crea un libro con POST |
| POST no guarda | Comprueba que se creó el perfil `usuarios` del vendedor |
| Expo no abre en Android | Encender emulador y presionar `a`; verificar `adb devices` |
| Tras cambiar `.env` no se refleja | Detener Expo y reiniciar con `npx expo start --clear` |

## 11. Estado de implementación, separado del objetivo

| Parte | Versión base del repositorio | Paquete S08.s2 propuesto |
|---|---|---|
| Login | Simulado | Integrado con Supabase Auth |
| Registro | Validación local | Registro real y perfil automático |
| Marketplace | Tres libros fijos | GET de API REST |
| Crear publicación | Mensaje simulado | POST real |
| Editar, retirar, eliminar | Pendientes | PATCH / DELETE con RLS |
| Base de datos | Sin integración | Tablas PostgreSQL de S08 |
| Fotografías propias | Pendientes | Pendientes |
| Carrito, checkout, pedidos, ventas y perfil | Pendientes | Pendientes |

**Importante:** la columna «paquete S08.s2» representa el código de integración proporcionado, no una prueba de que ya funcione contra tu instancia particular. Requiere ejecutar SQL, configurar tu `.env` y hacer pruebas reales. El repositorio público original no ha sido modificado automáticamente.

## 12. Ruta de desarrollo por etapas

- **Etapa 1 (semanas 1–5):** componentes, formularios, estado y navegación.
- **Etapa 2 (semanas 6–10):** hooks, API REST, CRUD, persistencia, temas. **S08.s2 pertenece aquí.**
- **Etapa 3 (semanas 11–15):** fotos propias, cámara/galería, ubicación, permisos y notificaciones.
- **Etapa 4 (semanas 16–18):** integración, pruebas, optimización, builds y proyecto final.

El sílabo ubica API/fetch en la semana 8 y AsyncStorage en la semana 9. No se debe presentar el alcance futuro como entregado hoy.

## 13. Grupo y referencias

**Grupo 5.** Líder de grupo según la consigna: Piero Alessandro Ramírez Salazar. Integrantes: completar con los nombres confirmados por el grupo.

- Repositorio original: https://github.com/wyzetevio/Marketbook
- Supabase API: https://supabase.com/docs/guides/api
- Supabase React Native Auth: https://supabase.com/docs/guides/auth/quickstarts/react-native
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Expo + Supabase: https://docs.expo.dev/guides/using-supabase/

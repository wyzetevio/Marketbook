# 📚 Marketplace de Libros

> **Compra. Vende. Encuentra tu próxima lectura.**

Aplicación móvil multiplataforma para la **compra y venta simulada de libros físicos nuevos y usados entre usuarios**.

**React Native** · **Expo** · **Supabase** · **PostgreSQL**

---

## 📌 Descripción

**Marketplace de Libros** es una aplicación móvil multiplataforma desarrollada con **React Native y Expo** que permite a usuarios registrados comprar y vender libros físicos nuevos o usados desde una misma cuenta.

Para acceder a las funcionalidades de la aplicación, el usuario deberá obligatoriamente **registrarse o iniciar sesión**.

Una vez autenticado, cualquier usuario podrá actuar tanto como **comprador** como **vendedor**, sin necesidad de crear diferentes tipos de cuenta.

Cuando un usuario desea vender un libro, podrá crear su propia publicación ingresando:

- Título.
- Autor.
- Categoría.
- ISBN opcional.
- Estado del libro.
- Precio.
- Descripción.
- Fotografías propias del ejemplar.

Las fotografías podrán ser tomadas utilizando la cámara del dispositivo o seleccionadas desde la galería.

Los usuarios interesados en comprar podrán explorar las publicaciones disponibles, buscar libros, aplicar filtros, consultar el detalle de una publicación, agregar productos al carrito y completar un proceso de compra mediante un **pago simulado**.

La aplicación utilizará **Supabase** como Backend as a Service para autenticación, base de datos y almacenamiento de fotografías.

---

## ❗ Problema

La compra y venta de libros usados suele realizarse mediante redes sociales, grupos de mensajería o plataformas generales de comercio electrónico.

Estos medios no están orientados específicamente a libros y pueden dificultar actividades como:

- Encontrar publicaciones de libros específicos.
- Comparar precios.
- Identificar el estado físico de un ejemplar.
- Organizar publicaciones propias.
- Gestionar libros que se desean vender.
- Mantener un registro de compras y ventas.

Por ello, se propone desarrollar una aplicación móvil especializada en la **compra y venta de libros físicos entre usuarios**, permitiendo centralizar estas operaciones dentro de una única plataforma.

---

## 🎯 Objetivo general

Desarrollar una aplicación móvil multiplataforma que permita a usuarios registrados **comprar y vender libros físicos nuevos o usados**, centralizando la creación de publicaciones, búsqueda de productos, carrito, compra simulada y gestión de compras y ventas.

### Objetivos específicos

- 🔐 Implementar el registro e inicio de sesión de usuarios.
- 🏠 Implementar un marketplace de publicaciones de libros.
- 🔎 Permitir buscar libros por título o autor.
- 🎛️ Implementar filtros para facilitar la búsqueda.
- 📝 Permitir que cualquier usuario publique libros para vender.
- 📷 Permitir agregar fotografías propias a las publicaciones.
- ✏️ Permitir modificar publicaciones propias.
- 🗑️ Permitir retirar publicaciones.
- 🛒 Implementar un carrito de compras.
- 💳 Implementar un proceso de checkout con pago simulado.
- 📍 Facilitar el registro de direcciones mediante geolocalización.
- 📦 Permitir consultar las compras realizadas.
- 💰 Permitir consultar las ventas realizadas.
- 👤 Permitir gestionar el perfil del usuario.
- 🔔 Incorporar notificaciones locales.
- 🌙 Incorporar modo claro y modo oscuro.
- ☁️ Mantener información persistente mediante Supabase.

---

## 👤 Actor del sistema

### Usuario

La aplicación utiliza un **único tipo de usuario**. Para acceder al Marketplace, el usuario deberá encontrarse autenticado. El mismo usuario podrá realizar operaciones de compra y venta desde una única cuenta.

#### 🔐 Cuenta

- Registrarse.
- Iniciar sesión.
- Recuperar su contraseña.
- Mantener su sesión iniciada.
- Cerrar sesión.

#### 🛒 Como comprador

- Explorar publicaciones.
- Buscar libros.
- Aplicar filtros.
- Consultar detalles de publicaciones.
- Agregar publicaciones al carrito.
- Eliminar publicaciones del carrito.
- Registrar o seleccionar una dirección.
- Realizar una compra simulada.
- Consultar sus compras.
- Consultar el estado de sus pedidos.

#### 📝 Como vendedor

- Crear publicaciones.
- Registrar información del libro.
- Subir fotografías propias.
- Editar publicaciones propias.
- Retirar publicaciones.
- Consultar sus publicaciones.
- Consultar las ventas realizadas.

#### 👤 Cuenta y configuración

- Consultar su perfil.
- Modificar información personal.
- Actualizar su fotografía.
- Cambiar entre modo claro y oscuro.

---

## 🔒 Regla de acceso

Las funcionalidades principales de la aplicación requieren autenticación.

```text
ABRIR APLICACIÓN
       │
       ▼
¿TIENE UNA CUENTA?
   │           │
   NO          SÍ
   │           │
   ▼           ▼
REGISTRO     LOGIN
   │           │
   └─────┬─────┘
         ▼
 USUARIO AUTENTICADO
         │
         ▼
    MARKETPLACE
```

> No existirá acceso al Marketplace como usuario invitado.

---

## 🧩 Módulos del sistema

| Código | Módulo |
|---|---|
| M01 | Autenticación |
| M02 | Marketplace |
| M03 | Gestión de publicaciones |
| M04 | Carrito |
| M05 | Checkout |
| M06 | Compras y pedidos |
| M07 | Ventas |
| M08 | Perfil |
| M09 | Configuración y notificaciones |

---

## 🔐 M01 — Autenticación

El módulo permitirá gestionar el acceso a la aplicación:

- Registro de usuario.
- Inicio de sesión.
- Recuperación de contraseña.
- Persistencia de sesión.
- Cierre de sesión.

La autenticación será gestionada mediante **Supabase Auth**.

---

## 🏠 M02 — Marketplace

El Marketplace será la pantalla principal después de iniciar sesión y mostrará las publicaciones activas realizadas por los usuarios.

Cada publicación podrá mostrar:

- Fotografía principal.
- Título.
- Autor.
- Precio.
- Estado del ejemplar.
- Nombre del vendedor.

Desde el Marketplace se podrá acceder al detalle completo de una publicación.

### 🔎 Búsqueda y filtros

Los usuarios podrán buscar por **título** o **autor** y aplicar filtros por:

- Categoría.
- Estado del libro.
- Precio mínimo.
- Precio máximo.

Estados iniciales del libro:

- Nuevo.
- Como nuevo.
- Bueno.
- Regular.

### 📖 Detalle de publicación

La pantalla de detalle podrá mostrar:

- Fotografías.
- Título.
- Autor.
- Categoría.
- ISBN, si fue registrado.
- Estado del ejemplar.
- Precio.
- Descripción.
- Nombre del vendedor.
- Fecha de publicación.

Desde esta pantalla se podrá agregar la publicación al carrito.

---

## 📝 M03 — Gestión de publicaciones

Cualquier usuario autenticado podrá publicar un libro para vender.

### Crear publicación

El formulario podrá solicitar:

- Título.
- Autor.
- Categoría.
- ISBN opcional.
- Estado del libro.
- Precio.
- Descripción.
- Fotografías.

Cada publicación representa un **ejemplar físico específico** que pertenece al usuario vendedor.

### 📷 Fotografías de publicaciones

El usuario podrá:

- Tomar fotografías utilizando la cámara.
- Seleccionar fotografías desde la galería.
- Visualizar las imágenes antes de publicar.
- Eliminar una imagen seleccionada.

Las fotografías serán almacenadas utilizando **Supabase Storage**.

### 📚 Mis publicaciones

El usuario podrá:

- Visualizar sus publicaciones.
- Editar información.
- Modificar el precio.
- Modificar la descripción.
- Cambiar fotografías.
- Retirar una publicación.
- Consultar su estado.

Estados de publicación:

- **Activa**
- **Vendida**
- **Retirada**

---

## 🛒 M04 — Carrito

El carrito permitirá almacenar temporalmente las publicaciones que un usuario desea comprar.

El usuario podrá:

- Agregar una publicación.
- Eliminar una publicación.
- Consultar productos seleccionados.
- Consultar precios.
- Consultar el total.
- Continuar al checkout.

Cada publicación corresponde a un ejemplar específico, por lo que su disponibilidad deberá comprobarse antes de confirmar la operación.

---

## 💳 M05 — Checkout

```text
CARRITO
   │
   ▼
REVISAR PRODUCTOS
   │
   ▼
SELECCIONAR DIRECCIÓN
   │
   ▼
SELECCIONAR MÉTODO
DE PAGO SIMULADO
   │
   ▼
REVISAR RESUMEN
   │
   ▼
CONFIRMAR COMPRA
   │
   ▼
CREAR PEDIDO
```

### Pago simulado

La aplicación no procesará dinero real. No se almacenarán números reales de tarjetas, CVV, credenciales bancarias ni información financiera sensible.

### 📍 Direcciones y geolocalización

Durante el checkout el usuario podrá seleccionar o registrar una dirección. La aplicación podrá utilizar **Expo Location** para facilitar el registro de dicha información.

---

## 📦 M06 — Compras y pedidos

Cada pedido podrá mostrar:

- Código o número de pedido.
- Libro adquirido.
- Fotografía.
- Precio.
- Fecha.
- Estado del pedido.
- Dirección registrada.

Estados iniciales:

- Confirmado.
- En proceso.
- Completado.
- Cancelado.

---

## 💰 M07 — Ventas

La sección **Mis ventas** podrá mostrar:

- Libro vendido.
- Fotografía.
- Comprador.
- Precio.
- Fecha.
- Estado de la operación.

El usuario contará con secciones separadas para **Mis publicaciones**, **Mis compras** y **Mis ventas**.

---

## 👤 M08 — Perfil

El perfil podrá mostrar:

- Nombre.
- Correo electrónico.
- Fotografía de perfil.
- Direcciones.
- Mis publicaciones.
- Mis compras.
- Mis ventas.
- Configuración.
- Cerrar sesión.

La fotografía de perfil podrá actualizarse mediante cámara o galería y almacenarse usando **Supabase Storage**.

---

## ⚙️ M09 — Configuración y notificaciones

### 🌙 Tema visual

- ☀️ Modo claro.
- 🌙 Modo oscuro.

La preferencia podrá almacenarse localmente utilizando **AsyncStorage**.

### 🔔 Notificaciones

Se utilizarán notificaciones locales para informar sobre acciones como:

- Compra confirmada.
- Publicación creada correctamente.
- Cambios importantes asociados a un pedido.

---

## 🏗️ Arquitectura

```text
                        ┌──────────────────┐
                        │     USUARIO      │
                        └────────┬─────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │   React Native   │
                        │      + Expo      │
                        └────────┬─────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
            ▼                    ▼                    ▼
    ┌──────────────┐     ┌──────────────┐     ┌─────────────────┐
    │   Supabase   │     │ AsyncStorage │     │  Expo Modules   │
    │ Auth         │     │ Tema         │     │ Camera          │
    │ PostgreSQL   │     │ Preferencias │     │ ImagePicker     │
    │ Storage      │     │              │     │ Location        │
    └──────┬───────┘     └──────────────┘     │ Notifications   │
           │                                  └─────────────────┘
           ▼
    ┌──────────────────────┐
    │ Datos persistentes   │
    │ Usuarios             │
    │ Publicaciones        │
    │ Imágenes             │
    │ Direcciones          │
    │ Carrito              │
    │ Pedidos              │
    │ Detalles de pedidos  │
    └──────────────────────┘
```

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| ⚛️ **React Native** | Desarrollo de la aplicación móvil |
| ⚡ **Expo** | Entorno de desarrollo y ejecución |
| ☁️ **Supabase** | Backend as a Service |
| 🐘 **PostgreSQL** | Base de datos |
| 🔐 **Supabase Auth** | Autenticación |
| 🗄️ **Supabase Storage** | Almacenamiento de fotografías |
| 💾 **AsyncStorage** | Preferencias locales |
| 📷 **Expo Camera** | Captura de fotografías |
| 🖼️ **Expo ImagePicker** | Selección de imágenes |
| 📍 **Expo Location** | Geolocalización |
| 🔔 **Expo Notifications** | Notificaciones locales |
| 🧭 **React Navigation** | Navegación |

---

## 🗃️ Modelo conceptual de datos

```text
                     USUARIO
                        │
        ┌───────────────┼─────────────────┐
        │               │                 │
        ▼               ▼                 ▼
   DIRECCION       PUBLICACION         PEDIDO
                       │                  │
                       ▼                  ▼
            IMAGEN_PUBLICACION     DETALLE_PEDIDO

                     USUARIO
                        │
                        ▼
                     CARRITO
                        │
                        ▼
                  PUBLICACION
```

### 👤 Usuarios

```text
usuarios
├── id
├── nombre
├── correo
├── foto_perfil
└── auth_id
```

### 📍 Direcciones

```text
direcciones
├── id
├── usuario_id
├── direccion
├── ciudad
├── latitud
└── longitud
```

### 📝 Publicaciones

```text
publicaciones
├── id
├── vendedor_id
├── titulo
├── autor
├── categoria
├── isbn
├── estado_libro
├── precio
├── descripcion
├── estado_publicacion
└── fecha_publicacion
```

El campo `isbn` será opcional.

### 🖼️ Imágenes de publicación

```text
imagenes_publicacion
├── id
├── publicacion_id
├── url_imagen
└── orden
```

### 🛒 Carrito

```text
carrito
├── id
├── usuario_id
├── publicacion_id
└── fecha_agregado
```

### 📦 Pedidos

```text
pedidos
├── id
├── comprador_id
├── direccion_id
├── fecha
├── estado
└── total
```

### 📄 Detalle de pedido

```text
detalle_pedido
├── id
├── pedido_id
├── publicacion_id
└── precio
```

---

## 📱 Flujo general

```text
                         ABRIR APP
                             │
                             ▼
                     REGISTRO / LOGIN
                             │
                             ▼
                    USUARIO AUTENTICADO
                             │
                             ▼
                        MARKETPLACE
                             │
             ┌───────────────┴───────────────┐
             │                               │
             ▼                               ▼
          COMPRAR                          VENDER
             │                               │
             ▼                               ▼
      Buscar / Filtrar                Crear publicación
             │                               │
             ▼                        Subir fotografías
      Ver publicación                       │
             │                               ▼
             ▼                            Publicar
          Carrito                            │
             │                               ▼
             ▼                       Mis publicaciones
          Checkout                           │
             │                               ▼
             ▼                           Mis ventas
          Pedido
             │
             ▼
        Mis compras
```

---

## 📂 Requerimientos funcionales

### 🔐 Autenticación

| ID | Requerimiento |
|---|---|
| RF01 | El sistema permitirá registrar un nuevo usuario. |
| RF02 | El sistema permitirá iniciar sesión mediante correo electrónico y contraseña. |
| RF03 | El sistema permitirá recuperar la contraseña. |
| RF04 | El sistema mantendrá la sesión del usuario autenticado. |
| RF05 | El sistema permitirá cerrar sesión. |

### 🏠 Marketplace

| ID | Requerimiento |
|---|---|
| RF06 | El sistema permitirá visualizar publicaciones activas. |
| RF07 | El sistema permitirá buscar publicaciones por título. |
| RF08 | El sistema permitirá buscar publicaciones por autor. |
| RF09 | El sistema permitirá aplicar filtros a las publicaciones. |
| RF10 | El sistema permitirá consultar el detalle de una publicación. |

### 📝 Publicaciones

| ID | Requerimiento |
|---|---|
| RF11 | El usuario podrá crear una publicación para vender un libro. |
| RF12 | El usuario podrá registrar la información del libro. |
| RF13 | El usuario podrá agregar fotografías propias a una publicación. |
| RF14 | El usuario podrá utilizar la cámara para tomar fotografías del libro. |
| RF15 | El usuario podrá seleccionar imágenes desde la galería. |
| RF16 | El usuario podrá editar una publicación propia. |
| RF17 | El usuario podrá retirar una publicación propia. |
| RF18 | El usuario podrá consultar sus publicaciones. |

### 🛒 Carrito

| ID | Requerimiento |
|---|---|
| RF19 | El usuario podrá agregar una publicación al carrito. |
| RF20 | El usuario podrá eliminar una publicación del carrito. |
| RF21 | El usuario podrá consultar el contenido y total del carrito. |

### 💳 Checkout

| ID | Requerimiento |
|---|---|
| RF22 | El usuario podrá registrar una dirección de entrega. |
| RF23 | El usuario podrá seleccionar una dirección registrada. |
| RF24 | El usuario podrá utilizar geolocalización para facilitar el registro de la dirección. |
| RF25 | El usuario podrá seleccionar un método de pago simulado. |
| RF26 | El usuario podrá revisar el resumen de la compra. |
| RF27 | El usuario podrá confirmar una compra. |

### 📦 Compras

| ID | Requerimiento |
|---|---|
| RF28 | El usuario podrá consultar sus compras realizadas. |
| RF29 | El usuario podrá consultar el detalle de un pedido. |
| RF30 | El usuario podrá consultar el estado de un pedido. |

### 💰 Ventas

| ID | Requerimiento |
|---|---|
| RF31 | El usuario podrá consultar las ventas de sus publicaciones. |
| RF32 | El usuario podrá consultar el detalle de una venta. |

### 👤 Perfil

| ID | Requerimiento |
|---|---|
| RF33 | El usuario podrá consultar su perfil. |
| RF34 | El usuario podrá modificar sus datos personales. |
| RF35 | El usuario podrá actualizar su fotografía de perfil. |

### ⚙️ Configuración

| ID | Requerimiento |
|---|---|
| RF36 | El usuario podrá alternar entre modo claro y oscuro. |
| RF37 | El sistema almacenará localmente la preferencia del tema. |
| RF38 | El sistema podrá generar notificaciones locales relacionadas con acciones importantes. |

---

## 📋 Requerimientos no funcionales

| ID | Requerimiento |
|---|---|
| RNF01 | **Usabilidad:** la aplicación deberá presentar una interfaz sencilla, clara, consistente e intuitiva. |
| RNF02 | **Rendimiento:** las pantallas principales deberán cargar en un máximo aproximado de 3 segundos bajo condiciones normales de funcionamiento y conexión. |
| RNF03 | **Compatibilidad:** la aplicación deberá ser compatible con dispositivos Android e iOS soportados por Expo. |
| RNF04 | **Seguridad:** las credenciales serán gestionadas mediante Supabase Auth y no se almacenarán contraseñas directamente en la aplicación. |
| RNF05 | **Persistencia:** los datos principales deberán mantenerse mediante Supabase PostgreSQL. |
| RNF06 | **Almacenamiento:** las fotografías deberán almacenarse utilizando Supabase Storage. |
| RNF07 | **Mantenibilidad:** la aplicación deberá utilizar componentes reutilizables y una estructura modular. |
| RNF08 | **Escalabilidad:** la arquitectura deberá permitir incorporar nuevas funcionalidades en futuras versiones. |
| RNF09 | **Privacidad:** la aplicación deberá solicitar permisos antes de acceder a cámara, galería o ubicación. |

---

## 📱 Pantallas previstas

### 🔐 Autenticación

- Inicio de sesión.
- Registro.
- Recuperación de contraseña.

### 🏠 Marketplace

- Inicio / Marketplace.
- Búsqueda.
- Filtros.
- Detalle de publicación.

### 📝 Venta

- Crear publicación.
- Agregar fotografías.
- Mis publicaciones.
- Editar publicación.
- Mis ventas.
- Detalle de venta.

### 🛒 Compra

- Carrito.
- Dirección.
- Checkout.
- Confirmación de compra.
- Mis compras.
- Detalle del pedido.

### 👤 Usuario

- Perfil.
- Editar perfil.
- Configuración.
- Notificaciones.

---

## 🧪 Pruebas previstas

- Autenticación y validación de formularios.
- Inicio de sesión y recuperación de contraseña.
- Visualización, búsqueda y filtros del Marketplace.
- Creación, edición y retiro de publicaciones.
- Uso de cámara y galería.
- Gestión del carrito.
- Registro de dirección y checkout simulado.
- Consulta de compras, pedidos y ventas.
- Actualización de perfil y cambio de tema.

---

## 🎯 Alcance

### ✅ Incluido

- Registro e inicio de sesión obligatorios.
- Recuperación de contraseña.
- Marketplace de libros físicos.
- Compra y venta entre usuarios.
- Un único tipo de cuenta.
- Publicaciones creadas por usuarios.
- Fotografías propias de los ejemplares.
- Cámara y galería.
- Búsqueda y filtros.
- Detalle de publicaciones.
- Carrito.
- Checkout.
- Pago simulado.
- Direcciones y geolocalización.
- Pedidos.
- Historial de compras y ventas.
- Perfil.
- Notificaciones locales.
- Modo claro y oscuro.
- Persistencia mediante Supabase.

### 🚫 Fuera del alcance

- Google Books API.
- Catálogos externos de libros.
- Sistema de favoritos.
- Libros digitales.
- Pagos reales y datos bancarios reales.
- Billetera virtual y comisiones.
- Chat comprador-vendedor.
- Subastas y ofertas.
- Sistema de reputación y valoraciones.
- Seguimiento logístico real.
- Integración con empresas de transporte.
- Panel administrativo complejo.
- Backend propio desarrollado desde cero.

---

## 📈 Posibles mejoras futuras

- Chat entre comprador y vendedor.
- Calificaciones, reputación y reseñas.
- Ofertas entre usuarios.
- Promociones.
- Panel administrativo.
- Estadísticas de ventas.
- Recomendaciones de libros.
- Procesamiento de pagos reales.
- Seguimiento avanzado de envíos.

> Estas funcionalidades no forman parte del alcance actual.

---

## 👨‍💻 Estructura sugerida del proyecto

```text
marketplace-libros/
│
├── assets/
│   ├── images/
│   └── icons/
│
├── components/
│   ├── PublicationCard/
│   ├── SearchBar/
│   ├── FilterButton/
│   ├── Input/
│   └── Button/
│
├── screens/
│   ├── Auth/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   └── ForgotPasswordScreen.js
│   ├── Marketplace/
│   │   ├── HomeScreen.js
│   │   ├── SearchScreen.js
│   │   └── PublicationDetailScreen.js
│   ├── Publications/
│   │   ├── CreatePublicationScreen.js
│   │   ├── MyPublicationsScreen.js
│   │   └── EditPublicationScreen.js
│   ├── Cart/
│   │   └── CartScreen.js
│   ├── Checkout/
│   │   ├── AddressScreen.js
│   │   ├── CheckoutScreen.js
│   │   └── PurchaseConfirmationScreen.js
│   ├── Purchases/
│   │   ├── PurchasesScreen.js
│   │   └── OrderDetailScreen.js
│   ├── Sales/
│   │   ├── SalesScreen.js
│   │   └── SaleDetailScreen.js
│   ├── Profile/
│   │   ├── ProfileScreen.js
│   │   └── EditProfileScreen.js
│   └── Settings/
│       └── SettingsScreen.js
│
├── navigation/
├── services/
│   └── supabase/
├── hooks/
├── utils/
├── App.js
├── index.js
├── app.json
├── package.json
├── .env
└── README.md
```

> Esta estructura es una propuesta inicial y podrá ajustarse conforme avance el desarrollo.

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

### 2. Entrar al proyecto

```bash
cd MarketplaceLibros
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crear un archivo `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica
```

> ⚠️ No se deberán almacenar contraseñas, claves privadas o información sensible dentro del repositorio.

### 5. Ejecutar la aplicación

```bash
npx expo start
```

Para utilizar un emulador Android:

1. Abrir **Android Studio**.
2. Abrir **Device Manager**.
3. Encender el dispositivo virtual.
4. Esperar hasta que Android termine de iniciar.
5. Ejecutar `npx expo start`.
6. Presionar `a`.

---

## 🔐 Supabase

### Supabase Auth

- Registro.
- Inicio de sesión.
- Gestión de credenciales.
- Persistencia de sesión.

### Supabase PostgreSQL

- Usuarios.
- Direcciones.
- Publicaciones.
- Imágenes asociadas.
- Carrito.
- Pedidos.
- Detalles de pedidos.

### Supabase Storage

- Fotografías de publicaciones.
- Fotografías de perfil.

---

## 🔒 Seguridad

- La aplicación utilizará **Supabase Auth** para la autenticación.
- No se almacenarán directamente las contraseñas de los usuarios dentro de las tablas de la aplicación.
- Las variables de configuración deberán mantenerse mediante variables de entorno.
- El archivo `.env` no deberá exponer claves privadas.

---

## 📄 Estado actual del proyecto

> 🟡 **EN DESARROLLO**

Actualmente se ha implementado un primer formulario funcional de registro utilizando React Native.

La implementación incorpora:

- `useState`.
- `TextInput`.
- `TouchableOpacity`.
- `Button`.
- Manejo de eventos.
- Validaciones de formulario.

Las demás funcionalidades se implementarán progresivamente conforme avance el curso.

---

## 🗺️ Desarrollo progresivo

### Etapa 1 — Fundamentos

- Interfaces básicas.
- Formularios.
- Eventos.
- Estados.
- Validaciones.
- Navegación.

### Etapa 2 — Datos

- Hooks.
- Persistencia de información.
- Supabase.
- Marketplace.
- Publicaciones.
- Carrito.
- Tema visual.

### Etapa 3 — Funciones del dispositivo

- Cámara.
- Galería.
- Geolocalización.
- Permisos.
- Notificaciones.

### Etapa 4 — Integración y entrega

- Integración.
- Pruebas.
- Optimización.
- Generación del APK.
- Presentación final.

---

## 👥 Equipo

**Proyecto:** Marketplace de Libros  
**Curso:** Desarrollo de Aplicaciones Móviles  
**Código:** 100000ST91  
**Grupo:** 5  
**Año:** 2026

### Integrantes

- 👨‍💻 Integrante 1
- 👨‍💻 Integrante 2
- 👨‍💻 Integrante 3
- 👨‍💻 Integrante 4

### Docente

**Mg. Miguel Angel Huerta Rojas**

---

<div align="center">

## 📚 Marketplace de Libros

**Compra. Vende. Encuentra tu próxima lectura.**

Proyecto académico desarrollado para el curso de **Desarrollo de Aplicaciones Móviles**.

© 2026 · Grupo 5

</div>

# 📚 Marketplace de Libros

<p align="center">
  <strong>Aplicación móvil multiplataforma para la búsqueda, comparación y compra de libros físicos y digitales.</strong>
</p>

<p align="center">
  📱 React Native · ⚡ Expo · 🗄️ Supabase · 🐘 PostgreSQL · 📖 Google Books API
</p>

---

## 📌 Descripción

**Marketplace de Libros** es una aplicación móvil multiplataforma desarrollada con **React Native y Expo**, cuyo objetivo es centralizar en una sola plataforma la búsqueda, visualización, comparación y compra de libros físicos y digitales.

La aplicación permite a los usuarios explorar un catálogo de libros obtenido mediante la **Google Books API**, consultar información detallada de cada producto, administrar favoritos, agregar libros a un carrito de compras y realizar un proceso de checkout con un método de pago simulado.

La información de usuarios, pedidos, direcciones y favoritos se almacena en la nube utilizando **Supabase**, mientras que determinadas funcionalidades del dispositivo, como la cámara y la geolocalización, son utilizadas directamente desde la aplicación móvil.

---

## 🎯 Objetivo del proyecto

Desarrollar una aplicación móvil multiplataforma que permita a los usuarios **buscar, comparar y comprar libros físicos y digitales**, centralizando el catálogo, el proceso de compra y el seguimiento de pedidos en una única plataforma.

### Objetivos específicos

* 🔎 Implementar un catálogo con buscador, categorías y filtros.
* 📖 Mostrar información detallada de cada libro.
* 🛒 Implementar un carrito de compras persistente.
* 💳 Desarrollar un flujo de checkout con pago simulado.
* 📦 Permitir consultar el estado e historial de pedidos.
* ❤️ Implementar un sistema de libros favoritos.
* 📍 Utilizar geolocalización para facilitar el registro de direcciones.
* 📷 Permitir actualizar la foto de perfil utilizando la cámara del dispositivo.
* ☁️ Mantener la información persistente mediante una base de datos en la nube.
* 🌙 Incorporar modo claro y modo oscuro.

---

# ✨ Características principales

## 🔐 Autenticación

* Registro de nuevos usuarios.
* Inicio de sesión.
* Gestión de credenciales mediante Supabase Auth.
* Persistencia de sesión.

## 📚 Catálogo de libros

* Catálogo obtenido desde **Google Books API**.
* Búsqueda por título.
* Búsqueda por autor.
* Categorías.
* Filtros por formato.
* Información detallada de cada libro.

## 🔍 Detalle del libro

Cada producto puede mostrar información relevante para la decisión de compra:

* Título.
* Autor.
* Categoría.
* Precio.
* Calificación.
* Formato.
* Descripción.

## 🛒 Carrito de compras

* Agregar libros.
* Eliminar libros.
* Modificar cantidades.
* Mantener el carrito de forma persistente.
* Revisar el resumen antes de confirmar el pedido.

## ❤️ Favoritos

Los usuarios pueden:

* Agregar libros a favoritos.
* Eliminar libros de favoritos.
* Consultar sus libros guardados.

## 📦 Pedidos

El sistema permite:

* Registrar una dirección de entrega.
* Revisar el resumen del pedido.
* Seleccionar un método de pago simulado.
* Confirmar la compra.
* Consultar el estado del pedido.
* Consultar el historial de pedidos.

## 📍 Geolocalización

La aplicación utiliza el GPS del dispositivo para facilitar el ingreso de la dirección de entrega mediante funcionalidades de geolocalización.

## 📷 Cámara

El usuario puede actualizar su foto de perfil utilizando la cámara o selector de imágenes del dispositivo.

## 🔔 Notificaciones

Después de confirmar un pedido, la aplicación genera una **notificación local** para informar al usuario sobre la confirmación.

## 🌙 Tema visual

La aplicación incorpora:

* ☀️ Modo claro.
* 🌙 Modo oscuro.

La preferencia del tema se mantiene utilizando almacenamiento local.

---

# 🏗️ Arquitectura

La aplicación utiliza una arquitectura **cliente-servidor**, donde el cliente móvil desarrollado con React Native y Expo se comunica con diferentes servicios externos.

```text
                         ┌──────────────────────┐
                         │       USUARIO        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Native      │
                         │       + Expo        │
                         └──────────┬───────────┘
                                    │
                   ┌────────────────┼─────────────────┐
                   │                │                 │
                   ▼                ▼                 ▼
          ┌────────────────┐ ┌───────────────┐ ┌────────────────┐
          │    Supabase    │ │ Google Books  │ │ Expo Modules   │
          │                │ │      API      │ │                │
          │ • Auth         │ │               │ │ • Camera       │
          │ • PostgreSQL   │ │ • Catálogo    │ │ • Location     │
          │ • Storage      │ │   de libros   │ │ • Notifications│
          └────────────────┘ └───────────────┘ └────────────────┘
                   │
                   ▼
          ┌────────────────────┐
          │ Información        │
          │ persistente        │
          │ de usuarios,       │
          │ pedidos y favoritos│
          └────────────────────┘
```

La arquitectura y las tecnologías utilizadas se encuentran definidas en la documentación del proyecto.

---

# 🛠️ Tecnologías utilizadas

| Tecnología                       | Uso                                      |
| -------------------------------- | ---------------------------------------- |
| ⚛️ **React Native**              | Desarrollo de la aplicación móvil        |
| ⚡ **Expo**                       | Entorno y herramientas para React Native |
| ☁️ **Supabase**                  | Backend como servicio                    |
| 🐘 **PostgreSQL**                | Base de datos                            |
| 🔐 **Supabase Auth**             | Autenticación de usuarios                |
| 🗄️ **Supabase Storage**         | Almacenamiento de archivos               |
| 📖 **Google Books API**          | Obtención del catálogo de libros         |
| 💾 **AsyncStorage**              | Persistencia local                       |
| 📷 **Expo Camera / ImagePicker** | Gestión de fotografías                   |
| 📍 **Expo Location**             | Geolocalización                          |
| 🔔 **Expo Notifications**        | Notificaciones locales                   |
| 🧭 **React Navigation**          | Navegación entre pantallas               |

Estas tecnologías corresponden a la arquitectura tecnológica definida para el proyecto.

---

# 🗃️ Modelo de datos

La base de datos se implementa mediante **Supabase PostgreSQL**.

Las principales entidades son:

```text
USUARIOS
   │
   ├──────────────► DIRECCIONES
   │
   ├──────────────► PEDIDOS
   │                    │
   │                    ▼
   │              DETALLE_PEDIDO
   │                    │
   │                    ▼
   ├──────────────► LIBROS ◄────────────── FAVORITOS
   │                    ▲
   │                    │
   └──────────────► CARRITO
```

### Entidades principales

#### 👤 Usuarios

```text
usuarios
├── id
├── nombre
├── correo
└── auth_id
```

#### 📍 Direcciones

```text
direcciones
├── id
├── usuario_id
├── direccion
└── ciudad
```

#### 📚 Libros

```text
libros
├── id
├── titulo
├── autor
├── categoria
└── precio
```

#### 🛒 Carrito

```text
carrito
├── id
├── usuario_id
├── libro_id
└── cantidad
```

#### ❤️ Favoritos

```text
favoritos
├── id
├── usuario_id
└── libro_id
```

#### 📦 Pedidos

```text
pedidos
├── id
├── usuario_id
├── direccion_id
├── fecha
├── estado
└── total
```

#### 📄 Detalle del pedido

```text
detalle_pedido
├── id
├── pedido_id
├── libro_id
├── cantidad
└── precio_unitario
```

El modelo conceptual documentado contempla usuarios, direcciones, libros, carrito, favoritos, pedidos y detalle de pedidos.

---

# 📱 Funcionalidades de la aplicación

El flujo principal de la aplicación puede representarse de la siguiente manera:

```text
                    ┌──────────────┐
                    │   Inicio     │
                    └──────┬───────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Registro/Login  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Marketplace   │
                  └────────┬────────┘
                           │
             ┌─────────────┼──────────────┐
             │             │              │
             ▼             ▼              ▼
        📚 Catálogo    ❤️ Favoritos    👤 Perfil
             │                            │
             ▼                            ▼
        🔎 Buscar                    📦 Pedidos
             │
             ▼
       📖 Detalle del libro
             │
             ▼
        🛒 Agregar al carrito
             │
             ▼
          💳 Checkout
             │
             ▼
       📦 Confirmar pedido
             │
             ▼
       🔔 Notificación
```

---

# 📂 Funcionalidades previstas

Actualmente, el diseño funcional contempla los siguientes requerimientos:

| ID   | Funcionalidad                   |
| ---- | ------------------------------- |
| RF01 | Registro de usuarios            |
| RF02 | Inicio de sesión                |
| RF03 | Catálogo de libros              |
| RF04 | Búsqueda por título o autor     |
| RF05 | Filtros por categoría y formato |
| RF06 | Detalle del libro               |
| RF07 | Carrito de compras              |
| RF08 | Libros favoritos                |
| RF09 | Dirección mediante GPS          |
| RF10 | Checkout y pago simulado        |
| RF11 | Notificación local              |
| RF12 | Historial de pedidos            |
| RF13 | Actualización de foto de perfil |
| RF14 | Modo claro / oscuro             |

Estos requerimientos forman parte de la especificación funcional del proyecto.

---

# 📋 Requerimientos no funcionales

El proyecto contempla los siguientes requisitos:

* **Usabilidad:** interfaz sencilla e intuitiva.
* **Rendimiento:** las pantallas principales deben cargar en un máximo de 3 segundos bajo condiciones normales de red.
* **Disponibilidad:** información persistente en Supabase.
* **Compatibilidad:** dispositivos Android e iOS mediante Expo.
* **Seguridad:** gestión de credenciales mediante Supabase Auth.
* **Escalabilidad:** posibilidad de incorporar nuevas categorías, libros y funcionalidades.
* **Mantenibilidad:** utilización de componentes y módulos reutilizables.

---

# 🚀 Instalación

> ⚠️ Los comandos exactos de instalación y los scripts disponibles dependen de la estructura final del proyecto y de su `package.json`.

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

### 2. Entrar al proyecto

```bash
cd <NOMBRE_DEL_PROYECTO>
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crear el archivo:

```text
.env
```

y agregar las credenciales correspondientes a los servicios utilizados por el proyecto.

Por ejemplo:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_de_supabase
```

> 🔒 **Importante:** nunca subir claves privadas, contraseñas o credenciales sensibles al repositorio.

### 5. Ejecutar la aplicación

Si el proyecto utiliza Expo:

```bash
npx expo start
```

Desde Expo se puede ejecutar la aplicación en un dispositivo físico o emulador compatible.

---

# 🔐 Configuración de Supabase

La aplicación utiliza Supabase como **Backend as a Service (BaaS)** para:

* Autenticación.
* Base de datos PostgreSQL.
* Persistencia de usuarios.
* Pedidos.
* Direcciones.
* Favoritos.
* Almacenamiento de archivos.

La documentación del proyecto especifica Supabase como backend y PostgreSQL como sistema de base de datos.

---

# 📖 Google Books API

El catálogo de libros se obtiene mediante la **Google Books API**.

Su utilización permite consultar información de libros y utilizarla dentro del marketplace para facilitar:

```text
Google Books API
       │
       ▼
   Catálogo
       │
       ├── Título
       ├── Autor
       ├── Categoría
       ├── Descripción
       ├── Formato
       └── Información adicional
```

La integración con Google Books API forma parte del alcance definido para el proyecto.

---

# 📱 Pantallas principales

El proyecto contempla las siguientes interfaces:

* 🚀 Onboarding.
* 🔐 Inicio de sesión.
* 📝 Registro.
* 🔑 Recuperación de contraseña.
* 🏠 Inicio / Marketplace.
* 📚 Categorías.
* 🛒 Carrito.
* 💳 Pago / Checkout.
* 📦 Estado de orden.
* 🔔 Notificaciones.
* 👤 Perfil.
* ❤️ Favoritos.
* 📜 Historial de pedidos.

Estas pantallas corresponden a los prototipos de interfaz incluidos en la documentación del proyecto.

---

# 🧪 Pruebas

El proyecto contempla pruebas funcionales sobre los principales flujos de la aplicación:

### 🔐 Autenticación

* Registro.
* Inicio de sesión.
* Gestión de sesión.

### 🔎 Catálogo

* Búsqueda.
* Filtros.
* Visualización de detalles.

### 🛒 Compra

* Agregar productos.
* Eliminar productos.
* Checkout.
* Confirmación del pedido.

### 👤 Perfil

* Actualización de fotografía.
* Gestión de favoritos.
* Consulta de historial.

La documentación indica que los casos de prueba y sus evidencias deben incorporarse conforme avance el desarrollo.

---

# 🎯 Alcance

## ✅ Incluido

* Registro e inicio de sesión.
* Catálogo de libros.
* Búsqueda y filtros.
* Detalle de productos.
* Carrito persistente.
* Checkout.
* Pago simulado.
* Confirmación de pedidos.
* Notificaciones locales.
* Historial de pedidos.
* Favoritos.
* Cámara.
* Geolocalización.
* Modo claro y oscuro.

## 🚧 Trabajo futuro

Las siguientes funcionalidades quedan fuera del alcance actual:

* 💳 Procesamiento real de pagos.
* 🏪 Panel completo para vendedores/proveedores.
* 🔔 Notificaciones push mediante servicios externos.
* 🖥️ Desarrollo de un backend completamente desde cero.

El documento especifica que Supabase se utiliza como backend como servicio en lugar de desarrollar un backend propio desde cero.

---

# 📈 Posibles mejoras futuras

Entre las posibles ampliaciones del proyecto se podrían considerar:

* 💳 Integración con una pasarela de pagos real.
* 🏪 Sistema de vendedores.
* ⭐ Sistema de reseñas y valoraciones.
* 📊 Panel administrativo.
* 📦 Seguimiento avanzado de envíos.
* 🔔 Notificaciones push.
* 🎁 Sistema de promociones y descuentos.
* 🔎 Búsqueda avanzada.
* 📚 Recomendaciones personalizadas.
* 📈 Estadísticas de ventas.

> Estas funcionalidades son propuestas de evolución y no forman parte del alcance actual documentado.

---

# 👨‍💻 Estructura sugerida del proyecto

La documentación indica que la organización del código se completará conforme avance el desarrollo.

Una estructura organizada podría seguir un esquema como:

```text
marketplace-libros/
│
├── 📁 assets/
│   ├── images/
│   └── icons/
│
├── 📁 components/
│   ├── BookCard/
│   ├── SearchBar/
│   └── ...
│
├── 📁 screens/
│   ├── Login/
│   ├── Register/
│   ├── Home/
│   ├── BookDetail/
│   ├── Cart/
│   ├── Checkout/
│   ├── Orders/
│   └── Profile/
│
├── 📁 services/
│   ├── supabase/
│   └── googleBooks/
│
├── 📁 navigation/
│
├── 📁 hooks/
│
├── 📁 utils/
│
├── 📄 App.js
├── 📄 package.json
├── 📄 app.json
├── 📄 .env
└── 📄 README.md
```

> Esta estructura es una **propuesta de organización** para el código y debe ajustarse a la estructura real del repositorio.

---

# 👥 Equipo

**Proyecto:** Marketplace de Libros
**Curso:** Desarrollo de Aplicaciones Móviles (100000ST91)
**Grupo:** 5
**Año:** 2026

### Integrantes

* 👨‍💻 Integrante 1
* 👨‍💻 Integrante 2
* 👨‍💻 Integrante 3
* 👨‍💻 Integrante 4

> Reemplazar los nombres anteriores por los integrantes reales del grupo.

### Docente

**Mg. Miguel Angel Huerta Rojas**

---

# 📚 Referencias

El proyecto utiliza como referencia documentación y recursos relacionados con:

* React Native.
* Expo.
* Supabase.
* PostgreSQL.
* Google Books API.
* Desarrollo de aplicaciones móviles.

La documentación académica también incluye referencias bibliográficas de David Robledo Fernández sobre desarrollo de aplicaciones Android.

---

# 📄 Estado del proyecto

```text
🟡 EN DESARROLLO
```

El proyecto se encuentra en proceso de implementación. Algunas secciones técnicas, pruebas, conclusiones y recomendaciones deberán completarse conforme avance el desarrollo.

---

# ⭐ Tecnologías

<p align="center">

<img src="https://img.shields.io/badge/React%20Native-2026-blue?logo=react" />
<img src="https://img.shields.io/badge/Expo-Framework-black?logo=expo" />
<img src="https://img.shields.io/badge/Supabase-Backend-green?logo=supabase" />
<img src="https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql" />
<img src="https://img.shields.io/badge/Google%20Books-API-red?logo=google" />

</p>

---

<p align="center">

### 📚 Marketplace de Libros

<strong>Busca. Compara. Compra.</strong>

Desarrollado como proyecto académico para el curso de <strong>Desarrollo de Aplicaciones Móviles</strong>.

</p>

<p align="center">
  © 2026 · Grupo 5
</p>

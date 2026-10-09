import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  usePublicacion,
  usePublicacionesActions,
  useCarrito,
} from "../../hooks";

import { Header, Badge } from "../../components";

import { useAppTheme, useEstilos } from "../../theme";

import { confirmAction, showMessage } from "../../utils/dialogs";

import { formatearPrecio } from "../../utils/formato";

export default function PublicationDetailScreen({ navigation, route }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);

  const id = route.params?.publicacionId ?? route.params?.id;

  const { libro, esPropia, cargando, error, refrescar } = usePublicacion(id);

  const { actualizar, retirar, eliminar } = usePublicacionesActions();

  const { agregar, estaEnCarrito } = useCarrito();

  const [procesando, setProcesando] = useState(false);

  const estado = libro?.estado_publicacion;
  const estaActiva = estado === "activa";
  const estaVendida = estado === "vendida";
  const estaRetirada = estado === "retirada";

  const puedeModificar = esPropia && !estaVendida;

  const puedeAgregar =
    !!libro && estaActiva && !esPropia && !estaEnCarrito(libro.id);

  const volver = () => navigation.goBack();

  // AGREGAR AL CARRITO
  const agregarCarrito = async () => {
    if (!puedeAgregar || procesando) return;

    setProcesando(true);

    try {
      await agregar(libro);

      showMessage(
        "Libro agregado",
        "El libro se agregó correctamente a tu carrito.",
      );
    } catch (e) {
      showMessage("No se pudo agregar", e.message || "Ocurrió un error.");
    } finally {
      setProcesando(false);
    }
  };

  // EDITAR PUBLICACIÓN
  const editarPublicacion = () => {
    if (!puedeModificar || procesando) return;

    navigation.navigate("EditarLibro", {
      publicacionId: libro.id,
    });
  };

  // RETIRAR PUBLICACIÓN
  const retirarPublicacion = () => {
    if (!esPropia || !estaActiva || procesando) return;

    confirmAction(
      "Retirar publicación",
      "El libro dejará de aparecer en Explorar, pero seguirá en Mis libros.",
      async () => {
        setProcesando(true);

        try {
          await retirar(libro.id);

          showMessage(
            "Publicación retirada",
            "El libro se retiró correctamente.",
          );

          navigation.goBack();
        } catch (e) {
          showMessage("No se pudo retirar", e.message || "Ocurrió un error.");
        } finally {
          setProcesando(false);
        }
      },
    );
  };

  // VOLVER A PUBLICAR UN LIBRO RETIRADO
  const volverAPublicar = () => {
    if (!esPropia || !estaRetirada || procesando) return;

    confirmAction(
      "Volver a publicar",
      `¿Deseas volver a publicar "${libro.titulo}"? El libro aparecerá nuevamente en Explorar.`,
      async () => {
        setProcesando(true);

        try {
          await actualizar(libro.id, {
            estado_publicacion: "activa",
          });

          // Recuperar el estado actualizado desde el backend.
          await refrescar();

          showMessage(
            "Publicación reactivada",
            "Tu libro vuelve a estar disponible en Explorar.",
          );
        } catch (e) {
          showMessage(
            "No se pudo reactivar",
            e.message || "Ocurrió un error inesperado.",
          );
        } finally {
          setProcesando(false);
        }
      },
    );
  };

  // ELIMINAR PUBLICACIÓN
  const eliminarPublicacion = () => {
    if (!puedeModificar || procesando) return;

    confirmAction(
      "Eliminar publicación",
      `¿Deseas eliminar definitivamente "${libro.titulo}"? Esta acción no se puede deshacer.`,
      async () => {
        setProcesando(true);

        try {
          await eliminar(libro.id);

          showMessage(
            "Publicación eliminada",
            "El libro se eliminó correctamente.",
          );

          navigation.goBack();
        } catch (e) {
          showMessage("No se pudo eliminar", e.message || "Ocurrió un error.");
        } finally {
          setProcesando(false);
        }
      },
    );
  };

  // ESTADO DE CARGA
  if (cargando && !libro) {
    return (
      <View style={styles.contenedor}>
        <Header titulo="Detalle" onAtras={volver} />

        <View style={styles.centro}>
          <ActivityIndicator size="large" color={t.colors.acento} />
          <Text style={styles.textoSecundario}>
            Cargando información del libro...
          </Text>
        </View>
      </View>
    );
  }

  // ESTADO DE ERROR
  if (error || !libro) {
    return (
      <View style={styles.contenedor}>
        <Header titulo="Detalle" onAtras={volver} />

        <View style={styles.centro}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={t.colors.textoTenue}
          />

          <Text style={styles.textoSecundario}>
            {error ? String(error) : "No se encontró la publicación."}
          </Text>

          <Pressable style={styles.botonPrincipal} onPress={refrescar}>
            <Text style={styles.textoBotonPrincipal}>Reintentar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Header titulo="Detalle" onAtras={volver} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        {/* PORTADA PROVISIONAL */}
        <View style={styles.portadaContenedor}>
          <View style={styles.portada}>
            <Ionicons name="book" size={70} color={t.colors.textoTenue} />

            <Text style={styles.portadaTitulo} numberOfLines={3}>
              {libro.titulo}
            </Text>
          </View>
        </View>

        {/* INFORMACIÓN PRINCIPAL */}
        <Text style={styles.titulo}>{libro.titulo}</Text>

        <View style={styles.autorFila}>
          <Ionicons
            name="person-circle-outline"
            size={20}
            color={t.colors.textoTenue}
          />

          <Text style={styles.autor}>{libro.autor}</Text>
        </View>

        {/* CATEGORÍA Y CONDICIÓN */}
        <View style={styles.badges}>
          {libro.categoria ? (
            <Badge texto={libro.categoria} tono="neutro" />
          ) : null}

          {libro.estado_libro ? (
            <Badge
              texto={libro.estado_libro}
              tono={libro.estado_libro === "Regular" ? "aviso" : "acento"}
            />
          ) : null}

          {esPropia ? (
            <Badge
              texto={
                estaActiva ? "Activa" : estaVendida ? "Vendida" : "Retirada"
              }
              tono={estaActiva ? "exito" : estaVendida ? "acento" : "neutro"}
            />
          ) : null}
        </View>

        {/* ISBN */}
        <Text style={styles.meta}>ISBN: {libro.isbn || "No especificado"}</Text>

        {/* PRECIO */}
        <Text style={styles.precio}>{formatearPrecio(libro.precio)}</Text>

        <View style={styles.divisor} />

        {/* VENDEDOR */}
        <Text style={styles.subtitulo}>Vendedor</Text>

        <View style={styles.vendedorFila}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color={t.colors.textoTenue} />
          </View>

          <View style={styles.vendedorInfo}>
            <Text style={styles.vendedorNombre}>
              {libro.vendedor_nombre || "Vendedor"}
            </Text>

            <Text style={styles.meta}>Publicado por el vendedor</Text>
          </View>
        </View>

        <View style={styles.divisor} />

        {/* DESCRIPCIÓN */}
        <Text style={styles.subtitulo}>Descripción</Text>

        <Text style={styles.descripcion}>
          {libro.descripcion || "Sin descripción disponible."}
        </Text>

        {/* MENSAJES SEGÚN ESTADO */}
        {estaVendida && (
          <View style={styles.aviso}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={t.colors.textoSecundario}
            />
            <Text style={styles.avisoTexto}>Este libro ya fue vendido.</Text>
          </View>
        )}

        {estaRetirada && (
          <View style={styles.aviso}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={t.colors.textoSecundario}
            />
            <Text style={styles.avisoTexto}>
              Esta publicación fue retirada.
            </Text>
          </View>
        )}

        {/* ACCIONES DEL COMPRADOR */}
        {!esPropia && estaActiva && (
          <Pressable
            style={[
              styles.botonPrincipal,
              (!puedeAgregar || procesando) && styles.botonDeshabilitado,
            ]}
            disabled={!puedeAgregar || procesando}
            onPress={agregarCarrito}
          >
            {procesando ? (
              <ActivityIndicator color={t.colors.textoSobrePrimario} />
            ) : (
              <Text style={styles.textoBotonPrincipal}>
                {estaEnCarrito(libro.id)
                  ? "Ya está en tu carrito"
                  : "Agregar al carrito"}
              </Text>
            )}
          </Pressable>
        )}

        {/* ACCIONES DEL PROPIETARIO */}
        {esPropia && !estaVendida && (
          <View style={styles.acciones}>
            <Pressable
              style={styles.botonPrincipal}
              disabled={procesando}
              onPress={editarPublicacion}
            >
              <Text style={styles.textoBotonPrincipal}>Editar publicación</Text>
            </Pressable>

            {/* VOLVER A PUBLICAR */}
            {estaRetirada && (
              <Pressable
                style={[
                  styles.botonReactivar,
                  procesando && styles.botonDeshabilitado,
                ]}
                disabled={procesando}
                onPress={volverAPublicar}
                accessibilityRole="button"
                accessibilityLabel="Volver a publicar este libro"
              >
                {procesando ? (
                  <ActivityIndicator color={t.colors.textoSobrePrimario} />
                ) : (
                  <>
                    <Ionicons
                      name="refresh-circle-outline"
                      size={21}
                      color={t.colors.textoSobrePrimario}
                    />
                    <Text style={styles.textoBotonPrincipal}>
                      Volver a publicar
                    </Text>
                  </>
                )}
              </Pressable>
            )}

            {estaActiva && (
              <Pressable
                style={styles.botonSecundario}
                disabled={procesando}
                onPress={retirarPublicacion}
              >
                <Text style={styles.textoBotonSecundario}>
                  Retirar publicación
                </Text>
              </Pressable>
            )}

            <Pressable
              style={styles.botonPeligro}
              disabled={procesando}
              onPress={eliminarPublicacion}
            >
              <Text style={styles.textoPeligro}>Eliminar publicación</Text>
            </Pressable>
          </View>
        )}

        {esPropia && estaVendida && (
          <Text style={styles.nota}>
            Las publicaciones vendidas no pueden editarse ni eliminarse.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const crearEstilos = (t) => ({
  contenedor: {
    flex: 1,
    backgroundColor: t.colors.fondo,
  },

  scroll: {
    flex: 1,
  },

  contenido: {
    paddingHorizontal: t.spacing.lg,
    paddingBottom: t.spacing.xl,
  },

  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: t.spacing.lg,
    gap: t.spacing.md,
  },

  portadaContenedor: {
    alignItems: "center",
    paddingVertical: t.spacing.lg,
  },

  portada: {
    width: 185,
    height: 265,
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.superficieAlt,
    alignItems: "center",
    justifyContent: "center",
    padding: t.spacing.md,
    gap: t.spacing.md,
  },

  portadaTitulo: {
    color: t.colors.textoSecundario,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 13,
  },

  titulo: {
    ...t.typography.titulo,
    color: t.colors.texto,
    marginTop: t.spacing.md,
  },

  autorFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.sm,
    marginTop: t.spacing.md,
  },

  autor: {
    color: t.colors.textoSecundario,
    fontSize: 13,
  },

  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: t.spacing.sm,
    marginTop: t.spacing.md,
  },

  meta: {
    ...t.typography.pequeno,
    color: t.colors.textoTenue,
    marginTop: t.spacing.sm,
  },

  precio: {
    ...t.typography.precio,
    fontSize: 25,
    color: t.colors.acento,
    marginTop: t.spacing.md,
  },

  divisor: {
    height: 1,
    backgroundColor: t.colors.borde,
    marginVertical: t.spacing.lg,
  },

  subtitulo: {
    ...t.typography.encabezado,
    color: t.colors.texto,
    marginBottom: t.spacing.md,
  },

  vendedorFila: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.md,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: t.colors.superficieAlt,
    alignItems: "center",
    justifyContent: "center",
  },

  vendedorInfo: {
    flex: 1,
  },

  vendedorNombre: {
    fontWeight: "700",
    color: t.colors.texto,
  },

  descripcion: {
    fontSize: 13,
    lineHeight: 21,
    color: t.colors.textoSecundario,
  },

  aviso: {
    flexDirection: "row",
    alignItems: "center",
    gap: t.spacing.sm,
    backgroundColor: t.colors.superficieAlt,
    borderRadius: t.radius.md,
    padding: t.spacing.md,
    marginTop: t.spacing.lg,
  },

  avisoTexto: {
    flex: 1,
    color: t.colors.textoSecundario,
    fontSize: 13,
  },

  acciones: {
    gap: t.spacing.md,
    marginTop: t.spacing.xl,
  },

  botonPrincipal: {
    backgroundColor: t.colors.primario,
    borderRadius: t.radius.pill,
    padding: t.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: t.spacing.xl,
    minHeight: 48,
  },

  textoBotonPrincipal: {
    color: t.colors.textoSobrePrimario,
    fontWeight: "700",
    fontSize: 14,
  },

  botonDeshabilitado: {
    opacity: 0.5,
  },

  botonSecundario: {
    borderWidth: 1,
    borderColor: t.colors.borde,
    borderRadius: t.radius.pill,
    padding: t.spacing.md,
    alignItems: "center",
  },

  textoBotonSecundario: {
    color: t.colors.texto,
    fontWeight: "700",
  },

  botonPeligro: {
    borderWidth: 1,
    borderColor: t.colors.peligro || t.colors.texto,
    borderRadius: t.radius.pill,
    padding: t.spacing.md,
    alignItems: "center",
  },

  textoPeligro: {
    color: t.colors.peligro || t.colors.texto,
    fontWeight: "700",
  },

  nota: {
    marginTop: t.spacing.xl,
    color: t.colors.textoSecundario,
    textAlign: "center",
  },

  textoSecundario: {
    color: t.colors.textoSecundario,
    textAlign: "center",
  },

  botonReactivar: {
    backgroundColor: t.colors.primario,
    borderRadius: t.radius.pill,
    padding: t.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: t.spacing.sm,
    minHeight: 48,
  },
});

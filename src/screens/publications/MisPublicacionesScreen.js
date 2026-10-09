import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { usePublicaciones, usePublicacionesActions } from "../../hooks";

import { Header, BookCard } from "../../components";

import { useAppTheme, useEstilos } from "../../theme";

import { confirmAction, showMessage } from "../../utils/dialogs";

// Estados de publicación disponibles
const FILTROS = [
  { id: "activa", texto: "Activas" },
  { id: "vendida", texto: "Vendidas" },
  { id: "retirada", texto: "Retiradas" },
];

function FiltroEstado({ filtro, seleccionado, onPress, styles }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: seleccionado }}
      style={[styles.filtro, seleccionado && styles.filtroActivo]}
    >
      <Text
        style={[styles.filtroTexto, seleccionado && styles.filtroTextoActivo]}
      >
        {filtro.texto}
      </Text>
    </Pressable>
  );
}

export default function MisPublicacionesScreen({ navigation }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);

  const [filtro, setFiltro] = useState("activa");
  const [procesandoId, setProcesandoId] = useState(null);

  // Hook del backend: incluye todas las publicaciones propias
  const { publicaciones, cargando, error, refrescar } = usePublicaciones({
    modo: "mias",
  });

  const { retirar, eliminar } = usePublicacionesActions();

  // Filtrar las publicaciones localmente por estado
  const libros = useMemo(() => {
    return (publicaciones || []).filter(
      (item) => item.estado_publicacion === filtro,
    );
  }, [publicaciones, filtro]);

  const abrirDetalle = (libro) => {
    navigation.navigate("DetalleLibro", {
      publicacionId: libro.id,
    });
  };

  const publicar = () => {
    navigation.navigate("CreatePublication");
  };

  const editar = (libro) => {
    if (libro.estado_publicacion === "vendida") return;

    navigation.navigate("EditarLibro", {
      publicacionId: libro.id,
    });
  };

  const retirarLibro = (libro) => {
    if (libro.estado_publicacion !== "activa" || procesandoId !== null) return;

    confirmAction(
      "Retirar publicación",
      `¿Deseas retirar "${libro.titulo}" de Explorar?`,
      async () => {
        setProcesandoId(libro.id);

        try {
          await retirar(libro.id);
          await refrescar();

          showMessage(
            "Publicación retirada",
            "El libro ya no aparecerá en Explorar.",
          );
        } catch (e) {
          showMessage("No se pudo retirar", e.message || "Ocurrió un error.");
        } finally {
          setProcesandoId(null);
        }
      },
    );
  };

  const eliminarLibro = (libro) => {
    if (libro.estado_publicacion === "vendida" || procesandoId !== null) return;

    confirmAction(
      "Eliminar publicación",
      `¿Deseas eliminar definitivamente "${libro.titulo}"?`,
      async () => {
        setProcesandoId(libro.id);

        try {
          await eliminar(libro.id);
          await refrescar();

          showMessage(
            "Publicación eliminada",
            "El libro se eliminó correctamente.",
          );
        } catch (e) {
          showMessage("No se pudo eliminar", e.message || "Ocurrió un error.");
        } finally {
          setProcesandoId(null);
        }
      },
    );
  };

  // Menú sencillo de acciones de cada libro
  const accionesLibro = (libro) => {
    if (procesandoId !== null) return;

    const estado = libro.estado_publicacion;

    if (estado === "vendida") {
      showMessage(
        "Libro vendido",
        "Esta publicación forma parte del historial de ventas y no puede modificarse ni eliminarse.",
      );
      return;
    }

    // El detalle permite editar, retirar o eliminar.
    abrirDetalle(libro);
  };

  const renderLibro = ({ item }) => (
    <BookCard
      libro={item}
      mostrarEstado
      mostrarVendedor={false}
      onPress={() => abrirDetalle(item)}
      derecha={
        <Pressable
          onPress={() => accionesLibro(item)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={`Opciones de ${item.titulo}`}
          disabled={procesandoId !== null}
        >
          {procesandoId === item.id ? (
            <ActivityIndicator size="small" color={t.colors.acento} />
          ) : (
            <Ionicons
              name="ellipsis-horizontal"
              size={22}
              color={t.colors.textoSecundario}
            />
          )}
        </Pressable>
      }
    />
  );

  return (
    <View style={styles.contenedor}>
      <Header
        titulo="Mis Publicaciones"
        derecha={
          <Pressable
            onPress={publicar}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Publicar nuevo libro"
          >
            <Ionicons
              name="add-circle-outline"
              size={25}
              color={t.colors.texto}
            />
          </Pressable>
        }
      />

      {/* FILTROS */}
      <View style={styles.filtros}>
        {FILTROS.map((item) => (
          <FiltroEstado
            key={item.id}
            filtro={item}
            seleccionado={filtro === item.id}
            onPress={() => setFiltro(item.id)}
            styles={styles}
          />
        ))}
      </View>

      {/* ESTADO DE ERROR */}
      {error ? (
        <View style={styles.centro}>
          <Ionicons
            name="alert-circle-outline"
            size={44}
            color={t.colors.textoTenue}
          />

          <Text style={styles.mensaje}>{String(error)}</Text>

          <Pressable style={styles.botonPrincipal} onPress={refrescar}>
            <Text style={styles.textoBoton}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          style={styles.lista}
          data={libros}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderLibro}
          refreshing={cargando}
          onRefresh={refrescar}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listaContenido,
            libros.length === 0 && styles.listaVacia,
          ]}
          ListEmptyComponent={
            cargando ? (
              <View style={styles.centro}>
                <ActivityIndicator size="large" color={t.colors.acento} />
                <Text style={styles.mensaje}>Cargando publicaciones...</Text>
              </View>
            ) : (
              <View style={styles.centro}>
                <Ionicons
                  name="book-outline"
                  size={52}
                  color={t.colors.textoTenue}
                />

                <Text style={styles.tituloVacio}>
                  {filtro === "activa"
                    ? "No tienes publicaciones activas"
                    : filtro === "vendida"
                      ? "Todavía no tienes libros vendidos"
                      : "No tienes publicaciones retiradas"}
                </Text>

                <Text style={styles.mensaje}>
                  {filtro === "activa"
                    ? "Publica tu primer libro para comenzar a vender."
                    : "Aquí aparecerán tus publicaciones cuando cambien de estado."}
                </Text>

                {filtro === "activa" && (
                  <Pressable style={styles.botonPrincipal} onPress={publicar}>
                    <Text style={styles.textoBoton}>Publicar libro</Text>
                  </Pressable>
                )}
              </View>
            )
          }
          ListFooterComponent={
            libros.length > 0 && filtro === "activa" ? (
              <Pressable style={styles.botonNuevo} onPress={publicar}>
                <Ionicons name="add" size={19} color={t.colors.texto} />
                <Text style={styles.textoNuevo}>Publicar otro libro</Text>
              </Pressable>
            ) : null
          }
        />
      )}
    </View>
  );
}

const crearEstilos = (t) => ({
  contenedor: {
    flex: 1,
    backgroundColor: t.colors.fondo,
  },

  filtros: {
    flexDirection: "row",
    gap: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.md,
  },

  filtro: {
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.sm,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.superficieAlt,
    borderWidth: 1,
    borderColor: t.colors.borde,
  },

  filtroActivo: {
    backgroundColor: t.colors.primario,
    borderColor: t.colors.primario,
  },

  filtroTexto: {
    fontSize: 12,
    color: t.colors.texto,
  },

  filtroTextoActivo: {
    color: t.colors.textoSobrePrimario,
    fontWeight: "700",
  },

  lista: {
    flex: 1,
  },

  listaContenido: {
    paddingHorizontal: t.spacing.md,
    paddingBottom: t.spacing.xl,
  },

  listaVacia: {
    flexGrow: 1,
  },

  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: t.spacing.lg,
    gap: t.spacing.md,
  },

  tituloVacio: {
    fontSize: 16,
    fontWeight: "700",
    color: t.colors.texto,
    textAlign: "center",
  },

  mensaje: {
    color: t.colors.textoSecundario,
    fontSize: 13,
    textAlign: "center",
  },

  botonPrincipal: {
    backgroundColor: t.colors.primario,
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.md,
    borderRadius: t.radius.pill,
    minHeight: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  textoBoton: {
    color: t.colors.textoSobrePrimario,
    fontWeight: "700",
    fontSize: 13,
  },

  botonNuevo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: t.spacing.sm,
    padding: t.spacing.md,
    marginTop: t.spacing.md,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.superficieAlt,
  },

  textoNuevo: {
    color: t.colors.texto,
    fontWeight: "600",
    fontSize: 13,
  },
});

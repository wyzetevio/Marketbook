import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Keyboard,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { usePublicaciones, useCarrito } from "../../hooks";

import { Header, BookCard } from "../../components";

import { useAppTheme, useEstilos } from "../../theme";

import { showMessage } from "../../utils/dialogs";

// Condiciones disponibles
const CONDICIONES = ["Todos", "Nuevo", "Como nuevo", "Bueno", "Regular"];

// Componente independiente para filtros
function Chip({ texto, activo, onPress, styles }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      style={[styles.chip, activo && styles.chipActivo]}
    >
      <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
        {texto}
      </Text>
    </Pressable>
  );
}

export default function MarketplaceScreen({ navigation }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);

  // Estados de búsqueda y filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [condicion, setCondicion] = useState("Todos");

  // Evita pulsaciones repetidas al agregar
  const [agregandoId, setAgregandoId] = useState(null);

  // Hook del backend
  const { publicaciones, categorias, cargando, error, refrescar } =
    usePublicaciones({
      modo: "activas",
      busqueda,
      categoria,
    });

  // Hook del carrito
  const { agregar, estaEnCarrito } = useCarrito();

  // Filtrar por condición
  const libros = useMemo(() => {
    return (publicaciones || []).filter((libro) => {
      return condicion === "Todos" || libro.estado_libro === condicion;
    });
  }, [publicaciones, condicion]);

  // Abrir detalle del libro
  const abrirDetalle = (libro) => {
    Keyboard.dismiss();

    navigation.navigate("DetalleLibro", {
      publicacionId: libro.id,
    });
  };

  // Agregar libro al carrito
  const agregarCarrito = async (libro) => {
    if (agregandoId !== null || estaEnCarrito(libro.id)) {
      return;
    }

    setAgregandoId(libro.id);

    try {
      await agregar(libro);

      showMessage("Carrito", "Libro agregado correctamente.");
    } catch (e) {
      showMessage("No se pudo agregar", e.message || "Ocurrió un error.");
    } finally {
      setAgregandoId(null);
    }
  };

  // Renderizar tarjeta
  const renderLibro = ({ item }) => (
    <View style={styles.columna}>
      <BookCard
        variante="grid"
        libro={item}
        onPress={() => abrirDetalle(item)}
        onAgregar={() => agregarCarrito(item)}
        agregado={estaEnCarrito(item.id) || agregandoId === item.id}
      />
    </View>
  );

  return (
    <View style={styles.contenedor}>
      {/* ENCABEZADO */}
      <Header titulo="Marketplace" />

      {/* BUSCADOR - FUERA DEL FLATLIST */}
      <View style={styles.buscador}>
        <Ionicons name="search-outline" size={19} color={t.colors.textoTenue} />

        <TextInput
          style={styles.inputBuscar}
          placeholder="Buscar por título o autor..."
          placeholderTextColor={t.colors.textoTenue}
          value={busqueda}
          onChangeText={setBusqueda}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {busqueda.length > 0 && (
          <Pressable
            onPress={() => setBusqueda("")}
            hitSlop={8}
            accessibilityLabel="Limpiar búsqueda"
          >
            <Ionicons
              name="close-circle"
              size={19}
              color={t.colors.textoTenue}
            />
          </Pressable>
        )}
      </View>

      {/* FILTROS POR CATEGORÍA */}
      <ScrollView
        horizontal
        style={styles.scrollFiltros}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.filtros}
      >
        <Chip
          texto="Todos"
          activo={categoria === ""}
          onPress={() => setCategoria("")}
          styles={styles}
        />

        {(categorias || []).filter(Boolean).map((cat) => (
          <Chip
            key={cat}
            texto={cat}
            activo={categoria === cat}
            onPress={() => setCategoria(cat)}
            styles={styles}
          />
        ))}
      </ScrollView>

      {/* FILTROS POR CONDICIÓN */}
      <ScrollView
        horizontal
        style={styles.scrollFiltros}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.filtros}
      >
        {CONDICIONES.map((item) => (
          <Chip
            key={item}
            texto={item}
            activo={condicion === item}
            onPress={() => setCondicion(item)}
            styles={styles}
          />
        ))}
      </ScrollView>

      {/* BOTÓN PUBLICAR LIBRO */}
      <Pressable
        style={styles.botonPublicar}
        onPress={() => navigation.navigate("CreatePublication")}
      >
        <Ionicons
          name="add-circle-outline"
          size={20}
          color={t.colors.textoSobrePrimario}
        />
        <Text style={styles.textoPublicar}>Publicar libro</Text>
      </Pressable>

      {/* TÍTULO DE SECCIÓN */}
      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Libros disponibles</Text>

        <Text style={styles.contador}>
          {libros.length} {libros.length === 1 ? "libro" : "libros"}
        </Text>
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

          <Pressable style={styles.botonReintentar} onPress={refrescar}>
            <Text style={styles.textoReintentar}>Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        /* LISTADO DE LIBROS */
        <FlatList
          style={styles.flatList}
          data={libros}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.fila}
          contentContainerStyle={styles.lista}
          renderItem={renderLibro}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          refreshing={cargando}
          onRefresh={refrescar}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            cargando ? (
              <View style={styles.centroVacio}>
                <ActivityIndicator size="large" color={t.colors.acento} />
                <Text style={styles.mensaje}>Cargando publicaciones...</Text>
              </View>
            ) : (
              <View style={styles.centroVacio}>
                <Ionicons
                  name="book-outline"
                  size={44}
                  color={t.colors.textoTenue}
                />

                <Text style={styles.mensaje}>
                  No encontramos libros disponibles.
                </Text>

                <Text style={styles.subMensaje}>
                  Prueba con otra búsqueda o categoría.
                </Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

// ESTILOS ADAPTADOS AL TEMA DE CÉSAR
const crearEstilos = (t) => ({
  contenedor: {
    flex: 1,
    backgroundColor: t.colors.fondo,
  },

  buscador: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: t.colors.superficie,
    borderWidth: 1,
    borderColor: t.colors.borde,
    borderRadius: t.radius.pill,
    paddingHorizontal: t.spacing.md,
    marginHorizontal: t.spacing.md,
    marginBottom: t.spacing.md,
    height: 45,
  },

  inputBuscar: {
    flex: 1,
    marginLeft: t.spacing.sm,
    color: t.colors.texto,
    fontSize: 13,
    paddingVertical: 0,
  },

  scrollFiltros: {
    flexGrow: 0,
    marginBottom: t.spacing.sm,
  },

  filtros: {
    gap: t.spacing.sm,
    paddingHorizontal: t.spacing.md,
    paddingBottom: t.spacing.xs,
  },

  chip: {
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.sm,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.superficieAlt,
    borderWidth: 1,
    borderColor: t.colors.borde,
  },

  chipActivo: {
    backgroundColor: t.colors.primario,
    borderColor: t.colors.primario,
  },

  chipTexto: {
    fontSize: 11,
    color: t.colors.texto,
  },

  chipTextoActivo: {
    color: t.colors.textoSobrePrimario,
  },

  seccion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: t.spacing.md,
    marginTop: t.spacing.sm,
    marginBottom: t.spacing.md,
  },

  tituloSeccion: {
    ...t.typography.encabezado,
    color: t.colors.texto,
  },

  contador: {
    fontSize: 12,
    color: t.colors.acento,
  },

  flatList: {
    flex: 1,
  },

  lista: {
    paddingHorizontal: t.spacing.md,
    paddingBottom: t.spacing.xl,
    flexGrow: 1,
  },

  fila: {
    gap: t.spacing.md,
    justifyContent: "flex-start",
  },

  // Mantiene dos columnas incluso con un solo libro
  columna: {
    width: "48%",
  },

  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: t.spacing.lg,
    gap: t.spacing.md,
  },

  centroVacio: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: t.spacing.xl,
    paddingHorizontal: t.spacing.lg,
    gap: t.spacing.md,
  },

  mensaje: {
    color: t.colors.textoSecundario,
    textAlign: "center",
    fontSize: 14,
  },

  subMensaje: {
    color: t.colors.textoTenue,
    textAlign: "center",
    fontSize: 12,
  },

  botonReintentar: {
    backgroundColor: t.colors.primario,
    borderRadius: t.radius.pill,
    paddingHorizontal: t.spacing.lg,
    paddingVertical: t.spacing.md,
  },

  textoReintentar: {
    color: t.colors.textoSobrePrimario,
    fontWeight: "700",
  },

  botonPublicar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: t.spacing.sm,
    backgroundColor: t.colors.primario,
    borderRadius: t.radius.pill,
    paddingVertical: t.spacing.md,
    marginHorizontal: t.spacing.md,
    marginBottom: t.spacing.md,
  },

  textoPublicar: {
    color: t.colors.textoSobrePrimario,
    fontWeight: "700",
    fontSize: 13,
  },
});

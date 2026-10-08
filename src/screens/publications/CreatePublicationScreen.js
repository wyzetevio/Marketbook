import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  usePublicacion,
  usePublicacionesActions,
  usePublicaciones,
} from "../../hooks";

import { Header } from "../../components";
import { useAppTheme, useEstilos } from "../../theme";
import { showMessage } from "../../utils/dialogs";

const ESTADOS = ["Nuevo", "Como nuevo", "Bueno", "Regular"];

const CATEGORIAS_BASE = [
  "Ficción",
  "No ficción",
  "Infantil",
  "Académico",
  "Historia",
  "Ciencia",
  "Tecnología",
  "Otros",
];

function Campo({
  etiqueta,
  valor,
  onChange,
  placeholder,
  styles,
  t,
  obligatorio = false,
  multiline = false,
  keyboardType = "default",
  maxLength,
}) {
  return (
    <View style={styles.grupoCampo}>
      <Text style={styles.etiqueta}>
        {etiqueta}
        {obligatorio ? " *" : ""}
      </Text>

      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={t.colors.textoTenue}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

export default function CreatePublicationScreen({ navigation, route }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);

  const publicacionId = route.params?.publicacionId ?? route.params?.libro?.id;

  const editando = publicacionId != null;

  const {
    libro,
    esPropia,
    cargando: cargandoLibro,
    error: errorLibro,
    refrescar,
  } = usePublicacion(editando ? publicacionId : null);

  const { crear, actualizar } = usePublicacionesActions();

  const { categorias } = usePublicaciones({ modo: "activas" });

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [isbn, setIsbn] = useState("");
  const [precio, setPrecio] = useState("");
  const [estado, setEstado] = useState("Bueno");
  const [descripcion, setDescripcion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false);
  const [formularioInicializado, setFormularioInicializado] = useState(false);

  // Cargar los datos del libro al editar
  useEffect(() => {
    if (!editando || !libro || formularioInicializado) return;

    setTitulo(libro.titulo || "");
    setAutor(libro.autor || "");
    setCategoria(libro.categoria || "");
    setIsbn(libro.isbn || "");
    setPrecio(String(libro.precio ?? ""));
    setEstado(libro.estado_libro || "Bueno");
    setDescripcion(libro.descripcion || "");

    setFormularioInicializado(true);
  }, [editando, libro, formularioInicializado]);

  const listaCategorias = Array.from(
    new Set([
      ...CATEGORIAS_BASE,
      ...(categorias || []),
      ...(categoria ? [categoria] : []),
    ]),
  );

  const guardar = async () => {
    if (guardando) return;

    const tituloLimpio = titulo.trim();
    const autorLimpio = autor.trim();
    const categoriaLimpia = categoria.trim();
    const isbnLimpio = isbn.trim();
    const descripcionLimpia = descripcion.trim();

    const precioTexto = precio.trim().replace(",", ".");
    const valor = Number(precioTexto);

    if (!tituloLimpio) {
      return showMessage("Campo obligatorio", "Ingresa el título del libro.");
    }

    if (!autorLimpio) {
      return showMessage("Campo obligatorio", "Ingresa el autor del libro.");
    }

    if (!categoriaLimpia) {
      return showMessage("Campo obligatorio", "Selecciona una categoría.");
    }

    if (!precioTexto || !Number.isFinite(valor) || valor <= 0) {
      return showMessage(
        "Precio inválido",
        "Ingresa un precio válido mayor que cero.",
      );
    }

    if (!ESTADOS.includes(estado)) {
      return showMessage(
        "Condición inválida",
        "Selecciona la condición del libro.",
      );
    }

    if (editando && (!esPropia || libro?.estado_publicacion === "vendida")) {
      return showMessage(
        "Acción no permitida",
        "No puedes editar esta publicación.",
      );
    }

    const datos = {
      titulo: tituloLimpio,
      autor: autorLimpio,
      categoria: categoriaLimpia,
      isbn: isbnLimpio || null,
      precio: valor,
      estado_libro: estado,
      descripcion: descripcionLimpia,
    };

    try {
      setGuardando(true);

      if (editando) {
        await actualizar(publicacionId, datos);
      } else {
        await crear(datos);
      }

      showMessage(
        editando ? "Publicación actualizada" : "Libro publicado",
        editando
          ? "Los cambios se guardaron correctamente."
          : "Tu libro ya está publicado en Marketbook.",
        () => navigation.goBack(),
      );
    } catch (e) {
      showMessage(
        "No se pudo guardar",
        e.message || "Ocurrió un error inesperado.",
      );
    } finally {
      setGuardando(false);
    }
  };

  // Estado de carga para edición
  if (editando && cargandoLibro && !libro) {
    return (
      <View style={styles.contenedor}>
        <Header
          titulo="Editar Publicación"
          onAtras={() => navigation.goBack()}
        />
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={t.colors.acento} />
          <Text style={styles.textoSecundario}>Cargando publicación...</Text>
        </View>
      </View>
    );
  }

  if (editando && (errorLibro || !libro)) {
    return (
      <View style={styles.contenedor}>
        <Header
          titulo="Editar Publicación"
          onAtras={() => navigation.goBack()}
        />
        <View style={styles.centro}>
          <Text style={styles.textoSecundario}>
            {String(errorLibro || "No se encontró la publicación.")}
          </Text>
          <Pressable style={styles.boton} onPress={refrescar}>
            <Text style={styles.botonTexto}>Reintentar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (editando && (!esPropia || libro?.estado_publicacion === "vendida")) {
    return (
      <View style={styles.contenedor}>
        <Header
          titulo="Editar Publicación"
          onAtras={() => navigation.goBack()}
        />
        <View style={styles.centro}>
          <Ionicons
            name="lock-closed-outline"
            size={42}
            color={t.colors.textoTenue}
          />
          <Text style={styles.textoSecundario}>
            No tienes permiso para editar este libro.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Header
        titulo={editando ? "Editar Publicación" : "Vender Libro"}
        onAtras={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* FOTOGRAFÍAS */}
          <Text style={styles.etiquetaSeccion}>FOTOGRAFÍAS DEL EJEMPLAR</Text>

          <View style={styles.fotosFila}>
            <View style={styles.fotoPlaceholder}>
              <Ionicons
                name="camera-outline"
                size={24}
                color={t.colors.textoTenue}
              />
              <Text style={styles.fotoTexto}>Tomar foto</Text>
            </View>

            <View style={styles.fotoPlaceholder}>
              <Ionicons
                name="images-outline"
                size={24}
                color={t.colors.textoTenue}
              />
              <Text style={styles.fotoTexto}>Galería</Text>
            </View>

            <View style={styles.fotoPlaceholder}>
              <Ionicons name="add" size={24} color={t.colors.textoTenue} />
            </View>
          </View>

          <Text style={styles.nota}>
            Las fotografías estarán disponibles en una próxima actualización.
          </Text>

          {/* TÍTULO */}
          <Campo
            etiqueta="TÍTULO"
            valor={titulo}
            onChange={setTitulo}
            placeholder="Escribe el título del libro..."
            styles={styles}
            t={t}
            obligatorio
            maxLength={120}
          />

          {/* AUTOR */}
          <Campo
            etiqueta="AUTOR"
            valor={autor}
            onChange={setAutor}
            placeholder="Escribe el autor..."
            styles={styles}
            t={t}
            obligatorio
            maxLength={100}
          />

          {/* CATEGORÍA */}
          <View style={styles.grupoCampo}>
            <Text style={styles.etiqueta}>CATEGORÍA *</Text>

            <Pressable
              style={styles.selector}
              onPress={() => setCategoriasAbiertas(!categoriasAbiertas)}
            >
              <Text
                style={[
                  styles.selectorTexto,
                  !categoria && styles.placeholderTexto,
                ]}
              >
                {categoria || "Seleccionar categoría"}
              </Text>

              <Ionicons
                name={categoriasAbiertas ? "chevron-up" : "chevron-down"}
                size={18}
                color={t.colors.textoTenue}
              />
            </Pressable>

            {categoriasAbiertas && (
              <View style={styles.listaCategorias}>
                {listaCategorias.map((cat) => (
                  <Pressable
                    key={cat}
                    style={styles.opcionCategoria}
                    onPress={() => {
                      setCategoria(cat);
                      setCategoriasAbiertas(false);
                    }}
                  >
                    <Text style={styles.opcionTexto}>{cat}</Text>

                    {categoria === cat && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={t.colors.acento}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* ISBN */}
          <Campo
            etiqueta="ISBN (OPCIONAL)"
            valor={isbn}
            onChange={setIsbn}
            placeholder="978-XXXXXXXXXX"
            styles={styles}
            t={t}
            maxLength={20}
          />

          {/* CONDICIÓN */}
          <View style={styles.grupoCampo}>
            <Text style={styles.etiqueta}>CONDICIÓN</Text>

            <View style={styles.estadosFila}>
              {ESTADOS.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setEstado(item)}
                  style={[
                    styles.estadoChip,
                    estado === item && styles.estadoSeleccionado,
                  ]}
                >
                  <View
                    style={[
                      styles.radio,
                      estado === item && styles.radioSeleccionado,
                    ]}
                  />

                  <Text style={styles.estadoTexto}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* PRECIO */}
          <Campo
            etiqueta="PRECIO (S/)"
            valor={precio}
            onChange={setPrecio}
            placeholder="0.00"
            styles={styles}
            t={t}
            obligatorio
            keyboardType="decimal-pad"
            maxLength={12}
          />

          {/* DESCRIPCIÓN */}
          <Campo
            etiqueta="DESCRIPCIÓN"
            valor={descripcion}
            onChange={setDescripcion}
            placeholder="Escribe detalles sobre el estado del libro, marcas o envío..."
            styles={styles}
            t={t}
            multiline
            maxLength={1000}
          />

          {/* BOTÓN GUARDAR */}
          <Pressable
            style={[styles.boton, guardando && styles.botonDeshabilitado]}
            disabled={guardando}
            onPress={guardar}
          >
            {guardando ? (
              <ActivityIndicator color={t.colors.textoSobrePrimario} />
            ) : (
              <Text style={styles.botonTexto}>
                {editando ? "Guardar cambios" : "Publicar libro"}
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const crearEstilos = (t) => ({
  contenedor: {
    flex: 1,
    backgroundColor: t.colors.fondo,
  },

  contenido: {
    padding: t.spacing.lg,
    paddingBottom: t.spacing.xl,
  },

  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: t.spacing.lg,
    gap: t.spacing.md,
  },

  etiquetaSeccion: {
    fontSize: 11,
    fontWeight: "600",
    color: t.colors.textoSecundario,
    marginBottom: t.spacing.sm,
  },

  fotosFila: {
    flexDirection: "row",
    gap: t.spacing.sm,
    marginBottom: t.spacing.sm,
  },

  fotoPlaceholder: {
    width: 80,
    height: 85,
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: t.colors.borde,
    backgroundColor: t.colors.superficieAlt,
    justifyContent: "center",
    alignItems: "center",
    gap: t.spacing.xs,
  },

  fotoTexto: {
    fontSize: 10,
    color: t.colors.textoTenue,
  },

  nota: {
    color: t.colors.textoTenue,
    fontSize: 11,
    marginBottom: t.spacing.lg,
  },

  grupoCampo: {
    marginBottom: t.spacing.lg,
  },

  etiqueta: {
    fontSize: 11,
    fontWeight: "600",
    color: t.colors.textoSecundario,
    marginBottom: t.spacing.sm,
  },

  input: {
    backgroundColor: t.colors.superficie,
    borderWidth: 1,
    borderColor: t.colors.borde,
    borderRadius: t.radius.sm,
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.md,
    color: t.colors.texto,
    fontSize: 14,
    minHeight: 46,
  },

  inputMultiline: {
    minHeight: 110,
    textAlignVertical: "top",
  },

  selector: {
    minHeight: 46,
    backgroundColor: t.colors.superficie,
    borderWidth: 1,
    borderColor: t.colors.borde,
    borderRadius: t.radius.sm,
    paddingHorizontal: t.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectorTexto: {
    color: t.colors.texto,
    fontSize: 14,
  },

  placeholderTexto: {
    color: t.colors.textoTenue,
  },

  listaCategorias: {
    backgroundColor: t.colors.superficie,
    borderWidth: 1,
    borderColor: t.colors.borde,
    borderRadius: t.radius.sm,
    marginTop: t.spacing.xs,
    overflow: "hidden",
  },

  opcionCategoria: {
    padding: t.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: t.colors.borde,
  },

  opcionTexto: {
    color: t.colors.texto,
  },

  estadosFila: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: t.spacing.sm,
  },

  estadoChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: t.colors.borde,
    borderRadius: t.radius.pill,
    paddingHorizontal: t.spacing.sm,
    paddingVertical: t.spacing.sm,
    gap: t.spacing.xs,
    backgroundColor: t.colors.superficie,
  },

  estadoSeleccionado: {
    borderColor: t.colors.acento,
  },

  radio: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: t.colors.borde,
  },

  radioSeleccionado: {
    backgroundColor: t.colors.acento,
    borderColor: t.colors.acento,
  },

  estadoTexto: {
    color: t.colors.texto,
    fontSize: 11,
  },

  boton: {
    backgroundColor: t.colors.primario,
    borderRadius: t.radius.pill,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    padding: t.spacing.md,
    marginTop: t.spacing.md,
  },

  botonTexto: {
    color: t.colors.textoSobrePrimario,
    fontSize: 14,
    fontWeight: "700",
  },

  botonDeshabilitado: {
    opacity: 0.6,
  },

  textoSecundario: {
    color: t.colors.textoSecundario,
    textAlign: "center",
  },
});

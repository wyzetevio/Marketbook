import { useCallback, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { publicacionesService } from "../services/publicacionesService";
import { useAuth } from "./AuthContext";

/**
 * Lista de libros.
 *  modo: 'activas' (Explorar) | 'mias' (Mis publicaciones)
 *  busqueda: texto que se compara con título o autor
 *  categoria: texto exacto de categoría ('' = todas)
 * Se recarga solo cada vez que la pantalla vuelve a estar en foco.
 */
export function usePublicaciones({
  modo = "activas",
  busqueda = "",
  categoria = "",
} = {}) {
  const { user } = useAuth();
  const [todas, setTodas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const peticion = useRef(0); // evita que una respuesta vieja pise a la nueva

  const cargar = useCallback(async () => {
    const n = ++peticion.current;
    if (modo === "mias" && !user) {
      setTodas([]);
      setCargando(false);
      return;
    }
    setCargando(true);
    setError("");
    try {
      const libros =
        modo === "mias"
          ? await publicacionesService.listarMias(user.id)
          : await publicacionesService.listarActivas();
      if (n === peticion.current) setTodas(libros);
    } catch (e) {
      if (n === peticion.current) setError(e.message);
    } finally {
      if (n === peticion.current) setCargando(false);
    }
  }, [modo, user?.id]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  const categorias = useMemo(
    () => [...new Set(todas.map((l) => l.categoria).filter(Boolean))].sort(),
    [todas],
  );

  const publicaciones = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const cat = categoria.trim().toLowerCase();
    return todas.filter((l) => {
      const coincideTexto =
        !q ||
        l.titulo.toLowerCase().includes(q) ||
        l.autor.toLowerCase().includes(q);
      const coincideCategoria =
        !cat || (l.categoria || "").toLowerCase() === cat;
      return coincideTexto && coincideCategoria;
    });
  }, [todas, busqueda, categoria]);

  return { publicaciones, categorias, cargando, error, refrescar: cargar };
}

/** Un solo libro por id. esPropia indica si el usuario es el vendedor. */
export function usePublicacion(id) {
  const { user } = useAuth();

  const [libro, setLibro] = useState(null);
  const [cargando, setCargando] = useState(id != null);
  const [error, setError] = useState("");
  const peticion = useRef(0);

  const cargar = useCallback(async () => {
    const n = ++peticion.current;

    // No consultar el backend cuando estamos creando un libro.
    if (id == null) {
      setLibro(null);
      setError("");
      setCargando(false);
      return;
    }

    setCargando(true);
    setError("");

    try {
      const l = await publicacionesService.obtener(id);

      // Ignorar respuestas antiguas.
      if (n !== peticion.current) return;

      setLibro({
        ...l,
        vendedor_nombre: l.vendedor_nombre ?? null,
      });
    } catch (e) {
      if (n !== peticion.current) return;

      setLibro(null);
      setError(e.message || "No se pudo cargar el libro.");
    } finally {
      if (n === peticion.current) {
        setCargando(false);
      }
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      cargar();

      // Invalida solicitudes pendientes al perder el foco.
      return () => {
        peticion.current += 1;
      };
    }, [cargar]),
  );

  const esPropia = !!libro && !!user && libro.vendedor_id === user.id;

  return {
    libro,
    esPropia,
    cargando,
    error,
    refrescar: cargar,
  };
}

/**
 * Acciones de escritura. Todas son async y lanzan Error con mensaje en español.
 *  datos = { titulo, autor, categoria, isbn, precio (número), estado_libro, descripcion }
 */
export function usePublicacionesActions() {
  const { user } = useAuth();
  return useMemo(() => {
    const uid = () => {
      if (!user) throw new Error("Debes iniciar sesión.");
      return user.id;
    };
    return {
      crear: async (datos) => publicacionesService.crear(datos, uid()),
      actualizar: async (id, datos) =>
        publicacionesService.actualizar(id, datos, uid()),
      retirar: async (id) =>
        publicacionesService.actualizar(
          id,
          { estado_publicacion: "retirada" },
          uid(),
        ),
      eliminar: async (id) => publicacionesService.eliminar(id, uid()),
    };
  }, [user]);
}

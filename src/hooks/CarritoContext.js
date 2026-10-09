
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { publicacionesService } from '../services/publicacionesService';

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [cargadoPara, setCargadoPara] = useState(null);
  const [comprobando, setComprobando] = useState(false);
  const [errorDisponibilidad, setErrorDisponibilidad] = useState('');
  const clave = user ? `marketbook:carrito:${user.id}` : null;

  // Leer el carrito al iniciar sesión o cambiar de usuario.
  useEffect(() => {
    let active = true;
    setItems([]);
    setErrorDisponibilidad('');
    setComprobando(false);

    if (!clave) {
      setCargadoPara(null);
      return undefined;
    }

    (async () => {
      let guardados = [];
      try {
        const raw = await AsyncStorage.getItem(clave);
        guardados = raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.warn('No se pudo leer el carrito:', e.message);
      }

      if (!active) return;
      setItems(Array.isArray(guardados) ? guardados : []);
      setCargadoPara(clave);
    })();

    return () => {
      active = false;
    };
  }, [clave]);

  // Guardar únicamente después de cargar el carrito del usuario actual.
  useEffect(() => {
    if (!clave || cargadoPara !== clave) return;
    AsyncStorage.setItem(clave, JSON.stringify(items)).catch((e) => {
      console.warn('No se pudo guardar el carrito:', e.message);
    });
  }, [items, clave, cargadoPara]);

  // Comprobar disponibilidad sin borrar los artículos que ya no se pueden comprar.
  const comprobarDisponibilidad = useCallback(async () => {
    if (!clave || cargadoPara !== clave) {
      return null;
    }

    if (items.length === 0) {
      setErrorDisponibilidad('');
      return [];
    }

    setComprobando(true);
    setErrorDisponibilidad('');

    try {
      const idsDisponibles = await publicacionesService.comprobarDisponibilidad(
        items.map((item) => item.id),
      );
      const disponibles = new Set(idsDisponibles.map(Number));

      const idsConsultados = new Set(
        items.map((item) => String(item.id)),
      );

      setItems((actuales) =>
        actuales.map((item) => {
          if (!idsConsultados.has(String(item.id))) {
            return item;
          }

          return {
            ...item,
            noDisponible: !disponibles.has(Number(item.id)),
          };
        }),
      );

      return [...disponibles];
    } catch (e) {
      console.warn('No se pudo comprobar la disponibilidad:', e.message);
      setErrorDisponibilidad(
        'No pudimos verificar qué libros siguen disponibles. Comprueba tu conexión e inténtalo de nuevo.',
      );
      return null;
    } finally {
      setComprobando(false);
    }
  }, [clave, cargadoPara, items]);

  const agregar = useCallback((libro) => {
    if (!user) throw new Error('Debes iniciar sesión.');
    if (libro.vendedor_id === user.id) {
      throw new Error('No puedes comprar tu propio libro.');
    }
    if (libro.estado_publicacion && libro.estado_publicacion !== 'activa') {
      throw new Error('Este libro ya no está disponible.');
    }

    setItems((prev) => {
      if (prev.some((item) => String(item.id) === String(libro.id))) return prev;

      return [
        ...prev,
        {
          id: libro.id,
          titulo: libro.titulo,
          autor: libro.autor,
          precio: Number(libro.precio),
          estado_libro: libro.estado_libro,
          vendedor_id: libro.vendedor_id,
          noDisponible: false,
        },
      ];
    });
  }, [user]);

  const quitar = useCallback((id) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  }, []);

  const vaciar = useCallback(() => setItems([]), []);

  const itemsDisponibles = useMemo(
    () => items.filter((item) => !item.noDisponible),
    [items],
  );

  const value = useMemo(() => ({
    items,
    itemsDisponibles,
    cantidad: itemsDisponibles.length,
    total: itemsDisponibles.reduce(
      (suma, item) => suma + (Number(item.precio) || 0),
      0,
    ),
    cargando: !!clave && cargadoPara !== clave,
    comprobando,
    errorDisponibilidad,
    comprobarDisponibilidad,
    agregar,
    quitar,
    vaciar,
    estaEnCarrito: (id) => items.some((item) => String(item.id) === String(id)),
  }), [
    items,
    itemsDisponibles,
    clave,
    cargadoPara,
    comprobando,
    errorDisponibilidad,
    comprobarDisponibilidad,
    agregar,
    quitar,
    vaciar,
  ]);

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>.');
  return ctx;
}
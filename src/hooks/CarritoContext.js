import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const CarritoContext = createContext(null);

// El carrito se guarda en AsyncStorage, una clave por usuario.
export function CarritoProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [cargadoPara, setCargadoPara] = useState(null);
  const clave = user ? `marketbook:carrito:${user.id}` : null;

  // Leer al iniciar sesión / cambiar de usuario
  useEffect(() => {
    let active = true;
    setItems([]);
    if (!clave) { setCargadoPara(null); return undefined; }
    (async () => {
      let guardados = [];
      try {
        const raw = await AsyncStorage.getItem(clave);
        guardados = raw ? JSON.parse(raw) : [];
      } catch (e) { console.warn('No se pudo leer el carrito:', e.message); }
      if (!active) return;
      setItems(Array.isArray(guardados) ? guardados : []);
      setCargadoPara(clave);
    })();
    return () => { active = false; };
  }, [clave]);

  // Guardar cada cambio (solo cuando ya se leyó el carrito de ese usuario)
  useEffect(() => {
    if (!clave || cargadoPara !== clave) return;
    AsyncStorage.setItem(clave, JSON.stringify(items)).catch((e) => console.warn('No se pudo guardar el carrito:', e.message));
  }, [items, clave, cargadoPara]);

  const agregar = useCallback((libro) => {
    if (!user) throw new Error('Debes iniciar sesión.');
    if (libro.vendedor_id === user.id) throw new Error('No puedes comprar tu propio libro.');
    if (libro.estado_publicacion && libro.estado_publicacion !== 'activa') throw new Error('Este libro ya no está disponible.');
    setItems((prev) => {
      if (prev.some((i) => i.id === libro.id)) return prev; // cada ejemplar es único
      return [...prev, {
        id: libro.id, titulo: libro.titulo, autor: libro.autor, precio: Number(libro.precio),
        estado_libro: libro.estado_libro, vendedor_id: libro.vendedor_id,
      }];
    });
  }, [user]);

  const quitar = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const vaciar = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({
    items,
    cantidad: items.length,
    total: items.reduce((suma, i) => suma + i.precio, 0),
    cargando: !!clave && cargadoPara !== clave,
    agregar, quitar, vaciar,
    estaEnCarrito: (id) => items.some((i) => i.id === id),
  }), [items, clave, cargadoPara, agregar, quitar, vaciar]);

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>.');
  return ctx;
}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE = 'marketbook:tema';
const TemaContext = createContext(null);

// Guarda la preferencia de modo claro/oscuro en AsyncStorage.
export function TemaProvider({ children }) {
  const [modo, setModo] = useState('claro');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(CLAVE)
      .then((v) => { if (active && (v === 'claro' || v === 'oscuro')) setModo(v); })
      .catch((e) => console.warn('No se pudo leer el tema:', e.message))
      .finally(() => { if (active) setCargando(false); });
    return () => { active = false; };
  }, []);

  const alternarModo = useCallback(() => {
    setModo((actual) => {
      const nuevo = actual === 'claro' ? 'oscuro' : 'claro';
      AsyncStorage.setItem(CLAVE, nuevo).catch((e) => console.warn('No se pudo guardar el tema:', e.message));
      return nuevo;
    });
  }, []);

  const value = useMemo(() => ({ modo, esOscuro: modo === 'oscuro', cargando, alternarModo }), [modo, cargando, alternarModo]);
  return <TemaContext.Provider value={value}>{children}</TemaContext.Provider>;
}

export function useTema() {
  const ctx = useContext(TemaContext);
  if (!ctx) throw new Error('useTema debe usarse dentro de <TemaProvider>.');
  return ctx;
}

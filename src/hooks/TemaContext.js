import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const TemaContext = createContext(null);

// Guarda la preferencia de modo claro/oscuro en AsyncStorage, una clave por usuario.
// Sin sesión (Login/Registro) siempre se usa el modo claro.
export function TemaProvider({ children }) {
  const { user } = useAuth();
  const [modoGuardado, setModoGuardado] = useState('claro');
  const [cargadoPara, setCargadoPara] = useState(null);
  const clave = user ? `marketbook:tema:${user.id}` : null;

  // Leer al iniciar sesión / cambiar de usuario
  useEffect(() => {
    let active = true;
    setModoGuardado('claro');
    if (!clave) { setCargadoPara(null); return undefined; }
    (async () => {
      let guardado = null;
      try {
        guardado = await AsyncStorage.getItem(clave);
      } catch (e) { console.warn('No se pudo leer el tema:', e.message); }
      if (!active) return;
      setModoGuardado(guardado === 'oscuro' ? 'oscuro' : 'claro');
      setCargadoPara(clave);
    })();
    return () => { active = false; };
  }, [clave]);

  // Mientras no se haya leído la preferencia de este usuario se usa el claro,
  // así nunca se ve (ni un instante) el tema de la cuenta anterior.
  const listo = !!clave && cargadoPara === clave;
  const modo = listo ? modoGuardado : 'claro';

  const alternarModo = useCallback(() => {
    if (!listo) return;
    setModoGuardado((actual) => {
      const nuevo = actual === 'claro' ? 'oscuro' : 'claro';
      AsyncStorage.setItem(clave, nuevo).catch((e) => console.warn('No se pudo guardar el tema:', e.message));
      return nuevo;
    });
  }, [listo, clave]);

  const value = useMemo(() => ({
    modo,
    esOscuro: modo === 'oscuro',
    cargando: !!clave && cargadoPara !== clave,
    alternarModo,
  }), [modo, clave, cargadoPara, alternarModo]);
  return <TemaContext.Provider value={value}>{children}</TemaContext.Provider>;
}

export function useTema() {
  const ctx = useContext(TemaContext);
  if (!ctx) throw new Error('useTema debe usarse dentro de <TemaProvider>.');
  return ctx;
}

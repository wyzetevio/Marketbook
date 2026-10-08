import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { perfilService } from '../services/perfilService';
import { useAuth } from './AuthContext';

/**
 * Perfil del usuario logueado.
 *  perfil: { id, nombre, foto_perfil, correo }
 *  actualizar({ nombre }) -> guarda el nuevo nombre (lanza Error si falla)
 */
export function usePerfil() {
  const { user } = useAuth();
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const peticion = useRef(0);

  const cargar = useCallback(async () => {
    const n = ++peticion.current;
    if (!user) { setDatos(null); setCargando(false); return; }
    setCargando(true);
    setError('');
    try {
      const p = await perfilService.obtener(user.id);
      if (n === peticion.current) setDatos(p);
    } catch (e) {
      if (n === peticion.current) setError(e.message);
    } finally {
      if (n === peticion.current) setCargando(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const actualizar = useCallback(async ({ nombre }) => {
    if (!user) throw new Error('Debes iniciar sesión.');
    const nuevo = await perfilService.actualizar(user.id, { nombre });
    setDatos((anterior) => ({ ...anterior, ...nuevo }));
    return nuevo;
  }, [user?.id]);

  const perfil = useMemo(() => (datos ? { ...datos, correo: user?.email ?? '' } : null), [datos, user?.email]);
  return { perfil, cargando, error, actualizar, refrescar: cargar };
}

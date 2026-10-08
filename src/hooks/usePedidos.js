import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { pedidosService } from '../services/pedidosService';
import { useAuth } from './AuthContext';

/**
 * Compras y ventas.
 *  comprar(ids, { direccion, metodoPago }) -> pedido creado (lanza Error si falla)
 *  misCompras: [{ id, fecha, total, estado, direccion_envio, metodo_pago, items: [{ publicacion_id, titulo, autor, precio }] }]
 *  misVentas:  [{ id, pedido_id, fecha, titulo, autor, precio, estado }]
 * Tras comprar con éxito, la pantalla debe llamar a useCarrito().vaciar().
 */
export function usePedidos() {
  const { user } = useAuth();
  const [misCompras, setMisCompras] = useState([]);
  const [misVentas, setMisVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const peticion = useRef(0);

  const refrescar = useCallback(async () => {
    const n = ++peticion.current;
    if (!user) { setMisCompras([]); setMisVentas([]); setCargando(false); return; }
    setCargando(true);
    setError('');
    try {
      const [compras, ventas] = await Promise.all([
        pedidosService.listarCompras(user.id),
        pedidosService.listarVentas(user.id),
      ]);
      if (n === peticion.current) { setMisCompras(compras); setMisVentas(ventas); }
    } catch (e) {
      if (n === peticion.current) setError(e.message);
    } finally {
      if (n === peticion.current) setCargando(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => { refrescar(); }, [refrescar]));

  const comprar = useCallback(async (ids, { direccion, metodoPago = 'simulado' } = {}) => {
    if (!user) throw new Error('Debes iniciar sesión.');
    const pedido = await pedidosService.crear(ids, { direccion, metodoPago }, user.id);
    refrescar();
    return pedido;
  }, [user?.id, refrescar]);

  return { comprar, misCompras, misVentas, cargando, error, refrescar };
}

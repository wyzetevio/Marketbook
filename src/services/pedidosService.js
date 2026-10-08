import { apiRequest } from './apiClient';

// Compra y venta. La compra se hace con la función SQL crear_pedido(), que
// valida, bloquea los libros y crea el pedido en UNA sola transacción.

const SELECT_COMPRAS = 'id,fecha,total,estado,direccion_envio,metodo_pago,detalle_pedido(publicacion_id,titulo,autor,precio,vendedor_id)';

export const pedidosService = {
  // POST /rpc/crear_pedido -> devuelve el pedido creado
  async crear(ids, { direccion, metodoPago = 'simulado' } = {}) {
    if (!Array.isArray(ids) || ids.length === 0) throw new Error('Tu carrito está vacío.');
    const pedido = await apiRequest('/rpc/crear_pedido', {
      method: 'POST',
      body: { p_publicaciones: ids.map(Number), p_direccion: (direccion || '').trim(), p_metodo_pago: metodoPago },
    });
    return { ...pedido, total: Number(pedido.total) };
  },

  // GET /pedidos: mis compras (la base de datos solo entrega las del usuario)
  async listarCompras() {
    const filas = await apiRequest('/pedidos', {
      query: `?select=${encodeURIComponent(SELECT_COMPRAS)}&order=fecha.desc&detalle_pedido.order=id.asc`,
    });
    return filas.map(({ detalle_pedido, ...pedido }) => ({
      ...pedido,
      total: Number(pedido.total),
      items: (detalle_pedido || []).map((d) => ({ ...d, precio: Number(d.precio) })),
    }));
  },

  // POST /rpc/mis_ventas: lo que yo vendí
  async listarVentas() {
    const filas = await apiRequest('/rpc/mis_ventas', { method: 'POST', body: {} });
    return (filas || []).map((v) => ({ ...v, precio: Number(v.precio) }));
  },
};

import { apiRequest } from './apiClient';

const SELECT = `select=${encodeURIComponent('id,nombre,foto_perfil')}`;

export const perfilService = {
  async obtener(userId) {
    const filas = await apiRequest('/usuarios', { query: `?${SELECT}&id=eq.${encodeURIComponent(userId)}&limit=1` });
    if (!filas?.length) throw new Error('No se encontró tu perfil.');
    return filas[0];
  },

  async actualizar(userId, { nombre }) {
    const limpio = (nombre || '').trim();
    if (limpio.length < 1 || limpio.length > 80) throw new Error('El nombre debe tener entre 1 y 80 caracteres.');
    const filas = await apiRequest('/usuarios', {
      method: 'PATCH',
      query: `?${SELECT}&id=eq.${encodeURIComponent(userId)}`,
      body: { nombre: limpio },
    });
    if (!filas?.length) throw new Error('No se pudo actualizar tu perfil.');
    return filas[0];
  },
};

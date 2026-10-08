// Validaciones de formularios compartidas.

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function esCorreoValido(correo) {
  return CORREO.test(String(correo).trim());
}

/** Requisitos de contraseña del diseño de registro: [{ texto, cumple }] */
export function requisitosPassword(password) {
  return [
    { texto: 'Mínimo 8 caracteres', cumple: password.length >= 8 },
    { texto: 'Al menos un número (0-9)', cumple: /\d/.test(password) },
    { texto: 'Al menos letras minúsculas o mayúsculas', cumple: /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(password) },
  ];
}

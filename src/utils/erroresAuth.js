// Supabase Auth devuelve sus errores en inglés; aquí se muestran en español al usuario.
const TRADUCCIONES = [
  [/invalid login credentials/i, 'Correo o contraseña incorrectos.'],
  [/email not confirmed/i, 'Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.'],
  [/user already registered|already been registered/i, 'Ya existe una cuenta con ese correo.'],
  [/password should be at least/i, 'La contraseña es demasiado corta.'],
  [/weak password|password is known to be weak/i, 'La contraseña es demasiado débil. Prueba con otra.'],
  [/unable to validate email|invalid format|email address .* is invalid/i, 'El correo no tiene un formato válido.'],
  [/rate limit|only request this after|too many requests/i, 'Demasiados intentos. Espera un momento y vuelve a intentarlo.'],
  [/signups? not allowed|signup is disabled/i, 'El registro de cuentas está deshabilitado.'],
  [/failed to fetch|network request failed|networkerror|load failed/i, 'No hay conexión con el servidor. Revisa tu internet.'],
];

export function mensajeErrorAuth(error) {
  const mensaje = error?.message ?? '';
  const encontrado = TRADUCCIONES.find(([patron]) => patron.test(mensaje));
  return encontrado ? encontrado[1] : mensaje || 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}

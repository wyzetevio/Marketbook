import { DarkTheme, DefaultTheme } from '@react-navigation/native';

/**
 * Tema de React Navigation construido desde nuestro theme, para que los fondos de las pantallas,
 * la tab bar y los headers nativos cambien con el modo claro/oscuro.
 */
export function getNavigationTheme(t) {
  const base = t.esOscuro ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: t.esOscuro,
    colors: {
      ...base.colors,
      primary: t.colors.acento,
      background: t.colors.fondo,
      card: t.colors.superficie,
      text: t.colors.texto,
      border: t.colors.borde,
      notification: t.colors.acento,
    },
  };
}

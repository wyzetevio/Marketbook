import React, { useMemo } from 'react';
import { Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useCarrito, useTema } from '../hooks';
import { getNavigationTheme, useAppTheme, useEstilos } from '../theme';
import { SplashView } from '../components';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PerfilScreen from '../screens/perfil/PerfilScreen';
import MiCuentaScreen from '../screens/perfil/MiCuentaScreen';
// Placeholders temporales: Bloque B y C los reemplazan por sus pantallas reales (ver src/screens/placeholders).
import {
  CarritoPlaceholder,
  ExplorarPlaceholder,
  MisComprasPlaceholder,
  MisLibrosPlaceholder,
  MisVentasPlaceholder,
} from '../screens/placeholders';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Icono de cada tab: relleno cuando está activa, contorno cuando no.
const ICONOS = { Explorar: 'home', Carrito: 'cart', MisLibros: 'book', Perfil: 'person' };

function TabsPrincipales() {
  const t = useAppTheme();
  const { cantidad } = useCarrito();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // cada pantalla usa el componente <Header />
        tabBarActiveTintColor: t.colors.acento,
        tabBarInactiveTintColor: t.colors.textoTenue,
        tabBarStyle: { backgroundColor: t.colors.superficie, borderTopColor: t.colors.borde },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? ICONOS[route.name] : `${ICONOS[route.name]}-outline`} size={size} color={color} />
        ),
      })}
    >
      {/* Bloque B (Piero): reemplazar ExplorarPlaceholder por la pantalla Explorar */}
      <Tab.Screen name="Explorar" component={ExplorarPlaceholder} />
      {/* Bloque C (Jesús): reemplazar CarritoPlaceholder por la pantalla Carrito */}
      <Tab.Screen
        name="Carrito"
        component={CarritoPlaceholder}
        options={{
          tabBarBadge: cantidad > 0 ? cantidad : undefined,
          tabBarBadgeStyle: { backgroundColor: t.colors.acento, color: t.colors.textoSobrePrimario, fontSize: 11 },
        }}
      />
      {/* Bloque B (Piero): reemplazar MisLibrosPlaceholder por Mis publicaciones */}
      <Tab.Screen name="MisLibros" component={MisLibrosPlaceholder} options={{ title: 'Mis libros' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

// En web limita el ancho para que la app se vea como un teléfono; en Android/iOS no hace nada.
function MarcoWeb({ children }) {
  const styles = useEstilos(crearEstilos);
  if (Platform.OS !== 'web') return children;
  return (
    <View style={styles.webFondo}>
      <View style={styles.webTelefono}>{children}</View>
    </View>
  );
}

export default function AppNavigator() {
  const { session, loading } = useAuth();
  const { cargando: cargandoTema } = useTema();
  const t = useAppTheme();
  const temaNavegacion = useMemo(() => getNavigationTheme(t), [t]);
  const iniciando = loading || cargandoTema;
  // El splash usa el color primario de fondo (invertido respecto a la app), así que la barra también se invierte.
  const estiloBarra = iniciando ? (t.esOscuro ? 'dark' : 'light') : t.statusBar;

  return (
    <SafeAreaProvider>
      <StatusBar style={estiloBarra} />
      <MarcoWeb>
        {iniciando ? (
          // Mientras se recupera la sesión y el tema guardados (AsyncStorage).
          <SplashView />
        ) : (
          <NavigationContainer theme={temaNavegacion}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {session ? (
                <>
                  <Stack.Screen name="Principal" component={TabsPrincipales} />
                  {/* Bloque A: Perfil → "Mi cuenta" (editar nombre) */}
                  <Stack.Screen name="MiCuenta" component={MiCuentaScreen} />
                  {/* Bloque C (Jesús): reemplazar los placeholders por Mis compras / Mis ventas (se abren desde Perfil) */}
                  <Stack.Screen name="MisCompras" component={MisComprasPlaceholder} />
                  <Stack.Screen name="MisVentas" component={MisVentasPlaceholder} />
                  {/*
                    Bloque B y C: registrar aquí las pantallas que se abren ENCIMA de las tabs
                    (sin tab bar), por ejemplo:
                      <Stack.Screen name="DetalleLibro" component={DetalleLibroScreen} />
                      <Stack.Screen name="Checkout" component={CheckoutScreen} />
                    Se navega con navigation.navigate('DetalleLibro', { id }).
                  */}
                </>
              ) : (
                <>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </MarcoWeb>
    </SafeAreaProvider>
  );
}

const crearEstilos = (t) => ({
  webFondo: { flex: 1, alignItems: 'center', backgroundColor: t.colors.superficieAlt },
  webTelefono: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    overflow: 'hidden',
    backgroundColor: t.colors.fondo,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: t.colors.borde,
  },
});

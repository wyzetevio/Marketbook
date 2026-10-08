import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from '../services/supabase/client';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MarketplaceScreen from '../screens/marketplace/MarketplaceScreen';
import PublicationDetailScreen from '../screens/marketplace/PublicationDetailScreen';
import CreatePublicationScreen from '../screens/publications/CreatePublicationScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [session, setSession] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) console.warn(error.message);
      setSession(data?.session ?? null);
      setCargando(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, current) => {
      if (active) setSession(current);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  if (cargando) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Comprobando sesión...</Text>
    </View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!session ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Crear cuenta' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Marketplace" component={MarketplaceScreen} options={{ title: 'Marketbook', headerBackVisible: false }} />
            <Stack.Screen name="PublicationDetail" component={PublicationDetailScreen} options={{ title: 'Detalle del libro' }} />
            <Stack.Screen name="CreatePublication" component={CreatePublicationScreen} options={{ title: 'Publicación' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MarketplaceScreen from '../screens/marketplace/MarketplaceScreen';
import PublicationDetailScreen from '../screens/marketplace/PublicationDetailScreen';
import CreatePublicationScreen from '../screens/publications/CreatePublicationScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Crear cuenta' }}
        />

        <Stack.Screen
          name="Marketplace"
          component={MarketplaceScreen}
          options={{
            title: 'Marketplace',
            headerBackVisible: false,
          }}
        />

        <Stack.Screen
          name="PublicationDetail"
          component={PublicationDetailScreen}
          options={{ title: 'Detalle' }}
        />

        <Stack.Screen
          name="CreatePublication"
          component={CreatePublicationScreen}
          options={{ title: 'Vender libro' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
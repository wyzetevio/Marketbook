import React from 'react';
import { AuthProvider } from './AuthContext';
import { CarritoProvider } from './CarritoContext';
import { TemaProvider } from './TemaContext';

// El orden importa: el carrito depende de la sesión.
export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CarritoProvider>
        <TemaProvider>{children}</TemaProvider>
      </CarritoProvider>
    </AuthProvider>
  );
}

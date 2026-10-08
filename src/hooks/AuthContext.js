import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabase/client';
import * as auth from '../services/supabase/authService';

const AuthContext = createContext(null);

// Mantiene la sesión real de Supabase en un solo lugar para toda la app.
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) console.warn(error.message);
      setSession(data?.session ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evento, actual) => {
      if (active) setSession(actual);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    loading,
    signIn: auth.signIn,   // (correo, password)
    signUp: auth.signUp,   // (nombre, correo, password)
    signOut: auth.signOut, // ()
  }), [session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  return ctx;
}

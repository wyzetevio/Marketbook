import { supabase } from './client';

export async function signIn(correo, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo.trim(),
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signUp(nombre, correo, password) {
  const { data, error } = await supabase.auth.signUp({
    email: correo.trim(),
    password,
    options: { data: { nombre: nombre.trim() } },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

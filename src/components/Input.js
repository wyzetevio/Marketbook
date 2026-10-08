import React, { useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, useEstilos } from '../theme';

/**
 * Campo de texto con etiqueta, error y ayuda (relleno gris, estilo Figma).
 *   <Input label="Correo electrónico" placeholder="Tu correo electrónico" value={correo}
 *          onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none"
 *          error={errores.correo} />
 *   <Input label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
 *   <Input label="Descripción" value={desc} onChangeText={setDesc} multiline />
 *
 * label: texto sobre el campo · error: mensaje rojo bajo el campo (borde rojo)
 * ayuda: texto gris bajo el campo (se oculta si hay error)
 * secureTextEntry: campo de contraseña con icono de ojo para mostrar/ocultar
 * estilo: estilos extra del contenedor
 * Cualquier otra prop (placeholder, keyboardType, maxLength, onSubmitEditing...) va al TextInput,
 * incluida `ref` (React 19), útil para pasar el foco: onSubmitEditing={() => siguienteRef.current?.focus()}
 */
export default function Input({
  label,
  error,
  ayuda,
  secureTextEntry = false,
  multiline = false,
  editable = true,
  estilo,
  onFocus,
  onBlur,
  ...rest
}) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  const [enfocado, setEnfocado] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  return (
    <View style={[styles.contenedor, estilo]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.campo,
          multiline && styles.campoMultilinea,
          enfocado && styles.enfocado,
          !!error && styles.conError,
          !editable && styles.inactivo,
        ]}
      >
        <TextInput
          style={[styles.input, multiline && styles.inputMultilinea]}
          placeholderTextColor={t.colors.textoTenue}
          selectionColor={t.colors.acento}
          secureTextEntry={secureTextEntry && !mostrar}
          multiline={multiline}
          editable={editable}
          accessibilityLabel={label}
          onFocus={(e) => { setEnfocado(true); onFocus?.(e); }}
          onBlur={(e) => { setEnfocado(false); onBlur?.(e); }}
          {...rest}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setMostrar((v) => !v)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <Ionicons name={mostrar ? 'eye-outline' : 'eye-off-outline'} size={20} color={t.colors.textoTenue} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : ayuda ? (
        <Text style={styles.ayuda}>{ayuda}</Text>
      ) : null}
    </View>
  );
}

const crearEstilos = (t) => ({
  contenedor: { marginBottom: t.spacing.md },
  label: { ...t.typography.etiqueta, color: t.colors.texto, marginBottom: t.spacing.sm },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: t.spacing.md,
    backgroundColor: t.colors.superficieAlt,
    borderWidth: 1,
    borderColor: t.colors.superficieAlt, // sin borde visible hasta enfocar
    borderRadius: t.radius.sm,
  },
  campoMultilinea: { alignItems: 'flex-start', paddingVertical: t.spacing.sm },
  enfocado: { borderColor: t.colors.texto, backgroundColor: t.colors.fondo },
  conError: { borderColor: t.colors.peligro },
  inactivo: { opacity: 0.6 },
  input: {
    flex: 1,
    fontSize: t.typography.cuerpo.fontSize,
    color: t.colors.texto,
    paddingVertical: t.spacing.sm,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null), // el borde ya marca el foco
  },
  inputMultilinea: { minHeight: 96, textAlignVertical: 'top' },
  error: { ...t.typography.pequeno, color: t.colors.peligro, marginTop: t.spacing.xs },
  ayuda: { ...t.typography.pequeno, color: t.colors.textoSecundario, marginTop: t.spacing.xs },
});

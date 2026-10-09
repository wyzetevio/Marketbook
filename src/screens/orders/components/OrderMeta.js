import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '../../../components';
import { useAppTheme, useEstilos } from '../../../theme';

const ESTADOS = {
  pagado: { texto: 'Pagado', tono: 'acento' },
  enviado: { texto: 'Enviado', tono: 'aviso' },
  entregado: { texto: 'Entregado', tono: 'exito' },
  cancelado: { texto: 'Cancelado', tono: 'peligro' },
};

const METODOS_PAGO = {
  simulado: 'Pago simulado',
  tarjeta: 'Tarjeta',
  yape: 'Yape',
  contra_entrega: 'Contra entrega',
};

export function formatearFechaPedido(valor) {
  if (!valor) return '';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return '';
  try {
    return new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(fecha);
  } catch {
    return fecha.toLocaleString();
  }
}

export function etiquetaMetodoPago(valor) {
  if (!valor) return '';
  return METODOS_PAGO[valor] ?? String(valor);
}

export function EstadoPedidoBadge({ estado }) {
  if (!estado) return null;
  const presentacion = ESTADOS[estado] ?? { texto: String(estado), tono: 'neutro' };
  return <Badge texto={presentacion.texto} tono={presentacion.tono} />;
}

export function DatoPedido({ icono, etiqueta, valor, multilinea = false }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  if (valor === undefined || valor === null || String(valor).trim() === '') return null;

  return (
    <View style={styles.fila}>
      <Ionicons name={icono} size={18} color={t.colors.textoTenue} style={styles.icono} />
      <View style={styles.textos}>
        <Text style={styles.etiqueta}>{etiqueta}</Text>
        <Text style={styles.valor} numberOfLines={multilinea ? undefined : 1}>{String(valor)}</Text>
      </View>
    </View>
  );
}

const crearEstilos = (t) => ({
  fila: { flexDirection: 'row', alignItems: 'flex-start', marginTop: t.spacing.sm },
  icono: { width: 24, marginTop: 1 },
  textos: { flex: 1 },
  etiqueta: { ...t.typography.pequeno, color: t.colors.textoTenue },
  valor: { ...t.typography.cuerpo, fontSize: 14, color: t.colors.texto, marginTop: 1 },
});

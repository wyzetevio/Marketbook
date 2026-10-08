import React from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePedidos } from '../../hooks';
import { useAppTheme, useEstilos } from '../../theme';
import { Aviso, EmptyState, ErrorView, Header, LoadingView } from '../../components';
import { formatearPrecio } from '../../utils/formato';
import { DatoPedido, EstadoPedidoBadge, formatearFechaPedido } from './components/OrderMeta';

function VentaCard({ venta }) {
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  const fecha = formatearFechaPedido(venta.fecha);
  const precioValido = venta.precio !== undefined
    && venta.precio !== null
    && venta.precio !== ''
    && Number.isFinite(Number(venta.precio));

  return (
    <View style={styles.tarjeta}>
      <View style={styles.libroFila}>
        <View style={styles.portada}>
          <Ionicons name="book" size={28} color={t.colors.textoTenue} />
        </View>
        <View style={styles.libroInfo}>
          {venta.titulo ? <Text style={styles.titulo} numberOfLines={2}>{venta.titulo}</Text> : null}
          {venta.autor ? <Text style={styles.autor} numberOfLines={1}>{venta.autor}</Text> : null}
          {precioValido ? <Text style={styles.precio}>{formatearPrecio(venta.precio)}</Text> : null}
        </View>
        <EstadoPedidoBadge estado={venta.estado} />
      </View>

      <View style={styles.separador} />
      {venta.pedido_id !== undefined && venta.pedido_id !== null ? (
        <DatoPedido icono="receipt-outline" etiqueta="Pedido" valor={`#${String(venta.pedido_id)}`} />
      ) : null}
      <DatoPedido icono="calendar-outline" etiqueta="Fecha" valor={fecha} />
      <DatoPedido icono="person-outline" etiqueta="Comprador" valor={venta.comprador_nombre} />
      <DatoPedido icono="location-outline" etiqueta="Dirección de entrega" valor={venta.direccion_envio} multilinea />
    </View>
  );
}

export default function MySalesScreen({ navigation }) {
  const { misVentas, cargando, error, refrescar } = usePedidos();
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  const ventas = Array.isArray(misVentas) ? misVentas : [];

  if (cargando && ventas.length === 0 && !error) {
    return (
      <View style={styles.pantalla}>
        <Header titulo="Mis ventas" onAtras={() => navigation.goBack()} />
        <LoadingView mensaje="Cargando tus ventas..." />
      </View>
    );
  }

  if (error && ventas.length === 0) {
    return (
      <View style={styles.pantalla}>
        <Header titulo="Mis ventas" onAtras={() => navigation.goBack()} />
        <ErrorView mensaje={error} onReintentar={refrescar} />
      </View>
    );
  }

  return (
    <View style={styles.pantalla}>
      <Header titulo="Mis ventas" onAtras={() => navigation.goBack()} />
      <FlatList
        data={ventas}
        keyExtractor={(venta, indice) => String(venta.id ?? `${venta.pedido_id ?? 'venta'}-${indice}`)}
        renderItem={({ item }) => <VentaCard venta={item} />}
        contentContainerStyle={[styles.lista, ventas.length === 0 && styles.listaVacia]}
        showsVerticalScrollIndicator={false}
        refreshControl={(
          <RefreshControl
            refreshing={cargando && ventas.length > 0}
            onRefresh={refrescar}
            tintColor={t.colors.acento}
            colors={[t.colors.acento]}
          />
        )}
        ListHeaderComponent={error ? <Aviso mensaje={error} /> : null}
        ListEmptyComponent={(
          <EmptyState
            icono="pricetag-outline"
            titulo="Todavía no tienes ventas"
            mensaje="Cuando alguien compre uno de tus libros, la venta aparecerá aquí."
            textoAccion="Actualizar"
            onAccion={refrescar}
          />
        )}
      />
    </View>
  );
}

const crearEstilos = (t) => ({
  pantalla: { flex: 1, backgroundColor: t.colors.fondo },
  lista: { paddingHorizontal: t.spacing.md, paddingBottom: t.spacing.xl },
  listaVacia: { flexGrow: 1 },
  tarjeta: {
    padding: t.spacing.md,
    marginBottom: t.spacing.md,
    borderWidth: 1,
    borderColor: t.colors.borde,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.superficie,
  },
  libroFila: { flexDirection: 'row', alignItems: 'flex-start' },
  portada: {
    width: 64,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.sm - 4,
    backgroundColor: t.colors.superficieAlt,
    marginRight: t.spacing.md,
  },
  libroInfo: { flex: 1, marginRight: t.spacing.sm },
  titulo: { ...t.typography.etiqueta, fontSize: 14, color: t.colors.texto },
  autor: { ...t.typography.pequeno, color: t.colors.textoSecundario, marginTop: 2 },
  precio: { ...t.typography.precio, color: t.colors.acento, marginTop: t.spacing.sm },
  separador: { height: 1, backgroundColor: t.colors.borde, marginTop: t.spacing.md },
});

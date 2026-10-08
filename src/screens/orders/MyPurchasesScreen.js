import React from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { usePedidos } from '../../hooks';
import { useAppTheme, useEstilos } from '../../theme';
import { Aviso, BookCard, EmptyState, ErrorView, Header, LoadingView } from '../../components';
import { formatearPrecio } from '../../utils/formato';
import {
  DatoPedido,
  EstadoPedidoBadge,
  etiquetaMetodoPago,
  formatearFechaPedido,
} from './components/OrderMeta';

function PedidoCard({ pedido }) {
  const styles = useEstilos(crearEstilos);
  const items = Array.isArray(pedido.items) ? pedido.items : [];
  const fecha = formatearFechaPedido(pedido.fecha);
  const totalValido = pedido.total !== undefined
    && pedido.total !== null
    && pedido.total !== ''
    && Number.isFinite(Number(pedido.total));

  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabeceraTarjeta}>
        <View style={styles.identificacion}>
          <Text style={styles.numeroPedido}>
            {pedido.id !== undefined && pedido.id !== null ? `Pedido #${String(pedido.id)}` : 'Pedido'}
          </Text>
          {fecha ? <Text style={styles.fecha}>{fecha}</Text> : null}
        </View>
        <EstadoPedidoBadge estado={pedido.estado} />
      </View>

      <View style={styles.resumen}>
        <Text style={styles.cantidad}>{items.length} {items.length === 1 ? 'libro' : 'libros'}</Text>
        {totalValido ? <Text style={styles.total}>{formatearPrecio(pedido.total)}</Text> : null}
      </View>

      <DatoPedido icono="location-outline" etiqueta="Dirección de entrega" valor={pedido.direccion_envio} multilinea />
      <DatoPedido icono="card-outline" etiqueta="Método de pago" valor={etiquetaMetodoPago(pedido.metodo_pago)} />

      <View style={styles.separador} />
      <Text style={styles.detalleTitulo}>Detalle del pedido</Text>
      {items.length > 0 ? items.map((libro, indice) => (
        <BookCard
          key={String(libro.publicacion_id ?? `${pedido.id ?? 'pedido'}-${indice}`)}
          libro={libro}
          mostrarVendedor={false}
        />
      )) : (
        <Text style={styles.sinDetalle}>El pedido no incluye detalle de libros.</Text>
      )}
    </View>
  );
}

export default function MyPurchasesScreen({ navigation }) {
  const { misCompras, cargando, error, refrescar } = usePedidos();
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  const compras = Array.isArray(misCompras) ? misCompras : [];

  if (cargando && compras.length === 0 && !error) {
    return (
      <View style={styles.pantalla}>
        <Header titulo="Mis compras" onAtras={() => navigation.goBack()} />
        <LoadingView mensaje="Cargando tus compras..." />
      </View>
    );
  }

  if (error && compras.length === 0) {
    return (
      <View style={styles.pantalla}>
        <Header titulo="Mis compras" onAtras={() => navigation.goBack()} />
        <ErrorView mensaje={error} onReintentar={refrescar} />
      </View>
    );
  }

  return (
    <View style={styles.pantalla}>
      <Header titulo="Mis compras" onAtras={() => navigation.goBack()} />
      <FlatList
        data={compras}
        keyExtractor={(pedido, indice) => String(pedido.id ?? `pedido-${indice}`)}
        renderItem={({ item }) => <PedidoCard pedido={item} />}
        contentContainerStyle={[styles.lista, compras.length === 0 && styles.listaVacia]}
        showsVerticalScrollIndicator={false}
        refreshControl={(
          <RefreshControl
            refreshing={cargando && compras.length > 0}
            onRefresh={refrescar}
            tintColor={t.colors.acento}
            colors={[t.colors.acento]}
          />
        )}
        ListHeaderComponent={error ? <Aviso mensaje={error} /> : null}
        ListEmptyComponent={(
          <EmptyState
            icono="bag-handle-outline"
            titulo="Todavía no tienes compras"
            mensaje="Cuando compres un libro, el pedido aparecerá aquí."
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
  cabeceraTarjeta: { flexDirection: 'row', alignItems: 'flex-start' },
  identificacion: { flex: 1, marginRight: t.spacing.sm },
  numeroPedido: { ...t.typography.subtitulo, color: t.colors.texto },
  fecha: { ...t.typography.pequeno, color: t.colors.textoSecundario, marginTop: 2 },
  resumen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: t.spacing.md,
  },
  cantidad: { ...t.typography.cuerpo, color: t.colors.textoSecundario },
  total: { ...t.typography.precio, color: t.colors.acento },
  separador: { height: 1, backgroundColor: t.colors.borde, marginVertical: t.spacing.md },
  detalleTitulo: { ...t.typography.etiqueta, fontSize: 14, color: t.colors.texto, marginBottom: t.spacing.md },
  sinDetalle: { ...t.typography.cuerpo, color: t.colors.textoSecundario },
});

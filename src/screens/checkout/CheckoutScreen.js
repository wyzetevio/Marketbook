import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCarrito, usePedidos } from '../../hooks';
import { useAppTheme, useEstilos } from '../../theme';
import { Aviso, BookCard, Button, ErrorView, Header, Input, LoadingView } from '../../components';
import { formatearPrecio } from '../../utils/formato';

const MIN_DIRECCION = 5;
const MAX_DIRECCION = 250;

function validarDireccion(direccion) {
  const limpia = direccion.trim();
  if (limpia.length < MIN_DIRECCION) return 'Ingresa una dirección de envío válida (mínimo 5 caracteres).';
  if (limpia.length > MAX_DIRECCION) return 'La dirección es demasiado larga (máximo 250 caracteres).';
  return '';
}

function rutaRegistrada(navigation, nombre) {
  return navigation.getState()?.routeNames?.includes(nombre) ?? false;
}

function idPublicacionValido(valor) {
  if (valor === null || valor === undefined || valor === '') return false;
  const numero = Number(valor);
  return Number.isSafeInteger(numero) && numero > 0;
}

export default function CheckoutScreen({ navigation }) {
  const { items, cantidad, total, cargando, vaciar } = useCarrito();
  const { comprar } = usePedidos();
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);

  const [direccion, setDireccion] = useState('');
  const [intentoComprar, setIntentoComprar] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [errorCompra, setErrorCompra] = useState('');
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);
  const bloqueoCompra = useRef(false);
  const compraConfirmada = useRef(false);
  const permitirSalida = useRef(false);
  const montado = useRef(true);

  useEffect(() => {
    montado.current = true;
    const cancelarRetroceso = navigation.addListener('beforeRemove', (evento) => {
      if (!compraConfirmada.current || permitirSalida.current) return;
      evento.preventDefault();
    });
    const hardware = BackHandler.addEventListener('hardwareBackPress', () => (
      compraConfirmada.current && !permitirSalida.current
    ));
    return () => {
      montado.current = false;
      cancelarRetroceso();
      hardware.remove();
    };
  }, [navigation]);

  const errorDireccion = intentoComprar ? validarDireccion(direccion) : '';

  const cambiarDireccion = (valor) => {
    setDireccion(valor);
    setErrorCompra('');
  };

  const confirmarCompra = async () => {
    // El ref cambia antes del próximo render: dos pulsaciones en el mismo frame
    // no pueden iniciar dos solicitudes al backend.
    if (bloqueoCompra.current || compraConfirmada.current) return;
    bloqueoCompra.current = true;
    setIntentoComprar(true);
    setErrorCompra('');

    const errorLocal = validarDireccion(direccion);
    if (cantidad === 0 || items.length === 0) {
      setErrorCompra('Tu carrito está vacío. Regresa y agrega al menos un libro.');
      bloqueoCompra.current = false;
      return;
    }
    if (errorLocal) {
      bloqueoCompra.current = false;
      return;
    }

    if (items.some((libro) => !idPublicacionValido(libro.id))) {
      setErrorCompra('Uno de los libros del carrito no tiene un identificador válido.');
      bloqueoCompra.current = false;
      return;
    }
    const ids = items.map((libro) => Number(libro.id));
    if (new Set(ids).size !== ids.length) {
      setErrorCompra('El carrito contiene publicaciones duplicadas. Regresa al carrito y vuelve a intentarlo.');
      bloqueoCompra.current = false;
      return;
    }

    setProcesando(true);
    try {
      const pedido = await comprar(ids, { direccion: direccion.trim(), metodoPago: 'simulado' });

      // Desde este punto el servidor confirmó la operación. Este bloqueo nunca se
      // libera en esta instancia, aunque falle el vaciado o falte registrar la ruta.
      compraConfirmada.current = true;
      if (montado.current) setPedidoConfirmado(pedido);

      let avisoSincronizacion = '';
      try {
        vaciar();
      } catch (e) {
        avisoSincronizacion = e?.message
          ? `La compra fue confirmada, pero no se pudo limpiar el carrito local: ${e.message}`
          : 'La compra fue confirmada, pero no se pudo limpiar el carrito local.';
      }

      if (rutaRegistrada(navigation, 'OrderSuccess')) {
        try {
          permitirSalida.current = true;
          navigation.replace('OrderSuccess', {
            pedido,
            avisoSincronizacion: avisoSincronizacion || undefined,
          });
        } catch (e) {
          permitirSalida.current = false;
          if (montado.current) {
            setErrorCompra(
              `${avisoSincronizacion ? `${avisoSincronizacion} ` : ''}`
              + `La compra fue confirmada, pero no se pudo abrir la confirmación: ${e?.message || 'error de navegación'}.`,
            );
          }
        }
      } else if (montado.current) {
        setErrorCompra(
          `${avisoSincronizacion ? `${avisoSincronizacion} ` : ''}`
          + 'La compra fue confirmada. César debe registrar la ruta OrderSuccess para mostrar la confirmación.',
        );
      }
    } catch (e) {
      if (!compraConfirmada.current) {
        bloqueoCompra.current = false;
        if (montado.current) setErrorCompra(e?.message || 'No se pudo completar la compra. Inténtalo nuevamente.');
      }
    } finally {
      if (montado.current) setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.pantalla}>
        <Header titulo="Checkout" onAtras={() => navigation.goBack()} />
        <LoadingView mensaje="Preparando tu compra..." />
      </View>
    );
  }

  if (cantidad === 0 && !pedidoConfirmado) {
    return (
      <View style={styles.pantalla}>
        <Header titulo="Checkout" onAtras={() => navigation.goBack()} />
        <ErrorView
          titulo="Tu carrito está vacío"
          mensaje="Agrega al menos un libro antes de continuar con la compra."
          textoBoton="Volver al carrito"
          onReintentar={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={styles.pantalla}>
      <Header titulo="Checkout" onAtras={compraConfirmada.current ? undefined : () => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {errorCompra ? <Aviso mensaje={errorCompra} tono={compraConfirmada.current ? 'info' : 'peligro'} /> : null}

          <Text style={styles.tituloSeccion}>Resumen del pedido</Text>
          <View style={styles.resumenCabecera}>
            <Text style={styles.resumenCantidad}>{cantidad} {cantidad === 1 ? 'libro' : 'libros'}</Text>
            <Text style={styles.resumenTotal}>{formatearPrecio(total)}</Text>
          </View>

          {items.map((libro) => (
            <BookCard key={String(libro.id)} libro={libro} mostrarVendedor={false} />
          ))}

          <Text style={styles.tituloSeccion}>Entrega</Text>
          <Input
            label="Dirección de entrega"
            placeholder="Av. Ejemplo 123, distrito"
            value={direccion}
            onChangeText={cambiarDireccion}
            error={errorDireccion}
            ayuda={`${direccion.trim().length}/${MAX_DIRECCION} caracteres`}
            maxLength={MAX_DIRECCION}
            multiline
            autoCapitalize="sentences"
            autoComplete="street-address"
            textContentType="fullStreetAddress"
            editable={!procesando && !compraConfirmada.current}
          />

          <Text style={styles.tituloSeccion}>Método de pago</Text>
          <View style={styles.metodoPago}>
            <View style={styles.iconoPago}>
              <Ionicons name="card-outline" size={22} color={t.colors.acento} />
            </View>
            <View style={styles.metodoInfo}>
              <Text style={styles.metodoTitulo}>Pago simulado</Text>
              <Text style={styles.metodoDetalle}>No se realizará ningún cargo real.</Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color={t.colors.exito} />
          </View>

          <View style={styles.totalFinal}>
            <Text style={styles.totalFinalEtiqueta}>Total a pagar</Text>
            <Text style={styles.totalFinalPrecio}>{formatearPrecio(total)}</Text>
          </View>

          <Button
            titulo={pedidoConfirmado ? 'Compra confirmada' : 'Confirmar compra'}
            icono={pedidoConfirmado ? 'checkmark-circle-outline' : 'lock-closed-outline'}
            onPress={confirmarCompra}
            cargando={procesando}
            deshabilitado={!!pedidoConfirmado || cantidad === 0}
            accessibilityLabel="Confirmar compra con pago simulado"
          />
          <Text style={styles.nota}>Al confirmar, los libros quedarán marcados como vendidos.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const crearEstilos = (t) => ({
  pantalla: { flex: 1, backgroundColor: t.colors.fondo },
  flex: { flex: 1 },
  contenido: { paddingHorizontal: t.spacing.md, paddingBottom: t.spacing.xl },
  tituloSeccion: {
    ...t.typography.subtitulo,
    color: t.colors.texto,
    marginTop: t.spacing.sm,
    marginBottom: t.spacing.md,
  },
  resumenCabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: t.spacing.md,
  },
  resumenCantidad: { ...t.typography.cuerpo, color: t.colors.textoSecundario },
  resumenTotal: { ...t.typography.precio, color: t.colors.acento },
  metodoPago: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: t.spacing.md,
    borderWidth: 1,
    borderColor: t.colors.borde,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.superficie,
    marginBottom: t.spacing.lg,
  },
  iconoPago: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: t.radius.sm,
    backgroundColor: t.colors.acentoSuave,
    marginRight: t.spacing.md,
  },
  metodoInfo: { flex: 1 },
  metodoTitulo: { ...t.typography.etiqueta, fontSize: 14, color: t.colors.texto },
  metodoDetalle: { ...t.typography.pequeno, color: t.colors.textoSecundario, marginTop: 2 },
  totalFinal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: t.spacing.md,
    marginBottom: t.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: t.colors.borde,
  },
  totalFinalEtiqueta: { ...t.typography.subtitulo, color: t.colors.texto },
  totalFinalPrecio: { ...t.typography.titulo, color: t.colors.acento },
  nota: {
    ...t.typography.pequeno,
    color: t.colors.textoSecundario,
    textAlign: 'center',
    marginTop: t.spacing.sm,
  },
});

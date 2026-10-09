import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Aviso, BookCard, Button, ErrorView, Header } from '../../components';
import { useAppTheme, useEstilos } from '../../theme';
import { formatearPrecio } from '../../utils/formato';

function rutasDisponibles(navigation) {
  return navigation.getState()?.routeNames ?? [];
}

export default function OrderSuccessScreen({ navigation, route }) {
  const pedido = route.params?.pedido ?? null;
  const avisoSincronizacion = route.params?.avisoSincronizacion ?? '';
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  const permitirSalida = useRef(false);
  const [errorNavegacion, setErrorNavegacion] = useState('');

  useEffect(() => {
    const cancelarRetroceso = navigation.addListener('beforeRemove', (evento) => {
      if (permitirSalida.current) return;
      evento.preventDefault();
    });
    const hardware = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => {
      cancelarRetroceso();
      hardware.remove();
    };
  }, [navigation]);

  const reiniciarEn = (destino) => {
    setErrorNavegacion('');
    const disponibles = rutasDisponibles(navigation);
    if (!disponibles.includes('Principal')) {
      setErrorNavegacion('La ruta principal todavía no está disponible. Revisa la integración de navegación.');
      return;
    }
    if (destino === 'MisCompras' && !disponibles.includes('MisCompras')) {
      setErrorNavegacion('La ruta MisCompras todavía no está disponible. César debe registrarla en el navegador.');
      return;
    }

    permitirSalida.current = true;
    if (destino === 'MisCompras') {
      navigation.reset({
        index: 1,
        routes: [{ name: 'Principal' }, { name: 'MisCompras' }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Principal', params: { screen: 'Explorar' } }],
      });
    }
  };

  if (!pedido) {
    return (
      <View style={styles.pantalla}>
        <Header titulo="Compra" />
        <ErrorView
          titulo="No hay una compra para mostrar"
          mensaje="La confirmación necesita el pedido devuelto por el proceso de compra."
          textoBoton="Volver a Explorar"
          onReintentar={() => reiniciarEn('Explorar')}
        />
      </View>
    );
  }

  const items = Array.isArray(pedido.items) ? pedido.items : [];
  const tieneTotal = pedido.total !== undefined
    && pedido.total !== null
    && pedido.total !== ''
    && Number.isFinite(Number(pedido.total));

  return (
    <View style={styles.pantalla}>
      <Header titulo="Compra confirmada" />
      <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
        <View style={styles.confirmacion}>
          <View style={styles.iconoExito}>
            <Ionicons name="checkmark" size={44} color={t.colors.exito} />
          </View>
          <Text style={styles.titulo}>¡Compra realizada!</Text>
          <Text style={styles.mensaje}>Tu pedido fue confirmado correctamente.</Text>
          {pedido.id !== undefined && pedido.id !== null ? (
            <Text style={styles.numeroPedido}>Pedido #{String(pedido.id)}</Text>
          ) : null}
        </View>

        {avisoSincronizacion ? <Aviso tono="info" mensaje={avisoSincronizacion} /> : null}
        {errorNavegacion ? <Aviso mensaje={errorNavegacion} /> : null}

        {tieneTotal ? (
          <View style={styles.totalCaja}>
            <Text style={styles.totalEtiqueta}>Total pagado</Text>
            <Text style={styles.totalPrecio}>{formatearPrecio(pedido.total)}</Text>
          </View>
        ) : null}

        {items.length > 0 ? (
          <View style={styles.libros}>
            <Text style={styles.tituloSeccion}>Libros comprados</Text>
            {items.map((libro, indice) => (
              <BookCard
                key={String(libro.publicacion_id ?? `${pedido.id ?? 'pedido'}-${indice}`)}
                libro={libro}
                mostrarVendedor={false}
              />
            ))}
          </View>
        ) : null}

        <Button
          titulo="Ir a Mis compras"
          icono="bag-handle-outline"
          onPress={() => reiniciarEn('MisCompras')}
        />
        <Button
          titulo="Volver a Explorar"
          variante="secundario"
          icono="home-outline"
          onPress={() => reiniciarEn('Explorar')}
          estilo={styles.botonSecundario}
        />
      </ScrollView>
    </View>
  );
}

const crearEstilos = (t) => ({
  pantalla: { flex: 1, backgroundColor: t.colors.fondo },
  contenido: { paddingHorizontal: t.spacing.md, paddingBottom: t.spacing.xl },
  confirmacion: {
    alignItems: 'center',
    paddingVertical: t.spacing.lg,
    paddingHorizontal: t.spacing.md,
    marginBottom: t.spacing.md,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.superficieAlt,
  },
  iconoExito: {
    width: 88,
    height: 88,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.colors.exitoSuave,
    marginBottom: t.spacing.md,
  },
  titulo: { ...t.typography.titulo, color: t.colors.texto, textAlign: 'center' },
  mensaje: {
    ...t.typography.cuerpo,
    color: t.colors.textoSecundario,
    textAlign: 'center',
    marginTop: t.spacing.xs,
  },
  numeroPedido: {
    ...t.typography.etiqueta,
    color: t.colors.texto,
    marginTop: t.spacing.md,
  },
  totalCaja: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: t.spacing.md,
    marginBottom: t.spacing.lg,
    borderWidth: 1,
    borderColor: t.colors.borde,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.superficie,
  },
  totalEtiqueta: { ...t.typography.subtitulo, color: t.colors.texto },
  totalPrecio: { ...t.typography.titulo, color: t.colors.acento },
  libros: { marginBottom: t.spacing.sm },
  tituloSeccion: { ...t.typography.subtitulo, color: t.colors.texto, marginBottom: t.spacing.md },
  botonSecundario: { marginTop: t.spacing.sm },
});

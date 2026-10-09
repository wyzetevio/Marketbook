import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCarrito } from '../../hooks';
import { useAppTheme, useEstilos } from '../../theme';
import {
  Aviso,
  BookCard,
  Button,
  EmptyState,
  Header,
  HojaConfirmacion,
  LoadingView,
} from '../../components';
import { formatearPrecio } from '../../utils/formato';

export default function CartScreen({ navigation }) {
  const { items, cantidad, total, cargando, quitar, vaciar } = useCarrito();
  const t = useAppTheme();
  const styles = useEstilos(crearEstilos);
  const [confirmandoVaciar, setConfirmandoVaciar] = useState(false);
  const [error, setError] = useState('');

  const continuarExplorando = () => {
    setError('');
    navigation.navigate('Explorar');
  };

  const eliminarLibro = (id) => {
    try {
      setError('');
      quitar(id);
    } catch (e) {
      setError(e?.message || 'No se pudo quitar el libro del carrito.');
    }
  };

  const confirmarVaciado = () => {
    try {
      setError('');
      vaciar();
      setConfirmandoVaciar(false);
    } catch (e) {
      setError(e?.message || 'No se pudo vaciar el carrito.');
      setConfirmandoVaciar(false);
    }
  };

  const irAlCheckout = () => {
    if (cantidad === 0) return;
    setError('');
    const checkoutRegistrado = navigation.getParent()?.getState()?.routeNames?.includes('Checkout') ?? false;
    if (!checkoutRegistrado) {
      setError('Checkout todavía no está disponible. César debe registrar la ruta antes de continuar.');
      return;
    }
    navigation.navigate('Checkout');
  };

  if (cargando) {
    return (
      <View style={styles.pantalla}>
        <Header titulo="Mi carrito" />
        <LoadingView mensaje="Recuperando tu carrito..." />
      </View>
    );
  }

  const accionVaciar = cantidad > 0 ? (
    <Pressable
      onPress={() => {
        setError('');
        setConfirmandoVaciar(true);
      }}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Vaciar carrito"
      style={({ pressed }) => [styles.accionVaciar, pressed && styles.presionado]}
    >
      <Ionicons name="trash-outline" size={22} color={t.colors.peligro} />
    </Pressable>
  ) : null;

  const pieCarrito = (
    <View style={styles.pie}>
      <View style={styles.filaResumen}>
        <View>
          <Text style={styles.totalEtiqueta}>Total</Text>
          <Text style={styles.totalDetalle}>
            {cantidad} {cantidad === 1 ? 'ejemplar' : 'ejemplares'}
          </Text>
        </View>
        <Text style={styles.total}>{formatearPrecio(total)}</Text>
      </View>

      <Button
        titulo="Proceder al checkout"
        icono="arrow-forward-outline"
        onPress={irAlCheckout}
        deshabilitado={cantidad === 0}
      />
      <Button
        titulo="Continuar explorando"
        variante="texto"
        onPress={continuarExplorando}
        estilo={styles.botonExplorar}
      />
    </View>
  );

  return (
    <View style={styles.pantalla}>
      <Header titulo="Mi carrito" derecha={accionVaciar} />

      {cantidad === 0 ? (
        <View style={styles.vacio}>
          {error ? <Aviso mensaje={error} /> : null}
          <EmptyState
            icono="cart-outline"
            titulo="Tu carrito está vacío"
            mensaje="Explora el catálogo y agrega los libros que quieras comprar."
            textoAccion="Explorar libros"
            onAccion={continuarExplorando}
          />
        </View>
      ) : (
        <ScrollView
          style={styles.lista}
          contentContainerStyle={styles.contenidoLista}
          showsVerticalScrollIndicator={false}
        >
          {error ? <Aviso mensaje={error} /> : null}

          <View style={styles.resumenSuperior}>
            <Text style={styles.cantidad}>
              {cantidad} {cantidad === 1 ? 'libro' : 'libros'}
            </Text>
            <Text style={styles.ayuda}>Cada publicación corresponde a un ejemplar único.</Text>
          </View>

          {items.map((libro) => (
            <BookCard
              key={String(libro.id)}
              libro={libro}
              mostrarVendedor={false}
              derecha={(
                <Pressable
                  onPress={() => eliminarLibro(libro.id)}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={`Quitar ${libro.titulo} del carrito`}
                  style={({ pressed }) => [styles.eliminar, pressed && styles.presionado]}
                >
                  <Ionicons name="trash-outline" size={20} color={t.colors.peligro} />
                </Pressable>
              )}
            />
          ))}
        </ScrollView>
      )}

      {pieCarrito}

      <HojaConfirmacion
        visible={confirmandoVaciar}
        titulo="Vaciar carrito"
        mensaje={`¿Quieres quitar ${cantidad === 1 ? 'este libro' : `los ${cantidad} libros`} del carrito?`}
        textoConfirmar="Sí, vaciar carrito"
        onConfirmar={confirmarVaciado}
        onCancelar={() => setConfirmandoVaciar(false)}
      />
    </View>
  );
}

const crearEstilos = (t) => ({
  pantalla: { flex: 1, backgroundColor: t.colors.fondo },
  vacio: { flex: 1, paddingHorizontal: t.spacing.md },
  lista: { flex: 1 },
  contenidoLista: {
    paddingHorizontal: t.spacing.md,
    paddingBottom: t.spacing.sm,
  },
  resumenSuperior: { marginBottom: t.spacing.md },
  cantidad: { ...t.typography.subtitulo, color: t.colors.texto },
  ayuda: { ...t.typography.pequeno, color: t.colors.textoSecundario, marginTop: t.spacing.xs },
  accionVaciar: {
    width: 40,
    height: 40,
    borderRadius: t.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eliminar: {
    width: 40,
    height: 40,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.peligroSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presionado: { opacity: 0.7 },
  pie: {
    paddingHorizontal: t.spacing.md,
    paddingTop: t.spacing.md,
    paddingBottom: t.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: t.colors.borde,
    backgroundColor: t.colors.superficie,
  },
  filaResumen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: t.spacing.md,
  },
  totalEtiqueta: { ...t.typography.subtitulo, color: t.colors.texto },
  totalDetalle: { ...t.typography.pequeno, color: t.colors.textoSecundario, marginTop: 2 },
  total: { ...t.typography.titulo, color: t.colors.acento },
  botonExplorar: { alignSelf: 'center' },
});

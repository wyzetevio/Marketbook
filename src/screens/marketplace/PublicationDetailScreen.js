import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function PublicationDetailScreen({ route }) {
  const { libro } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {libro.titulo}
      </Text>

      <Text style={styles.author}>
        {libro.autor}
      </Text>

      <Text style={styles.label}>Estado</Text>
      <Text>{libro.estado}</Text>

      <Text style={styles.label}>Precio</Text>

      <Text style={styles.price}>
        {libro.precio}
      </Text>

      <Text style={styles.label}>Descripción</Text>

      <Text style={styles.description}>
        Ejemplar publicado por un usuario del Marketplace
        de Libros. Información simulada para el primer avance.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          Alert.alert(
            'Carrito',
            'Libro agregado al carrito.'
          )
        }
      >
        <Text style={styles.buttonText}>
          Agregar al carrito
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 28,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 30,
  },

  author: {
    color: '#777777',
    marginBottom: 25,
  },

  label: {
    fontWeight: '700',
    marginTop: 18,
  },

  price: {
    fontSize: 24,
    fontWeight: '700',
  },

  description: {
    color: '#666666',
    lineHeight: 22,
    marginTop: 6,
  },

  button: {
    backgroundColor: '#202020',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 35,
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
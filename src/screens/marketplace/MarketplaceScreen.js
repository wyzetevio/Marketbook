import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const publicaciones = [
  {
    id: '1',
    titulo: 'Cien Años de Soledad',
    autor: 'Gabriel García Márquez',
    precio: 'S/ 18.99',
    estado: 'Como nuevo',
  },
  {
    id: '2',
    titulo: 'El Principito',
    autor: 'Antoine de Saint-Exupéry',
    precio: 'S/ 12.50',
    estado: 'Nuevo',
  },
  {
    id: '3',
    titulo: '1984',
    autor: 'George Orwell',
    precio: 'S/ 15.99',
    estado: 'Bueno',
  },
];

export default function MarketplaceScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>

      <Text style={styles.subtitle}>
        Compra y vende libros físicos
      </Text>

      <TouchableOpacity
        style={styles.sellButton}
        onPress={() => navigation.navigate('CreatePublication')}
      >
        <Text style={styles.sellText}>
          + Vender un libro
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>
        Publicaciones
      </Text>

      {publicaciones.map((libro) => (
        <TouchableOpacity
          key={libro.id}
          style={styles.card}
          onPress={() =>
            navigation.navigate('PublicationDetail', { libro })
          }
        >
          <Text style={styles.bookTitle}>
            {libro.titulo}
          </Text>

          <Text>{libro.autor}</Text>
          <Text>{libro.estado}</Text>

          <Text style={styles.price}>
            {libro.precio}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 22,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 30,
  },

  subtitle: {
    color: '#999999',
    marginBottom: 20,
  },

  sellButton: {
    backgroundColor: '#202020',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 25,
  },

  sellText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  card: {
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  bookTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  price: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 6,
  },
});
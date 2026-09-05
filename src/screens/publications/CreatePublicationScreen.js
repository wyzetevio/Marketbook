import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function CreatePublicationScreen() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const publicar = () => {
    if (!titulo.trim() || !autor.trim() || !precio.trim()) {
      Alert.alert(
        'Campos incompletos',
        'Completa título, autor y precio.'
      );
      return;
    }

    Alert.alert(
      'Publicación creada',
      'El libro fue publicado correctamente.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vender libro</Text>

      <Text style={styles.subtitle}>
        Crea una publicación para tu ejemplar
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={autor}
        onChangeText={setAutor}
      />

      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"
      />

      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <TouchableOpacity
        style={styles.photoButton}
        onPress={() =>
          Alert.alert(
            'Fotografías',
            'Cámara y galería se implementarán posteriormente.'
          )
        }
      >
        <Text>📷 Agregar fotografías</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={publicar}
      >
        <Text style={styles.buttonText}>
          Publicar libro
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 25,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    marginTop: 30,
  },

  subtitle: {
    color: '#999999',
    marginBottom: 25,
  },

  input: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 8,
    marginBottom: 15,
  },

  description: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  photoButton: {
    borderWidth: 1,
    borderColor: '#dddddd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  button: {
    backgroundColor: '#202020',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 25,
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
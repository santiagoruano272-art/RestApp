import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';


const DetailScreen = ({ route }) => {
  // 📥 Recibir datos
  const item = route.params?.item;

  // ❌ Si no hay datos (evita crash en monkey testing)
  if (!item) {
    return <EmptyState message="No hay información disponible" />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* 📸 Imagen */}
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <EmptyState message="Sin imagen disponible" />
      )}

      {/* 🏷️ Nombre */}
      <Text style={styles.title}>
        {item.name || 'Local'}
      </Text>

      {/* 📝 Descripción */}
      <Text style={styles.description}>
        {item.description || 'Sin descripción'}
      </Text>

      {/* 📍 Ubicación */}
      {item.location ? (
        <View style={styles.locationBox}>
          <Text style={styles.locationTitle}>Ubicación</Text>
          <Text style={styles.location}>
            Lat: {item.location.latitude}
          </Text>
          <Text style={styles.location}>
            Lng: {item.location.longitude}
          </Text>
        </View>
      ) : (
        <Text style={styles.noLocation}>
          No hay ubicación disponible
        </Text>
      )}
    </ScrollView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginBottom: 15,
  },
  locationBox: {
    backgroundColor: '#f1f2f6',
    padding: 10,
    borderRadius: 10,
  },
  locationTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    fontSize: 13,
    color: '#333',
  },
  noLocation: {
    color: '#888',
  },
});
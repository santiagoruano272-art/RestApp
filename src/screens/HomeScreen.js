import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import RestaurantCard from '../components/RestaurantCard';
import Loader from '../components/Loader';

const HomeScreen = ({ navigation, route }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 ESCUCHAR NUEVO POST
  useEffect(() => {
    if (route.params?.newPost) {
      setRestaurants(prev => [
        route.params.newPost,
        ...prev,
      ]);

      // ⚠️ limpiar params para evitar duplicados
      navigation.setParams({ newPost: undefined });
    }
  }, [route.params]);

  const handleCreate = () => {
    navigation.navigate('Create');
  };

  const renderItem = ({ item }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() =>
        navigation.navigate('Detail', { item })
      }
    />
  );

  return (
    <View style={styles.container}>

      {/* Botón */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
      >
        <Text style={styles.buttonText}>
          Agregar Local
        </Text>
      </TouchableOpacity>

      {/* Lista */}
      {restaurants.length === 0 ? (
        <Text style={styles.empty}>
          No hay Locales aún
        </Text>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
  },
});
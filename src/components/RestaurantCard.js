import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const RestaurantCard = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: restaurant.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title}>{restaurant.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {restaurant.description}
        </Text>
        <Text style={styles.location}>
          📍 {restaurant.location?.latitude}, {restaurant.location?.longitude}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  location: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});
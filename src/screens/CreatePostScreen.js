import React, { useState } from 'react';
import { View,Text,StyleSheet,Image,Alert,ScrollView,TextInput,TouchableOpacity,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';

const CreatePostScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [cameraPermission, setCameraPermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  // 📸 Tomar foto
  const handlePickImage = async () => {
    if (loading) return;

    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        setCameraPermission(false);
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a la cámara'
        );
        return;
      }

      setCameraPermission(true);

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        // 📳 Vibración
        await Haptics.impactAsync(
          Haptics.ImpactFeedbackStyle.Medium
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo abrir la cámara');

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
    }
  };

  // 📍 Obtener ubicación
  const handleGetLocation = async () => {
    if (loading) return;

    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationPermission(false);
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a la ubicación'
        );
        return;
      }

      setLocationPermission(true);

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo obtener la ubicación');

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
    }
  };

  // ✅ Validaciones
  const validateForm = () => {
    if (!image) {
      Alert.alert('Error', 'Debes tomar una foto');
      return false;
    }

    if (!description || description.length < 5) {
      Alert.alert('Error', 'Descripción muy corta');
      return false;
    }

    if (!location) {
      Alert.alert('Error', 'Debes obtener la ubicación');
      return false;
    }

    return true;
  };

  // 🚀 Publicar
  const handleSubmit = async () => {
    if (loading) return;

    if (!validateForm()) return;

    try {
      setLoading(true);

      const newPost = {
        name: name || 'Local',
        description,
        image,
        location,
        createdAt: new Date().toISOString(),
      };

      console.log('POST:', newPost);

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      Alert.alert('Éxito', 'Publicado correctamente');

      // Reset
      setImage(null);
      setDescription('');
      setName('');
      setLocation(null);

      navigation.navigate('Home', { newPost });
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo publicar');

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Imagen */}
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.empty}>No has tomado foto</Text>
      )}

      {/* Permisos */}
      {cameraPermission === false && (
        <Text style={styles.error}>
          Necesitamos acceso a la cámara
        </Text>
      )}

      {locationPermission === false && (
        <Text style={styles.error}>
          Necesitamos acceso a la ubicación
        </Text>
      )}

      {/* Ubicación */}
      {!location && (
        <Text style={styles.warning}>
          ⚠️ Aún no has obtenido la ubicación
        </Text>
      )}

      {location && (
        <Text style={styles.location}>
          📍 {location.latitude}, {location.longitude}
        </Text>
      )}

      {/* Inputs */}
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nombre del restaurante"
        style={styles.input}
      />

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Describe lo que venden..."
        multiline
        style={styles.input}
      />

      {/* Botones */}
      <TouchableOpacity
        style={styles.button}
        onPress={handlePickImage}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Tomar foto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGetLocation}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Obtener ubicación</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Publicando...' : 'Publicar'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  location: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  warning: {
    color: 'orange',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
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
    color: '#888',
    marginBottom: 10,
  },
});
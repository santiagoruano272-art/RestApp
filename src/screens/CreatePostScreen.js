import React, { useState, useRef } from 'react';
import { View,Text,StyleSheet,Image,Alert,ScrollView,TextInput,TouchableOpacity,} from 'react-native';

import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';

const CreatePostScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [locationPermission, setLocationPermission] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef(null);

  // 📸 Abrir cámara
  const openCamera = async () => {
    const result = await requestPermission();

    if (!result.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara');
      return;
    }

    setShowCamera(true);
  };

  // 📸 Tomar foto
  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      setImage(photo.uri);
      setShowCamera(false);

      await Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Medium
      );
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo tomar la foto');
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
    }
  };

  // ✅ Validación
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

      setImage(null);
      setDescription('');
      setName('');
      setLocation(null);

      navigation.navigate('Home', { newPost });
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudo publicar');
    } finally {
      setLoading(false);
    }
  };

  // 📷 Vista de cámara
  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          ref={cameraRef}
          facing="back"
        />

        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePhoto}
        >
          <Text style={styles.buttonText}>Tomar Foto</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 📱 Vista principal
  return (
    <ScrollView style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.empty}>No has tomado foto</Text>
      )}

      {permission && !permission.granted && (
        <Text style={styles.error}>
          Permiso de cámara denegado
        </Text>
      )}

      {locationPermission === false && (
        <Text style={styles.error}>
          Permiso de ubicación denegado
        </Text>
      )}

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

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nombre del local"
        style={styles.input}
      />

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Describe lo que venden..."
        multiline
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={openCamera}
      >
        <Text style={styles.buttonText}>
          Abrir cámara
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleGetLocation}
      >
        <Text style={styles.buttonText}>
          Obtener ubicación
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
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
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 50,
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
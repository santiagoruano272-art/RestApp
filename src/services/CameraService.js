
import * as ImagePicker from 'expo-image-picker';

/**
 * Solicita permisos de cámara
 */
export const requestCameraPermission = async () => {
  try {
    const result = await ImagePicker.requestCameraPermissionsAsync();
    return result.granted;
  } catch (error) {
    console.log('Error permiso cámara:', error);
    return false;
  }
};

/**
 * Abre la cámara y toma una foto
 */
export const takePhoto = async () => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (result.canceled) return null;

    return result.assets[0].uri;
  } catch (error) {
    console.log('Error tomando foto:', error);
    return null;
  }
};

/**
 * Abrir galería (opcional pero recomendado)
 */
export const pickImageFromGallery = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });

    if (result.canceled) return null;

    return result.assets[0].uri;
  } catch (error) {
    console.log('Error galería:', error);
    return null;
  }
};
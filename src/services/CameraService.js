
import * as ImagePicker from 'expo-image-picker';
//Permisos de cámara 
export const requestCameraPermission = async () => {
  try {
    const result = await ImagePicker.requestCameraPermissionsAsync();
    return result.granted;
  } catch (error) {
    console.log('Error permiso cámara:', error);
    return false;
  }
};
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
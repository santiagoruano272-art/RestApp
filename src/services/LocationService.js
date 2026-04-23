import * as Location from 'expo-location';

/**
 * Solicita permisos de ubicación
 */
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.log('Error permiso ubicación:', error);
    return false;
  }
};

/**
 * Obtiene la ubicación actual
 */
export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) return null;

    const loc = await Location.getCurrentPositionAsync({});

    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
  } catch (error) {
    console.log('Error obteniendo ubicación:', error);
    return null;
  }
};
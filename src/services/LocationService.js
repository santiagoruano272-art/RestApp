import * as Location from 'expo-location';

// 🔐 Permiso
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.log('Error permiso ubicación:', error);
    return false;
  }
};

// 📍 Obtener ubicación 
export const getCurrentLocation = async () => {
  try {
    // 1. Permisos
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      throw new Error('Permiso denegado');
    }

    // 2. GPS activo
    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      throw new Error('GPS desactivado');
    }

    // 3. Obtener ubicación con control de tiempo y precisión
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeout: 3000,
    });

    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };

  } catch (error) {
    console.log('LOCATION SERVICE ERROR:', error.message);
    return null;
  }
};
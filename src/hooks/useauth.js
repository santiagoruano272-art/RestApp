import React, { createContext, useContext, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

// Crear contexto
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔐 Login con biometría
  const login = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();

      if (!compatible) {
        alert('El dispositivo no soporta biometría');
        return;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!enrolled) {
        alert('No hay datos biométricos registrados');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Iniciar sesión',
        fallbackLabel: 'Usar contraseña',
      });

      if (result.success) {
        setUser({ name: 'Usuario' });
      } else {
        alert('Autenticación fallida');
      }

    } catch (error) {
      console.log(error);
      alert('Error en autenticación');
    }
  };

  // 🔓 Logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = () => {
  return useContext(AuthContext);
};
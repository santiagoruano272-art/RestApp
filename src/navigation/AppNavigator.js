import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../hooks/useauth';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import DetailScreen from '../screens/DetailScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>

        {user ? (
          // 🔓 Usuario autenticado
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Create" component={CreatePostScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} />
          </>
        ) : (
          // 🔐 Usuario NO autenticado
          <Stack.Screen name="Login" component={LoginScreen} />
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
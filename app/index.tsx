// app/index.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { config } from "@gluestack-ui/config"
import { GluestackUIProvider } from "@gluestack-ui/themed"
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import AuthNavigator from '@/src/navigation/AuthNavigator';
import MainNavigator from '@/src/navigation/MainNavigator';

const Stack = createStackNavigator();

const AppContent = () => {
  const { isLoggedIn, user } = useAuth() as { isLoggedIn(): boolean, user: any }; // Now works correctly
  return isLoggedIn() ? <MainNavigator /> : <AuthNavigator />;
};

const App = () => {
  const { isLoggedIn } = useAuth() as any;
  return (
    <GluestackUIProvider config={config}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
    </GluestackUIProvider>
  );
};

export default App;
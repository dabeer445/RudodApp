// app/index.tsx
import 'react-native-gesture-handler'; 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from '../src/context/AuthContext';
import LoginScreen from '../src/screens/auth/LoginScreen';
import RegisterScreen from '../src/screens/auth/RegisterScreen';
import HomeScreen from '../src/screens/main/HomeScreen'; 
import CreateOrderScreen from '../src/screens/main/CreateOrderScreen'; 
import OrdersScreen from '../src/screens/main/OrdersScreen'; 
import OrderDetailsScreen from '../src/screens/main/OrderDetailsScreen'; 

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateOrderScreen" component={CreateOrderScreen} />
          <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
          <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        </Stack.Navigator>
    </AuthProvider>
  );
};

export default App;
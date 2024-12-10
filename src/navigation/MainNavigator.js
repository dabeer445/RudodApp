// src/navigation/MainNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@/src/screens/main/HomeScreen";
import CreateOrderScreen from "@/src/screens/main/CreateOrderScreen";
import OrdersScreen from "@/src/screens/main/OrdersScreen";
import OrderDetailsScreen from "@/src/screens/main/OrderDetailsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { Home, Plus, ListIcon } from "lucide-react";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabScreens = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Home: <Home size={size} color={color} />,
          Create: <Plus size={size} color={color} />,
          "View All Orders": <ListIcon size={size} color={color} />,
        };
        return icons[route.name];
      },
      headerStyle: {
        backgroundColor: 'white',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f5'
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20
      }
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Create" component={CreateOrderScreen} />
    <Tab.Screen name="View All Orders" component={OrdersScreen} />
  </Tab.Navigator>
);

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabScreens" component={TabScreens} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    </Stack.Navigator>
  );
}

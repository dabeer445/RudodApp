// src/screens/main/OrdersScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
} from "react-native";
import { useAuth } from "@/src/context/AuthContext"; // Import your useAuth hook
import { getOrders } from "@/src/services/order.service"; // Ensure you have this function implemented

const OrdersScreen = ({navigation}) => {
  const { user } = useAuth(); // Access user from context
  const [orders, setOrders] = useState([]); // State to hold the orders
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchOrders = async () => {
      if (user && user.token) {
        // Check if user and token exist
        setLoading(true); // Set loading state to true
        try {
          const response = await getOrders(user.token); // Call the order fetching API
          setOrders(response.data.data); // Set orders in state
        } catch (err) {
          setError(err.message); // Set error if there's an issue
          Alert.alert(
            "Error fetching orders",
            err.message || "An unknown error occurred."
          );
        } finally {
          setLoading(false); // Reset loading state
        }
      } else {
        Alert.alert("Unauthorized", "You need to be logged in to view orders.");
      }
    };

    fetchOrders();
  }, [user]);

  // Render function for individual order items
  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Pickup Location: {item.pickup_location}</Text>
      <Text>Delivery Location: {item.delivery_location}</Text>
      <Text>Created At: {new Date(item.created_at).toLocaleDateString()}</Text>
      <Button 
        title="View Details"
        onPress={() => navigation.navigate('OrderDetails', { order: item })} // Navigate to OrderDetailsScreen
      />
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.errorText}>No Orders</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  orderCard: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default OrdersScreen;

// src/screens/main/HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { getOrders } from "@/src/services/order.service";
import { getUnreadMessages } from "@/src/services/message.service"; // Make sure this function is implemented

const HomeScreen = ({ navigation }) => {
  const { user, handleLogout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.token) {
          // Fetch orders
          const ordersResponse = await getOrders(user.token);
          setOrders(ordersResponse.data.data); // Assuming orders are in response.data

          // Fetch unread messages
          const messagesResponse = await getUnreadMessages(user.token);
          setUnreadMessages(messagesResponse.data.data); // Assuming messages are in response.data
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageCard}>
      <Text style={styles.messageSender}>{item.sender.name}:</Text>{" "}
      {/* Display sender's name */}
      <Text>{item.content}</Text>
    </View>
  );

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text style={styles.title}>Welcome, {user.name}!</Text>
          <Button
            title="Create New Order"
            onPress={() => navigation.navigate("CreateOrderScreen")}
          />
          <Button
            title="View Orders"
            onPress={() => navigation.navigate("OrdersScreen")}
          />
          <Button title="Logout" onPress={handleLogout} />

          <Text style={styles.subtitle}>Your Latest Orders:</Text>
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderOrderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <Text style={styles.subtitle}>Your Latest Unread Messages:</Text>
          <FlatList
            data={unreadMessages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessageItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "bold",
  },
  orderCard: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  messageCard: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#e7f3ff",
  },
  messageSender: {
    fontWeight: "bold",
  },
});

export default HomeScreen;

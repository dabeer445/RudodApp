// src/screens/main/CreateOrderScreen.js
import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/src/context/AuthContext"; // Import your useAuth hook
import { createOrder } from "@/src/services/order.service"; // Ensure this import matches your actual service

const CreateOrderScreen = ({ navigation }) => {
  const { user } = useAuth(); // Access user from context
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [cargoWeight, setCargoWeight] = useState("");
  const [cargoDimensions, setCargoDimensions] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  useEffect(() => {
    // You can fetch user's orders using the user information.
    console.log("Current user:", user);
    // Here you might trigger an API call to get the user's orders
  }, [user]);

  const handleCreateOrder = async () => {
    try {
      const orderDetails = {
        pickup_location: pickupLocation,
        delivery_location: deliveryLocation,
        cargo_details: {
          weight: cargoWeight,
        //   dimensions: cargoDimensions,
        },
        pickup_time: pickupTime,
        delivery_time: deliveryTime,
      };

      const token = user.token; // Retrieve user's token from context or where it's stored
      const response = await createOrder(orderDetails, token);

      Alert.alert("Order Created", "Your order has been successfully created!");
      navigation.navigate("Home"); // Navigate back to Home Screen after successful order creation
    } catch (error) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "An error occurred while creating the order."
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Pickup Location"
        value={pickupLocation}
        onChangeText={setPickupLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Delivery Location"
        value={deliveryLocation}
        onChangeText={setDeliveryLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo Weight"
        value={cargoWeight}
        onChangeText={setCargoWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo Dimensions"
        value={cargoDimensions}
        onChangeText={setCargoDimensions}
      />
      <TextInput
        style={styles.input}
        placeholder="Pickup Time"
        value={pickupTime}
        onChangeText={setPickupTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Delivery Time"
        value={deliveryTime}
        onChangeText={setDeliveryTime}
      />
      <Button title="Create Order" onPress={handleCreateOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

export default CreateOrderScreen;

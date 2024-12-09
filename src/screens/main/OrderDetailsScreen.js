// src/screens/main/OrderDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/src/context/AuthContext';
import { sendMessage, fetchMessages } from '@/src/services/message.service';

const OrderDetailsScreen = ({ route }) => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const order = route.params.order;

  const [messages, setMessages] = useState([]); // State for messages
  const [newMessage, setNewMessage] = useState(''); // State for new message input
  const [loadingMessages, setLoadingMessages] = useState(false); // Loading state for messages

  useEffect(() => {
    const fetchOrderMessages = async () => {
      if (order.id) {
        setLoadingMessages(true);
        try {
          const response = await fetchMessages(order.id, user.token); // Fetch messages for the order
          setMessages(response.data.data); // Assuming response.data contains the messages
        } catch (error) {
          Alert.alert('Error fetching messages', error.message || 'An error occurred while fetching messages.');
        } finally {
          setLoadingMessages(false);
        }
      }
    };

    fetchOrderMessages();
  }, [order.id, user.token]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Invalid input', 'Please enter a message.'); // Basic validation
      return;
    }

    try {
      await sendMessage(order.id, newMessage, user.token); // Send the message
      setNewMessage(''); // Clear the input

      // Optionally, fetch messages again to refresh the view
      const response = await fetchMessages(order.id, user.token);
      setMessages(response.data.data);
      Alert.alert('Message Sent', 'Your message has been sent to the admin.');
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred while sending the message.');
    }
  };

  // Render function for individual message items
  const renderMessageItem = ({ item }) => (
    <View style={styles.messageCard}>
      <Text style={styles.messageSender}>{item.sender.name}:</Text> {/* Access sender's name */}
      <Text>{item.content}</Text> {/* Message content */}
      <Text style={styles.messageTime}>
        {new Date(item.created_at).toLocaleString()} {/* Created time of the message */}
      </Text>
      <Text style={styles.messageStatus}>
        {item.is_read ? 'Read' : 'Unread'} {/* Status of the message */}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order ID: {order.id}</Text>
      <Text>Status: {order.status}</Text>
      <Text>Pickup Location: {order.pickup_location}</Text>
      <Text>Delivery Location: {order.delivery_location}</Text>
      <Text>Created At: {new Date(order.created_at).toLocaleString()}</Text>

      {/* Messages section */}
      <Text style={styles.subtitle}>Messages</Text>
      {loadingMessages ? (
        <Text>Loading messages...</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessageItem}
          style={styles.messageList}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Input for new message */}
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={newMessage}
        onChangeText={setNewMessage}
      />
      <Button title="Send Message" onPress={handleSendMessage} />
      <Button title="Back to Orders" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
  },
  messageCard: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  messageSender: {
    fontWeight: 'bold',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
  },
  messageStatus: {
    fontSize: 12,
    color: '#888',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

export default OrderDetailsScreen;
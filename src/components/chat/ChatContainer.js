// src/components/chat/ChatContainer.js
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@gluestack-ui/themed";
import { useApi } from "@/src/hooks/useApi";
import {
  getMessagesByOrderId,
  sendMessage,
} from "@/src/services/message.service";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatContainer = ({ orderId }) => {
  const getMessagesApi = useApi(getMessagesByOrderId);
  const sendMessageApi = useApi(sendMessage);
  const [messages, setMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const mountedRef = useRef(true);
  const fetchMessages = useCallback(async () => {
    if (
      !refreshing &&
      !getMessagesApi.loading &&
      orderId &&
      mountedRef.current
    ) {
      try {
        const response = await getMessagesApi.request(orderId);
        if (mountedRef.current) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
  }, [orderId]);

  useEffect(() => {
    mountedRef.current = true;
    fetchMessages();

    return () => {
      mountedRef.current = false;
    };
  }, [orderId]);


  const handleRefresh = useCallback(async () => {
    if (mountedRef.current) {
      setRefreshing(true);
      await fetchMessages();
      setRefreshing(false);
    }
  }, [fetchMessages]);

  const handleSendMessage = useCallback(
    async (content) => {
      if (!content.trim() || !orderId) return false;

      try {
        const response = await sendMessageApi.request(orderId, content);
        if (mountedRef.current) {
          setMessages((prev) => [response.data, ...prev]);
        }
        return true;
      } catch (error) {
        console.error("Error sending message:", error);
        return false;
      }
    },
    [orderId]
  );

  return (
    <Box
      flex={1}
      bg="$white"
      borderRadius="$lg"
      borderWidth={1}
      borderColor="$borderLight100"
    >
      <MessageList
        messages={messages.reverse()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        loading={getMessagesApi.loading}
      />
      <MessageInput
        onSend={handleSendMessage}
        loading={sendMessageApi.loading}
      />
    </Box>
  );
};

export default ChatContainer;

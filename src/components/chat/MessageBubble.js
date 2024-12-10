// src/components/chat/MessageBubble.js
import React from "react";
import { Box, Text, VStack } from "@gluestack-ui/themed";
import { format } from "date-fns";
import { useAuth } from "@/src/context/AuthContext";

const MessageBubble = ({ message }) => {
  const { user } = useAuth();
  const isOwn = message.sender.id === user?.id;
  return (
    <Box
      width="100%"
      px="$4"
      py="$2"
      alignItems={isOwn ? "flex-end" : "flex-start"}
    >
      <VStack space="xs" maxWidth="80%">
        {!isOwn && (
          <Text size="xs" color="$gray500">
            {message.sender.name}
          </Text>
        )}
        <Box
          bg={isOwn ? "$primary100" : "$secondary100"}
          p="$3"
          borderRadius="$xl"
          borderTopRightRadius={isOwn ? "$none" : "$xl"}
          borderTopLeftRadius={isOwn ? "$xl" : "$none"}
        >
          <Text color="$gray800">{message.content}</Text>
        </Box>
        <Box
         alignItems={isOwn ? "flex-end" : "flex-start"}
         >
          <Text size="xs" color="$gray400">
            {format(new Date(message.created_at), "MMM d, h:mm a")}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default MessageBubble;

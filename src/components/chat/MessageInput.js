// src/components/chat/MessageInput.js
import React from "react";
import {
  Box,
  HStack,
  Input,
  InputField,
  Button,
  ButtonIcon,
  Spinner,
} from "@gluestack-ui/themed";
import { Send as SendIcon } from "lucide-react"; // Fixed import

const MessageInput = ({ onSend, loading }) => {
  const [message, setMessage] = React.useState("");

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const success = await onSend(message.trim());
    if (success) {
      setMessage("");
    }
  };

  return (
    <Box
      px="$4"
      py="$3"
      borderRadius="$lg"
      borderTopWidth={1}
      borderColor="$borderLight100"
      bg="white"
    >
      <HStack space="sm" alignItems="flex-end">
        <Input
          flex={1}
          size="md"
          borderWidth={1}
          borderColor="$gray200"
          bg="$gray50"
          rounded="$full"
        >
          <InputField
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSend}
            multiline
            maxHeight={100}
            style={{
              maxHeight: 100, // Ensures consistent max height
              minHeight: 40, // Ensures minimum height
            }}
          />
        </Input>

        <Button
          size="lg"
          className="rounded-full p-3.5"
          variant="solid"
          borderRadius="$full"
          bg={message.trim() ? "$primary500" : "$gray300"}
          onPress={handleSend}
          disabled={!message.trim() || loading}
        >
          {loading ? (
            <Spinner size="small" color="white" />
          ) : (
            <ButtonIcon as={SendIcon} />
          )}
        </Button>
      </HStack>
    </Box>
  );
};
export default MessageInput;

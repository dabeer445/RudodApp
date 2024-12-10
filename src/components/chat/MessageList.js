// src/components/chat/MessageList.js
import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { Box, Center, Spinner } from "@gluestack-ui/themed";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages, onRefresh, refreshing, loading, style }) => {
  const renderMessage = ({ item }) => <MessageBubble message={item} />;

  const renderFooter = () => {
    if (!loading || refreshing) return null;
    return (
      <Center py="$4">
        <Spinner size="small" />
      </Center>
    );
  };

  return (
    <Box flex={1}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          height: "0px",
          paddingBottom: "4rem"
        }}
        showsVerticalScrollIndicator={true}
        initialNumToRender={7}
        maxToRenderPerBatch={7}
        windowSize={7}
      />
    </Box>
  );

  //     <Box flex={1} pb="$16">
  //       {" "}
  //       {/* Add padding bottom to account for input */}
  //       <FlatList
  //         data={messages}
  //         renderItem={({ item }) => <MessageBubble message={item} />}
  //         keyExtractor={(item) => item.id.toString()}
  //         contentContainerStyle={{
  //           height:"0px",
  //         //   paddingBottom: 60, // Adjust this value based on your MessageInput height
  //         }}
  //         inverted={false}
  //         showsVerticalScrollIndicator={true}
  //       />
  //     </Box>
  //   );
};

export default MessageList;

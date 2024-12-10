import React from "react";
import { Box, Text, VStack, HStack, Pressable } from "@gluestack-ui/themed";
import { MapPin, Clock, Package, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";

const OrderCard = ({ order }) => {
  const navigation = useNavigation();
  const getStatusColor = (status) =>
    ({
      pending: "$warning400",
      in_progress: "$info400",
      completed: "$success400",
      cancelled: "$error400",
    }[status.toLowerCase()] || "$gray400");

  const orderDetails = [
    {
      icon: <MapPin size={18} color="#666" />,
      label: "Pickup",
      value: order.pickup_location,
    },
    {
      icon: <MapPin size={18} color="#666" />,
      label: "Delivery",
      value: order.delivery_location,
    },
    {
      icon: <Clock size={18} color="#666" />,
      label: "Pickup Time",
      value: format(new Date(order.pickup_time), "MMM d, h:mm a"),
    },
    {
      icon: <Package size={18} color="#666" />,
      label: "Cargo Details",
      value: order.cargo_details
        ? `${order.cargo_details.weight}kg ${
            order.cargo_details.dimensions
              ? `( ${order.cargo_details.dimensions.length}m x${order.cargo_details.dimensions.width}m x${order.cargo_details.dimensions.height}m )`
              : ""
          }`
        : "-",
    },
  ];

  return (
    <Box id={order.id}>
      <Pressable
        onPress={() =>
          navigation.navigate("OrderDetails", { orderId: order.id })
        }
      >
        <Box
          borderWidth={1}
          borderColor="$borderLight100"
          borderRadius="$xl"
          my="$2"
          bg="$white"
          p="$4"
          shadowColor="$gray300"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={3.84}
          elevation={5}
        >
          <VStack space="md">
            <HStack justifyContent="space-between" alignItems="center">
              <Box bg="$primary50" px="$3" py="$1" borderRadius="$lg">
                <Text color="$primary700" fontWeight="$bold">
                  #{order.id}
                </Text>
              </Box>
              <Box
                bg={getStatusColor(order.status)}
                px="$3"
                py="$1"
                borderRadius="$full"
              >
                <Text
                  color="$white"
                  size="sm"
                  textTransform="capitalize"
                  fontWeight="$medium"
                >
                  {order.status}
                </Text>
              </Box>
            </HStack>

            <Box>
              <HStack flexWrap="wrap" mx="-$2">
                {orderDetails.map((detail, index) => (
                  <Box key={index} width="50%" p="$2">
                    <Box
                      bg="$gray50"
                      p="$3"
                      borderRadius="$lg"
                      // borderWidth={1}
                      // borderColor="$gray100"
                    >
                      <HStack space="$2" alignItems="center" mb="$1">
                        {detail.icon}
                        <Text size="xs" color="$gray500">
                          {detail.label}
                        </Text>
                      </HStack>
                      <Text fontWeight="$medium" numberOfLines={1}>
                        {detail.value}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </HStack>
            </Box>

            {order.messages_count && order.messages_count > 0 && (
              <HStack
                space="$2"
                bg="$error50"
                p="$2"
                borderRadius="$lg"
                alignItems="center"
                alignSelf="flex-start"
              >
                <MessageSquare size={16} color="#ef4444" />
                <Text color="$error600" fontWeight="$medium">
                  {order.messages_count} messages
                </Text>
              </HStack>
            )}
          </VStack>
        </Box>
      </Pressable>
    </Box>
  );
};

export default OrderCard;

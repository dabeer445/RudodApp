import React from "react";
import {
  ScrollView,
  VStack,
  HStack,
  Box,
  Text,
  Button,
  Badge,
  Icon,
  Divider,
  useToast,
  Center,
  Toast,
  ToastDescription,
  ToastTitle,
  Spinner,
  Pressable,
} from "@gluestack-ui/themed";
import { RefreshControl } from "react-native";
import {
  MessageSquare,
  XCircle,
  HelpCircleIcon,
  CloseIcon,
  ArrowLeft,
} from "lucide-react";
import { useApi } from "@/src/hooks/useApi";
import { getOrderById, cancelOrder } from "@/src/services/order.service";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { OrderCard } from "@/src/components";
import ChatContainer from "@/src/components/chat/ChatContainer";

const OrderDetailsScreen = ({ route }) => {
  const { orderId } = route.params;
  const toast = useToast();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);

  // API hooks
  const getOrderApi = useApi(getOrderById);
  const cancelOrderApi = useApi(cancelOrder);

  const fetchData = React.useCallback(async () => {
    if (!refreshing && !getOrderApi.loading) {
      try {
        await Promise.all([getOrderApi.request(orderId)]);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    }
  }, [refreshing, getOrderApi.loading, orderId]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleEditOrder = () => {
    navigation.navigate("EditOrder", { orderId });
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrderApi.request(orderId);
      toast.show({
        action: "success",
        placement: "top",
        render: ({ id, message = "Order Cancelled Succesfully!" }) => {
          return (
            <Toast
              action="success"
              variant="outline"
              nativeID={id}
              className="p-4 gap-6 border-success-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
            >
              <HStack space="md">
                <Icon
                  as={HelpCircleIcon}
                  className="stroke-success-500 mt-0.5"
                />
                <VStack space="xs">
                  <ToastTitle className="font-semibold text-success-500">
                    Success!
                  </ToastTitle>
                  <ToastDescription className="text-typography-700" size="sm">
                    <Text width="100%" overflow="ellipsis" numberOfLines={2}>
                      {message}
                    </Text>
                  </ToastDescription>
                </VStack>
              </HStack>
              <HStack className="min-[450px]:gap-3 gap-1">
                <Pressable onPress={() => toast.close(id)}>
                  <Icon as={CloseIcon} />
                </Pressable>
              </HStack>
            </Toast>
          );
        },
      });
      navigation.goBack({ shouldRefresh: true });
      // navigation.navigate('Home', { shouldRefresh: true });
    } catch (error) {
      // console.log("CCWEE", error);
      const { response } = error;
      console.log(response.data.message);
      toast.show({
        action: "error",
        placement: "top",
        render: ({ id, message = response.data.message }) => {
          return (
            <Toast
              action="error"
              variant="outline"
              nativeID={id}
              className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
            >
              <HStack space="md">
                <Icon as={HelpCircleIcon} className="stroke-error-500 mt-0.5" />
                <VStack space="xs">
                  <ToastTitle className="font-semibold text-error-500">
                    Error!
                  </ToastTitle>
                  <ToastDescription className="text-typography-700" size="sm">
                    <Text width="100%" overflow="ellipsis" numberOfLines={2}>
                      {message}
                    </Text>
                  </ToastDescription>
                </VStack>
              </HStack>
              <HStack className="min-[450px]:gap-3 gap-1">
                <Pressable onPress={() => toast.close(id)}>
                  <Icon as={CloseIcon} />
                </Pressable>
              </HStack>
            </Toast>
          );
        },
      });
    }
  };

  if ((getOrderApi.loading && !refreshing) || !getOrderApi.data) {
    return (
      <Center flex={1}>
        <Spinner size="large" />
      </Center>
    );
  }
  const order = getOrderApi.data.data;

  return (
    <Box flex={1} bg="$backgroundLight50">
      <VStack flex={1} space="md" >
        {/* Header Section */}
        <Box p="$4">
          <HStack justifyContent="center" alignItems="center">
            <Pressable
              onPress={() => navigation.goBack()}
              p="$2"
              bg="$primary50"
              rounded="$lg"
            >
              <ArrowLeft size={20} color="#666" />
            </Pressable>
            <HStack flex={1} justifyContent="center">
              <Text fontSize="$xl" fontWeight="$bold">
                Order #{orderId}
              </Text>
            </HStack>
            <Button
              variant="outline"
              action="negative"
              onPress={handleCancelOrder}
              leftIcon={<Icon as={XCircle} />}
              isDisabled={
                cancelOrder.loading || (order && order.status != "pending")
              }
            >
              Cancel
            </Button>
          </HStack>
        </Box>

        <Divider />
        {order && (
          <VStack flex={1}>
            <Box p="$4">
              <OrderCard order={order} />
            </Box>

            <Divider />

            <Box flex={1} p="$4">
              <HStack space="md" alignItems="center" px="$4" mb="$2">
                <Icon as={MessageSquare} color="$primary" />
                <Text fontSize="$lg" fontWeight="$medium">
                  Communication
                </Text>
              </HStack>
              <Box flex={1}>
                <ChatContainer orderId={order.id} />
              </Box>
            </Box>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default OrderDetailsScreen;

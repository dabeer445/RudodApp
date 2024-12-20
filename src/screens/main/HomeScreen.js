import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Pressable,
  Spinner,
  Center,
} from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useApi } from "@/src/hooks/useApi";
import { getOrders } from "@/src/services/order.service";
import { useAuth } from "@/src/context/AuthContext";
import { OrderCard, MetricsSection } from "@/src/components";

export default function HomeScreen() {
  const { user } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const getOrdersApi = useApi(getOrders);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!refreshing && !getOrdersApi.loading) {
      try {
        await Promise.all([getOrdersApi.request(1)]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, [refreshing, getOrdersApi.loading]);

  useEffect(() => {
    fetchData();
  }, []);

  // Handle refresh when screen gains focus or when shouldRefresh is true
  useEffect(() => {
    if (route.params?.shouldRefresh) {
      fetchData(); // Fetch fresh data
      navigation.setParams({ shouldRefresh: false }); // Reset param to avoid redundant fetches
    }
  }, [route.params?.shouldRefresh, fetchData, navigation]);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const metrics = useMemo(() => {
    return {
      totalOrders: user.stats.total_orders,
      pendingOrders: user.stats.status_counts.pending,
      inProgessOrders: user.stats.status_counts.in_progress,
      completedOrders: user.stats.status_counts.completed,
      cancelledOrders: user.stats.status_counts.cancelled,
    };
  }, [user]);

  if (getOrdersApi.loading && !refreshing) {
    return (
      <Center flex={1}>
        <Spinner size="large" />
      </Center>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Box p="$4">
        <VStack space="$4">
          <Box>
            <Heading size="xl">Welcome back, {user.name}!</Heading>
            <Text color="$gray500">Here's your delivery overview</Text>
          </Box>

          <MetricsSection metrics={metrics} />

          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="lg">Recent Orders</Heading>
            <Pressable onPress={() => navigation.navigate("View All Orders")}>
              <Text color="$blue600" fontWeight="$medium">
                View All
              </Text>
            </Pressable>
          </HStack>

          <VStack>
            {getOrdersApi.data &&
              getOrdersApi.data.data?.map((order) => (
                <OrderCard order={order} />
              ))}
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}

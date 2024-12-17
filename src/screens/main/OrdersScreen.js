import React, { useEffect, useState, useCallback, useRef } from "react";
import { RefreshControl } from "react-native";
import { Box, Spinner, Center, Text, FlatList } from "@gluestack-ui/themed";

import { getOrders } from "@/src/services/order.service";
import { OrderCard } from "@/src/components";
import { useApi } from "@/src/hooks/useApi";

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const getOrdersApi = useApi(getOrders);
  const mounted = useRef(true);
  const loadingRef = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchOrders = useCallback(async (page = 1, shouldAppend = false) => {
    if (!mounted.current || loadingRef.current) return;
    loadingRef.current = true;

    try {
      const response = await getOrdersApi.request(page);

      if (!mounted.current) return;

      const newOrders = response.data;
      if (shouldAppend) {
        setOrders((prev) => [...prev, ...newOrders]);
      } else {
        setOrders(newOrders);
      }
      
      if (!response.links.next) {
        setNextPageUrl(null);
        return;
      }

      const url = new URL(response.links.next);
      const params = new URLSearchParams(url.search);
      setNextPageUrl(params.get("page"));

 
    } catch (error) {
      if (mounted.current) {
        console.error("Error fetching orders:", error, "page:", page);
      }
    } finally {
      if (mounted.current) {
        loadingRef.current = false;
      }
    }
  }, []);

  const onRefresh = useCallback(async () => {
    if (!mounted.current) return;

    setRefreshing(true);
    await fetchOrders(1, false);
    setRefreshing(false);
  }, [fetchOrders]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !nextPageUrl || loadingRef.current) return;
    if (!mounted.current) return;
    setIsLoadingMore(true);
    await fetchOrders(nextPageUrl, true);
    if (mounted.current) {
      setIsLoadingMore(false);
    }
  }, [nextPageUrl, isLoadingMore]);

  useEffect(() => {
    fetchOrders(1, false);
    return () => {
      mounted.current = false;
    };
  }, []);

  const renderFooter = () => {
    if (!isLoadingMore || !nextPageUrl) return null;

    return (
      <Box py="$4">
        <Center>
          <Spinner />
        </Center>
      </Box>
    );
  };

  const renderEmpty = () => {
    if (getOrdersApi.loading) return null;

    return (
      <Text color="$error700" textAlign="center" marginTop="$5">
        No Orders
      </Text>
    );
  };

  const renderHeader = () => (
    <Text fontSize="$2xl" marginBottom="$5">
      Your Orders
    </Text>
  );

  const renderItem = useCallback(({ item }) => <OrderCard order={item} />, []);

  if (getOrdersApi.loading && !refreshing && !isLoadingMore) {
    return (
      <Center flex={1}>
        <Spinner size="large" />
      </Center>
    );
  }

  return (
    <Box flex={1} bg="$backgroundLight50">
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 20,
        }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </Box>
  );
};

export default OrdersScreen;

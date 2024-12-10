import React from "react";
import { Box, Text, HStack } from "@gluestack-ui/themed";
import { Clock, Package } from "lucide-react";

const MetricCard = ({ icon, value, label, bgColor }) => (
  <Box bg={bgColor} borderRadius="$xl" p="$4" flex={1}>
    {icon}
    <Text size="2xl" fontWeight="$bold" mt="$1">
      {value}
    </Text>
    <Text color="$gray600">{label}</Text>
  </Box>
);

const MetricsSection = ({ metrics }) => {
  return (
    <HStack gap="$3">
      <MetricCard
        icon={<Package size={24} color="#6366f1" />}
        value={metrics.totalOrders}
        label="Total Orders"
        bgColor="$blue50"
      />
      <MetricCard
        icon={<Clock size={24} color="#f59e0b" />}
        value={metrics.pendingOrders}
        label="Pending"
        bgColor="$warning50"
      />
      <MetricCard
        icon={<Package size={24} color="#10b981" />}
        value={metrics.completedOrders}
        label="Completed"
        bgColor="$success50"
      />
      <MetricCard
        icon={<Package size={24} color="#ff3d35" />}
        value={metrics.cancelledOrders}
        label="Cancelled"
        bgColor="$error50"
      />
    </HStack>
  );
};

export default MetricsSection;

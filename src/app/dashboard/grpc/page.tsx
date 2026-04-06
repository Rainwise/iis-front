"use client";
import { useState } from "react";
import { Stack, Flex, Button, Paper, Text, TextInput } from "@mantine/core";
import { IconSend, IconSearch, IconTemperature } from "@tabler/icons-react";
import { useWeatherGrpc } from "@/hooks/grpc/useGrpc";
import { MantineTable } from "@/components/MantineTable/mantineTable";
import { grpcWeatherColumnsConfig } from "@/app/dashboard/grpc/weatherColumnsConfig";

export default function GrpcPage() {
  const [city, setCity] = useState("");
  const { data, loading, error, fetchWeather } = useWeatherGrpc();

  const tableData = data?.results ?? [];

  const handleFetch = () => {
    if (city.trim()) fetchWeather(city.trim());
  };

  return (
    <Stack gap="md">
      <Flex
        justify="space-between"
        align="center"
        bg="var(--mantine-color-bg-1)"
        p="md"
        bdrs="xl"
        mih="60px"
        wrap="wrap"
        gap="lg"
      >
        <TextInput
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.currentTarget.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFetch()}
          rightSection={<IconSearch size={16} />}
          radius="xl"
          disabled={loading}
          w={240}
        />
        <Button
          c="var(--mantine-color-text-4)"
          fz="sm"
          fw={300}
          radius="xl"
          size="md"
          color="var(--mantine-color-primary-2)"
          leftSection={<IconSend size={18} />}
          rightSection={<IconTemperature size={18} />}
          onClick={handleFetch}
          loading={loading}
          disabled={!city.trim()}
        >
          {"Fetch temperature via gRPC"}
        </Button>
      </Flex>

      {error && (
        <Paper bg="var(--mantine-color-bg-1)" p="lg" bdrs="xl">
          <Text fw={600} c="var(--mantine-color-text-0)" mb="xs">
            {"Error"}
          </Text>
          <Text c="red" fw={500}>
            {error}
          </Text>
        </Paper>
      )}

      <Paper bg="var(--mantine-color-bg-1)" p="lg" bdrs="xl">
        <Stack gap="md">
          <Text fw={600} c="var(--mantine-color-text-0)">
            {data ? `Results for "${data.cityName}"` : "Temperature results"}
          </Text>
          <MantineTable
            tableData={tableData}
            columnDefinitions={grpcWeatherColumnsConfig()}
            isLoading={loading}
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

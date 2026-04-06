"use client";
import { useCallback } from "react";
import { Stack, Flex, Group, Button, Text, Paper, Code } from "@mantine/core";
import {
  IconRefresh,
  IconKeyFilled,
  IconHexagonLetterXFilled,
} from "@tabler/icons-react";
import { useToken } from "@/hooks/tokens/useToken";

export default function DashboardPage() {
  const tokenCodeStyles = {
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    overflowWrap: "anywhere" as const,
  };
  const { tokenData, refreshing, revoking, refreshToken, revokeToken } =
    useToken();
  const isTokenActionLoading = refreshing || revoking;

  const onRefreshToken = useCallback(async () => {
    if (isTokenActionLoading) return;
    await refreshToken();
  }, [isTokenActionLoading, refreshToken]);

  const onRevokeToken = useCallback(async () => {
    if (isTokenActionLoading) return;
    await revokeToken();
  }, [isTokenActionLoading, revokeToken]);

  return (
    <Stack gap={"md"}>
      <Flex
        justify={"flex-end"}
        align={"center"}
        bg={"var(--mantine-color-bg-1)"}
        p={"md"}
        bdrs={"xl"}
        mih={"60px"}
        wrap={"wrap"}
        gap={"lg"}
      >
        <Group gap={"md"}>
          <Button
            c="var(--mantine-color-text-4)"
            fz={"sm"}
            fw={300}
            radius="xl"
            size="md"
            color={"var(--mantine-color-green-2)"}
            leftSection={<IconRefresh size={18} />}
            rightSection={<IconKeyFilled size={18} />}
            onClick={onRefreshToken}
            loading={refreshing}
            disabled={isTokenActionLoading}
          >
            {"Refresh token"}
          </Button>
          <Button
            c="var(--mantine-color-text-4)"
            fz={"sm"}
            fw={300}
            radius="xl"
            size="md"
            color={"var(--mantine-color-red-8)"}
            leftSection={<IconHexagonLetterXFilled size={18} />}
            rightSection={<IconKeyFilled size={18} />}
            onClick={onRevokeToken}
            loading={revoking}
            disabled={isTokenActionLoading}
          >
            {"Revoke token"}
          </Button>
        </Group>
      </Flex>

      <Paper bg={"var(--mantine-color-bg-1)"} p={"lg"} bdrs={"xl"}>
        <Stack gap={"md"}>
          <Text fw={600} c="var(--mantine-color-text-0)">
            {"Token data"}
          </Text>

          <Stack gap={"xs"}>
            <Text size="sm" c="dimmed">
              {"Access token"}
            </Text>
            <Code block style={tokenCodeStyles}>
              {tokenData?.accessToken || "-"}
            </Code>
          </Stack>

          <Stack gap={"xs"}>
            <Text size="sm" c="dimmed">
              {"Refresh token"}
            </Text>
            <Code block style={tokenCodeStyles}>
              {tokenData?.refreshToken || "-"}
            </Code>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

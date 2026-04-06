"use client";
import { AppShell, LoadingOverlay, ScrollArea, Stack } from "@mantine/core";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/hooks/providers/useAuthContext";
import { useDisclosure } from "@mantine/hooks";

import { DashboardSidebar } from "@/components/DashboardSidebar/DashboardSidebar";

export default function LobbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, checkingData, loading } = useAuthContext();
  const [opened] = useDisclosure(false);

  useEffect(() => {
    if (!checkingData && !user) {
      router.replace("/auth");
    }
  }, [user, checkingData, router]);

  if (checkingData || loading || !user) {
    return (
      <LoadingOverlay
        visible
        zIndex={1000}
        loaderProps={{ color: "var(--mantine-color-primary-1)", type: "oval" }}
      />
    );
  }

  return (
    <AppShell
      layout="alt"
      withBorder={true}
      navbar={{
        width: {
          base: "80px",
          sm: "80px",
          md: "80px",
          lg: "80px",
          xl: "80px",
        },
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
      footer={{ height: 80 }}
      padding={"sm"}
    >
      <AppShell.Navbar p={"sm"} bg={"var(--mantine-color-bg-1)"}>
        <AppShell.Section mb={"xl"}></AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          <DashboardSidebar />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Header bg={"var(--mantine-color-bg-1"}>
        {/* <LobbyHeader /> */}
      </AppShell.Header>

      <AppShell.Main bg={"var(--mantine-color-bg-0)"}>
        <Stack mt={"sm"} display={"flex"} p="xs">
          {children}
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}

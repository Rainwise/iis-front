"use client";

import { Container, Button, Stack, Title, Center } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <Container size="sm" py={120}>
      <Center>
        <Stack gap="lg" align="center">
          <Title order={1} size="h1">
            IIS Project Frontend
          </Title>
          <Link href="/auth" style={{ textDecoration: "none", width: "100%" }}>
            <Button fullWidth size="lg" mt="xl">
              Continue to dashboard
            </Button>
          </Link>
        </Stack>
      </Center>
    </Container>
  );
}

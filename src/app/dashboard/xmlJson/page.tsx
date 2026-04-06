"use client";
import { useMemo, useState } from "react";
import {
  Stack,
  Flex,
  Group,
  Button,
  Paper,
  Text,
  Textarea,
  Code,
} from "@mantine/core";
import {
  IconFileTypeXml,
  IconJson,
  IconPlus,
  IconSend,
} from "@tabler/icons-react";
import { useStripeCustomerSubmit } from "@/hooks/stripeCustomer/useStripeCustomerSubmit";

const validXmlTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<StripeCustomer>
  <Email>john.doe@example.com</Email>
  <Name>John Doe</Name>
  <Currency>usd</Currency>
</StripeCustomer>`;

const invalidXmlTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<StripeCustomer>
  <Email>not-an-email</Email>
  <Currency>US D</Currency>
</StripeCustomer>`;

const validJsonTemplate = `{
  "email": "jane.doe@example.com",
  "name": "Jane Doe",
  "currency": "eur"
}`;

const invalidJsonTemplate = `{
  "email": "bad-email",
  "currency": "EURO"
}`;

export default function XmlJsonPage() {
  const [payload, setPayload] = useState(validJsonTemplate);
  const { submittingFormat, lastResult, submitJson, submitXml } =
    useStripeCustomerSubmit();

  const isLoading = submittingFormat !== null;

  const resultText = useMemo(() => {
    if (!lastResult) return "No request sent yet.";

    const body =
      typeof lastResult.data === "string"
        ? lastResult.data
        : JSON.stringify(lastResult.data, null, 2);

    return `Status: ${lastResult.status}\nSuccess: ${lastResult.ok}\n\n${body}`;
  }, [lastResult]);

  return (
    <Stack gap={"md"}>
      <Flex
        justify={"space-between"}
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
            color={"var(--mantine-color-primary-2)"}
            leftSection={<IconPlus size={18} />}
            rightSection={<IconFileTypeXml size={18} />}
            onClick={() => setPayload(validXmlTemplate)}
            loading={false}
            disabled={isLoading}
          >
            {"Valid XML"}
          </Button>
          <Button
            c="var(--mantine-color-text-4)"
            fz={"sm"}
            fw={300}
            radius="xl"
            size="md"
            color={"var(--mantine-color-red-5)"}
            leftSection={<IconPlus size={18} />}
            rightSection={<IconFileTypeXml size={18} />}
            onClick={() => setPayload(invalidXmlTemplate)}
            loading={false}
            disabled={isLoading}
          >
            {"Invalid XML"}
          </Button>
          <Button
            c="var(--mantine-color-text-4)"
            fz={"sm"}
            fw={300}
            radius="xl"
            size="md"
            color={"var(--mantine-color-primary-2)"}
            leftSection={<IconPlus size={18} />}
            rightSection={<IconJson size={18} />}
            onClick={() => setPayload(validJsonTemplate)}
            loading={false}
            disabled={isLoading}
          >
            {"Valid JSON"}
          </Button>
          <Button
            c="var(--mantine-color-text-4)"
            fz={"sm"}
            fw={300}
            radius="xl"
            size="md"
            color={"var(--mantine-color-red-5)"}
            leftSection={<IconPlus size={18} />}
            rightSection={<IconJson size={18} />}
            onClick={() => setPayload(invalidJsonTemplate)}
            loading={false}
            disabled={isLoading}
          >
            {"Invalid JSON"}
          </Button>
        </Group>
        <Group gap={"md"}>
          <Button
            c="var(--mantine-color-text-4)"
            fz={"sm"}
            fw={300}
            radius="xl"
            size="md"
            color={"var(--mantine-color-green-1)"}
            leftSection={<IconSend size={18} />}
            rightSection={<IconFileTypeXml size={18} />}
            onClick={() => submitXml(payload)}
            loading={submittingFormat === "xml"}
            disabled={isLoading}
          >
            {"Send XML"}
          </Button>

          <Button
            c="var(--mantine-color-text-4)"
            fz={"sm"}
            fw={300}
            radius="xl"
            size="md"
            color={"var(--mantine-color-green-1)"}
            leftSection={<IconSend size={18} />}
            rightSection={<IconJson size={18} />}
            onClick={() => submitJson(payload)}
            loading={submittingFormat === "json"}
            disabled={isLoading}
          >
            {"Send JSON"}
          </Button>
        </Group>
      </Flex>

      <Paper bg={"var(--mantine-color-bg-1)"} p={"lg"} bdrs={"xl"}>
        <Stack gap={"md"}>
          <Text fw={600} c="var(--mantine-color-text-0)">
            {"Payload editor"}
          </Text>

          <Textarea
            minRows={10}
            autosize
            value={payload}
            onChange={(event) => setPayload(event.currentTarget.value)}
            placeholder="Paste XML or JSON payload here"
            disabled={isLoading}
            spellCheck={false}
          />
        </Stack>
      </Paper>

      <Paper bg={"var(--mantine-color-bg-1)"} p={"lg"} bdrs={"xl"}>
        <Stack gap={"md"}>
          <Text fw={600} c="var(--mantine-color-text-0)">
            {"Backend response"}
          </Text>
          <Code
            block
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {resultText}
          </Code>
        </Stack>
      </Paper>
    </Stack>
  );
}

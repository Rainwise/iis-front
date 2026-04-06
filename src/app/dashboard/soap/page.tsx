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
} from "@mantine/core";
import {
  IconFileTypeXml,
  IconDeviceIpadHorizontalSearch,
  IconPlus,
  IconSend,
  IconCheck,
} from "@tabler/icons-react";
import { useCustomerSoapService } from "@/hooks/soap/useCustomerSoapService";
import { MantineTable } from "@/components/MantineTable/mantineTable";
import { customersColumnsConfig } from "@/app/dashboard/soap/customersColumnsConfig";
import { StripeCustomer } from "@/types/stripeCustomer";

const validSoapEnvelope = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:tem="http://iis-project.local/customers">
  <soapenv:Body>
    <tem:SearchCustomers>
      <tem:searchTerm></tem:searchTerm>
    </tem:SearchCustomers>
  </soapenv:Body>
</soapenv:Envelope>`;

export default function SoapPage() {
  const [payload, setPayload] = useState(validSoapEnvelope);
  const {
    submitting,
    validating,
    lastResult,
    validationResult,
    searchCustomers,
    validateXml,
  } = useCustomerSoapService();
  const tableData = useMemo<StripeCustomer[]>(() => {
    return lastResult?.customers ?? [];
  }, [lastResult]);
  const isLoading = submitting || validating;

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
            onClick={() => setPayload(validSoapEnvelope)}
            disabled={isLoading}
          >
            {"SOAP template"}
          </Button>
          <Button
            c="var(--mantine-color-text-4)"
            fz={"sm"}
            fw={300}
            radius="xl"
            size="md"
            color={"var(--mantine-color-green-2)"}
            leftSection={<IconCheck size={18} />}
            rightSection={<IconFileTypeXml size={18} />}
            onClick={() => validateXml()}
            loading={validating}
            disabled={isLoading}
          >
            {"Validate generated XML file"}
          </Button>
        </Group>
        <Button
          c="var(--mantine-color-text-4)"
          fz={"sm"}
          fw={300}
          radius="xl"
          size="md"
          color={"var(--mantine-color-green-1)"}
          leftSection={<IconSend size={18} />}
          rightSection={<IconDeviceIpadHorizontalSearch size={18} />}
          onClick={() => searchCustomers(payload)}
          loading={submitting}
          disabled={isLoading}
        >
          {"Send SOAP request"}
        </Button>
      </Flex>

      <Paper bg={"var(--mantine-color-bg-1)"} p={"lg"} bdrs={"xl"}>
        <Stack gap={"md"}>
          <Text fw={600} c="var(--mantine-color-text-0)">
            {"SOAP envelope editor"}
          </Text>

          <Textarea
            minRows={14}
            autosize
            value={payload}
            onChange={(event) => setPayload(event.currentTarget.value)}
            placeholder="Paste SOAP XML envelope here"
            disabled={isLoading}
            spellCheck={false}
          />
        </Stack>
      </Paper>

      {tableData.length > 0 && (
        <Paper bg={"var(--mantine-color-bg-1)"} p={"lg"} bdrs={"xl"}>
          <Stack gap={"md"}>
            <Text fw={600} c="var(--mantine-color-text-0)">
              {"Retrieved customers"}
            </Text>
            <MantineTable
              tableData={tableData}
              columnDefinitions={customersColumnsConfig()}
              isLoading={isLoading}
            />
          </Stack>
        </Paper>
      )}

      <Paper bg={"var(--mantine-color-bg-1)"} p={"lg"} bdrs={"xl"}>
        <Stack gap={"xs"}>
          <Text fw={600} c="var(--mantine-color-text-0)">
            {"XML validation result"}
          </Text>
          <Text c={validationResult?.ok ? "green" : "red"} fw={500}>
            {validationResult
              ? `${validationResult.ok ? "Valid" : "Invalid"} (status ${validationResult.status})`
              : "No validation result yet."}
          </Text>
          {validationResult?.errors?.length ? (
            <Stack gap={4}>
              {validationResult.errors.map((error, index) => (
                <Text key={`${index}-${error}`} c="dimmed">
                  {error}
                </Text>
              ))}
            </Stack>
          ) : (
            <Text c="dimmed">
              {validationResult?.ok ? "No validation errors returned." : ""}
            </Text>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}

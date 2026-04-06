"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useApiClient } from "@/hooks/api/useApiClient";

type SubmitFormat = "json" | "xml";

type SubmitResult = {
  ok: boolean;
  status: number;
  data: unknown;
};

export function useStripeCustomerSubmit() {
  const api = useApiClient();
  const [submittingFormat, setSubmittingFormat] = useState<SubmitFormat | null>(
    null,
  );
  const [lastResult, setLastResult] = useState<SubmitResult | null>(null);

  const submit = useCallback(
    async (format: SubmitFormat, payload: string): Promise<SubmitResult> => {
      setSubmittingFormat(format);
      try {
        const endpoint =
          format === "json"
            ? "/api/stripecustomer/json"
            : "/api/stripecustomer/xml";

        const contentType =
          format === "json" ? "application/json" : "application/xml";

        const { data, status } = await api.post(endpoint, payload, {
          headers: {
            "Content-Type": contentType,
          },
        });

        const result: SubmitResult = {
          ok: true,
          status,
          data,
        };

        setLastResult(result);
        notifications.show({
          title: "Payload accepted",
          message: `Request succeeded with status ${status}.`,
          color: "green",
        });

        return result;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status ?? 500;
          const data = error.response?.data ?? { error: error.message };

          const result: SubmitResult = {
            ok: false,
            status,
            data,
          };

          setLastResult(result);
          notifications.show({
            title: "Validation failed",
            message: `Request failed with status ${status}.`,
            color: "red",
          });

          return result;
        }

        const result: SubmitResult = {
          ok: false,
          status: 500,
          data: { error: "Unexpected error while sending payload." },
        };

        setLastResult(result);
        notifications.show({
          title: "Request failed",
          message: "Unexpected error while sending payload.",
          color: "red",
        });

        return result;
      } finally {
        setSubmittingFormat(null);
      }
    },
    [api],
  );

  const submitJson = useCallback(
    async (payload: string) => submit("json", payload),
    [submit],
  );

  const submitXml = useCallback(
    async (payload: string) => submit("xml", payload),
    [submit],
  );

  return {
    submittingFormat,
    lastResult,
    submitJson,
    submitXml,
  };
}

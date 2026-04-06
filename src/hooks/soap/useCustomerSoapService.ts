"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useApiClient } from "@/hooks/api/useApiClient";

export type SoapCustomer = {
  customerId: string;
  email: string;
  name: string;
  currency: string;
};

export type SoapSearchResult = {
  ok: boolean;
  status: number;
  rawXml: string;
  customers: SoapCustomer[];
  fault?: string;
};

export type SoapValidationResult = {
  ok: boolean;
  status: number;
  errors: string[];
};

type BackendXmlValidationResponse = {
  isValid?: boolean;
  validationErrors?: string[];
};

const SOAP_ACTION = "http://iis-project.local/customers/SearchCustomers";
const SOAP_ENDPOINT = "/CustomerService.asmx";
const VALIDATE_XML_ENDPOINT = "/api/stripecustomer/validate-xml";

const textByLocalName = (parent: Element, localName: string): string => {
  const nodes = parent.getElementsByTagName("*");
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes.item(i);
    if (node && node.localName === localName) {
      return node.textContent?.trim() ?? "";
    }
  }

  return "";
};

const parseSoapResponse = (
  xml: string,
): { customers: SoapCustomer[]; fault?: string } => {
  const doc = new DOMParser().parseFromString(xml, "text/xml");

  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    return {
      customers: [],
      fault: "Invalid XML response from SOAP service.",
    };
  }

  const faultNode = Array.from(doc.getElementsByTagName("*")).find(
    (el) => el.localName === "faultstring",
  );

  if (faultNode?.textContent) {
    return {
      customers: [],
      fault: faultNode.textContent.trim(),
    };
  }

  const customerNodes = Array.from(doc.getElementsByTagName("*")).filter(
    (el) => el.localName === "StripeCustomer",
  );

  const customers = customerNodes.map((customerNode) => ({
    customerId: textByLocalName(customerNode, "CustomerId"),
    email: textByLocalName(customerNode, "Email"),
    name: textByLocalName(customerNode, "Name"),
    currency: textByLocalName(customerNode, "Currency"),
  }));

  return { customers };
};

export function useCustomerSoapService() {
  const api = useApiClient();
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<SoapSearchResult | null>(null);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<SoapValidationResult | null>(null);

  const searchCustomers = useCallback(
    async (soapEnvelope: string): Promise<SoapSearchResult> => {
      setSubmitting(true);

      try {
        const response = await api.post<string>(SOAP_ENDPOINT, soapEnvelope, {
          headers: {
            "Content-Type": "text/xml; charset=utf-8",
            SOAPAction: SOAP_ACTION,
          },
          responseType: "text",
        });

        const parsed = parseSoapResponse(response.data);
        const result: SoapSearchResult = {
          ok: !parsed.fault,
          status: response.status,
          rawXml: response.data,
          customers: parsed.customers,
          fault: parsed.fault,
        };

        setLastResult(result);

        if (parsed.fault) {
          notifications.show({
            title: "SOAP fault",
            message: parsed.fault,
            color: "red",
          });
        } else {
          notifications.show({
            title: "SOAP request successful",
            message: `Found ${parsed.customers.length} customer(s).`,
            color: "green",
          });
        }

        return result;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status ?? 500;
          const rawXml =
            typeof error.response?.data === "string"
              ? error.response.data
              : JSON.stringify(error.response?.data ?? {}, null, 2);

          const parsed =
            typeof error.response?.data === "string"
              ? parseSoapResponse(error.response.data)
              : { customers: [], fault: error.message };

          const result: SoapSearchResult = {
            ok: false,
            status,
            rawXml,
            customers: parsed.customers,
            fault: parsed.fault ?? "SOAP request failed.",
          };

          setLastResult(result);
          notifications.show({
            title: "SOAP request failed",
            message: result.fault,
            color: "red",
          });

          return result;
        }

        const result: SoapSearchResult = {
          ok: false,
          status: 500,
          rawXml: "",
          customers: [],
          fault: "Unexpected SOAP request error.",
        };

        setLastResult(result);
        notifications.show({
          title: "SOAP request failed",
          message: result.fault,
          color: "red",
        });

        return result;
      } finally {
        setSubmitting(false);
      }
    },
    [api],
  );

  const validateXml = useCallback(async (): Promise<SoapValidationResult> => {
    setValidating(true);

    try {
      const response = await api.get<BackendXmlValidationResponse>(
        VALIDATE_XML_ENDPOINT,
      );

      const errors = response.data.validationErrors ?? [];
      const isValid = response.data.isValid ?? errors.length === 0;

      const result: SoapValidationResult = {
        ok: isValid,
        status: response.status,
        errors,
      };

      setValidationResult(result);
      notifications.show({
        title: result.ok ? "XML validated" : "XML validation returned errors",
        message: result.ok
          ? "XML structure is valid."
          : `${errors.length} validation error(s) returned.`,
        color: result.ok ? "green" : "red",
      });

      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 500;
        const rawErrors = error.response?.data as
          | BackendXmlValidationResponse
          | string
          | string[]
          | undefined;

        const errors = Array.isArray(rawErrors)
          ? rawErrors
          : typeof rawErrors === "string"
            ? [rawErrors]
            : (rawErrors?.validationErrors ?? [error.message]);

        const result: SoapValidationResult = {
          ok: false,
          status,
          errors,
        };

        setValidationResult(result);
        notifications.show({
          title: "XML validation failed",
          message: errors[0] ?? "XML validation failed.",
          color: "red",
        });

        return result;
      }

      const result: SoapValidationResult = {
        ok: false,
        status: 500,
        errors: ["Unexpected XML validation error."],
      };

      setValidationResult(result);
      notifications.show({
        title: "XML validation failed",
        message: result.errors[0],
        color: "red",
      });

      return result;
    } finally {
      setValidating(false);
    }
  }, [api]);

  return {
    submitting,
    validating,
    lastResult,
    validationResult,
    searchCustomers,
    validateXml,
  };
}

"use client";

import { useCallback, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useApiClient } from "@/hooks/api/useApiClient";
import { StripeCustomer, StripeCustomerPayload } from "@/types/stripeCustomer";

const GRAPHQL_ENDPOINT = "/stripeCustomers";

const CUSTOMER_FIELDS = `
  id
  customerId
  email
  name
  currency
`;

const GET_CUSTOMERS_QUERY = `
  query GetCustomers {
    customers {
      ${CUSTOMER_FIELDS}
    }
  }
`;

const CREATE_CUSTOMER_MUTATION = `
  mutation CreateCustomer($email: String!, $name: String!, $currency: String!) {
    createCustomer(email: $email, name: $name, currency: $currency) {
      ${CUSTOMER_FIELDS}
    }
  }
`;

const UPDATE_CUSTOMER_MUTATION = `
  mutation UpdateCustomer($id: Int!, $email: String!, $name: String!, $currency: String!) {
    updateCustomer(id: $id, email: $email, name: $name, currency: $currency) {
      ${CUSTOMER_FIELDS}
    }
  }
`;

const DELETE_CUSTOMER_MUTATION = `
  mutation DeleteCustomer($id: Int!) {
    deleteCustomer(id: $id)
  }
`;

const UPDATE_CUSTOMER_BY_CUSTOMER_ID_MUTATION = `
  mutation UpdateCustomerByCustomerId($customerId: String!, $email: String!, $name: String!, $currency: String!) {
    updateCustomerByCustomerId(customerId: $customerId, email: $email, name: $name, currency: $currency) {
      ${CUSTOMER_FIELDS}
    }
  }
`;

const DELETE_CUSTOMER_BY_CUSTOMER_ID_MUTATION = `
  mutation DeleteCustomerByCustomerId($customerId: String!) {
    deleteCustomerByCustomerId(customerId: $customerId)
  }
`;

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

const normalizePayload = (
  payload: StripeCustomerPayload,
): StripeCustomerPayload => ({
  email: payload.email.trim(),
  name: payload.name.trim(),
  currency: payload.currency.trim().toLowerCase(),
});

export function useStripeCustomers() {
  const api = useApiClient();
  const [customers, setCustomers] = useState<StripeCustomer[]>([]);
  const [fetchingCustomers, setFetchingCustomers] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [updatingCustomer, setUpdatingCustomer] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState<number | null>(
    null,
  );

  const gql = useCallback(
    async <T>(
      query: string,
      variables?: Record<string, unknown>,
    ): Promise<T> => {
      const response = await api.post<GraphQLResponse<T>>(GRAPHQL_ENDPOINT, {
        query,
        variables,
      });

      if (response.data.errors?.length) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data as T;
    },
    [api],
  );

  const fetchCustomers = useCallback(async (): Promise<StripeCustomer[]> => {
    setFetchingCustomers(true);

    try {
      const data = await gql<{ customers: StripeCustomer[] }>(
        GET_CUSTOMERS_QUERY,
      );
      setCustomers(data.customers);
      return data.customers;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch Stripe customers.";

      notifications.show({
        title: "Could not load customers",
        message,
        color: "red",
      });

      throw error;
    } finally {
      setFetchingCustomers(false);
    }
  }, [gql]);

  const createCustomer = useCallback(
    async (payload: StripeCustomerPayload): Promise<StripeCustomer> => {
      setCreatingCustomer(true);

      try {
        const normalized = normalizePayload(payload);
        const data = await gql<{ createCustomer: StripeCustomer }>(
          CREATE_CUSTOMER_MUTATION,
          normalized,
        );

        notifications.show({
          title: "Customer created",
          message: `${data.createCustomer.name} was created successfully.`,
          color: "green",
        });

        return data.createCustomer;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create Stripe customer.";

        notifications.show({
          title: "Create failed",
          message,
          color: "red",
        });

        throw error;
      } finally {
        setCreatingCustomer(false);
      }
    },
    [gql],
  );

  const updateCustomer = useCallback(
    async (
      id: number,
      payload: StripeCustomerPayload,
    ): Promise<StripeCustomer> => {
      setUpdatingCustomer(true);

      try {
        const normalized = normalizePayload(payload);
        const data = await gql<{ updateCustomer: StripeCustomer }>(
          UPDATE_CUSTOMER_MUTATION,
          { id, ...normalized },
        );

        notifications.show({
          title: "Customer updated",
          message: `${data.updateCustomer.name} was updated successfully.`,
          color: "green",
        });

        return data.updateCustomer;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update Stripe customer.";

        notifications.show({
          title: "Update failed",
          message,
          color: "red",
        });

        throw error;
      } finally {
        setUpdatingCustomer(false);
      }
    },
    [gql],
  );

  const deleteCustomer = useCallback(
    async (id: number): Promise<void> => {
      setDeletingCustomerId(id);

      try {
        await gql<{ deleteCustomer: boolean }>(DELETE_CUSTOMER_MUTATION, {
          id,
        });

        notifications.show({
          title: "Customer deleted",
          message: `Customer #${id} was removed successfully.`,
          color: "green",
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete Stripe customer.";

        notifications.show({
          title: "Delete failed",
          message,
          color: "red",
        });

        throw error;
      } finally {
        setDeletingCustomerId(null);
      }
    },
    [gql],
  );

  const updateCustomerByCustomerId = useCallback(
    async (
      customerId: string,
      payload: StripeCustomerPayload,
    ): Promise<StripeCustomer> => {
      setUpdatingCustomer(true);

      try {
        const normalized = normalizePayload(payload);
        const data = await gql<{ updateCustomerByCustomerId: StripeCustomer }>(
          UPDATE_CUSTOMER_BY_CUSTOMER_ID_MUTATION,
          { customerId, ...normalized },
        );

        notifications.show({
          title: "Customer updated",
          message: `${data.updateCustomerByCustomerId.name} was updated successfully.`,
          color: "green",
        });

        return data.updateCustomerByCustomerId;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update Stripe customer.";

        notifications.show({
          title: "Update failed",
          message,
          color: "red",
        });

        throw error;
      } finally {
        setUpdatingCustomer(false);
      }
    },
    [gql],
  );

  const deleteCustomerByCustomerId = useCallback(
    async (customerId: string): Promise<void> => {
      setDeletingCustomerId(-1);

      try {
        await gql<{ deleteCustomerByCustomerId: boolean }>(
          DELETE_CUSTOMER_BY_CUSTOMER_ID_MUTATION,
          { customerId },
        );

        notifications.show({
          title: "Customer deleted",
          message: `Customer ${customerId} was removed successfully.`,
          color: "green",
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete Stripe customer.";

        notifications.show({
          title: "Delete failed",
          message,
          color: "red",
        });

        throw error;
      } finally {
        setDeletingCustomerId(null);
      }
    },
    [gql],
  );

  return {
    customers,
    fetchingCustomers,
    creatingCustomer,
    updatingCustomer,
    deletingCustomerId,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    updateCustomerByCustomerId,
    deleteCustomer,
    deleteCustomerByCustomerId,
  };
}

"use client";
import { MantineTable } from "@/components/MantineTable/mantineTable";
import { Stack, Flex, Group, Button } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { stripeCustomersColumnsConfiguration } from "./stripeCustomersColumnsConfiguration";
import StripeCustomerCreateOrUpdateModal from "@/components/StripeCustomerCreateOrUpdateModal/StripeCustomerCreateOrUpdateModal";
import DeleteModal from "@/components/DeleteModal/DeleteModal";
import {
  StripeCustomer,
  StripeCustomerModalValues,
} from "@/types/stripeCustomer";
import { useStripeCustomers } from "@/hooks/stripeCustomer/useStripeCustomers";
import { useAuthContext } from "@/hooks/providers/useAuthContext";

export default function StripePage() {
  const [opened, setOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<StripeCustomer | null>(
    null,
  );
  const [selectedCustomerForDelete, setSelectedCustomerForDelete] =
    useState<StripeCustomer | null>(null);
  const { isAdmin } = useAuthContext();

  const {
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
  } = useStripeCustomers();

  const busy =
    fetchingCustomers ||
    creatingCustomer ||
    updatingCustomer ||
    deletingCustomerId !== null;

  useEffect(() => {
    void fetchCustomers();
  }, [fetchCustomers]);

  const handleCreateClick = useCallback(() => {
    if (!isAdmin) return;
    setEditingCustomer(null);
    setOpened(true);
  }, [isAdmin]);

  const handleEditClick = useCallback(
    (customer: StripeCustomer) => {
      if (!isAdmin) return;
      setEditingCustomer(customer);
      setOpened(true);
    },
    [isAdmin],
  );

  const handleDeleteClick = useCallback(
    (customer: StripeCustomer) => {
      if (!isAdmin) return;
      setSelectedCustomerForDelete(customer);
      setDeleteOpened(true);
    },
    [isAdmin],
  );

  const handleDeleteConfirm = useCallback(
    async (id: number | string): Promise<void> => {
      if (!isAdmin) return;

      if (typeof id === "number" && id > 0) {
        await deleteCustomer(id);
      } else {
        await deleteCustomerByCustomerId(String(id));
      }

      await fetchCustomers();
      setDeleteOpened(false);
      setSelectedCustomerForDelete(null);
    },
    [deleteCustomer, deleteCustomerByCustomerId, fetchCustomers, isAdmin],
  );

  const handleSubmit = useCallback(
    async (values: StripeCustomerModalValues): Promise<void> => {
      if (!isAdmin) return;

      const payload = {
        email: values.email,
        name: values.name,
        currency: values.currency,
      };

      if (editingCustomer?.id) {
        await updateCustomer(editingCustomer.id, payload);
      } else if (editingCustomer?.customerId) {
        await updateCustomerByCustomerId(editingCustomer.customerId, payload);
      } else {
        await createCustomer(payload);
      }

      await fetchCustomers();
    },
    [
      createCustomer,
      editingCustomer,
      fetchCustomers,
      isAdmin,
      updateCustomer,
      updateCustomerByCustomerId,
    ],
  );

  const initialValues = useMemo<StripeCustomerModalValues | undefined>(() => {
    if (!editingCustomer) return undefined;

    return {
      id: editingCustomer.id ?? 0,
      email: editingCustomer.email,
      name: editingCustomer.name,
      currency: editingCustomer.currency,
    };
  }, [editingCustomer]);

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
        {isAdmin && (
          <Group gap={"md"}>
            <Button
              c="var(--mantine-color-text-4)"
              fz={"sm"}
              fw={300}
              radius="xl"
              size="md"
              color={"var(--mantine-color-primary-2)"}
              leftSection={<IconUserPlus size={18} />}
              onClick={handleCreateClick}
              loading={creatingCustomer}
              disabled={busy}
            >
              {"Add stripe customer"}
            </Button>
          </Group>
        )}
      </Flex>

      <MantineTable
        tableData={customers}
        columnDefinitions={stripeCustomersColumnsConfiguration({
          onEdit: isAdmin ? handleEditClick : undefined,
          onDelete: isAdmin ? handleDeleteClick : undefined,
          deletingCustomerId,
          showActions: isAdmin,
        })}
        isLoading={fetchingCustomers}
      />

      {isAdmin && (
        <StripeCustomerCreateOrUpdateModal
          modalProps={{
            opened,
            onClose: () => {
              setOpened(false);
              setEditingCustomer(null);
            },
          }}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={creatingCustomer || updatingCustomer}
        />
      )}

      {isAdmin && (
        <DeleteModal
          modalProps={{
            opened: deleteOpened,
            onClose: () => {
              setDeleteOpened(false);
              setSelectedCustomerForDelete(null);
            },
          }}
          modalTitle="Delete Stripe customer"
          modalDescription={`Are you sure you want to delete ${selectedCustomerForDelete?.name ?? "this customer"} (${selectedCustomerForDelete?.email ?? ""})?`}
          objectId={
            selectedCustomerForDelete?.id && selectedCustomerForDelete.id > 0
              ? selectedCustomerForDelete.id
              : selectedCustomerForDelete?.customerId
          }
          onSubmit={handleDeleteConfirm}
          loading={deletingCustomerId !== null}
        />
      )}
    </Stack>
  );
}

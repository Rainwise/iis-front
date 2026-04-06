"use client";

import { Modal, TextInput, Group, Button, Stack, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import {
  CustomModalProps,
  StripeCustomerModalValues,
} from "@/types/stripeCustomer";
import { IconChecks, IconX } from "@tabler/icons-react";

export default function StripeCustomerCreateOrUpdateModal({
  modalProps,
  initialValues,
  onSubmit,
  loading = false,
}: Readonly<CustomModalProps>) {
  const form = useForm<StripeCustomerModalValues>({
    initialValues: {
      id: 0,
      email: "",
      name: "",
      currency: "eur",
      ...initialValues,
    },
    validate: {
      name: (value) =>
        value.trim().length <= 2 ? "Name must be at least 2 characters" : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
    },
  });

  const handleSubmit = async (values: StripeCustomerModalValues) => {
    try {
      if (!onSubmit) {
        console.error("No onSubmit handler provided");
        return;
      }
      await onSubmit(values);
      modalProps.onClose();
      form.reset();
    } catch (error) {
      console.error("Failed to create/update stripe customer:", error);
    }
  };

  useEffect(() => {
    if (modalProps.opened) {
      if (initialValues) {
        form.setValues({
          ...initialValues,
        });
      } else {
        form.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalProps.opened]);

  return (
    <Modal
      opened={modalProps.opened}
      onClose={() => {
        modalProps.onClose();
        form.reset();
      }}
      centered
      title={
        initialValues ? "Edit Stripe Customer" : "Create New Stripe Customer"
      }
      closeOnEscape={false}
      closeOnClickOutside={false}
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Customer Name"
            placeholder="Name"
            {...form.getInputProps("name")}
          />

          <TextInput
            label="Customer Email"
            placeholder="Email"
            {...form.getInputProps("email")}
          />

          <Select
            label="Currency"
            allowDeselect={false}
            data={[
              { value: "usd", label: "USD" },
              { value: "eur", label: "EUR" },
              { value: "gbp", label: "GBP" },
              { value: "hrk", label: "HRK" },
            ]}
            value={form.values.currency}
            {...form.getInputProps("currency")}
          />

          <Group mt="md" justify="flex-end">
            <Button
              leftSection={<IconX size={20} />}
              color="var(--mantine-color-red-7)"
              onClick={() => {
                modalProps.onClose();
                form.reset();
              }}
            >
              {"Cancel"}
            </Button>
            <Button
              leftSection={<IconChecks size={20} />}
              type="submit"
              color="var(--mantine-color-primary-2)"
              loading={loading}
              disabled={loading}
            >
              {"Submit"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}

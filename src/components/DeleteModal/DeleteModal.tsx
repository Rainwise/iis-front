"use client";
import { Modal, Button, Group, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// Icon Imports
import { IconX, IconChecks } from "@tabler/icons-react";

// Type Imports
import { DeleteModalProps } from "@/types/deleteModal";

export default function DeleteModal({
  modalProps,
  onSubmit,
  modalTitle,
  modalDescription,
  objectId,
  loading = false,
}: Readonly<DeleteModalProps>) {
  const handleSubmit = () => {
    if (objectId !== undefined && objectId !== null && onSubmit) {
      onSubmit(objectId);
      modalProps.onClose();
    } else {
      notifications.show({
        title: "Error",
        withBorder: true,
        message: "Failed to delete item",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={modalProps.opened}
      onClose={modalProps.onClose}
      centered
      title={modalTitle}
      closeOnEscape={false}
      closeOnClickOutside={false}
      size="md"
    >
      <Text>{modalDescription}</Text>
      <Group mt="md" justify="flex-end">
        <Button
          leftSection={<IconX size={20} />}
          variant="filled"
          color="var(--mantine-color-red-7)"
          onClick={modalProps.onClose}
        >
          {"Cancel"}
        </Button>
        <Button
          leftSection={<IconChecks size={20} />}
          loading={loading}
          type="submit"
          onClick={handleSubmit}
          color="var(--mantine-color-primary-2)"
        >
          {"Yes"}
        </Button>
      </Group>
    </Modal>
  );
}
//

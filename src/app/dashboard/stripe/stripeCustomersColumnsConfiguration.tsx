// Type Imports
import { StripeCustomer } from "@/types/stripeCustomer";
import { ColumnDefinition } from "@/components/MantineTable/mantineTableTypes";
import { ActionIcon, Group, Text } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

type StripeCustomersColumnsActions = {
  onEdit?: (customer: StripeCustomer) => void;
  onDelete?: (customer: StripeCustomer) => void;
  deletingCustomerId?: number | null;
  showActions?: boolean;
};

export const stripeCustomersColumnsConfiguration = (
  actions?: StripeCustomersColumnsActions,
): ColumnDefinition<StripeCustomer>[] => {
  const columns: ColumnDefinition<StripeCustomer>[] = [
    {
      key: "customerId",
      label: "Customer ID",
      width: 200,
      render: (_, row) => {
        return <Text truncate>{row.customerId}</Text>;
      },
    },
    {
      key: "email",
      label: "Email",
      width: 200,
      render: (_, row) => {
        return row.email;
      },
    },
    {
      key: "name",
      label: "Name",
      width: 200,
      render: (_, row) => {
        return row.name;
      },
    },
    {
      key: "currency",
      label: "Currency",
      width: 100,
      align: "center",
      render: (_, row) => {
        return row.currency;
      },
    },
  ];

  if (actions?.showActions) {
    columns.push({
      key: "actions",
      label: "Actions",
      width: 120,
      align: "center",
      render: (_, row) => {
        const isDeleting = actions.deletingCustomerId === row.id;

        return (
          <Group gap={8} justify="center" wrap="nowrap">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => actions.onEdit?.(row)}
              disabled={!actions.onEdit || isDeleting}
              aria-label={`Edit ${row.name}`}
            >
              <IconPencil size={16} />
            </ActionIcon>
            <ActionIcon
              variant="light"
              color="red"
              onClick={() => actions.onDelete?.(row)}
              disabled={!actions.onDelete || isDeleting}
              loading={isDeleting}
              aria-label={`Delete ${row.name}`}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        );
      },
    });
  }

  return columns;
};

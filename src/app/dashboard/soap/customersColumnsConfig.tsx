import { Text } from "@mantine/core";
import { StripeCustomer } from "@/types/stripeCustomer";
import { ColumnDefinition } from "@/components/MantineTable/mantineTableTypes";

export const customersColumnsConfig =
  (): ColumnDefinition<StripeCustomer>[] => [
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

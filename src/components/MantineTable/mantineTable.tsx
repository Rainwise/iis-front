// Mantine Imports
import { Table, Loader, Text } from "@mantine/core";

// Type Imports
import { MantineTableProps } from "@/components/MantineTable/mantineTableTypes";

export const MantineTable = <TData extends Record<string, unknown>>({
  tableData,
  columnDefinitions,
  isLoading = false,
}: MantineTableProps<TData>) => {
  return (
    <Table.ScrollContainer minWidth={500} maxHeight={400}>
      <Table
        layout="fixed"
        fz="md"
        highlightOnHover
        horizontalSpacing="md"
        striped="even"
        verticalSpacing="xs"
        withColumnBorders
        withRowBorders
        withTableBorder
        stickyHeader
        w="100%"
        bg="var(--mantine-color-bg-1)"
        c="var(--mantine-color-text-0)"
      >
        <Table.Thead>
          <Table.Tr
            bg="var(--mantine-color-primary-2)"
            c="var(--mantine-color-text-4)"
          >
            {columnDefinitions.map((col) => (
              <Table.Th
                key={String(col.key)}
                fw={600}
                style={{
                  textAlign: col.align ?? "left",
                  width: col.width,
                  backgroundColor: "var(--mantine-color-primary-2)",
                }}
              >
                {col.label}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td
                colSpan={columnDefinitions.length}
                align="center"
                bg="var(--mantine-color-bg-2)"
              >
                <Loader color="var(--mantine-color-primary-1)" size="xl" />
                <Text>Loading Data</Text>
              </Table.Td>
            </Table.Tr>
          ) : tableData.length === 0 ? (
            <Table.Tr mih="300px">
              <Table.Td colSpan={columnDefinitions.length}>
                <Text ta="center" c="dimmed" py="md">
                  No data found.
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            tableData.map((row, i) => (
              <Table.Tr key={i}>
                {columnDefinitions.map((col) => {
                  const value =
                    col.accessor?.(row) ??
                    (col.key ? (row as TData)[col.key] : undefined);

                  const content =
                    col.render?.(value, row) ?? String(value ?? "—");

                  return (
                    <Table.Td
                      key={String(col.key)}
                      h="60px"
                      bd="1px solid var(--mantine-color-gray-3)"
                      style={{
                        textAlign: col.align ?? "left",
                        width: col.width,
                      }}
                    >
                      {content}
                    </Table.Td>
                  );
                })}
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};

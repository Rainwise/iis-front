export interface ColumnDefinition<TData> {
  key: keyof TData | string;
  label: string;
  render?: (value: unknown, row: TData) => React.ReactNode;
  accessor?: (row: TData) => unknown;
  align?: "left" | "center" | "right";
  width?: string | number;
}

export interface MantineTableProps<TData extends Record<string, unknown>> {
  tableData: TData[];
  columnDefinitions: ColumnDefinition<TData>[];
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
}

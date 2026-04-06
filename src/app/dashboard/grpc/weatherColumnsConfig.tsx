import { ColumnDefinition } from "@/components/MantineTable/mantineTableTypes";
import { WeatherTemperatureResult } from "@/types/weatherGrpc";

export const grpcWeatherColumnsConfig =
  (): ColumnDefinition<WeatherTemperatureResult>[] => [
    {
      key: "city",
      label: "City",
      width: 220,
      render: (_, row) => row.city,
    },
    {
      key: "temperature",
      label: "Temperature (C)",
      width: 180,
      align: "center",
      render: (_, row) => row.temperature,
    },
  ];

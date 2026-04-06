export type WeatherTemperatureResult = {
  city: string;
  temperature: number;
};

export type WeatherGrpcResponse = {
  ok: boolean;
  cityName: string;
  results: WeatherTemperatureResult[];
  error?: string;
};

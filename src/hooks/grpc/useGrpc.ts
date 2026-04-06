"use client";
import { useState, useCallback } from "react";
import { WeatherGrpcResponse } from "@/types/weatherGrpc";

export function useWeatherGrpc() {
  const [data, setData] = useState<WeatherGrpcResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `/api/grpc/weather?city=${encodeURIComponent(city)}`,
      );
      const json: WeatherGrpcResponse = await res.json();

      if (!json.ok) {
        setError(json.error ?? "Unknown error");
      } else {
        setData(json);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchWeather };
}

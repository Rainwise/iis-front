import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { NextResponse } from "next/server";

const GRPC_URL = process.env.GRPC_URL ?? "localhost:5067";

const PROTO_PATH = path.join(process.cwd(), "src/proto/weather.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const weatherProto = (grpc.loadPackageDefinition(packageDefinition) as any)
  .weather;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { ok: false, error: "Missing city query parameter" },
      { status: 400 },
    );
  }

  return new Promise<NextResponse>((resolve) => {
    const client = new weatherProto.WeatherService(
      GRPC_URL,
      grpc.credentials.createInsecure(),
    );

    client.GetTemperatureByCity(
      { city_name: city },
      (
        err: grpc.ServiceError | null,
        response: { results: { city: string; temperature: string }[] },
      ) => {
        if (err) {
          resolve(
            NextResponse.json(
              { ok: false, cityName: city, error: err.message },
              { status: 502 },
            ),
          );
          return;
        }

        resolve(
          NextResponse.json({
            ok: true,
            cityName: city,
            results: response.results ?? [],
          }),
        );
      },
    );
  });
}

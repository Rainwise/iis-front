# IIS Frontend

A Next.js web application dashboard for testing and demonstrating multiple integration protocols and services, including REST, gRPC, SOAP, XML/JSON transformation, and Stripe payment integration.

## Tech Stack

- **Framework**: Next.js 15 / React 19
- **UI**: [Mantine v9](https://mantine.dev) + [Tabler Icons](https://tabler.io/icons)
- **HTTP Client**: Axios (with JWT interceptors)
- **Protocols**: REST, gRPC (`@grpc/grpc-js`), SOAP
- **Language**: TypeScript (strict mode)

## Getting Started

### Prerequisites

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:5066   # REST API base URL
GRPC_URL=localhost:5067                       # gRPC server endpoint
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Scripts

```bash
npm run build   # Production build
npm start       # Start production server
npm run lint    # Run ESLint
```

## Project Structure

```
src/
├── app/
│   ├── api/grpc/weather/    # Next.js API route for gRPC calls
│   ├── auth/                # Login page
│   ├── dashboard/           # Protected dashboard routes
│   │   ├── grpc/            # Weather via gRPC
│   │   ├── soap/            # SOAP envelope editor
│   │   ├── stripe/          # Stripe customer management
│   │   └── xmlJson/         # XML/JSON payload submission
│   └── layout.tsx           # Root layout with AuthProvider
├── components/              # Shared UI components
├── hooks/
│   ├── api/                 # useApiClient (Axios + auth interceptor)
│   ├── grpc/                # useGrpc
│   ├── providers/           # useAuthContext
│   ├── soap/                # SOAP integration hooks
│   ├── stripeCustomer/      # Stripe CRUD hooks
│   └── tokens/              # Token management hooks
├── proto/                   # gRPC Protobuf definitions
├── routes/                  # Route path constants
├── styles/                  # Mantine theme & component overrides
└── types/                   # Shared TypeScript interfaces
```

## Features

### Authentication
- Username/password login with JWT tokens
- Role-based access control (admin vs user, decoded from JWT)
- Automatic token refresh via Axios interceptors
- Token revocation from the dashboard

### Dashboard Pages

| Route | Description |
|---|---|
| `/dashboard` | Token management (refresh / revoke) |
| `/dashboard/grpc` | Fetch weather data via gRPC |
| `/dashboard/soap` | SOAP envelope editor with XML validation |
| `/dashboard/xmlJson` | Submit XML/JSON payloads |
| `/dashboard/stripe` | Stripe customer CRUD (admin only) |


### Screens

<img width="2558" height="854" alt="1" src="https://github.com/user-attachments/assets/4256cb9e-28a7-4d5a-b644-e3dbe0f02200" />

<img width="2560" height="1128" alt="2" src="https://github.com/user-attachments/assets/a2220d53-34f9-4c5a-bff2-64289e84dc3e" />

<img width="2558" height="1286" alt="3" src="https://github.com/user-attachments/assets/72ba4559-4e18-42ee-8344-89ceb3163ee6" />

<img width="2558" height="871" alt="4" src="https://github.com/user-attachments/assets/f8178db7-b0ae-434e-823c-4a9986fef459" />

<img width="2556" height="1017" alt="5" src="https://github.com/user-attachments/assets/3ed5d54a-07a8-4d5d-8138-fcb299397c84" />




"use client";

import { createTRPCReact } from "@trpc/react-query";
import { createWSClient, wsLink } from "@trpc/client";
import type { AppRouter } from "@/server/trpc/router";

// Create WebSocket client
const wsClient = createWSClient({
  url: "ws://localhost:3001", // WebSocket server URL
});

// tRPC client setup
export const trpc = createTRPCReact<AppRouter>({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
});

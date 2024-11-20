// src/utils/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import { createWSClient, wsLink } from "@trpc/client";
import type { AppRouter } from "../server/trpc/router";

const wsClient = createWSClient({
  url: "ws://localhost:3001",
});

export const trpc = createTRPCReact<AppRouter>({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
});

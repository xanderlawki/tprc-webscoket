// src/server/trpc/server.ts
import { createWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./router";
import ws from "ws";

const wss = new ws.Server({ port: 3001 });

export const handler = createWSSHandler({
  router: appRouter,
  createContext: () => ({}),
});
wss.on("connection", (socket) => {
  handler(socket);
});

console.log("WebSocket server running on ws://localhost:3001");

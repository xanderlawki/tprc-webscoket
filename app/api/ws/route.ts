import { appRouter } from "@/lib/trpc";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { createContext } from "@/lib/context";
import { Server } from "ws";

// Disable body parsing for WebSocket routes
export const config = {
  api: {
    bodyParser: false,
  },
};

// Create the WebSocket handler
let wss: Server | undefined;

export default function handler(req: any, res: any) {
  if (!wss) {
    wss = new Server({ noServer: true });

    const server = res.socket.server;

    server.on("upgrade", (req: any, socket: any, head: any) => {
      if (req.url === "/api/trpc/ws") {
        wss.handleUpgrade(req, socket, head, (client) => {
          wss.emit("connection", client, req);
        });
      }
    });

    applyWSSHandler({
      wss,
      router: appRouter,
      createContext,
    });

    console.log("WebSocket server initialized.");
  }

  res.end();
}

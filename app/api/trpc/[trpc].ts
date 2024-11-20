import { createNextApiHandler } from "@trpc/server/adapters/next";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/appRouter";

// Export tRPC API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
});

import { router, procedure } from "./trpc";
import { z } from "zod";
import { EventEmitter } from "events";
import { observable } from "@trpc/server"; // Correct import for observable

const messageEmitter = new EventEmitter(); // Event emitter for real-time messages

export const appRouter = router({
  // Mutation for sending a new message
  sendMessage: procedure
    .input(
      z.object({
        roomId: z.string(),
        content: z.string(),
        sender: z.string(),
      })
    )
    .mutation(({ input }) => {
      const message = {
        ...input,
        timestamp: new Date(),
      };

      // Emit the new message to subscribers
      messageEmitter.emit("newMessage", message);

      return message;
    }),

  // Subscription for receiving new messages in real-time
  onMessage: procedure.subscription(() => {
    return observable((emit) => {
      // Listener to send new messages to subscribers
      const listener = (message: any) => emit.next(message);

      messageEmitter.on("newMessage", listener);

      // Cleanup function to remove listener when subscription ends
      return () => {
        messageEmitter.off("newMessage", listener);
      };
    });
  }),
});

export type AppRouter = typeof appRouter;

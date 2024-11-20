import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { EventEmitter } from "events";
import { observable } from "@trpc/server";

const t = initTRPC.create();
const messageEmitter = new EventEmitter(); // Event emitter for broadcasting messages

interface Message {
  sender: string;
  content: string;
  roomId: string;
  timestamp: Date;
  reactions: { [key: string]: string[] }; // Store reactions as a dictionary of reaction types and users who reacted
}

export const appRouter = t.router({
  // Mutation to send a new message
  sendMessage: t.procedure
    .input(
      z.object({
        roomId: z.string(),
        content: z.string(),
        sender: z.string(),
      })
    )
    .mutation(({ input }) => {
      const message: Message = {
        ...input,
        timestamp: new Date(),
        reactions: {},
      };
      messageEmitter.emit("newMessage", message); // Emit new message to all subscribers
      return message; // Return the sent message
    }),

  // Mutation to add a reaction to a message
  addReaction: t.procedure
    .input(
      z.object({
        roomId: z.string(),
        messageId: z.string(),
        reactionType: z.string(), // Reaction type (like thumbs-up, heart, etc.)
        userId: z.string(),
      })
    )
    .mutation(({ input }) => {
      const { roomId, messageId, reactionType, userId } = input;
      // Find the message and update reactions
      const message = findMessageById(roomId, messageId);
      if (message) {
        // Add the reaction to the message
        if (!message.reactions[reactionType]) {
          message.reactions[reactionType] = [];
        }
        message.reactions[reactionType].push(userId); // Add user to the list of people who reacted
        messageEmitter.emit("messageUpdated", message); // Emit updated message with reactions
      }
      return message;
    }),

  // Subscription for receiving new messages
  onMessage: t.procedure
    .input(z.object({ roomId: z.string() }))
    .subscription(({ input }) => {
      const { roomId } = input;

      return observable<Message>((emit) => {
        const listener = (message: Message) => {
          if (message.roomId === roomId) {
            emit.next(message); // Emit message to subscribers
          }
        };

        messageEmitter.on("newMessage", listener);
        messageEmitter.on("messageUpdated", listener); // Listen for updated messages with reactions

        return () => {
          messageEmitter.off("newMessage", listener);
          messageEmitter.off("messageUpdated", listener);
        };
      });
    }),
});

// Helper function to simulate finding a message by ID
function findMessageById(roomId: string, messageId: string): Message | null {
  // Simulating a database or in-memory store lookup
  return {
    sender: "User1",
    content: "This is a message",
    roomId,
    timestamp: new Date(),
    reactions: {
      thumbsUp: ["User2"],
    },
  };
}

export type AppRouter = typeof appRouter;

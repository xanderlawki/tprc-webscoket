import create from "zustand";

// Define the state and actions for chat, including username and reactions
interface ChatStore {
  messages: {
    sender: string;
    content: string;
    timestamp: string;
    reactions: { like: string[]; dislike: string[] };
  }[];
  username: string;
  setUsername: (username: string) => void;
  addMessage: (message: {
    sender: string;
    content: string;
    timestamp: string;
    reactions: { like: string[]; dislike: string[] };
  }) => void;
  addReaction: (
    messageId: string,
    reactionType: "like" | "dislike",
    userId: string
  ) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  username: "",
  setUsername: (username) => set({ username }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  addReaction: (messageId, reactionType, userId) =>
    set((state) => {
      const updatedMessages = state.messages.map((msg) => {
        if (msg.timestamp === messageId) {
          if (!msg.reactions[reactionType]) {
            msg.reactions[reactionType] = [];
          }
          if (!msg.reactions[reactionType].includes(userId)) {
            msg.reactions[reactionType].push(userId);
          }
        }
        return msg;
      });
      return { messages: updatedMessages };
    }),
}));

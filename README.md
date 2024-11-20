# tprc-webscoket
# **Real-Time Chat Application**

This is a real-time chat application built with **Next.js**, **Zustand** for state management, **tRPC** for API handling, and **WebSocket** for real-time communication. The app features real-time messaging, reactions (like and dislike), message search, typing indicators, and user activity tracking (e.g., when users join or leave the room).

## **Features**
- **Real-Time Messaging**: Messages are sent and received in real-time using **tRPC** subscriptions and **WebSocket**.
- **Reactions**: Users can react to messages with "like" or "dislike" reactions, and reactions are displayed in real-time.
- **Message Search**: A search functionality that allows users to search through the messages in a room.
- **Activity Indicators**: Displays a typing indicator when a user is typing and an activity indicator when sending or receiving messages.
- **User Join/Leave Notifications**: Tracks and displays when a user joins or leaves a chat room.
- **Zustand for State Management**: Zustand is used for managing global state, including chat messages, reactions, and user authentication.

## **Technologies Used**
- **Next.js** (for server-side rendering and routing)
- **Zustand** (for global state management)
- **tRPC** (for type-safe API calls)
- **WebSocket** (for real-time communication)
- **NextAuth.js** (for authentication)

## **Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/chat-app.git
   cd chat-app
   ```

2. **Install Dependencies**
   Install the required dependencies using `npm` or `yarn`.

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**
   Create a `.env.local` file in the root of the project and add your environment variables.

   Example:
   ```bash
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   NEXTAUTH_SECRET=your-next-auth-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the Application**
   Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app should now be running at `http://localhost:3000`.

## **How to Use**

1. **Sign In**
   - Users must sign in to access the chat functionality. Sign in is managed by **NextAuth.js**.
   - You can use Google or GitHub authentication (configure your environment variables for API keys).

2. **Join a Chat Room**
   - After signing in, enter a **room ID** on the home page to join a chat room.
   - You can send and receive messages in real-time once in the chat room.

3. **React to Messages**
   - You can react to messages with a **like** (`👍`) or **dislike** (`👎`) reaction.
   - Reactions are updated in real-time across all users in the room.

4. **Search Messages**
   - Use the search bar at the top of the chat room to search for messages by their content.
   - The list of messages will filter dynamically based on your search term.

5. **Typing and Activity Indicators**
   - A typing indicator will appear when a user is typing a message.
   - When messages are sent or received, a loading indicator will show the progress of the activity.

6. **User Activity**
   - You'll see notifications when a user joins or leaves the room.

## **Folder Structure**

```bash
├── app/
│   ├── chatrooms/
│   │   └── [id]/
│   │       └── page.tsx         # Chat room page with real-time features
│   └── page.tsx                 # Home page (room ID entry and login)
├── lib/
│   ├── store.ts                 # Zustand store for global state management
├── pages/
│   └── api/
│       └── auth/
│           └── [...nextauth].ts # NextAuth.js configuration
├── public/
├── styles/
├── .env.local                   # Environment variables
├── package.json
└── README.md
```

## **State Management with Zustand**

- **Messages** are stored in Zustand and updated in real-time using tRPC subscriptions.
- **User Reactions** (like/dislike) are stored alongside each message, and reactions are updated in real-time.
- **Username** is stored in Zustand after the user signs in using **NextAuth.js**.

### Example of Zustand Store:

```typescript
import create from "zustand";

interface ChatStore {
  messages: { sender: string; content: string; timestamp: string; reactions: { like: string[]; dislike: string[] } }[];
  username: string;
  setUsername: (username: string) => void;
  addMessage: (message: { sender: string; content: string; timestamp: string; reactions: { like: string[]; dislike: string[] } }) => void;
  addReaction: (messageId: string, reactionType: "like" | "dislike", userId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  username: "",
  setUsername: (username) => set({ username }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  addReaction: (messageId, reactionType, userId) => set((state) => {
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
```

## **Future Improvements**
- **Persist Chat Data**: Integrate a database (e.g., MongoDB, PostgreSQL) to store chat history and make it persistent across sessions.
- **Enhanced User Interface**: Improve the user interface with features like **emojis**, **themes**, or **file uploads**.
- **Push Notifications**: Implement notifications for new messages or when users are typing.

## **License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

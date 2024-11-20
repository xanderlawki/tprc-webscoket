"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/lib/trpc";
import { useChatStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { use } from "react"; // Import React.use

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  const roomId = use(params); // Unwrap the params object to access `id`
  const { data: session, status } = useSession();
  const router = useRouter();

  const { messages, addMessage, addReaction, setUsername } = useChatStore();
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [filteredMessages, setFilteredMessages] = useState(messages); // State for filtered messages

  // Update filtered messages when the search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMessages(messages);
    } else {
      setFilteredMessages(
        messages.filter((msg) =>
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, messages]);

  // Session handling and redirecting if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (status === "authenticated" && session?.user?.name) {
      setUsername(session.user.name);
    }
  }, [status, session, setUsername, router]);

  const sendMessage = trpc.sendMessage.useMutation();
  trpc.onMessage.useSubscription(
    { roomId },
    {
      onData(newMessage) {
        addMessage(newMessage); // Add new message to Zustand store
      },
      onError(err) {
        console.error("Subscription error:", err);
      },
    }
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage.mutate(
      { roomId, content: message, sender: session?.user?.name || "Anonymous" },
      {
        onSuccess: () => setMessage(""),
      }
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleReaction = (
    messageId: string,
    reactionType: "like" | "dislike"
  ) => {
    addReaction(messageId, reactionType, session?.user?.id || "anonymous");
  };

  return (
    <div>
      {status === "loading" ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>Chat Room: {roomId}</h1>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search messages..."
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              height: "300px",
              overflowY: "scroll",
              marginBottom: "10px",
            }}
          >
            {filteredMessages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: "10px" }}>
                <strong>{msg.sender}:</strong> {msg.content}
                <div style={{ fontSize: "0.8em", color: "#555" }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                <div>
                  <strong>Likes:</strong> {msg.reactions.like?.length || 0}
                  <button
                    onClick={() =>
                      handleReaction(msg.timestamp.toString(), "like")
                    }
                  >
                    👍
                  </button>
                  <strong>Dislikes:</strong>{" "}
                  {msg.reactions.dislike?.length || 0}
                  <button
                    onClick={() =>
                      handleReaction(msg.timestamp.toString(), "dislike")
                    }
                  >
                    👎
                  </button>
                </div>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
            style={{
              width: "calc(100% - 100px)",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginRight: "10px",
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: "10px 20px",
              border: "none",
              background: "#0070f3",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </>
      )}
    </div>
  );
}

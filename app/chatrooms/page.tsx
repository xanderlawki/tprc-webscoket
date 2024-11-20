"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ChatroomsPage = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch chatrooms from the API
  const fetchChatrooms = async () => {
    try {
      const res = await fetch("/api/chatrooms");
      if (!res.ok) {
        throw new Error("Failed to fetch chatrooms");
      }
      const data = await res.json();
      setChatrooms(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatrooms();
  }, []);

  if (loading) {
    return <div className="p-6">Loading chatrooms...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chatrooms</h1>
      <ul className="space-y-4">
        {chatrooms.map((room: any) => (
          <li key={room._id} className="p-4 border rounded">
            <div className="font-semibold text-lg">{room.name}</div>
            <div className="text-sm text-gray-600">
              Created: {new Date(room.createdAt).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Users: {room.userCount}</div>
            <Link
              href={`/chatrooms/${room._id}`}
              className="block mt-2 bg-blue-500 text-white px-4 py-2 rounded text-center"
            >
              Enter Room
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatroomsPage;

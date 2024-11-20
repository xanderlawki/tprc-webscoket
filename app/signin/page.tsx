"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SigninPage = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignin = async () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }), // Only sending the username
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Signin failed");
      }

      // Persist username in localStorage
      localStorage.setItem("username", username);

      // Navigate to chatrooms page
      router.push("/chatrooms");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-xl font-bold mb-4">Sign In</h1>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleSignin}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SigninPage;

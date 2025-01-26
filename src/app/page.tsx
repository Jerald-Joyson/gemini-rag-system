"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ChatPage() {
  const [isClient, setIsClient] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { user: string; bot: string }[]
  >([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSend = async () => {
    if (!query.trim() || !isClient) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "https://2fd5-104-196-251-70.ngrok-free.app/ask",
        { query }
      );

      const botResponse = res.data.response;

      setChatHistory((prev) => [
        ...prev,
        {
          user: query,
          bot:
            botResponse ||
            "I cannot find the specific information in the paper.",
        },
      ]);

      setQuery("");
    } catch (error) {
      console.error("Error fetching response:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          user: query,
          bot: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Gemini RAG System Chat
      </h1>

      <div className="w-full max-w-2xl bg-white p-4 rounded-md shadow-md overflow-y-auto max-h-[50vh] mb-4">
        {chatHistory.map((chat, idx) => (
          <div key={idx} className="mb-4 border-b pb-2 last:border-b-0">
            <p className="text-blue-600 font-semibold">You:</p>
            <p className="text-gray-800 mb-2">{chat.user}</p>
            <p className="text-green-600 font-semibold">Gemini:</p>
            <p className="text-gray-800">{chat.bot}</p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl mt-4 flex">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          placeholder="Ask something about the paper..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={loading || !query.trim()}
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
}

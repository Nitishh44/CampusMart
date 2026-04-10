"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage({ params }) {
  const conversationId = params.id;
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [conversation, setConversation] = useState(null);

  const chatBoxRef = useRef(null);

  // Fetch messages + conversation
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) setCurrentUser(user._id);

    fetch(`http://localhost:5000/api/message/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data));

    fetch(`http://localhost:5000/api/chat/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setConversation(data));
  }, [conversationId]);

  // Auto scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message
  const handleSend = async () => {
    const token = localStorage.getItem("token");
    if (!text.trim()) return;

    const res = await fetch("http://localhost:5000/api/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ conversationId, text }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessages([...messages, data]);
      setText("");
    }
  };

  const otherUser =
    conversation &&
    (conversation.buyer?._id === currentUser
      ? conversation.seller
      : conversation.buyer);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-yellow-50 to-indigo-100">

      {/* 🔥 HEADER */}
      <div className="bg-gradient-to-r from-[#0f3d91] to-[#1d4ed8] text-white p-4 flex items-center gap-3 shadow-lg">
        <button
          onClick={() => router.back()}
          className="text-xl hover:scale-110 transition"
        >
          ⬅️
        </button>

        <div>
          <h2 className="font-semibold text-lg">
            {conversation?.product?.title || "Chat"}
          </h2>
          <p className="text-sm text-blue-200">
            {otherUser?.name || ""}
          </p>
        </div>
      </div>

      {/* 💬 CHAT BOX */}
      <div
        ref={chatBoxRef}
        className="flex-1 p-4 overflow-y-auto space-y-3"
      >
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No messages yet
          </p>
        ) : (
          messages.map((msg) => {
            const senderId =
              typeof msg.sender === "object"
                ? msg.sender?._id
                : msg.sender;

            const isMe =
              String(senderId) === String(currentUser);

            return (
              <div
                key={msg._id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-2xl shadow-md ${
                    isMe
                      ? "bg-[#0f3d91] text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <p>{msg.text}</p>

                  <p className="text-xs mt-1 opacity-70 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ✍️ INPUT */}
      <div className="p-4 bg-white shadow-md flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
        />

        <button
          onClick={handleSend}
          className="bg-[#0f3d91] text-white px-5 rounded-xl hover:scale-105 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
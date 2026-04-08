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

    if (user) {
      setCurrentUser(user._id);
    }

    // Fetch messages
    fetch(`http://localhost:5000/api/message/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.log(err));

    // Fetch conversation details
    fetch(`http://localhost:5000/api/chat/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setConversation(data))
      .catch((err) => console.log(err));
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

    try {
      const res = await fetch("http://localhost:5000/api/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId,
          text,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages([...messages, data]);
        setText("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error sending message");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 border-b pb-3">
        <button onClick={() => router.back()} className="text-xl font-bold">
          ⬅️
        </button>

        <div>
          <h2 className="font-bold text-lg">
            {conversation?.product?.title || "Chat"}
          </h2>
          <p className="text-sm text-gray-500">
            {conversation
              ? `Chat with ${
                  conversation.buyer?._id === currentUser
                    ? conversation.seller?.name
                    : conversation.buyer?.name
                }`
              : ""}
          </p>
        </div>
      </div>

      {/* Chat box */}
      <div
        ref={chatBoxRef}
        className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50"
      >
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          messages.map((msg) => {
            const senderId =
              typeof msg.sender === "object" ? msg.sender?._id : msg.sender;

            return (
              <div
                key={msg._id}
                className={`mb-2 flex ${
                  String(senderId) === String(currentUser)
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg shadow inline-block max-w-xs ${
                    String(senderId) === String(currentUser)
                      ? "bg-blue-500 text-white"
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

      {/* Input */}
      <div className="flex mt-4 gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
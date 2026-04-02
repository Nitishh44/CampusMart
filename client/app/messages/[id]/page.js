"use client";

import { useEffect, useState } from "react";

export default function ChatPage({ params }) {
  const conversationId = params.id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  // Fetch old messages
  useEffect(() => {
    const token = localStorage.getItem("token");

     const user = JSON.parse(localStorage.getItem("user"));
console.log("LOCAL USER:", user);

if (user) {
  setCurrentUser(user._id);
}

    fetch(`http://localhost:5000/api/message/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.log(err));
  }, [conversationId]);

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


console.log("CURRENT USER ID:", currentUser);
console.log("MESSAGES:", messages);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50">
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
      <p
        className={`p-2 rounded-lg shadow inline-block max-w-xs ${
          String(senderId) === String(currentUser)
            ? "bg-blue-500 text-white"
            : "bg-white text-black"
        }`}
      >
        {msg.text}
      </p>
    </div>
  );
})
        )}
      </div>

      <div className="flex mt-4 gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
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
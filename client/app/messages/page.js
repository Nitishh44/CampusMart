"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InboxPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/chat", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("CHAT DATA:", data);
        setConversations(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.log(err);
        setConversations([]);
      });
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>

      {conversations.length === 0 ? (
        <p>No chats yet</p>
      ) : (
        conversations.map((c) => (
          <div
            key={c._id}
            onClick={() => router.push(`/messages/${c._id}`)}
            className="border p-4 rounded-lg mb-3 cursor-pointer hover:bg-gray-100"
          >
            <h2 className="font-bold">
              {c.product?.title || "Product"}
            </h2>
            <p className="text-gray-600">Open Chat</p>
          </div>
        ))
      )}
    </div>
  );
}
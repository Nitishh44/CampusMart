"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function InboxPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setCurrentUser(user._id);
    }

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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Inbox</h1>

      {conversations.length === 0 ? (
        <p className="text-gray-500">No chats yet</p>
      ) : (
        <div className="space-y-4">
          {conversations.map((c) => {
            const otherUser =
              c.buyer?._id === currentUser ? c.seller : c.buyer;

            return (
              <div
                key={c._id}
                onClick={() => router.push(`/messages/${c._id}`)}
                className="flex items-center gap-4 border rounded-xl p-4 shadow-md hover:bg-gray-50 cursor-pointer"
              >
                {c.product?.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${c.product.image}`}
                    alt={c.product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <div>
                  <h2 className="font-bold text-lg">
                    {c.product?.title || "Product"}
                  </h2>
                  <p className="text-gray-600">
                    Chat with: {otherUser?.name || "User"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
  {c.lastMessage
    ? c.lastMessage.text.slice(0, 30)
    : "No messages yet"}
</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
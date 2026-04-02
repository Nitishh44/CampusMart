"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Inbox() {
  const [conversations, setConversations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/chat", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Inbox Data:", data);
        setConversations(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>

      {conversations.length === 0 ? (
        <p>No chats yet</p>
      ) : (
        conversations.map((c) => (
          <div
            key={c._id}
            onClick={() => router.push(`/messages/${c._id}`)}
            className="flex items-center gap-4 border p-3 rounded-lg mb-3 cursor-pointer hover:bg-gray-100"
          >
            {c.product?.image && (
              <img
                src={`http://localhost:5000/uploads/${c.product.image}`}
                alt=""
                className="w-12 h-12 object-cover rounded"
              />
            )}

            <div>
              <h3 className="font-semibold">
                {c.product?.title || "Product"}
              </h3>
              <p className="text-sm text-gray-500">
                Chat ID: {c._id.slice(-5)}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
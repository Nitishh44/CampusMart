"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/product/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCount(data.length));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-yellow-50 to-indigo-100">

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-[350px] text-center">

        {/* Avatar */}
        <div className="w-20 h-20 bg-blue-500 text-white flex items-center justify-center rounded-full mx-auto text-2xl font-bold">
          {user.name[0]}
        </div>

        <h1 className="text-xl font-bold mt-4">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>

        <p className="mt-4 text-lg">
          Products: <span className="font-bold text-blue-600">{count}</span>
        </p>

        <button
          onClick={() => router.push("/my-products")}
          className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-xl"
        >
          Go to My Products
        </button>

      </div>
    </div>
  );
}
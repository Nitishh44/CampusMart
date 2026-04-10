"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProduct({ params }) {
  const { id } = params;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // 🔹 Fetch product
  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
      });
  }, [id]);

  // 🔹 Update product
  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/product/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, price }),
      }
    );

    if (res.ok) {
      alert("Updated!");
      router.push("/my-products");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-yellow-50 to-indigo-100">

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-[400px]">

        <h1 className="text-2xl font-bold mb-5 text-center">
          Edit Product
        </h1>

        <div className="flex flex-col gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="border p-3 rounded-xl"
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="border p-3 rounded-xl"
          />

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="border p-3 rounded-xl"
          />

          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white py-3 rounded-xl"
          >
            Update Product
          </button>
        </div>

      </div>
    </div>
  );
}
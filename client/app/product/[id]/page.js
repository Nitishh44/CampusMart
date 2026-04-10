"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductDetail({ params }) {
  const { id } = params;
  const router = useRouter();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChat = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/chat/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sellerId: product.seller?._id || product.seller,
          productId: product._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/messages/${data._id}`);
      } else {
        alert(data.message || "Error starting chat");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  if (!product) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {product.image && (
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.title}
          className="w-full h-80 object-cover rounded-xl mb-4"
        />
      )}

      <h1 className="text-3xl font-bold">{product.title}</h1>

      <p className="text-gray-600 mt-3 text-lg">{product.description}</p>

      <p className="mt-3 text-sm text-blue-600 font-medium">
        Category: {product.category || "Others"}
      </p>

      <p className="mt-2 text-sm text-gray-700">
        Seller: {product.seller?.name || "Unknown Seller"}
      </p>

      <p
        className={`mt-2 text-sm font-semibold ${
          product.isSold ? "text-red-600" : "text-green-600"
        }`}
      >
        Status: {product.isSold ? "SOLD" : "Available"}
      </p>

      <p className="text-2xl font-bold mt-4">₹ {product.price}</p>

      <button
        onClick={handleChat}
        className="mt-6 bg-green-600 text-white px-5 py-2 rounded-lg"
      >
        Chat with Seller
      </button>
    </div>
  );
}
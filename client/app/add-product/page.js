"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function AddProduct() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    router.push("/login");
  }
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Token check
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price), // important fix
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product Added Successfully!");

        // Reset form
        setTitle("");
        setDescription("");
        setPrice("");
      } else {
        alert(data.message || "Error adding product");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
  <div className="p-6 max-w-md mx-auto">
    <h1 className="text-2xl font-bold mb-4">Add Product</h1>

    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
       type="file"
       onChange={(e) => setImage(e.target.files[0])}
      />

      <button className="bg-blue-500 text-white py-2 rounded">
        Add Product
      </button>
    </form>
  </div>
 );
}
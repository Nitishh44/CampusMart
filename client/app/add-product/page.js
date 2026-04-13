"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image);

    const res = await fetch("http://localhost:5000/api/product/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      alert("Product added");
      router.push("/");
    }
  };

  const handleGenerate = async () => {
  const token = localStorage.getItem("token");

  if (!title) {
    alert("Enter title first");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();

    if (res.ok) {
      setDescription(data.description);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.log(err);
    alert("AI error");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-yellow-50 to-indigo-100">
      <form className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md hover:shadow-blue-200 transition-all duration-500" onSubmit={handleSubmit}>
        
        <h1 className="text-2xl font-bold mb-6 text-center text-[#0f3d91]">
          Add Product
        </h1>

        <input
          type="text"
          placeholder="Title"
          className="w-full mb-3 p-3 border rounded-lg"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          type="text"
          placeholder="Description"
          value={description}
          className="w-full mb-3 p-3 border rounded-lg"
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
        type ="button"
        onClick = {handleGenerate}
        className = "bg-purple-600 text-white px-4 py-2 rounded mb-3"
        >
          Generate AI Description
        </button>

        <input
          type="number"
          placeholder="Price"
          className="w-full mb-3 p-3 border rounded-lg"
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Books">Books</option>
          <option value="Electronics">Electronics</option>
          <option value="Notes">Notes</option>
        </select>

        <input
          type="file"
          className="w-full mb-4"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button className="w-full bg-[#0f3d91] text-white py-3 rounded-lg font-semibold hover:bg-[#0c2f70] hover:scale-[1.02] transition">
          Add Product
        </button>
      </form>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // 👉 OLD DATA load karega
  useEffect(() => {
    fetch(`http://localhost:5000/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
      });
  }, [id]);

  // 👉 UPDATE function
  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      return;
    }

    const res = await fetch(`http://localhost:5000/api/product/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, price }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Updated!");
      router.push("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div>
      <h1>Edit Product</h1>

      <form onSubmit={handleUpdate}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button>Update</button>
      </form>
    </div>
  );
}
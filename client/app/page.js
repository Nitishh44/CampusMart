"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/product/all");
        const data = await res.json();
        console.log("DATA:", data);
        setProducts(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🔹 Delete product
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product Deleted");

        // Update UI instantly
        setProducts(products.filter((p) => p._id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Error deleting product");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CampusMart Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p>₹ {p.price}</p>

            {/* 🔥 Delete Button */}
            <button
              onClick={() => handleDelete(p._id)}
              style={{
                background: "red",
                color: "white",
                padding: "5px 10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
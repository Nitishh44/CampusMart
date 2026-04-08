"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/product/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  const handleSold = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/api/product/sold/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (res.ok) {
    alert("Marked as sold");
    setProducts(
      products.map((p) =>
        p._id === id ? { ...p, isSold: true } : p
      )
    );
  } else {
    alert(data.message);
  }
};

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">You have not added any products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-xl shadow-md p-4 bg-white"
            >
              {p.image && (
                <img
                  src={`http://localhost:5000/uploads/${p.image}`}
                  alt={p.title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              )}

              {p.isSold && (
  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
    SOLD
  </span>
)}

              <h2 className="text-lg font-semibold">{p.title}</h2>
              <p className="text-gray-600">{p.description}</p>
              <p className="font-bold mt-2">₹ {p.price}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/edit-product/${p._id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>

                <button
                 onClick={() => handleSold(p._id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
               >
              Mark as Sold
              </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
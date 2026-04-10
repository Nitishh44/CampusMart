"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

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

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const total = products.length;
  const sold = products.filter((p) => p.isSold).length;
  const available = total - sold;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-yellow-50 to-indigo-100 p-6 max-w-6xl mx-auto">

      {/* 🔥 HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-[#0f3d91]">
        My Products Dashboard 🚀
      </h1>

      {/* 📊 STATS */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-4 shadow-xl text-center hover:scale-105 transition">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-blue-700">{total}</p>
        </div>

        <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-4 shadow-xl text-center hover:scale-105 transition">
          <p className="text-gray-500 text-sm">Available</p>
          <p className="text-2xl font-bold text-green-600">{available}</p>
        </div>

        <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl p-4 shadow-xl text-center hover:scale-105 transition">
          <p className="text-gray-500 text-sm">Sold</p>
          <p className="text-2xl font-bold text-red-600">{sold}</p>
        </div>
      </div>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search your products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-3 mb-6 w-full rounded-xl shadow focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
      />

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {p.image && (
                <img
                  src={`http://localhost:5000/uploads/${p.image}`}
                  alt={p.title}
                  className="w-full h-48 object-cover hover:scale-105 transition duration-500"
                />
              )}

              <div className="p-4">
                {p.isSold && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    SOLD
                  </span>
                )}

                <h2 className="text-lg font-bold mt-2">{p.title}</h2>

                <p className="text-sm text-blue-600">{p.category}</p>

                <p className="text-gray-600">{p.description}</p>

                <p className="text-blue-700 font-bold mt-2 text-lg">
                  ₹ {p.price}
                </p>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => router.push(`/edit-product/${p._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
                  >
                    Edit
                  </button>

                  {!p.isSold && (
                    <button
                      onClick={() => handleSold(p._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
                    >
                      Sold
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
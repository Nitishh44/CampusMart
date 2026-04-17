"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
  const [chatCount, setChatCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = selectedCategory
      ? p.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  // 🔹 Fetch products + chat count
  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    setCurrentUser(user._id);
  }

  const token = localStorage.getItem("token");

  if (token) {
    // 🔴 UNREAD COUNT
    fetch(`${BASE_URL}/api/chat/unread`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.count))
      .catch((err) => console.log(err));

    // 📦 CHAT COUNT (optional)
    fetch(`${BASE_URL}/api/chat`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChatCount(data.length);
        }
      })
      .catch((err) => console.log(err));
  }

  // PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await fetch("https://campusmart-1-4esv.onrender.com/api/product/all");
      const data = await res.json();
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
      const res = await fetch(`${BASE_URL}/api/product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-yellow-50 to-indigo-100">
      
      {/* 🔥 HERO SECTION */}
      <div className="bg-gradient-to-r from-[#0f3d91] to-[#1d4ed8] text-white px-6 py-10 shadow-xl transition-all duration-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              CampusMart
            </h1>
            <p className="mt-2 text-blue-100 text-lg">
              Buy, Sell & Chat for Campus Essentials 📚⚡
            </p>
          </div>

          <div className="relative">
  <button
    onClick={() => router.push("/messages")}
    className="bg-[#facc15] text-[#0f172a] font-bold px-6 py-3 rounded-full shadow-md hover:scale-105 transition-all duration-300"
  >
    Inbox
  </button>

  {unreadCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
      {unreadCount}
    </span>
  )}
</div>
        </div>
      </div>

      {/* 🔍 SEARCH + FILTER BAR */}
      <div className="bg-[#facc15] px-6 py-5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search books, notes, electronics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-4 rounded-xl border-none shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 text-gray-800"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-4 rounded-xl shadow-md text-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300"
          >
            <option value="">All Categories</option>
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
            <option value="Notes">Notes</option>
            <option value="Calculator">Calculator</option>
            <option value="Cycle">Bottles</option>
            <option value="Hostel">Hostel Items</option>
          </select>
        </div>
      </div>

      {/* 📦 PRODUCT SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-[#0f172a] mb-8">
          Explore Products
        </h2>

        {loading ? (
          <p className="text-lg text-gray-600">Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-lg text-gray-600">No products found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                onClick={() => router.push(`/product/${p._id}`)}
                className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              >
                {p.image && (
                  <img
                    src={`${BASE_URL}/uploads/${p.image}`}
                    alt={p.title}
                    className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                <div className="p-5">
                  {/* CATEGORY BADGE */}
                  {p.category && (
                    <span className="inline-block bg-yellow-300 text-[#0f172a] text-xs font-semibold px-3 py-1 rounded-full mb-3 shadow-sm group-hover:scale-105 transition">
                      {p.category}
                    </span>
                  )}

                  <h3 className="text-xl font-bold text-slate-800">
                    {p.title}
                  </h3>

                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {p.description}
                  </p>

                  <p className="text-blue-700 font-extrabold mt-4 text-2xl">
                    ₹ {p.price}
                  </p>

                  {/* OWNER BUTTONS */}
                  {String(p.seller) === String(currentUser) && (
                    <div className="flex gap-2 mt-5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p._id);
                        }}
                        className="bg-red-500 hover:bg-red-600 hover:scale-105 text-white px-4 py-2 rounded-xl text-sm shadow transition-all duration-300"
                      >
                        Delete
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/edit-product/${p._id}`);
                        }}
                        className="bg-[#0f3d91] hover:bg-[#0c2f70] hover:scale-105 text-white px-4 py-2 rounded-xl text-sm shadow transition-all duration-300"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <footer className="mt-16 py-6 text-center text-sm bg-white/50 backdrop-blur border-t border-gray-200">
  <p className="text-gray-600">
    Made with <span className="text-red-500 text-lg">❤️</span> by{" "}
    <span className="font-bold text-[#0f3d91]">Nitish Gupta</span>
  </p>
</footer>
    </div>
  );
}
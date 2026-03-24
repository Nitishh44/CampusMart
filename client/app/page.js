"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredProducts = products.filter((p) =>
  p.title.toLowerCase().includes(search.toLowerCase())
  );

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
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">CampusMart Products</h1>
    <input
  type="text"
  placeholder="Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border p-2 mb-4 w-full rounded"
 />

    {loading ? (
      <p>Loading...</p>
    ) : products.length === 0 ? (
      <p>No products found</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.map((p) => (
          <div
            key={p._id}
            className="border rounded-xl shadow-md p-4 bg-white"
          >
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="text-gray-600">{p.description}</p>
            <p className="font-bold mt-2">₹ {p.price}</p>

            <button
  onClick={() => handleDelete(p._id)}
  className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
>
  Delete
</button>

<button
  onClick={() => router.push(`/edit-product/${p._id}`)}
  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
>
  Edit
</button>
          </div>
        ))}
      </div>
    )}
  </div>
 );
}
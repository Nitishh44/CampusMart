"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out");
    router.push("/login");
  };

  return (
    <div style={{ padding: "10px", borderBottom: "1px solid gray" }}>
      <Link href="/">Home</Link> |{" "}
      <Link href="/add-product">Add Product</Link> |{" "}
      <Link href="/my-products">My Products</Link> | {" "}
      <Link href="/register">Register</Link> |{" "}
      <Link href="/my-products">My Products</Link> | {" "}
      
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </div>
  );
}
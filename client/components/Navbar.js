"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    setIsLoggedIn(false);
    router.push("/login");
  };

  const linkStyle = (path) =>
    `transition font-medium hover:text-yellow-300 ${
      pathname === path ? "text-yellow-300" : "text-white"
    }`;

  return (
    <nav className="bg-gradient-to-r from-[#0f3d91] to-[#1d4ed8] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row justify-between items-center gap-3 gap-4">
        
        {/* 🔥 LEFT SIDE */}
        <div className="flex flex-wrap justify-center md:justify-start  items-center gap-3 md:gap-5 text-sm md:text-base">
          <Link href="/" className={linkStyle("/")}>
            Home
          </Link>

          <Link href="/add-product" className={linkStyle("/add-product")}>
            Add Product
          </Link>

          <Link href="/my-products" className={linkStyle("/my-products")}>
            My Products
          </Link>

          <Link href="/profile" className={linkStyle("/profile")}>
            Profile
          </Link>
        </div>

        {/* 🔥 RIGHT SIDE */}
        <div className="flex items-center justify-center md:justify-end gap-2 md:gap-3 w-full md:w-auto">
          {!isLoggedIn && (
            <>
              <Link
                href="/register"
                className="bg-white text-[#0f3d91] px-4 py-2 rounded-full font-semibold text-sm shadow hover:scale-105 transition"
              >
                Register
              </Link>

              <Link
                href="/login"
                className="bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold text-sm shadow hover:scale-105 transition"
              >
                Login
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white w-full md:w-auto px-4 py-2 text-center rounded-full font-semibold text-sm shadow hover:scale-105 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
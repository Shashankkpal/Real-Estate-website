"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

function Header() {
  const path = usePathname();
  const router = useRouter();
  const { isSignedIn } = useUser();

  const [search, setSearch] = useState("");

  // 🔥 Smart search (same page, debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim() !== "") {
        router.push(`${path}?search=${search}`);
      } else {
        router.push(path);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search, path, router]);

  return (
    <div className="p-4 px-10 flex items-center justify-between shadow-sm fixed top-0 w-full z-10 bg-white/90 backdrop-blur-md">

      {/* LEFT */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" width={40} height={40} alt="Logo" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NestoriaX
          </h1>
        </Link>

        <Link
          href="/for-sale"
          className={`font-medium ${
            path === "/for-sale" ? "text-blue-600" : "text-gray-600"
          } hover:text-blue-500 transition`}
        >
          For Sale
        </Link>

        <Link
          href="/for-rent"
          className={`font-medium ${
            path === "/for-rent" ? "text-blue-600" : "text-gray-600"
          } hover:text-blue-500 transition`}
        >
          For Rent
        </Link>
      </div>

      {/* 🔍 SEARCH (premium UI) */}
      <div className="flex-1 flex justify-center">
        <div className="relative">

          <input
            type="text"
            placeholder="Search city (Delhi, Gurgaon...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[380px] px-5 py-2.5 rounded-full border border-amber-700 bg-white/80 backdrop-blur shadow-sm focus:outline-cyan-600 focus:ring-2 focus:ring-cyan-300 transition-all duration-300  hover:border-cyan-400 hover:shadow-md focus:border-cyan-400  "
          />

          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <Link href="/add-new-listing">
          <Button className="flex gap-2">
            <Plus className="h-5 w-5" />
            Post Your Ad
          </Button>
        </Link>

        {!isSignedIn ? (
          <>
            <SignInButton mode="modal">
              <Button variant="outline">Login</Button>
            </SignInButton>

            <SignUpButton mode="modal">
              <Button>Sign Up</Button>
            </SignUpButton>
          </>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
      </div>
    </div>
  );
}

export default Header;
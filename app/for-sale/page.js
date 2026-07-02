"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ForSale() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [listings, setListings] = useState([]);

  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    getListings();
  }, [minPrice, maxPrice, search]);

  const getListings = async () => {
    let query = supabase
      .from("listing")
      .select(`
        *,
        listingImages (*),
        sale_properties (*)
      `)
      .eq("active", true)
      .not("sale_properties", "is", null);

    if (search) {
      query = query.ilike("address", `%${search}%`);
    }

    if (minPrice) {
      query = query.gte("sale_properties.sale_price", minPrice);
    }

    if (maxPrice) {
      query = query.lte("sale_properties.sale_price", maxPrice);
    }

    const { data } = await query;
    setListings(data);
  };

  return (
    <div className="p-10">
      {/* 🔥 Heading */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-600 to-green-700 bg-clip-text text-transparent">
          Homes For Sale
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Invest in your future with the perfect property 💰
        </p>
      </div>

      {/* 🔥 Filter UI (clean + premium) */}
      <div className="flex flex-wrap gap-4 mb-8 bg-gray-100 p-4 rounded-xl shadow-sm">

        <input
          type="number"
          placeholder="Min Price (Cr)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded-lg w-40 focus:ring-2 focus:ring-green-500"
        />

        <input
          type="number"
          placeholder="Max Price (Cr)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded-lg w-40 focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={() => {
            setMinPrice("");
            setMaxPrice("");
          }}
          className="bg-black text-white px-4 rounded-lg hover:bg-gray-800"
        >
          Reset
        </button>

      </div>

      {/* 🔥 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((item) => (
          <Link href={`/listing/${item.id}`} key={item.id}>
            <div className="border rounded-xl overflow-hidden shadow hover:shadow-xl transition duration-300 cursor-pointer">

              <img
                src={
                  item.listingImages?.[0]?.url ||
                  "https://via.placeholder.com/300"
                }
                className="h-48 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="font-semibold text-lg">
                  {item.address}
                </h2>

                <p className="text-gray-600 mt-1">
                  ₹ {item.sale_properties?.[0]?.sale_price} Cr
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
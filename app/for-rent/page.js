"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ForRent() {
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
        rent_properties (*)
      `)
      .eq("active", true)
      .not("rent_properties", "is", null);

    if (search) {
      query = query.ilike("address", `%${search}%`);
    }

    if (minPrice) {
      query = query.gte("rent_properties.rent_price", minPrice);
    }

    if (maxPrice) {
      query = query.lte("rent_properties.rent_price", maxPrice);
    }

    const { data } = await query;
    setListings(data);
  };

  return (
    <div className="p-10">
      {/* 🔥 Heading */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-600 to-indigo-700 bg-clip-text text-transparent">
          Rental Properties
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Comfortable living spaces, ready for you 🏡
        </p>
      </div>

      {/* 🔥 Filter */}
      <div className="flex flex-wrap gap-4 mb-8 bg-gray-100 p-4 rounded-xl shadow-sm">

        <input
          type="number"
          placeholder="Min Rent"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded-lg w-40 focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Max Rent"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded-lg w-40 focus:ring-2 focus:ring-blue-500"
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
                  ₹ {item.rent_properties?.[0]?.rent_price}
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
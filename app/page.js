"use client";

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [listings, setListings] = useState([]);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  useEffect(() => {
    getListings();
  }, [search]);

  const getListings = async () => {
    let query = supabase
      .from("listing")
      .select(`
        *,
        listingImages (url),
        rent_properties (*),
        sale_properties (*)
      `)
      .eq("active", true);

    if (search) {
      query = query.ilike("address", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.log("Fetch error:", error);
    } else {
      setListings(data);
    }
  };

  return (
    <div className="p-10">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-600 via-lime-500 to-pink-800 bg-clip-text text-transparent">
          Discover Your Dream Home
        </h1>

        <p className="text-gray-500 mt-2 text-lg">
          Find the perfect property tailored just for you ✨
        </p>
      </div>

      {listings.length === 0 ? (
        <p>No listings found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {listings.map((item) => {
            const sale = item.sale_properties?.[0];
            const rent = item.rent_properties?.[0];
            const image = item.listingImages?.[0]?.url;

            return (
              <Link href={`/listing/${item.id}`} key={item.id}>
                <div className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer">

                  {/* Image */}
                  <img
                    src={image || "https://via.placeholder.com/300"}
                    className="h-48 w-full object-cover"
                    alt="property"
                  />

                  {/* Content */}
                  <div className="p-3">
                    <h2 className="font-semibold">{item.address}</h2>

                    <p className="text-gray-600 mt-1">
                      {sale
                        ? `₹ ${sale.sale_price} Cr`
                        : rent
                        ? `₹ ${rent.rent_price}`
                        : "N/A"}
                    </p>
                  </div>

                </div>
              </Link>
            );
          })}

        </div>
      )}
    </div>
  );
}
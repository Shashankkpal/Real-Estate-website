"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase/client";
import { useParams } from "next/navigation";

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getListing();
  }, []);

  const getListing = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select(`
        *,
        listingImages (*),
        rent_properties (*),
        sale_properties (*)
      `)
      .eq("id", id); // ❌ NO .single()

    if (!error && data?.length > 0) {
      setListing(data[0]); // ✅ important
    }
  };

  if (!listing) return <p className="p-10">Loading...</p>;

  const images = listing.listingImages || [];
  const sale = listing.sale_properties?.[0];
  const rent = listing.rent_properties?.[0];

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-20">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">

        {/* 🔥 IMAGE SLIDER */}
        <div className="relative w-full h-[400px]">

          <img
            src={images[current]?.url}
            className="w-full h-full object-cover"
          />

          {/* LEFT */}
          {images.length > 1 && (
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
            >
              ◀
            </button>
          )}

          {/* RIGHT */}
          {images.length > 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
            >
              ▶
            </button>
          )}

        </div>

        {/* 🔥 DOTS */}
        {images.length > 1 && (
          <div className="flex justify-center mt-3 gap-2">
            {images.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 w-2 rounded-full cursor-pointer ${
                  current === index ? "bg-black" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}

        <div className="p-8">

          {/* 📍 ADDRESS */}
          <h1 className="text-3xl font-bold">
            {listing.address}
          </h1>

          {/* 📌 COMPLETE ADDRESS */}
          <p className="text-gray-500 mt-1">
            {sale?.complete_address || rent?.complete_address}
          </p>

          {/* 💰 PRICE */}
          <p className="text-2xl font-semibold text-blue-600 mt-4">
            {sale
              ? `₹ ${sale.sale_price} Cr`
              : `₹ ${rent?.rent_price}`}
          </p>

          {/* 🏠 DETAILS */}
          <div className="grid grid-cols-3 gap-6 mt-6 text-center">

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-gray-500 text-sm">Bedrooms</p>
              <p className="font-bold text-lg">
                {sale?.bedrooms || rent?.bedrooms || "N/A"}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-gray-500 text-sm">Bathrooms</p>
              <p className="font-bold text-lg">
                {sale?.bathrooms || rent?.bathrooms || "N/A"}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-xl">
              <p className="text-gray-500 text-sm">Area</p>
              <p className="font-bold text-lg">
                {sale?.area || rent?.area || "N/A"} sq.ft
              </p>
            </div>

          </div>

          {/* 📝 DESCRIPTION */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-gray-600 mt-2 leading-relaxed">
              {sale?.description || rent?.description}
            </p>
          </div>

          {/* 📞 OWNER */}
          <div className="mt-8 p-5 border rounded-xl bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">
              Contact Owner
            </h2>

            <p>
              <b>Name:</b> {sale?.owner_name || rent?.owner_name}
            </p>

            <p>
              <b>Phone:</b> {sale?.owner_phone || rent?.owner_phone}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
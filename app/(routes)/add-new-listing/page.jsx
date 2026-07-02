"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../../utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const MapPicker = dynamic(
  () => import("../../_components/MapPicker"),
  { ssr: false }
);

const AddNewListing = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [searchLocation, setSearchLocation] = useState(null);

  const { user } = useUser();
  const router = useRouter();

  const handleSearch = async () => {
    if (!address) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
    );
    const data = await res.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      setSearchLocation({ lat, lng });
    } else {
      alert("Address not found");
    }
  };

  const handleSave = async () => {
    if (!address || !location) {
      alert("Please enter address and select location");
      return;
    }

    const { data, error } = await supabase
      .from("listing")
      .insert([
        {
          address: address,
          latitude: location.lat,
          longitude: location.lng,
          created_by: user?.primaryEmailAddress?.emailAddress,
          active: true,
        },
      ])
      .select();

    if (error) {
      alert(error.message);
    } else {
      const listingId = data[0].id;
      router.push(`/add-details/${listingId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      
      {/* Main Card */}
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl p-10 space-y-8">

        {/* 🔥 Heading Section */}
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Add New Listing
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Start by adding your property location
          </p>
        </div>

        {/* 📍 Address Section */}
        <div className="bg-gray-50 border rounded-xl p-5">
          
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📍 Property Address
          </label>

          <p className="text-xs text-gray-500 mb-3">
            Enter full address to locate your property on the map
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. Sector 62, Noida"
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              Search
            </button>
          </div>
        </div>

        {/* 🗺️ Map */}
        <div className="rounded-xl overflow-hidden border shadow-sm">
          <MapPicker
            setLocation={setLocation}
            searchLocation={searchLocation}
          />
        </div>

        {/* 📍 Coordinates */}
        {location && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
            <p>
              <span className="font-medium">Latitude:</span> {location.lat}
            </p>
            <p>
              <span className="font-medium">Longitude:</span> {location.lng}
            </p>
          </div>
        )}

        {/* 🚀 Button */}
        <button
          onClick={handleSave}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Continue to Add Details →
        </button>

      </div>
    </div>
  );
};

export default AddNewListing;
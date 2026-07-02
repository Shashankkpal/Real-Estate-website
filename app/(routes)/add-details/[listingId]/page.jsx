"use client";

import React, { useState } from "react";
import { supabase } from "../../../../utils/supabase/client";
import { useParams, useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FileUpload from "../../edit-listing/_components/FileUpload";

function AddDetails() {
  const { listingId } = useParams(); // ⚠️ UUID STRING
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [type, setType] = useState("Rent");

  const [formData, setFormData] = useState({
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    furnishing: "",
    parking: false,
    complete_address: "",
    owner_name: "",
    owner_phone: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  const handleSave = async () => {
    if (!formData.price || !formData.complete_address) {
      alert("Please fill required fields");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    // 🔥 IMPORTANT: UUID ko string hi rehne do
    const listingIdStr = listingId;

    if (!listingIdStr) {
      alert("Listing ID missing!");
      return;
    }

    let error;

    // 🏠 INSERT PROPERTY
    if (type === "Rent") {
      const res = await supabase.from("rent_properties").insert([
        {
          listing_id: listingIdStr, // ✅ UUID STRING
          rent_price: Number(formData.price),
          furnishing: formData.furnishing || null,
          bedrooms: Number(formData.bedrooms) || null,
          bathrooms: Number(formData.bathrooms) || null,
          area: Number(formData.area) || null,
          complete_address: formData.complete_address,
          description: description,
          owner_name: formData.owner_name,      // ✅ NEW
          owner_phone: formData.owner_phone, 
        },
      ]);
      error = res.error;
    } else {
      const res = await supabase.from("sale_properties").insert([
        {
          listing_id: listingIdStr, // ✅ UUID STRING
          sale_price: Number(formData.price),
          bedrooms: Number(formData.bedrooms) || null,
          bathrooms: Number(formData.bathrooms) || null,
          area: Number(formData.area) || null,
          parking: formData.parking || false,
          complete_address: formData.complete_address,
          description: description,
          owner_name: formData.owner_name,      // ✅ NEW
          owner_phone: formData.owner_phone, 
        },
      ]);
      error = res.error;
    }

    if (error) {
      console.log("Property insert error:", error);
      alert(error.message);
      return;
    }

    // 🖼️ IMAGE UPLOAD + SAVE
    for (const file of images) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("listingImages")
        .upload(fileName, file);

      if (uploadError) {
        console.log("Upload error:", uploadError);
        continue;
      }

      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listingImages/${fileName}`;

      const { error: dbError } = await supabase
        .from("listingImages")
        .insert([
          {
            listing_id: listingIdStr, // ✅ UUID STRING
            url: imageUrl,
          },
        ]);

      if (dbError) {
        console.log("Image DB error:", dbError);
      }
    }

    // ✅ Publish listing
    await supabase
      .from("listing")
      .update({ active: true })
      .eq("id", listingIdStr); // ✅ UUID STRING

    alert("Property saved successfully 🎉");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 md:px-20">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg flex flex-col gap-6">

        <h2 className="text-2xl font-bold text-center">
          Add Property Details
        </h2>

        {/* Listing Type */}
        <div>
          <Label className="mb-2 block">Listing Type</Label>
          <RadioGroup
            defaultValue="Rent"
            onValueChange={(value) => setType(value)}
            className="flex gap-10"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Rent" id="Rent" />
              <Label htmlFor="Rent">Rent</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="Sell" id="Sell" />
              <Label htmlFor="Sell">Sell</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Address */}
        <div>
          <Label>Complete Address</Label>
          <input
            name="complete_address"
            placeholder="Street, Colony, City..."
            className="border p-3 rounded-lg w-full mt-1"
            onChange={handleChange}
          />
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            name="price"
            placeholder={type === "Rent" ? "Monthly Rent ₹" : "Sale Price ₹"}
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <input
            name="bedrooms"
            placeholder="Bedrooms"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <input
            name="bathrooms"
            placeholder="Bathrooms"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <input
            name="area"
            placeholder="Area (sq ft)"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />


          <input
            name="owner_name"
            placeholder="Owner Name"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

          <input
            name="owner_phone"
            placeholder="Owner Contact Number"
            className="border p-3 rounded-lg"
            onChange={handleChange}
          />

        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Rent */}
        {type === "Rent" && (
          <div>
            <label className="block mb-2 font-medium">
              Furnishing
            </label>
            <input
              name="furnishing"
              placeholder="Fully / Semi / None"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
            />
          </div>
        )}

        {/* Sale */}
        {type === "Sell" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="parking"
              onChange={handleChange}
            />
            <Label>Parking Available</Label>
          </div>
        )}

        {/* Image Upload */}
        <div>
          <h2 className="font-semibold mb-2">
            Upload Property Images
          </h2>
          <FileUpload setImages={setImages} />
        </div>

        {/* Button */}
        <button
          onClick={handleSave}
          className="bg-black text-white p-3 rounded-lg mt-4 hover:bg-gray-800"
        >
          Save Property
        </button>

      </div>
    </div>
  );
}

export default AddDetails;
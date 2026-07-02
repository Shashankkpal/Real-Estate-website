"use client";

import React, { useState } from "react";
import Image from "next/image";

function FileUpload({ setImages }) {
  const [imagePreview, setImagePreview] = useState([]);

  const handleFileUpload = (event) => {
    const files = event.target.files;

    const fileArray = Array.from(files);
    setImages(fileArray);

    const previews = fileArray.map((file) =>
      URL.createObjectURL(file)
    );
    setImagePreview(previews);
  };

  return (
    <div>
      {/* Upload Box */}
      <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-50">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-48"
        >
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Click to upload</span> or drag & drop
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG or GIF
          </p>

          <input
            id="dropzone-file"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            accept="image/png, image/jpeg, image/gif"
          />
        </label>
      </div>

      {/* Preview */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-4">
        {imagePreview.map((image, index) => (
          <Image
            key={index}
            src={image}
            width={100}
            height={100}
            className="rounded-lg object-cover h-[100px] w-[100px]"
            alt="preview"
          />
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
"use client";

import Header from "./Header";

export default function Provider({ children }) {
  return (
    <>
      <Header />
      <div className="pt-24">
        {children}
      </div>
    </>
  );
}

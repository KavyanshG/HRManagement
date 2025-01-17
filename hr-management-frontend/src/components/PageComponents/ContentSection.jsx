// src/components/ContentSection.jsx

import React from "react";

export default function ContentSection({ title, children }) {
  return (
    <div className="content-section bg-white p-8 rounded-lg shadow-lg  h-max overflow-y-auto mt-4">
      <h2 className="text-2xl font-semibold text-blue-950 mb-6">{title}</h2>
      <div className="text-lg text-gray-600">{children}</div>
     
    </div>
  );
}

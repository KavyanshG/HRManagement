// src/components/Unauthorized.jsx

import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="unauthorized-page flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-600">403 - Unauthorized</h1>
      <p className="mt-4 text-lg">
        You do not have permission to view this page.
      </p>
      <Link to="/login" className="mt-6 text-blue-500 underline">
        Go to Login
      </Link>
    </div>
  );
}

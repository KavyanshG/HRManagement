import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("https://example.com/background.jpg")' }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Our HR Management System
        </h1>
        <p className="text-gray-600 mb-6">
          Your career starts here. Manage your career, explore job
          opportunities, and grow with us.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/apply"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300"
          >
            View Job Postings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

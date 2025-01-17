// src/components/EmployeeComponents/Sidebar.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ menuItems, onLogout, isOpen, onClose, Role }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Close sidebar after navigation
  };

  return (
    <div
      className={` fixed top-0 left-0 h-screen inset-0 z-50 bg-blue-950 text-white transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 md:w-1/4 p-4 md:p-8`}
    >
      <div className="flex justify-between items-center mb-4 md:mb-8">
        <h2 className="text-xl md:text-2xl font-semibold">{Role} Menu</h2>
        <button onClick={onClose} className="md:hidden text-white">
          X
        </button>
      </div>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path} className="mb-2 md:mb-4">
            <button
              onClick={() => handleNavigation(item.path)}
              className={`w-full px-2 py-2 md:px-4 md:py-3 rounded-lg ${
                location.pathname === item.path
                  ? "bg-palette-3 text-gray-300" // Active page color
                  : "bg-palette-4 text-white hover:bg-palette-3" // Inactive page color
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
        <li className="mt-4 md:mt-8">
          <button
            onClick={onLogout}
            className="w-full px-2 py-2 md:px-4 md:py-3 bg-red-500 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

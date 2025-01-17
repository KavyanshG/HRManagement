// src/pages/EmployeeStatus.jsx

import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import { menuItems } from "./constants";

export default function EmployeePerformance() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="employee-status min-h-screen flex bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        Role="Employee"
      />

      <div className="main-content flex-1 p-4 md:p-12 relative">
        {/* Top Bar with Header and Hamburger Icon */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <DashboardHeader title="Your Current Status" />
          <button
            onClick={toggleSidebar}
            className="p-2 mb-4 bg-blue-950 text-white rounded-lg"
          >
            ☰
          </button>
        </div>

        <ContentSection title="Status Overview">
          <p>Your current status details will be displayed here.</p>
          {/* Additional content related to status can go here */}
        </ContentSection>
      </div>
    </div>
  );
}

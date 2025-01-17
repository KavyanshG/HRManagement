// src/components/EmployeeDashboard.jsx

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import { menuItems } from "./constants";
import "../style/mainContent.css";

export default function HRPerformance() {
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
    <div className=" min-h-screen flex bg-gray-100  ">
      <Sidebar
        menuItems={menuItems}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        Role="HR"
      />

      <div className="main-content flex-1 ml-1/2 md:ml-1/4 p-4 md:p-12 h-screen">
        {/* Top Bar with Header and Hamburger Icon */}
        <div className="flex items-center justify-between  md:hidden">
          <DashboardHeader title="Welcome, HR!" />
          <button
            onClick={toggleSidebar}
            className="p-2 mb-4 bg-blue-950 text-white rounded-lg"
          >
            ☰
          </button>
        </div>
        <ContentSection title="Performance Overview">
          <p>Track Employee Performance</p>
          {/* Add additional user-specific content here */}
        </ContentSection>
      </div>
    </div>
  );
}

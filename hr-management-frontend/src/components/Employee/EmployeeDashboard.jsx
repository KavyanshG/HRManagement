import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import { menuItems } from "./constants";
import "../style/mainContent.css";
import API from "../../services/api";
import { jwtDecode } from "jwt-decode";

export default function EmployeeDashboard() {
  const token = localStorage.getItem("token");
  const decryptedToken = jwtDecode(token);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);

  // Fetch employee data
  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        const response = await API.get(`/employees/${decryptedToken.id}`);
        setEmployeeData(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    }
    fetchEmployeeData();
  }, [decryptedToken.id]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        menuItems={menuItems}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        Role="HR"
      />

      <div className="main-content flex-1 ml-1/2 md:ml-1/4 p-4 md:p-12 h-screen">
        {/* Top Bar with Header and Hamburger Icon */}
        <div className="flex items-center justify-between md:hidden">
          <DashboardHeader title="Welcome, HR!" />
          <button
            onClick={toggleSidebar}
            className="p-2 mb-4 bg-blue-950 text-white rounded-lg"
          >
            ☰
          </button>
        </div>
        
        <ContentSection title="Employee Dashboard">
          {employeeData ? (
            <div className="employee-info bg-white shadow-md rounded-lg p-6 mt-4">
              <div className="flex items-center mb-4">
                <img
                  src={employeeData.photo}
                  alt="Employee Photo"
                  className="w-20 h-20 rounded-full border border-gray-300 mr-4"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {employeeData.name}
                  </h2>
                  <p className="text-gray-500">
                    Department: {employeeData.department}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p>
                  <strong>ID:</strong> {employeeData._id}
                </p>
                <p>
                  <strong>User ID:</strong> {employeeData.user}
                </p>
                <p>
                  <strong>Phone:</strong> {employeeData.phone}
                </p>
                <p>
                  <strong>Joining Date:</strong>{" "}
                  {new Date(employeeData.joining_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(employeeData.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Updated At:</strong>{" "}
                  {new Date(employeeData.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Loading employee data...</p>
          )}
        </ContentSection>
      </div>
    </div>
  );
}

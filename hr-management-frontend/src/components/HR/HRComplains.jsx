// src/components/HRComplaints.jsx

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import "../style/mainContent.css";
import { menuItems } from "./constants";
import { jwtDecode } from "jwt-decode";
import API  from "../../services/api";
export default function HRComplaints() {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  console.log(decoded)
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all complaints when the component mounts
    const fetchComplaints = async () => {
      try {
        const response = await API.get("/complaints");
        setComplaints(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDeleteComplaint = async (id) => {
    try {
      await API.delete(`/complaints/${id}`);
      // Filter out the deleted complaint from the state
      setComplaints(complaints.filter((complaint) => complaint._id !== id));
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        Role="HR"
      />

      <div className="main-content flex-1 ml-1/2 md:ml-1/4 p-4 md:p-12 h-screen overflow-y-auto">
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

        <ContentSection title="Complaints Overview">
          <p>Check for Complaints from Employees</p>

          {loading ? (
            <p>Loading complaints...</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Complaint Details</th>
                  <th className="px-4 py-2 border">Employee</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td className="px-4 py-2 border">
                      {complaint.complaint_details}
                    </td>
                    <td className="px-4 py-2 border">
                      {complaint.employee_id?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleDeleteComplaint(complaint._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                      {/* Additional actions like edit can be added here */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ContentSection>
      </div>
    </div>
  );
}

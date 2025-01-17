import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import { menuItems } from "./constants";
import API from "../../services/api";
import {  jwtDecode } from "jwt-decode";

export default function EmployeeComplain() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [complaintDetails, setComplaintDetails] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
 const decoded = jwtDecode(token, process.env.JWT_SECRET);
 console.log(decoded.id);
  useEffect(() => {
    
    // Fetch complaints related to the employee on component mount
    const fetchComplaints = async () => {
      try {
        const response = await API.get("/complaints"); // Adjust endpoint as needed
        setComplaints(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching complaints:", error);
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

  // Handle complaint submission
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("decoded", decoded.id);
      const response = await API.post("/complaints", {
        hr_id: "66fe3060158eae56e55daf27",
        user_id: decoded.id, 
        complaint_details: complaintDetails,
        review_notes: {
          reviewer:"Admin",
          notes: "Ok",
          review_date: Date.now(),
        }, // Start with an empty array for review notes
      });
      setComplaints([...complaints, response.data]);
      setComplaintDetails("");
    } catch (error) {
      console.error("Error submitting complaint:", error.message);
    }
  };

  // Handle complaint deletion
  const handleDeleteComplaint = async (id) => {
    try {
      await API.delete(`/complaints/${id}`);
      setComplaints(complaints.filter((complaint) => complaint._id !== id));
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  return (
    <div className="employee-complain min-h-screen flex bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        Role="Employee"
      />

      <div className="main-content flex-1 p-4 md:p-12 relative overflow-y-auto">
        {/* Top Bar with Header and Hamburger Icon */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <DashboardHeader title="File a Complaint" />
          <button
            onClick={toggleSidebar}
            className="p-2 mb-4 bg-blue-950 text-white rounded-lg"
          >
            ☰
          </button>
        </div>

        <ContentSection title="Complaint Submission">
          <p>
            Please provide details of your complaint below. We value your
            feedback.
          </p>

          {/* Complaint Form */}
          <form onSubmit={handleComplaintSubmit} className="mb-6">
            <textarea
              value={complaintDetails}
              onChange={(e) => setComplaintDetails(e.target.value)}
              placeholder="Enter complaint details"
              className="w-full p-2 border rounded-md mb-4"
              rows="4"
              required
            ></textarea>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-950 text-white rounded-lg"
            >
              Submit Complaint
            </button>
          </form>

          {/* List of Complaints */}
          <h3 className="text-lg font-semibold mb-4">Your Complaints</h3>
          {loading ? (
            <p>Loading complaints...</p>
          ) : complaints.length > 0 ? (
            <ul className="space-y-4">
              {complaints.map((complaint) => (
                <li
                  key={complaint._id}
                  className="p-4 border rounded-md bg-white"
                >
                  <p>{complaint.complaint_details}</p>
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => handleDeleteComplaint(complaint._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No complaints found.</p>
          )}
        </ContentSection>
      </div>
    </div>
  );
}

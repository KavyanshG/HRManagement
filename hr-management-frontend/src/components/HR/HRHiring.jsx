// src/components/HRHiring.jsx

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import { menuItems } from "./constants";
import API from "../../services/api";
import "../style/mainContent.css";

export default function HRHiring() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  // Fetch job postings on mount
  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await API.get("/hiring");
      setJobs(data);
    };
    fetchJobs();
  }, []);

  // Fetch applications for a selected job
  const fetchApplications = async (jobId) => {
    const { data } = await API.get(`/applications/${jobId}`);
    setApplications(data);
    setSelectedJob(jobId);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleHire = async (appId) => {
    await API.post(`/applications/hire/${appId}`);
    alert("Applicant hired!");
    fetchApplications(selectedJob); // Refresh the applications after hiring
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

        <ContentSection title="Hiring Overview">
          {/* Job Postings List */}
          <h3 className="text-lg font-semibold mb-2">Job Postings</h3>
          <ul className="mb-6">
            {jobs.map((job) => (
              <li
                key={job._id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>
                   {job.open_positions} Open Positions
                </span>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => fetchApplications(job._id)}
                >
                  View Applicants
                </button>
              </li>
            ))}
          </ul>

          {/* Applications Section */}
          {selectedJob && (
            <div className="applications-section">
              <h4 className="text-lg font-semibold mb-2">
                Applications for Job ID: {selectedJob}
              </h4>
              <ul>
                {applications.map((app) => (
                  <li
                    key={app._id}
                    className="flex justify-between items-center p-2 border-b"
                  >
                    <span>
                      {app.applicant_id.name} - Status: {app.status}
                    </span>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-md"
                      onClick={() => handleHire(app._id)}
                    >
                      Hire
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ContentSection>
      </div>
    </div>
  );
}

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import { menuItems } from "./constants";
import API from "../../services/api";
import "../style/mainContent.css";

export default function HRAttendance() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]); // Ensure this is initialized as an array
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch leave requests and attendance records for HR
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await API.get("/leave");
        // Ensure leaveRequests is always an array
        setLeaveRequests(response.data.data || []);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    const fetchAttendanceRecords = async () => {
      try {
        const response = await API.get("/attendance");
        // Ensure attendanceRecords is always an array

        setAttendanceRecords(response.data || []);
        console.log("Attendance Records:", attendanceRecords);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };

    fetchLeaveRequests();
    fetchAttendanceRecords();
  }, []);

  // Handle leave request approval/rejection
  const handleLeaveRequest = async (id, action) => {
    try {
      await API.put(`/leave/${id}/confirm/${action}`); // Action should be "approve" or "reject"
      // Refetch leave requests after the action
      try {
        const response = await API.get("/leave");
        // Ensure leaveRequests is always an array
        setLeaveRequests(response.data.data || []);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    } catch (error) {
      console.error("Error updating leave request:", error);
    }
  };
  const handleAttendanceRequest = async (id) => {
    try {
      await API.put(`/attendance/${id}/confirm`);
      try {
        const response = await API.get("/attendance");
        // Ensure leaveRequests is always an array
        setAttendanceRecords(response.data || []);
      } catch (error) {
        console.error("Error fetching attendance requests:", error);
      }
    } catch (error) {
      console.error("Error updating attendance request:", error);
    }
  };

  // Filter pending leave requests (those that are not approved or rejected)
  const pendingLeaveRequests = leaveRequests.filter(
    (request) => request.status === "Pending"
  );

  // Filter approved attendance records
  const PendingAttendanceRecord = attendanceRecords.filter((record) => {
    const status = record.monitor_attendance[0].status;
    return status === "Pending";
  });

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

        <div>
          <ContentSection title="Attendance Overview" > 
            <h3 className="text-lg font-bold">Pending Attendance Records</h3>
            {console.log(
              "Pending Attendance Records on content:",
              PendingAttendanceRecord
            )}
            {PendingAttendanceRecord.length === 0 ? (
              <p>No Pending attendance records available.</p>
            ) : (
              <ul className="space-y-4">
                {PendingAttendanceRecord.map((attendance) => (
                  <li key={attendance._id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <p>
                        {attendance.employee_id.name} marked attendance on
                        <b>
                          {new Date(
                            attendance.monitor_attendance[0].date
                          ).toLocaleDateString()}
                        </b>
                      </p>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                        onClick={() => handleAttendanceRequest(attendance._id)}
                      >
                        Mark
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ContentSection>

          <ContentSection title="Leave Requests">
            <h3 className="text-lg font-bold">Pending Leave Requests</h3>
            {pendingLeaveRequests.length === 0 ? (
              <p>No pending leave requests.</p>
            ) : (
              <ul className="space-y-4">
                {pendingLeaveRequests.map((request) => (
                  <li key={request._id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        {request.employee_id.name}
                        <div>
                          Reason:
                          <b>{request.reason}</b>
                        </div>
                        <div>
                          Date:
                          <b>
                            {new Date(request.leaveDays).toLocaleDateString()}
                          </b>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleLeaveRequest(request._id, "approve")
                          }
                          className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleLeaveRequest(request._id, "reject")
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ContentSection>
        </div>
      </div>
    </div>
  );
}

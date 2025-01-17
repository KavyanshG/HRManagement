import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import { menuItems } from "./constants";
import API from "../../services/api";
import { jwtDecode } from "jwt-decode";

export default function EmployeeAttendance() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [markedToday, setMarkedToday] = useState(false);
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveSuccess, setLeaveSuccess] = useState("");
  const [isViewingAttendance, setIsViewingAttendance] = useState(true);

  useEffect(() => {
    try {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      setUserId(decodedToken.id);
    } catch (error) {
      console.error("Error decoding token:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleView = () => {
    setIsViewingAttendance((prev) => !prev);
  };

  useEffect(() => {
    if (userId) {
      const fetchAttendanceRecords = async () => {
        try {
          const response = await API.get(`/attendance/${userId}`);
          setAttendanceRecords(response.data || []);
          const today = new Date().toISOString().split("T")[0];
          setMarkedToday(
            response.data.some(
              (record) =>
                record.monitor_attendance[0].date.split("T")[0] === today
            )
          );
        } catch (err) {
          console.error("API Error:", err);
          setError(
            err.response
              ? err.response.data.message
              : "Error fetching attendance records"
          );
        }
      };

      const fetchLeaveRequests = async () => {
        try {
          const response = await API.get(`/leave/${userId}`);
          console.log(response.data);
          setLeaveRequests(response.data || []);
        } catch (err) {
          console.error("Get API Error:", err);
          setError(
            err.response
              ? err.response.data.message
              : "Error fetching leave requests"
          );
        }
      };

      fetchAttendanceRecords();
      fetchLeaveRequests();
    }
  }, [userId]);

  const markAttendance = async () => {
    try {
      await API.post(`/attendance`, {
        user_id: userId,
      });
      setMarkedToday(true); // Set to true immediately after marking attendance
      setAttendanceRecords((prevRecords) => [
        ...prevRecords,
        {
          monitor_attendance: [
            { date: new Date().toISOString(), status: "Pending" },
          ],
        },
      ]);
    } catch (err) {
      console.error("Error marking attendance:", err);
      setError(
        err.response ? err.response.data.message : "Error marking attendance"
      );
    }
  };

  const applyLeave = async () => {
    try {
      await API.post(`/leave`, {
        user_id: userId,
        leaveDays: leaveDate,
        reason: leaveReason,
      });
      setLeaveSuccess("Leave applied successfully!");
      setLeaveDate("");
      setLeaveReason("");
    } catch (err) {
      console.error("Error applying for leave:", err);
      setError(
        err.response ? err.response.data.message : "Error applying for leave"
      );
    }
  };

  return (
    <div className="employee-attendance min-h-screen flex bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        Role="Employee"
      />

      <div className="main-content flex-1 p-4 md:p-12 relative">
        <DashboardHeader title="Attendance & Leave Management" />

        <button
          onClick={toggleView}
          className="p-2 mb-4 bg-blue-600 text-white rounded-lg"
        >
          Toggle View:{" "}
          {isViewingAttendance ? "Leave Requests" : "Attendance Records"}
        </button>

        <ContentSection
          title={
            isViewingAttendance
              ? "Your Attendance Overview"
              : "Leave Applications"
          }
        >
          {error && <p style={{ color: "red" }}>{error}</p>}

          {isViewingAttendance ? (
            <div className="attendance-records mt-6">
              {attendanceRecords.length === 0 ? (
                <p>No attendance records found.</p>
              ) : (
                <ul>
                  {attendanceRecords.map((record) => (
                    <li key={record._id}>
                      {new Date(
                        record.monitor_attendance[0].date
                      ).toLocaleDateString()}{" "}
                      - Status: {record.monitor_attendance[0].status}
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={markAttendance}
                disabled={markedToday}
                className={`mt-4 p-2 rounded bg-blue-600 text-white ${
                  markedToday ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {markedToday
                  ? "Attendance Marked for Today"
                  : "Mark Attendance for Today"}
              </button>
            </div>
          ) : (
            <div className="leave-application mt-6">
              <h3>Apply for Leave</h3>
              {leaveSuccess && <p style={{ color: "green" }}>{leaveSuccess}</p>}
              <input
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="mt-2 p-2 border rounded"
              />
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="Reason for leave"
                className="mt-2 p-2 border rounded w-full"
              />
              <button
                onClick={applyLeave}
                disabled={!leaveDate || !leaveReason}
                className="mt-4 p-2 bg-blue-600 text-white rounded"
              >
                Apply for Leave
              </button>

              <h3 className="mt-6">Your Leave Requests</h3>
              {leaveRequests.length === 0 ? (
                <p>No leave requests found.</p>
              ) : (
                <ul>
                  {leaveRequests.map((request) => (
                    <li
                      key={request._id}
                      className="border p-4 shadow-md rounded-md mt-2"
                    >
                      <div className="flex justify-between items-center ">
                        <div>
                          Reason: {request.reason}
                          <div>
                            Status:
                            {request.status === "Pending" ? (
                              <b className="text-blue-600"> {request.status}</b>
                            ) : request.status === "Approved" ? (
                              <span className="text-green-600 text-lg font-bold">
                                {request.status}
                              </span>
                            ) : (
                              <span className="text-red-600 text-lg font-bold">{request.status}</span>
                            )}
                          </div>
                          <div>
                            Date:
                            <b>
                              {new Date(request.leaveDays).toLocaleDateString()}
                            </b>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </ContentSection>
      </div>
    </div>
  );
}

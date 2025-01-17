// src/App.jsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./context/ProtectedRoute";
import Unauthorized from "./components/Others/Unauthorized";

import Login from "./components/Login/Login";

import AdminDashboard from "./components/Admin/AdminDashboard";

import HRDashboard from "./components/HR/HRDashboard";
import HRAttendance from "./components/HR/HRAttendance";
import HRComplains from "./components/HR/HRComplains";
import HRFiring from "./components/HR/HRFiring";
import HRHiring from "./components/HR/HRHiring";
import HRPayroll from "./components/HR/HRPayroll";
import HRPerformance from "./components/HR/HRPerformance";


import EmployeeDashboard from "./components/Employee/EmployeeDashboard";
import EmployeeAttendance from "./components/Employee/EmployeeAttendance";
import EmployeeStatus from "./components/Employee/EmployeePerformance";
import EmployeeComplain from "./components/Employee/EmployeeComplain";
import LandingPage from "./components/Login/Landing";
import JobApplication from "./components/Login/JobApplication";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<JobApplication />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin", ["Employee"]]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-dashboard"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-hiring"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRHiring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-firing"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRFiring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-payroll"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRPayroll />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-performance"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRPerformance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-attendance"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-complains"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRComplains />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-attendance"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-performance"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-complain"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeComplain />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

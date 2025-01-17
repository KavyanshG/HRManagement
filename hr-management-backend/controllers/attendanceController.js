const { stat } = require("fs");
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const LeaveRequest = require("../models/LeaveRequest"); // New model for leave requests
const asyncHandler = require("express-async-handler");

// @desc    Create a new Attendance record
// @route   POST /api/attendance
// @access  Employee
exports.createAttendance = asyncHandler(async (req, res) => {
  const { user_id } = req.body; // user_id is from the request body
  const employee = await Employee.findOne({ user: user_id });

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  // Check if attendance already exists for today
  const today = new Date().setHours(0, 0, 0, 0);
  const existingAttendance = await Attendance.findOne({
    employee_id: employee._id,
    "monitor_attendance.date": today,
  });

  if (existingAttendance) {
    res.status(400);
    throw new Error("Attendance already marked for today");
  }

  const attendance = new Attendance({
    employee_id: employee._id,
    monitor_attendance: [
      {
        date: today,
        status: "Pending", // Initial status is Pending until HR confirms
      },
    ],
  });

  const savedAttendance = await attendance.save();
  res.status(201).json(savedAttendance);
});

// @desc    Get all Attendance records
// @route   GET /api/attendance
// @access  HR/Admin
exports.getAllAttendance = asyncHandler(async (req, res) => {
  const attendances = await Attendance.find().populate(
    "employee_id",
    
  );
  res.status(200).json(attendances);
});

// @desc    Get a single Attendance record by ID
// @route   GET /api/attendance/:id
// @access  HR/Admin
exports.getAttendanceById = asyncHandler(async (req, res) => {
  const employee_id= await Employee.findOne({ user: req.params.id }).id;
  const attendance = await Attendance.find(employee_id).populate(
    "employee_id",
    "name email"
  );

  if (!attendance) {
    res.status(404);
    throw new Error("Attendance record not found");
  }

  res.status(200).json(attendance);
});

// @desc    Confirm or update an Attendance record
// @route   PUT /api/attendance/:id/confirm
// @access  HR/Admin
exports.confirmAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    res.status(404);
    throw new Error("Attendance record not found");
  }
console.log(attendance.monitor_attendance);
  // Update the status based on HR confirmation
  // "Confirmed" or "Rejected"
  attendance.monitor_attendance.forEach((entry) => {

      entry.status = "Present";
      console.log("MARKED")// Update status for the specific date
    
  });

  const updatedAttendance = await attendance.save();
  res.status(200).json(updatedAttendance);
});

// @desc    Delete an Attendance record
// @route   DELETE /api/attendance/:id
// @access  HR/Admin
exports.deleteAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    res.status(404);
    throw new Error("Attendance record not found");
  }

  await attendance.remove();
  res.status(200).json({ message: "Attendance record removed" });
});


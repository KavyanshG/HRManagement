const asyncHandler = require("express-async-handler");
const LeaveRequest = require("../models/LeaveRequest");
const Employee = require("../models/Employee");


exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find().populate(
      "employee_id",
      "name"
    ); // Fetch from the Leave model
    res.status(200).json({ success: true, data: leaveRequests });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};



exports.getAllLeaveRequestsByID = asyncHandler(async (req, res) => {
  // Find the employee based on the user ID provided in params
  const employee = await Employee.findOne({ user: req.params.id });

  if (!employee) {
    return res
      .status(404)
      .json({ success: false, message: "Employee not found" });
  }

  // Use the employee's ID to find leave requests
  const leaveRequests = await LeaveRequest.find({
    employee_id: employee._id, // Use `_id` to match with employee_id in leave requests
  }).populate("employee_id", "name");
    
    if (!leaveRequests) {
        return res
            .status(404)
            .json({ success: false, message: "Leave requests not found" });
    }

  res.status(200).json( leaveRequests );
});



exports.applyLeave = asyncHandler(async (req, res) => {
  const { user_id, leaveDays, reason } = req.body; // leaveDays is the number of leave days requested
  const employee = await Employee.findOne({ user: user_id });

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  if (leaveDays > 10) {
    res.status(400);
    throw new Error(
      "You can only apply for a maximum of 10 paid leave days per year"
    );
  }

  const leaveRequest = new LeaveRequest({
    employee_id: employee._id,
    leaveDays,
    reason,
    status: "Pending",
  });

  const savedLeaveRequest = await leaveRequest.save();
  res.status(201).json(savedLeaveRequest);
});


// @desc    Confirm or update an Attendance record
// @route   PUT /api/leave/:id/confirm
// @access  HR/Admin
// Confirm or update a leave request status (approve or reject)
exports.confirmLeaveRequest = asyncHandler(async (req, res) => {
  const leaveRequest = await LeaveRequest.findById(req.params.id);

  if (!leaveRequest) {
    res.status(404);
    throw new Error("Leave request not found");
  }

  // Extract action from the URL (approve or reject)
  const action = req.params.status; // "approve" or "reject"
  
  if (!["approve", "reject"].includes(action)) {
    res.status(400);
    throw new Error("Invalid action");
  }

  // Set the status based on the action
  leaveRequest.status = action === "approve" ? "Approved" : "Rejected";

  const updatedLeaveRequest = await leaveRequest.save();
  res.status(200).json(updatedLeaveRequest);
});
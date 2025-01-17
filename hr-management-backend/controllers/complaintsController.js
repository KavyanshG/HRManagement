// controllers/complaintsController.js

const Complaints = require("../models/Complaints");
const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");

// @desc    Create a new Complaint record
// @route   POST /api/complaints
// @access  HR/Admin/Employee
exports.createComplaint = asyncHandler(async (req, res) => {
  const { hr_id, user_id, complaint_details, review_notes } = req.body; 
  // Validate HR and Employee existence
  const hr = await require("../models/HR").findById(hr_id);
  const employee = await require("../models/Employee").findOne({user: user_id});

  var employee_id = employee._id;
  if (!hr) {
    res.status(404);
    throw new Error("HR not found");
  }

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const complaint = new Complaints({
    hr_id,
    employee_id,
    complaint_details,
    review_notes,
  });

  const savedComplaint = await complaint.save();
  res.status(201).json(savedComplaint);
});

// @desc    Get all Complaints
// @route   GET /api/complaints
// @access  HR/Admin
exports.getAllComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaints.find()
    .populate("hr_id", "name email")
    .populate("employee_id", "name email");
  res.status(200).json(complaints);
});

// @desc    Get a single Complaint record by ID
// @route   GET /api/complaints/:id
// @access  HR/Admin
exports.getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaints.findById(req.params.id)
    .populate("hr_id", "name email")
    .populate("employee_id", "name email");

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint record not found");
  }

  res.status(200).json(complaint);
});

// @desc    Update a Complaint record
// @route   PUT /api/complaints/:id
// @access  HR/Admin
exports.updateComplaint = asyncHandler(async (req, res) => {
  const { complaint_details, review_notes } = req.body;

  const complaint = await Complaints.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint record not found");
  }

  complaint.complaint_details =
    complaint_details || complaint.complaint_details;
  complaint.review_notes = review_notes || complaint.review_notes;

  const updatedComplaint = await complaint.save();
  res.status(200).json(updatedComplaint);
});

// @desc    Delete a Complaint record
// @route   DELETE /api/complaints/:id
// @access  HR/Admin
exports.deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaints.findById(req.params.id);

  if (!complaint) {
    res.status(404);
    throw new Error("Complaint record not found");
  }

  await Complaints.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Complaint record removed" });
});

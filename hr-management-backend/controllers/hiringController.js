// controllers/hiringController.js

const Hiring = require("../models/Hiring");
const asyncHandler = require("express-async-handler");

// @desc    Create a new Hiring Record
// @route   POST /api/hiring
// @access  Private/HR or Admin
// Example modification in createHiring
exports.createHiring = asyncHandler(async (req, res) => {
  const { hr_id, job_title, department, open_positions, scheduled_interviews, checked_documents } = req.body;

  const hiring = await Hiring.create({
    hr_id,
    job_title,
    department,
    open_positions,
    scheduled_interviews,
    checked_documents,
  });

  res.status(201).json(hiring);
});







// @desc    Get all Hiring Records
// @route   GET /api/hiring
// @access  Private/HR or Admin
exports.getAllHiring = asyncHandler(async (req, res) => {
  const hirings = await Hiring.find()
    .populate("hr_id", "name department")
    .populate("scheduled_interviews.employee_id", "name department")
    .populate("checked_documents.employee_id", "name department");

  res.json(hirings);
});

// @desc    Get single Hiring Record
// @route   GET /api/hiring/:id
// @access  Private/HR or Admin
exports.getHiring = asyncHandler(async (req, res) => {
  const hiring = await Hiring.findById(req.params.id)
    .populate("hr_id", "name department")
    .populate("scheduled_interviews.employee_id", "name department")
    .populate("checked_documents.employee_id", "name department");

  if (hiring) {
    res.json(hiring);
  } else {
    res.status(404);
    throw new Error("Hiring record not found");
  }
});

// @desc    Update Hiring Record
// @route   PUT /api/hiring/:id
// @access  Private/HR or Admin
exports.updateHiring = asyncHandler(async (req, res) => {
  const hiring = await Hiring.findById(req.params.id);

  if (hiring) {
    hiring.open_positions = req.body.open_positions || hiring.open_positions;
    hiring.scheduled_interviews =
      req.body.scheduled_interviews || hiring.scheduled_interviews;
    hiring.checked_documents =
      req.body.checked_documents || hiring.checked_documents;

    const updatedHiring = await hiring.save();
    res.json(updatedHiring);
  } else {
    res.status(404);
    throw new Error("Hiring record not found");
  }
});

// @desc    Delete Hiring Record
// @route   DELETE /api/hiring/:id
// @access  Private/HR or Admin
exports.deleteHiring = asyncHandler(async (req, res) => {
  const hiring = await Hiring.findById(req.params.id);

  if (hiring) {
    await hiring.remove();
    res.json({ message: "Hiring record removed" });
  } else {
    res.status(404);
    throw new Error("Hiring record not found");
  }
});

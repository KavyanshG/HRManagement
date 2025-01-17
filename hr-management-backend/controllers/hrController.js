// controllers/hrController.js

const HR = require("../models/HR");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc    Create a new HR
// @route   POST /api/hr
// @access  Private/Admin
exports.createHR = asyncHandler(async (req, res) => {
  const { email, password, name, department, phone, address, photo } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("HR already exists");
  }

  // Create user
  const user = await User.create({
    email,
    password,
    role: "HR",
    name,
    department,
    phone,
    address,
    photo,
  });

  if (user) {
    // Create HR profile
    const hr = await HR.create({
      user: user._id,
      name,
      department,
      phone,
      address,
      photo,
    });

    res.status(201).json(hr);
  } else {
    res.status(400);
    throw new Error("Invalid HR data");
  }
});

// @desc    Get all HRs
// @route   GET /api/hr
// @access  Private/Admin
exports.getAllHRs = asyncHandler(async (req, res) => {
  const hrs = await HR.find().populate("user", "-password");
  res.json(hrs);
});

// @desc    Get single HR
// @route   GET /api/hr/:id
// @access  Private/Admin
exports.getHR = asyncHandler(async (req, res) => {
  const hr = await require("../models/HR").findOne({ user: req.params.id });
  

  if (hr) {
    res.json(hr);
  } else {
    res.status(404);
    throw new Error("HR not found");
  }
});

// @desc    Update HR
// @route   PUT /api/hr/:id
// @access  Private/Admin
exports.updateHR = asyncHandler(async (req, res) => {
  const hr = await HR.findById(req.params.id);

  if (hr) {
    hr.name = req.body.name || hr.name;
    hr.department = req.body.department || hr.department;
    hr.phone = req.body.phone || hr.phone;
    hr.address = req.body.address || hr.address;
    hr.photo = req.body.photo || hr.photo;

    const updatedHR = await hr.save();
    res.json(updatedHR);
  } else {
    res.status(404);
    throw new Error("HR not found");
  }
});

// @desc    Delete HR
// @route   DELETE /api/hr/:id
// @access  Private/Admin
exports.deleteHR = asyncHandler(async (req, res) => {
  const hr = await HR.findById(req.params.id);

  if (hr) {
    // Delete associated User
    await User.findByIdAndDelete(hr.user);

    // Delete HR profile
    await hr.remove();

    res.json({ message: "HR removed" });
  } else {
    res.status(404);
    throw new Error("HR not found");
  }
});

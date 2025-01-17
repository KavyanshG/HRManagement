const User = require("../models/User");
const HR = require("../models/HR");
const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate("role");
  res.json(users);
});

// @desc    Get all HRs
// @route   GET /api/admin/hrs
// @access  Private/Admin
exports.getAllHRs = asyncHandler(async (req, res) => {
  const hrs = await HR.find().populate("user"); // populate user if needed
  res.json(hrs);
});

// @desc    Get all employees
// @route   GET /api/admin/employees
// @access  Private/Admin
exports.getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().populate("user"); // populate user if needed
  res.json(employees);
});

// @desc    Create a new user (Admin)
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  const { email, password, role, name, department, phone, address, photo } =
    req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create new user
  const user = await User.create({
    email,
    password,
    role,
    name,
    department,
    phone,
    address,
    photo,
  });

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);

  if (user) {
    user.role = role || user.role;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

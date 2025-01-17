const User = require("../models/User");
const Admin = require("../models/Admin");
const HR = require("../models/HR");
const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// Utility function to create a new user
const createUserAndProfile = async (role, userData) => {
  const user = await User.create({ ...userData, role });
  if (role === "Admin") {
    await Admin.create({ user: user._id });
  } else if (role === "HR") {
    await HR.create({ user: user._id, ...userData });
  } else if (role === "Employee") {
    await Employee.create({ user: user._id, ...userData });
  }
  return user;
};

// @desc    Register a new user (Admin, HR, Employee)
// @route   POST /api/auth/register/:role
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { role } = req.params; // get role from params
  const { email, password, name, department, phone, address, photo, hr_id } =
    req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error(`${role} already exists`);
  }

  // Create user and their profile
  const user = await createUserAndProfile(role, {
    email,
    password,
    name,
    department,
    phone,
    address,
    photo,
    hr_id,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email }).select("+password");
  
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

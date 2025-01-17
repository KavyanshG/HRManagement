// controllers/employeeController.js

const Employee = require("../models/Employee");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc    Create a new Employee
// @route   POST /api/employees
// @access  Private/HR or Admin
exports.createEmployee = asyncHandler(async (req, res) => {
  const { email, password, name, department, phone, address, photo, hr_id } =
    req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Employee already exists");
  }

  // Create user
  const user = await User.create({
    email,
    password,
    role: "Employee",
    name,
    department,
    phone,
    address,
    photo,
  });

  if (user) {
    // Create Employee profile
    const employee = await Employee.create({
      user: user._id,
      hr_id,
      name,
      department,
      phone,
      address,
      photo,
    });

    res.status(201).json(employee);
  } else {
    res.status(400);
    throw new Error("Invalid Employee data");
  }
});

// @desc    Get all Employees
// @route   GET /api/employees
// @access  Private/HR or Admin
exports.getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find()
    .populate("user", "-password")
    .populate("hr_id", "name department");
  res.json(employees);
});

// @desc    Get single Employee
// @route   GET /api/employees/:id
// @access  Private/HR or Admin
exports.getEmployee = asyncHandler(async (req, res) => {
  const employee = await require("../models/Employee").findOne({ user: req.params.id });

  if (employee) {
    res.json(employee);
  } else {
    res.status(404);
    throw new Error("Employee not found");
  }
});

// @desc    Update Employee
// @route   PUT /api/employees/:id
// @access  Private/HR or Admin
exports.updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate("user");

  if (employee) {
    // Update User fields
    const user = employee.user;
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.department = req.body.department || user.department;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.photo = req.body.photo || user.photo;
    if (req.body.password) {
      user.password = req.body.password; // Will be hashed in User model pre-save hook
    }
    await user.save();

    // Update Employee fields
    employee.hr_id = req.body.hr_id || employee.hr_id;
    employee.department = req.body.department || employee.department;
    employee.phone = req.body.phone || employee.phone;
    employee.address = req.body.address || employee.address;
    employee.photo = req.body.photo || employee.photo;
    await employee.save();

    res.json(employee);
  } else {
    res.status(404);
    throw new Error("Employee not found");
  }
});

// @desc    Delete Employee
// @route   DELETE /api/employees/:id
// @access  Private/HR or Admin
exports.deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate("user");

  if (employee) {
    // Delete associated User
    await User.findByIdAndDelete(employee.user._id);

    // Delete Employee profile
    await employee.remove();

    res.json({ message: "Employee removed" });
  } else {
    res.status(404);
    throw new Error("Employee not found");
  }
});

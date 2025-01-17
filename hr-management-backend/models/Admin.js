// models/Admin.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Admin Schema
const adminSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Add any additional fields specific to Admins here
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;

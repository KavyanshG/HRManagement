// models/Attendance.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Attendance Schema
const attendanceSchema = new Schema(
  {
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    monitor_attendance: [
      {
        date: { type: Date, required: true },
        status: { type: String, required: true }, // Present, Absent, Late
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;

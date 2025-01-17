// models/Hiring.js
const mongoose = require("mongoose");

const hiringSchema = new mongoose.Schema(
  {
    hr_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job_title: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    open_positions: {
      type: Number,
      required: true,
    },
    scheduled_interviews: [
      {
        employee_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
        },
        date: Date,
      },
    ],
    checked_documents: [
      {
        employee_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
        },
        documents: Array,
      },
    ],
    applicants: [
      {
        name: String,
        department: String,
        phone: String,
        photo: String,
      },
    ],
  },
  { timestamps: true }
);

const Hiring = mongoose.model("Hiring", hiringSchema);
module.exports = Hiring;

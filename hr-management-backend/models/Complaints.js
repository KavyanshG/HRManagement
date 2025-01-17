// models/Complaints.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Complaints Schema
const complaintsSchema = new Schema(
  {
    hr_id: { type: Schema.Types.ObjectId, ref: "HR", required: true },
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    complaint_details: { type: String, required: true },
    review_notes: [
      {
        reviewer: { type: String, required: true },
        notes: { type: String, required: true },
        review_date: { type: Date, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Complaints = mongoose.model("Complaints", complaintsSchema);
module.exports = Complaints;

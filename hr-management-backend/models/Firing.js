// models/Firing.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Firing Schema
const firingSchema = new Schema(
  {
    hr_id: { type: Schema.Types.ObjectId, ref: "HR", required: true },
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    reason_for_termination: { type: String, required: true },
    termination_date: { type: Date, required: true },
    final_salary_settlement: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Firing = mongoose.model("Firing", firingSchema);
module.exports = Firing;




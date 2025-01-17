// models/Performance.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Performance Schema
const performanceSchema = new Schema(
  {
    hr_id: { type: Schema.Types.ObjectId, ref: "HR", required: true },
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    performance_review: [
      {
        review_period: { type: String, required: true }, // e.g., Q1 2024
        score: { type: Number, required: true },
        reviewer: { type: String, required: true },
        review_date: { type: Date, required: true },
      },
    ],
    bonuses: [
      {
        bonus_type: { type: String, required: true },
        bonus_amount: { type: Number, required: true },
        awarded_on: { type: Date, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Performance = mongoose.model("Performance", performanceSchema);
module.exports = Performance;

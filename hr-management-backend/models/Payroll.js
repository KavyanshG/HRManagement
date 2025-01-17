// models/Payroll.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Payroll Schema
const payrollSchema = new Schema(
  {
    hr_id: { type: Schema.Types.ObjectId, ref: "HR", required: true },
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    monthly_or_quarterly_payments: [
      {
        amount: { type: Number, required: true },
        payment_date: { type: Date, required: true },
        period: { type: String, required: true }, // e.g., Monthly, Quarterly
      },
    ],
    promotions: [
      {
        promotion_date: { type: Date, required: true },
        new_position: { type: String, required: true },
        salary_increase: { type: Number, required: true },
      },
    ],
    bonus_schedule: [
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

const Payroll = mongoose.model("Payroll", payrollSchema);
module.exports = Payroll;

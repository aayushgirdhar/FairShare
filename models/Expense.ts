import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    payer: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
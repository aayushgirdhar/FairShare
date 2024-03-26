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
    total: {
      type: Number,
      required: true,
    },
    payers: [
      {
        _id: false,
        uid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);

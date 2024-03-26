import mongoose from "mongoose";

export const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  expenses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Expense",
  },
}, { timestamps: true });

// avoid recompiling model if it already exists
export default mongoose.models.Group || mongoose.model("Group", GroupSchema); 
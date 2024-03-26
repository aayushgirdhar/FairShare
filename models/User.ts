import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
    },
    groups: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Group",
    },
    expenses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Expense",
    },
    isOAuth: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

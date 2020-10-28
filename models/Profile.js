import mongoose from "mongoose";
// import validator from "express-validator";

const ProfileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
    },
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", ProfileSchema);

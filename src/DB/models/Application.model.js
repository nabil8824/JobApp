import mongoose, { Schema } from "mongoose";


const ApplicationSchema = new mongoose.Schema(
  {
    jobId: { 
      type: Schema.Types.ObjectId, ref: "Job",
       required: true }, 
    userId: { 
      type: Schema.Types.ObjectId, ref: "User", 
      required: true }, 
    userCV: {
      secure_url: String, 
      public_id: String, 
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "viewed", "in consideration", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const ApplicationModel = mongoose.models.Application|| mongoose.model('Application',ApplicationSchema )
export default ApplicationModel;



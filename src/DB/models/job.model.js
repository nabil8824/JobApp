import mongoose from "mongoose";
import ApplicationModel from "./Application.model.js";


const JobSchema = new mongoose.Schema(
  {
    jobTitle: {
       type: String, 
       required: true, 
       trim: true },
    jobLocation: { 
      type: String, 
      enum: ["onsite", "remotely", "hybrid"], 
      required: true },
    workingTime: { 
      type: String, enum: ["part-time", "full-time"], 
      required: true },
    seniorityLevel: {
      type: String,
      enum: ["Fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
      required: true,
    },
    jobDescription: {
       type: String, 
       required: true, 
       trim: true },
    technicalSkills: [{
       type: String, required: true 
      }], 
    softSkills: [{
       type:String, required: true 
      }], 
    addedBy: { 
      type: mongoose.Schema.Types.ObjectId, ref: "User", 
      required: true }, 
    updatedBy: { 
      type: mongoose.Schema.Types.ObjectId, ref: "User",
       default: null }, 
    closed: { 
      type: Boolean, 
      default: false }, 
    companyId: { 
      type: mongoose.Schema.Types.ObjectId, ref: "Company", 
      required: true }, 
    deletedAt:{
      type: Date,
    },
    isdeleted:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true ,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);
JobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
  justOne: false, 
});


JobSchema.pre("findOneAndDelete", async function (next) {
  const job = await this.model.findOne(this.getFilter());
  if (!job) {
    return next();
  }
  await ApplicationModel.deleteMany({ jobId: job._id }); 
  next();
});

const JobModel = mongoose.models.Job||mongoose.model("Job", JobSchema);
export default JobModel;


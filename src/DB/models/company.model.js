import mongoose from "mongoose";
import ApplicationModel from "./Application.model.js";
import JobModel from "./job.model.js";


const companySchema= new mongoose.Schema({
    companyName: {
       type: String, required: true, 
       unique: true, 
       trim: true },

    description: {
       type: String,
        required: true, 
        trim: true },
    industry: { 
      type: String, 
      required: true,
       trim: true },
    address: { type: String,
       required: true, 
       trim: true },
    numberOfEmployees: {
        type: Number,
       min:11,
        max: 20,
        required: true,
      },
      companyEmail: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId, ref: "User", 
         required: true }, 
      logo: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null },
      },
      coverPic: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null },
      },
      HRs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
      bannedAt: { type: Date, default: null },
      isdeleted: { type: Boolean, default: false},
      deletedAt: { type: Date, default: null },
      legalAttachment: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null },
      },
      approvedByAdmin: { type: Boolean, default: false },
      isbanned: { type: Boolean, default: false },
    },
    { timestamps: true ,
      toJSON: { virtuals: true },
    toObject: { virtuals:true},
    })
    companySchema.virtual("job",
      {
        ref: "Job",
        localField: "_id",
        foreignField: "companyId",
      }
    )
    companySchema.pre("deleteOne", { document: true, query: false }, async function (next) {
      const companyId = this._id; 
      await JobModel.deleteMany({ companyId });
      await ApplicationModel.deleteMany({ jobId });
      console.log("Related Jobs Deleted ");
      next();
    });
    const companyModel = mongoose.models.Company || mongoose.model('Company',companySchema )
    export default companyModel;



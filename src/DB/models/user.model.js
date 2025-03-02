import mongoose from "mongoose";
import { roles } from "../../middelware/auth.js";
import companyModel from "./company.model.js";
import JobModel from "./job.model.js";
import ApplicationModel from "./Application.model.js";
import { Decrypt } from "../../utils/encrypt/decrypt.js";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    provider: {
      type: String,
      enum: ["google", "system"],
      default: "system",
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const today = new Date();
          const age = today.getFullYear() - value.getFullYear();
          return age > 18;
        },
        message: "User must be at least 18 years old.",
      },
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: "user",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },
    bannedAt: {
      type: Date,
      default: null,
    },
    isbanned: {
      type: Boolean,
      default: false,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    changeCredentialTime: { type: Date, default: null },

    profilePic: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    OTP: [
      {
        code: { type: String, required: true },
        type: {
          type: String,
          enum: ["confirmEmail", "forgetPassword"],
          required: true,
        },
        expiresIn: { type: Date, required: true },
      },
    ],

    otpPassword: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("username").get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return "";
});
UserSchema.virtual("userData", {
  ref: "Company",
  localField: "_id",
  foreignField: "companyId",
});
UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await companyModel.deleteMany({ createdBy: this._id });
    await JobModel.deleteMany({ addedBy: this._id });
    await ApplicationModel.deleteMany({ userId: this._id });
    console.log("Related documents deleted ");
    next();
  }
);
UserSchema.post("findOne", async function (doc, next) {
  if (doc && doc.mobileNumber) {
    doc.mobileNumber = await Decrypt({
      key: doc.mobileNumber,
      SECRET_KEY: process.env.SECRET_KEY,
    });
  }
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;

import ApplicationModel from "../../DB/models/Application.model.js";
import companyModel from "../../DB/models/company.model.js";
import JobModel from "../../DB/models/job.model.js";
import UserModel from "../../DB/models/user.model.js";
import { sendEmail } from "../../service/sendEmails.js";
import cloudinary from "../../utils/cloudinary/index.js";
import { asyncHandler } from "../../utils/error/errorHandler.js";
import ExcelJS from "exceljs";

export const getApplicationsExcel = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const job = await JobModel.findOne({ _id: jobId, isdeleted: false });
  if (!job) {
    return next(new Error("Company not found or deleted", { cause: 404 }));
  }
  const applications = await ApplicationModel.find({ jobId }).populate({
    path: "userId",
    select: "firstName lastName email",
  });

  console.log(applications);

  if (!applications || applications.length === 0) {
    return next(
      new Error("No applications found for this company", { cause: 404 })
    );
  }
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Applications");
  worksheet.columns = [
    { header: "User Name", key: "userName", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Status", key: "status", width: 20 },
    { header: "Applied Date", key: "createdAt", width: 25 },
  ];

  applications.forEach((app) => {
    worksheet.addRow({
      userName: `${app.userId.firstName} ${app.userId.lastName}`,
      email: app.userId.email,
      status: app.status,
      createdAt: app.createdAt.toLocaleDateString(),
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const uploadExcel = cloudinary.uploader.upload_stream(
    {
      resource_type: "raw",
      folder: "job_app/excelFiles",
      public_id: `Applications_${jobId}`,
      filename: `Applications_${jobId}.xlsx`,
    },
    async (error, result) => {
      if (error) {
        return next(new Error("Error uploading Excel file", { cause: 500 }));
      }
      res.status(200).json({
        message: "Excel sheet created successfully",
        fileURL: result.secure_url,
      });
    }
  );

  uploadExcel.end(buffer);
});

//البونص اهو بس بصراحه ساعدني شات جيبيتي بس تعبت فيه وحضرتك كنت قايلي عادي لو ساعدني بس اتعلمت حاجه جديده

export const addApplication = asyncHandler(async (req, res, next) => {
  const { jobId } = req.body;
  const job = await JobModel.findOne({ _id: jobId, isdeleted: false });
  if (!job) {
    return next(new Error("Job not found or deleted", { cause: 404 }));
  }
  let userCV = null;
  if (req.file) {
    try {
      const uploadProfile = await cloudinary.uploader.upload(req.file.path, {
        folder: "job_app/userCV",
      });
      userCV = {
        secure_url: uploadProfile.secure_url,
        public_id: uploadProfile.public_id,
      };
    } catch (error) {
      return next(new Error("Error uploading CV", { cause: 500 }));
    }
  } else {
    return next(new Error("CV file is required", { cause: 400 }));
  }
  const addApplication = await ApplicationModel.create({
    jobId,
    userId: req.user._id,
    userCV,
  });
  res
    .status(200)
    .json({ message: "Application submitted successfully", addApplication });
});
export const acceptOrRejectApplication = asyncHandler(
  async (req, res, next) => {
    const { applicationId, status } = req.body;
    const { userId, companyId } = req.params;
    const company = await companyModel.findOne({
      _id: companyId,
      isdeleted: false,
    });
    if (!company) {
      return next(new Error("Company not found or deleted", { cause: 404 }));
    }
    if (!company.HRs.includes(userId)) {
      return next(new Error("You are not authorized", { cause: 403 }));
    }
    const application = await ApplicationModel.findOneAndUpdate(
      { _id: applicationId },
      { status },
      { new: true }
    ).populate("userId", "-password -__v");
    if (!application) {
      return next(
        new Error("Application not found or deleted", { cause: 404 })
      );
    }
    if (!application.userId) {
      return next(
        new Error("User not found for this application", { cause: 404 })
      );
    }
    const user = await UserModel.findByIdAndUpdate(
      application.userId._id,
      { $push: { appliedJobs: application._id } },
      { new: true }
    );
    if (!user) {
      return next(new Error("User not found or deleted", { cause: 404 }));
    }
    if (status === "accepted") {
      await sendEmail(
        user.email,
        "Application Accepted ",
        `<h1>Dear ${user.firstName},</h1>
         <p>Congratulations! Your application has been <strong>accepted</strong> at <strong>${company.companyName}</strong>.</p>
         <p>Best of Luck!</p>`
      );
    } else if (status === "rejected") {
      await sendEmail(
        user.email,
        "Application Rejected ",
        `<h1>Dear ${user.firstName},</h1>
         <p>Unfortunately, your application has been <strong>rejected</strong> at <strong>${company.companyName}</strong>.</p>
         <p>Better luck next time!</p>`
      );
    }

    res.status(200).json({
      message: `Application ${status} successfully`,
    });
  }
);

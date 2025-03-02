import ApplicationModel from "../../DB/models/Application.model.js";
import companyModel from "../../DB/models/company.model.js";
import JobModel from "../../DB/models/job.model.js";
import { asyncHandler } from "../../utils/error/errorHandler.js";
import { pagination } from "../../utils/features/index.js";

export const AddJob = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await companyModel.findById({
    _id: companyId,
    isdeleted: false,
  });
  if (!company) {
    return next(new Error("Company not found or deleted", { cause: 404 }));
  }
  if (
    company.createdBy.toString() !== req.user._id.toString() &&
    !company.HRs.includes(req.user._id.toString())
  ) {
    return next(
      new Error("You are not authorized to add a job OR You are not HR", {
        cause: 403,
      })
    );
  }
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  const newJob = await JobModel.create({
    companyId,
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: req.user._id,
  });
  res.status(201).json({ message: "Job added successfully", job: newJob });
});
export const UpdateJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { companyId } = req.params;
  const company = await companyModel.findById({
    _id: companyId,
    isdeleted: false,
  });
  if (!company) {
    return next(new Error("Company not found or deleted", { cause: 404 }));
  }
  const job = await JobModel.findById({ _id: jobId, isdeleted: false });
  if (!job) {
    return next(new Error("Job not found or deleted", { cause: 404 }));
  }
  if (company.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new Error("You are not authorized to update this job", { cause: 403 })
    );
  }

  const updatedJob = await JobModel.findByIdAndUpdate(
    { _id: jobId },
    req.body,
    { new: true }
  );
  res.status(200).json({ message: "Job updated successfully", updatedJob });
});
export const DeleteJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { companyId } = req.params;
  const company = await companyModel.findById({
    _id: companyId,
    isdeleted: false,
  });
  if (!company) {
    return next(new Error("Company not found or deleted", { cause: 404 }));
  }
  const job = await JobModel.findById({ _id: jobId, isdeleted: false });
  if (!job) {
    return next(new Error("Job not found or deleted", { cause: 404 }));
  }
  if (!company.HRs.includes(req.user._id.toString())) {
    return next(
      new Error("You are not authorized to delete this job", { cause: 403 })
    );
  }
  await JobModel.findOneAndDelete({ _id: jobId });
  res.status(200).json({ message: "Job deleted successfully" });
});
export const getJobApplications = asyncHandler(async (req, res, next) => {
  const { jobId, companyId } = req.params;
  const { page, sort = "createdAt", limit } = req.query;

  const company = await companyModel.findOne({
    _id: companyId,
    isdeleted: false,
  });
  if (!company) {
    return next(new Error("Company not found or deleted", { cause: 404 }));
  }
  const job = await JobModel.findOne({ _id: jobId, isdeleted: false }).populate(
    {
      path: "applications",
      populate: {
        path: "userId",
        select: "-password -__v",
      },
    }
  );
  if (!job) {
    return next(new Error("Job not found or deleted", { cause: 404 }));
  }
  if (
    !company.HRs.includes(req.user._id.toString()) &&
    company.addedBy.toString() !== req.user._id.toString()
  ) {
    return next(
      new Error("You are not authorized to see these applications", {
        cause: 403,
      })
    );
  }
  const result = await pagination({
    page,
    limit,
    model: ApplicationModel,
    populate: [
      {
        path: "userId",
        select: "firstName -_id",
      },
    ],
    sort,
  });
  res.status(200).json({
    message: "Applications fetched successfully",
    totalApplications: result.totalCount,
    currentPage: result.currentPage,
    totalPages: result.totalPages,
    applications: result.data,
  });
});
export const getAllJobs = asyncHandler(async (req, res, next) => {
  const { page, sort = "createdAt", limit } = req.query;
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;
  const { companyId } = req.params;
  const company = await companyModel.findOne({
    _id: companyId,
    isdeleted: false,
  });
  if (!company) {
    return next(new Error("Company not found or deleted", { cause: 404 }));
  }
  let filter = { companyId, isdeleted: false };
  if (workingTime) filter.workingTime = workingTime;
  if (jobLocation) filter.jobLocation = jobLocation;
  if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
  if (jobTitle) filter.jobTitle = { $regex: jobTitle, $options: "i" };
  if (technicalSkills)
    filter.technicalSkills = { $in: technicalSkills.split(",") };

  const result = await pagination({
    page,
    limit,
    model: JobModel,
    filter,
    sort,
    populate: [
      {
        path: "companyId",
        select: "companyName",
      },
    ],
  });
  res.status(200).json({
    message: "Jobs fetched successfully",
    totalJobs: result.totalCount,
    jobs: result.data,
  });
});

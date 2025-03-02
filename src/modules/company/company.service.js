import companyModel from "../../DB/models/company.model.js";
import cloudinary from "../../utils/cloudinary/index.js";
import { asyncHandler } from "../../utils/error/errorHandler.js";

export const addCompany = asyncHandler(async (req, res, next) => {
  const { companyName, description, industry, address,numberOfEmployees,companyEmail } = req.body;
  const existingCompany = await companyModel.findOne({
    $or: [{ companyEmail }, { companyName }],
  });
  if (existingCompany) {
    return next(new Error("Company name or email already exists", { cause: 400 }));
  }
  const newCompany = await companyModel.create({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    createdBy: req.user._id,
  });
  return res.status(201).json({
    message: "Company added successfully",
     company: newCompany,
  });
});
export const updateCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params; 
  const userId = req.user._id; 
  const company = await companyModel.findById(id,{isdeleted: false});
  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  if (company.createdBy.toString() !== userId.toString()) {
    return next(new Error("You are not authorized to update this company", { cause: 403 }));
  }
  const updatedCompany = await companyModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(200).json({
    message: "Company updated successfully",
    company: updatedCompany,
  });
});
export const SoftdeleteCompany = asyncHandler(async (req, res, next) => {
 const { id } = req.params;
 const company = await companyModel.findOne({_id:id,isdeleted: false});
  if (!company) {
    return next(new Error("Company not found or deleted", { cause: 404 }));
  }
  if (req.user.role !== "admin" && company.createdBy.toString() !== req.user._id.toString()) {
    return next(new Error("You are not authorized to delete this company", { cause: 403 }));
  }

  await companyModel.findByIdAndUpdate(id,{isdeleted: true,deletedAt:Date.now()},{ new: true });
  return res.status(200).json({ message: "Company Freezed successfully" });
})
export const deleteCompany = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const company = await companyModel.findOne({ _id: id, isdeleted: false });
  if (!company) {
    return next(new Error("Company not found or deleted", { cause: 404 }));
  }
  if (req.user.role !== "admin" && company.createdBy.toString() !== req.user._id.toString()) {
    return next(new Error("You are not authorized to delete this company", { cause: 403 }));
  }
  await company.deleteOne(); 
  return res.status(200).json({ message: "Company deleted successfully " });
});
export const SearchCompany = asyncHandler(async(req, res,next) =>{
    const { companyName } = req.body;
    const companies = await companyModel.find({companyName:companyName})
    if (!companies.length) {
      return next(new Error("Company not found", { cause: 404 }));
    }
    return res.status(200).json({ message: "Done", companies });
})  
export const addHr=asyncHandler(async(req, res,next) =>{
  const { companyId } = req.params;
  const {userId} = req.params; 
  const company = await companyModel.findById(companyId,{isdeleted: false});
  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  if (company.createdBy.toString()!== req.user._id.toString()) {
    return next(new Error("You are not authorized to add HR", { cause: 403 }));
  }
  if (company.HRs.includes(userId)) {
    return next(new Error("HR already exists", { cause: 400 }));
  }
  const newHR = await companyModel.findByIdAndUpdate(
    companyId,
    { $push: { HRs: userId } },
    { new: true }
  );
  return res.status(201).json({
    message: "HR added successfully",
  });
})
export const SearchCompanyWithJobs = asyncHandler(async(req, res,next) =>{
  const { companyId } = req.params;
  const companies = await companyModel.findOne({_id:companyId}).populate([{
    path:"job"
  }])
  if (!companies) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", companies });
})  
export const uploadlogo = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await companyModel.findById(companyId);
  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  if (!req.file) {
    return next(new Error("logo is required", { cause: 400 }));
  }
  const uploadlogo = await cloudinary.uploader.upload(req.file.path, {
    folder: "job_app/company/logo",
  });
  const logo = {
    secure_url: uploadlogo.secure_url,
    public_id: uploadlogo.public_id,
  };
  company.logo = logo;
  await company.save();
  res.status(200).json({ message: "logo  Uploaded Successfully", company });
});
export const uploadCoverPic = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await companyModel.findById(companyId);
  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  if (!req.file) {
    return next(new Error("Profile Picture is required", { cause: 400 }));
  }
  const uploadCoverPic = await cloudinary.uploader.upload(req.file.path, {
    folder: "job_app/company/coverPic",
  });
  const coverPic = {
    secure_url: uploadCoverPic.secure_url,
    public_id: uploadCoverPic.public_id,
  };
  company.coverPic = coverPic;
  await company.save();
  res.status(200).json({ message: "cover Picture Uploaded Successfully", company });
});
export const deleteLogo = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await companyModel.findById(companyId);
  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  if (!company.logo?.public_id) {
    return next(new Error("No Logo Found to Delete", { cause: 400 }));
  }
  await cloudinary.uploader.destroy(company.logo.public_id);
  console.log("Logo Deleted Successfully ");
  company.logo = null;
  await company.save();
  res.status(200).json({ message: "Logo Deleted Successfully ", company });
});
export const deletecoverPic = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;
  const company = await companyModel.findById(companyId);
  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }
  if (!company.coverPic?.public_id) {
    return next(new Error("No coverPic Found to Delete", { cause: 400 }));
  }
  await cloudinary.uploader.destroy(company.coverPic.public_id);
  console.log("coverPic Deleted Successfully ");
  company.coverPic = null;
  await company.save();
  res.status(200).json({ message: "coverPic Deleted Successfully ", company });
});

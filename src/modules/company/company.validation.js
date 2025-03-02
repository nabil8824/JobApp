import Joi from "joi";


export const AddCompanySchema = Joi.object({
    companyName: Joi.string().min(3).max(100).required().messages({
      "string.empty": "Company Name is required",
    }),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.number().min(11).max(20) .required(),
    companyEmail: Joi.string().email().required(),
 });
export const searchCompanySchema=Joi.object({
    companyName:Joi.string().required(),
})
export const UpdateCompanySchema = Joi.object({
    companyName: Joi.string().min(3).max(100),
    id: Joi.string().required(),
    description: Joi.string(),
    industry: Joi.string(),
    address: Joi.string(),
    numberOfEmployees: Joi.number().min(11).max(20) ,
    companyEmail: Joi.string().email(),
 });
export const DeleteCompanySchema = Joi.object({
    id: Joi.string().required(),
 });
 export const searchCompanyWJobsSchema=Joi.object({
  companyId:Joi.string().required(),
})
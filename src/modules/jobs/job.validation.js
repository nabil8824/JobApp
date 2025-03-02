import Joi from "joi";

export const AddJobSchema = Joi.object({
  companyId: Joi.string().required(),
  jobTitle: Joi.string().min(3).max(100).required(),
  jobLocation: Joi.string()
    .valid("onsite", "remotely", "hybrid")
    .required(),
  
  workingTime: Joi.string()
    .valid("part-time", "full-time")
    .required(),
  seniorityLevel: Joi.string()
    .valid("Fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
    .required(),

  jobDescription: Joi.string().required(),
  technicalSkills: Joi.array().items(Joi.string().required()).required(),
  softSkills: Joi.array().items(Joi.string().required()).required()
});

export const UpdateJobSchema = Joi.object({
  jobId: Joi.string(),
  companyId: Joi.string(),
  jobTitle: Joi.string().min(3).max(100),
  jobLocation: Joi.string().valid("onsite", "remotely", "hybrid"),
  workingTime: Joi.string().valid("part-time", "full-time"),
  seniorityLevel: Joi.string().valid("Fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
  jobDescription: Joi.string(),
  technicalSkills: Joi.array().items(Joi.string()),
  softSkills: Joi.array().items(Joi.string()),
});

export const DeleteJobSchema = Joi.object({
  jobId: Joi.string().required(),
  companyId: Joi.string().required()
});

export const searchJobSchema = Joi.object({
  companyId: Joi.string().required()
});

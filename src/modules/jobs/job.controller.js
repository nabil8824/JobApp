import { Router } from "express";
import { AddJob, DeleteJob, getAllJobs, getJobApplications, UpdateJob } from "./job.service.js";
import { authentication } from "../../middelware/auth.js";
import { validation } from "../../middelware/validation.js";
import { AddJobSchema, DeleteJobSchema, searchJobSchema, UpdateJobSchema } from "./job.validation.js";



const JobRouter = Router();

JobRouter.post("/add/:companyId",validation(AddJobSchema),authentication ,AddJob);
JobRouter.patch("/Update/:companyId/:jobId",validation(UpdateJobSchema),authentication ,UpdateJob);
JobRouter.delete("/delete/:companyId/:jobId",validation(DeleteJobSchema),authentication ,DeleteJob);
JobRouter.get("/getJobApplications/:companyId/:jobId",authentication,getJobApplications)
JobRouter.get("/getAllJobs/:companyId",authentication,getAllJobs)

export default JobRouter;
import { Router } from "express";
import { authentication, authorization, roles } from "../../middelware/auth.js";
import { acceptOrRejectApplication, addApplication, getApplicationsExcel } from "./application.service.js";
import { fileTypes, multerHost } from "../../middelware/multer.js";





const applicationRouter = Router();

applicationRouter.post("/add",multerHost(fileTypes.document).single("userCV"),authentication,authorization(roles.user),addApplication)
applicationRouter.patch("/acceptOrRejectApplication/:userId/:companyId",authentication,acceptOrRejectApplication)
applicationRouter.get("/applications/:jobId/excel", getApplicationsExcel);

export default applicationRouter;
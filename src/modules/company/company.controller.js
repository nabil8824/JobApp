import { Router } from "express";
import { addCompany, addHr, deleteCompany, deletecoverPic, deleteLogo, SearchCompany, SearchCompanyWithJobs, SoftdeleteCompany, updateCompany, uploadCoverPic, uploadlogo } from "./company.service.js";
import { authentication } from "../../middelware/auth.js";
import { validation } from "../../middelware/validation.js";
import { AddCompanySchema, DeleteCompanySchema, searchCompanySchema, searchCompanyWJobsSchema, UpdateCompanySchema } from "./company.validation.js";
import { fileTypes, multerHost } from "../../middelware/multer.js";




const companyRouter = Router();

companyRouter.post("/create",validation(AddCompanySchema), authentication,addCompany);
companyRouter.post("/addHr/:companyId/:userId", authentication,addHr);

companyRouter.patch("/UpdateCompany/:id",validation(UpdateCompanySchema) ,authentication,updateCompany);
companyRouter.patch("/SoftdeleteCompany/:id", validation(DeleteCompanySchema),authentication,SoftdeleteCompany);
companyRouter.delete("/deleteCompany/:id", validation(DeleteCompanySchema),authentication,deleteCompany);

companyRouter.get("/SearchCompany", validation(searchCompanySchema),authentication,SearchCompany);
companyRouter.get("/SearchCompanyWithJobs/:companyId", validation(searchCompanyWJobsSchema),authentication,SearchCompanyWithJobs);

companyRouter.post("/uploadeLogo/:companyId",multerHost(fileTypes.image).single("Logo"),authentication,uploadlogo)
companyRouter.post("/uploadeCoverPic/:companyId",multerHost(fileTypes.image).single("CoverPic"),authentication,uploadCoverPic)

companyRouter.delete("/deleteLogo/:companyId",authentication,deleteLogo)
companyRouter.delete("/deletecoverPic/:companyId",authentication,deletecoverPic)



export default companyRouter;

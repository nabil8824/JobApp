import { Router } from "express";
import { confirmEmail, deleteAccount, deleteCoverPic, deleteProfilePic, ForgetPassword, freezeAccount, getProfile, refreshToken, resetPassword, shareProfile, signin, signup, updatePassword, updateProfile, uploadProfileCover, uploadProfilePic } from "./user.service.js";
 import { fileTypes, multerHost } from "../../middelware/multer.js";
import { validation } from "../../middelware/validation.js";
import { confirmEmailSchema, forgetPasswordSchema, freezeAccountSchema, GetProfileSchema, logInSchema, refreshTokenSchema, resetPasswordSchema, shareProfileSchema, singUpSchema, updatePasswordSchema, updateProfileSchema } from "./user.validation.js";
import { authentication, authorization, roles } from "../../middelware/auth.js";


const userRouter = Router();

userRouter.post("/signup",multerHost(fileTypes.image).fields([
   {name: "profilePic",maxCount:1},
   {name: "coverPic",maxCount:1},
]),signup);
userRouter.post("/signin",validation(logInSchema),signin);
userRouter.patch("/confirmed",validation(confirmEmailSchema),confirmEmail);
userRouter.patch('/forgetPassword',validation(forgetPasswordSchema),ForgetPassword);
userRouter.patch('/resetPassword',validation(resetPasswordSchema),resetPassword);
userRouter.get('/refreshToken',validation(refreshTokenSchema),refreshToken);
userRouter.get("/profile/:id",validation(shareProfileSchema) ,authentication,shareProfile)
userRouter.get("/Getprofile", validation(GetProfileSchema),authentication,getProfile)
userRouter.patch("/updatePassword",validation(updatePasswordSchema), authentication , updatePassword)
userRouter.patch("/update", validation(updateProfileSchema),authentication, updateProfile)
userRouter.patch('/freeze', validation(freezeAccountSchema), authentication, authorization(roles.admin),freezeAccount)
userRouter.delete('/delete/:userId', authentication, authorization(roles.admin),deleteAccount)
userRouter.post("/uploadePic",multerHost(fileTypes.image).single("profilePic"),authentication,uploadProfilePic)
userRouter.post("/uploadeCover",multerHost(fileTypes.image).single("profileCov"),authentication,uploadProfileCover)
userRouter.delete("/deletePic",authentication,deleteProfilePic)
userRouter.delete("/deleteCover",authentication,deleteCoverPic)

export default userRouter;


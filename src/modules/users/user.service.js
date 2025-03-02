import { Types } from "mongoose";
import UserModel from "../../DB/models/user.model.js";
import { decodedToken, roles } from "../../middelware/auth.js";
import cloudinary from "../../utils/cloudinary/index.js";
import { encrypt } from "../../utils/encrypt/encrypt.js";
import { asyncHandler } from "../../utils/error/errorHandler.js";
import { compare } from "../../utils/Hash/compare.js";
import { Hash } from "../../utils/Hash/hash.js";
import { EventEmitterr } from "../../utils/sendEmailEvents/sendEmailEvents.js";
import { generateToken } from "../../utils/Token/generateToken.js";
import { decrypt } from "dotenv";
import { Decrypt } from "../../utils/encrypt/decrypt.js";
  


  
  export const signup =asyncHandler(async (req,res,next)=>{
    const {role,mobileNumber,DOB,gender,provider,password,email,lastName,firstName}=req.body
    const emailexist=await UserModel.findOne({email})
    if(emailexist){
      return next(new Error("Email already exists",{cause:400}))
    }
    let profilePic = null;
    let coverPic = null;
    if (req.files?.profilePic) {
        const uploadProfile = await cloudinary.uploader.upload(req.files.profilePic[0].path,{  folder: "job_app/users/profPic",});
        profilePic = { secure_url: uploadProfile.secure_url, public_id: uploadProfile.public_id };
    }
    if (req.files?.coverPic) {
        const uploadCover = await cloudinary.uploader.upload(req.files.coverPic[0].path,{  folder: "job_app/users/covPic",});
        coverPic = { secure_url: uploadCover.secure_url, public_id: uploadCover.public_id };
    }
    const encryptedphone=await encrypt({
      key:mobileNumber,
      SECRET_KEY:process.env.SECRET_KEY,
    })
    const hashedPassword=await Hash({
      key:password,
      SALT_NUMBER:process.env.SALT_NUMBER,
    })
    const newUser=await UserModel.create({
      firstName,
      lastName,
      email,
      password:hashedPassword,
      provider,
      mobileNumber:encryptedphone,
      gender,
      DOB,
      role,
     profilePic,
     coverPic
    })
    EventEmitterr.emit("sendEmail",{email,id:newUser._id})//حضرتك عارف ان الجيمال مش بيبعت عندي 
   return res.status(201).json({message:"User created successfully",newUser})
})
  export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { email, code } = req.body;
    const user = await UserModel.findOne({ email, isConfirmed: false })
    if (!user) {
        return next(new Error('User not found or not confirmed yet', { cause: 404 }))
    }
    const otp = user.OTP.find(
      (otp) =>
        otp.type === "confirmEmail" && otp.expiresIn > new Date()
    );
    if (!otp) {
        return next(new Error('invalide code', { cause: 400 }))
    }
    await UserModel.updateOne({ email }, { isConfirmed: true, $unset: { otpEmail: 0 } })
    res.status(200).json({ message: 'Email confirmed successfully' })
})
export const signin=asyncHandler(async(req, res, next)=>{
  const {email,password}=req.body
  const user=await UserModel.findOne({email,isdeleted: false})
  if(!user){
    return next(new Error("User not found",{cause:404}))
  }
  const isMatch = await compare({ password, hashed: user.password })


  if(!isMatch){
    return next(new Error("password is not correct",{cause:401}))
  }
  const acces_token = await generateToken({
    payload: { email, id: user._id },
    SIGNATURE:user.role===roles.user?process.env.ACCESS_SIGNATURE_USER:process.env.ACCESS_SIGNATURE_ADMIN,
    expiresIn: '1h'
})
  const refresh_token = await generateToken({
    payload: { email, id: user._id },
    SIGNATURE:user.role===roles.user?process.env.ACCESS_SIGNATURE_USER:process.env.ACCESS_SIGNATURE_ADMIN,
    expiresIn: '1w'
})
  res.json({message:"User signed in successfully", token: {
    acces_token,
    refresh_token
}})
})
export const ForgetPassword = asyncHandler(async (req, res, next) => {
  const{email}=req.body
  const user = await UserModel.findOne({email:email , isdeleted:false})
      if (!user) {
          return next(new Error('User not found or not confirmed yet', { cause: 404 }))
      }
    EventEmitterr.emit("forgetPassword",{email})
   return res.status(201).json({ message: "done" })
})
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, newPassword } = req.body;
  const user = await UserModel.findOne({ email, isdeleted: false });
  if (!user) {
    return next(new Error("User not found or not confirmed yet", { cause: 404 }));
  }
  const match = await compare({ password: code, hashed: user.otpPassword });
  if (!match) {
    return next(new Error("Incorrect code", { cause: 400 }));
  }
  const hash = await Hash({ key: newPassword, SALT_NUMBER: parseInt(process.env.SALT_NUMBER) });
  await UserModel.updateOne(
    { email },
    { password: hash, isConfirmed: true, $unset: { otpPassword: "" } }
  );
  res.status(201).json({ message: "Password reset successfully" });
});
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
const user= await decodedToken({authorization,next})
  if(!user){
    return next(new Error("User not found",{cause:404}))
  }
  if (user.changeCredentialTime) {
    const changeTime = parseInt(user.changeCredentialTime.getTime() / 1000); 
    if (user.iat < changeTime) {
      return next(new Error("Token is no longer valid"));
    }
  }
  const acces_token = await generateToken({
      payload: { email: user.email, id: user._id },
      SIGNATURE:user.role===roles.user?process.env.ACCESS_SIGNATURE_USER:process.env.ACCESS_SIGNATURE_ADMIN,
      expiresIn: '1d'
  })
  res.status(201).json({
      message: 'User logged in successfully', token: {
          acces_token
      }
  })
})
export const shareProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await UserModel.findOne({ _id: id, isdeleted: false });
  if (!user) {
    return next(new Error("Email not exist", { cause: 404 }));
  }
  const decryptedphone= await Decrypt({
    key: user.mobileNumber,
    SECRET_KEY: process.env.SECRET_KEY,
  })
  return res.status(200).json({ message: "done", user:{
    username:user.username,
    mobileNumber:decryptedphone,
    profilePic: user.profilePic,
    coverPic: user.coverPic,
  }});
});
export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.user.email }).select("-password")
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  res.status(200).json({ message: "Done", user });
});
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldpassword, newpassword } = req.body;
  const matchpassord = await compare({
    password: oldpassword,
    hashed: req.user.password,
  });
  if (!matchpassord) {
    return next(new Error("Old password is incorrect", { cause: 400 }));
  }
  const hashedPassword = await Hash({
    key: newpassword,
    SALT_NUMBER: process.env.SALT_NUMBER,
  });
  const user = await UserModel.findByIdAndUpdate(
    { _id: req.user._id },
    { password: hashedPassword, changeCredentialTime: Date.now() },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "Password updated successfully", user });
});
export const updateProfile = asyncHandler(async (req, res, next) => {
  if (req.body.mobileNumber) {
    req.body.mobileNumber = await encrypt({
      key: req.body.mobileNumber,
      SECRET_KEY: process.env.SECRET_KEY,
    });
  }
  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  }).select("-password"); 
  return res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
});
export const freezeAccount = asyncHandler(async (req, res, next) => {

  const user = await UserModel.findByIdAndUpdate(req.user._id, { isdeleted: true, changeCredentialTime: Date.now() }, { new: true });
  res.status(201).json({ message: "User account frozen successfully", user });
});
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await UserModel.findOne({ _id: userId, isdeleted: false });
  if (!user) {
    return next(new Error("user not found or deleted", { cause: 404 }));
  }
  if (req.user.role !== "admin" && company.createdBy.toString() !== req.user._id.toString()) {
    return next(new Error("You are not authorized to delete this company", { cause: 403 }));
  }
  await user.deleteOne(); 
  res.status(201).json({ message: "User account deleted successfully" });
});
export const uploadProfilePic = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("Profile Picture is required", { cause: 400 }));
  }

  const uploadProfile = await cloudinary.uploader.upload(req.file.path, {
    folder: "job_app/users/profPic",
  });

  const profilePic = {
    secure_url: uploadProfile.secure_url,
    public_id: uploadProfile.public_id,
  };

  const user = await UserModel.findByIdAndUpdate(req.user._id, { profilePic }, { new: true });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  res.status(200).json({ message: "Profile Picture Uploaded Successfully", user });
});
export const uploadProfileCover = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("Profile Picture is required", { cause: 400 }));
  }
  const uploadProfileCover = await cloudinary.uploader.upload(req.file.path, {
    folder: "job_app/users/coverPic",
  });
  const coverPic = {
    secure_url: uploadProfileCover.secure_url,
    public_id: uploadProfileCover.public_id,
  };
  const user = await UserModel.findByIdAndUpdate(req.user._id, { coverPic }, { new: true });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  res.status(200).json({ message: "cover Picture Uploaded Successfully", user });
});
export const deleteProfilePic = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (!user.profilePic?.public_id) {
    return next(new Error("No Profile Picture Found to Delete", { cause: 400 }));
  }
  await cloudinary.uploader.destroy(user.profilePic.public_id);
  console.log("ProfilePic Deleted Successfully ");
  user.profilePic = null;
  await user.save();
  res.status(200).json({ message: "Profile Picture Deleted Successfully ",user});
});
export const deleteCoverPic = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (!user.coverPic?.public_id) {
    return next(new Error("No Profile Picture Found to Delete", { cause: 400 }));
  }
  await cloudinary.uploader.destroy(user.coverPic.public_id);
  console.log("coverPic Deleted Successfully ");
  user.coverPic = null;
  await user.save();
  res.status(200).json({ message: "coverPic Deleted Successfully ",user});
});
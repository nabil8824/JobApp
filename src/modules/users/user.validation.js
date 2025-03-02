import Joi from "joi";
import { generalRules } from "../../utils/generalRules/generalRules.js";



export const singUpSchema=Joi.object({
        firstName:Joi.string().min(3).required(),
        lastName:Joi.string().min(3).required(),
        email:Joi.string().email({tlds:{allow:["com","org"]}}).required(),
        password:Joi.string().min(6).required(),
        cpassword:Joi.string().required().valid(Joi.ref('password')),
        mobileNumber:Joi.string().required(),
        gender: Joi.string().valid("Male", "Female"),
        DOB:Joi.date().required(),
        role:Joi.string().valid("user","admin").required(),
        provider: Joi.string().required(),
        profilePic:Joi.string(),
        coverPic:Joi.string(),
        headers: generalRules.headers.required()
    })
export const logInSchema=Joi.object({
            email:Joi.string().email({tlds:{allow:["com","org"]}}).required(),
            password:Joi.string().min(6).required(),
})
export const forgetPasswordSchema=Joi.object({
        email:Joi.string().email({tlds:{allow:["com","org"]}}).required(),
})
export const resetPasswordSchema=Joi.object({
        email:Joi.string().email({tlds:{allow:["com","org"]}}).required(),
        code:Joi.string().length(4).required(),
        newPassword:Joi.string().min(6).required(),
        cpassword:Joi.string().required().valid(Joi.ref('newPassword')),
       // headers: generalRules.headers.required()
    })
export const refreshTokenSchema = Joi.object({
  authorization:Joi.string().required(),   
  })
 export const confirmEmailSchema = Joi.object({
      email: Joi.string().email({ tlds: { allow: ["com", "org"] } }).required(),
      code: Joi.string().length(4).required(), 
    }).required();
export const updatePasswordSchema = Joi.object({
    oldpassword: Joi.string().min(6).required(),
    newpassword:Joi.string().min(6).required() ,
      cPassword: Joi.string().required().valid(Joi.ref('newpassword')),
      headers:Joi.object({
        authorization:Joi.string().required(),
      }).unknown(true)
     // file:generalRules.file.required(),
    })
    export const updateProfileSchema = Joi.object({
        firstName: Joi.string().min(3),
        lastName: Joi.string().min(3),
        mobileNumber: Joi.string(),
        gender: Joi.string().valid("Male", "Female"),
        DOB: Joi.date(),
        // file: generalRules.file.required(),
    })
    export const freezeAccountSchema=Joi.object({
       
          headers:Joi.object({
            authorization:Joi.string().required(),
          })
    })
    export const shareProfileSchema=Joi.object({
       
        headers:Joi.object({
            authorization:Joi.string().required(),
          }),
        id: generalRules.objectId.required(),
  })
  export const GetProfileSchema=Joi.object({
       
    headers:Joi.object({
      authorization:Joi.string().required(),
    })
})



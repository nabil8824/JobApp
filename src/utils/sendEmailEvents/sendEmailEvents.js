import { EventEmitter } from "events";
import { customAlphabet } from "nanoid";
import { Hash } from "../Hash/hash.js";
import { html } from "./template.js";
import UserModel from "../../DB/models/user.model.js";
import { sendEmail } from "../../service/sendEmails.js";
export const EventEmitterr = new EventEmitter();


EventEmitterr.on("sendEmail", async (data) => {
  const { email } = data;
  const otp = customAlphabet("0123456789", 4)();
  const hash = await Hash({ key: otp, SALT_NUMBER: parseInt(process.env.SALT_NUMBER) });
  await UserModel.updateOne(
    { email },
    {
      $push: {
        OTP: {
          code: hash,
          type: "confirmEmail",
          expiresIn: new Date(Date.now() + 10 * 60 * 1000),
         },
      },
    }
  );
  const htmlContent = await html({ code: otp,message:"Confirm Email" });
  await sendEmail(email, "Confirm Email", htmlContent); 
});


EventEmitterr.on("forgetPassword", async (data) => {
  const { email } = data;
  const otp = customAlphabet("0123456789", 4)();
  const hash = await Hash({ key: otp, SALT_NUMBER: parseInt(process.env.SALT_NUMBER) });
  await UserModel.updateOne({ email }, { otpPassword: hash });
  const htmlContent = await html({ code: otp ,message:"forget password"}); 
  await sendEmail(email, "Forget Password", htmlContent);
});

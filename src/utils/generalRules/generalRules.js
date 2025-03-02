import { Types } from "mongoose";
import joi from "joi";
import Joi from "joi";

export const customId = (value, helper) => {
  let data = Types.ObjectId.isValid(value);
  return data ? value : helper.message("id is not valid");
};

export const generalRules = {
  objectId: joi.string().custom(customId),
  headers: joi.object({
    authorization: joi.string().required(),
    "cache-control": joi.string(),
    "postman-token": joi.string(),
    "content-type": joi.string(),
    "content-length": joi.string(),
    host: joi.string(),
    "user-agent": joi.string(),
    accept: joi.string(),
    "accept-encoding": joi.string(),
    connection: joi.string(),
  }),
  file: Joi.object({
    size: Joi.number().positive().required(),
    path: Joi.string().required(),
    filename: Joi.string().required(),
    destination: Joi.string().required(),
    mimetype: Joi.string().required(),
    encoding: Joi.string().required(),
    originalname: Joi.string().required(),
    fieldname: Joi.string().required(),
  }).required(),
};

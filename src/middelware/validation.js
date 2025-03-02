import { asyncHandler } from "../utils/error/errorHandler.js";

export const validation = (schema) => {
    return asyncHandler(async(req, res, next) => {
      const inputdata = { ...req.body, ...req.query, ...req.params }
      const result = schema.validate(inputdata, { abortEarly: true })
      if (result?.error) {
        return res.status(400).json({ message: "Validation Failed", error: result.error.details.map(({ message }) => message) })
      }
        next();
    });
  };
import express from "express";
import cors from "cors"
import rateLimit from "express-rate-limit"
import connectionDB from "./DB/connectionDb.js";
import userRouter from "./modules/users/user.controller.js";
import { globalErrorHandler } from "./utils/error/errorHandler.js";
import companyRouter from "./modules/company/company.controller.js";
import JobRouter from "./modules/jobs/job.controller.js";
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from "./modules/graphQl.schema.js";
import helmet from  "helmet"
import multer from "multer";
import applicationRouter from "./modules/Application/application.controller.js";

const limiter=rateLimit({
    limit: 5,
    windowMs: 1 * 60 * 1000, // 1 minute
    message: {error:"Game Over ! Too many requests from this IP, please try again in a minute."},
    handler: (req,res,next)=>{
    return next(new Error("Game Over ! Too many requests from this IP",{cause:429}))
    }
  })
const boootstrap = async (app) => {
    app.use(express.json());
    app.use(cors())
    app.use(limiter)
    app.use(helmet()); 
    await connectionDB();
    app.use("/users", userRouter);
    app.use("/company", companyRouter);
    app.use("/job", JobRouter);
    app.use("/application", applicationRouter);
    app.all("/graphql",createHandler({schema:schema}));
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "Welcome to the Job_App" });
    });
    app.use("*", (req, res, next) => {
        return next(new Error(`Invalid URL ${req.originalUrl}`));
    });
    app.use(globalErrorHandler);
};

export default boootstrap;

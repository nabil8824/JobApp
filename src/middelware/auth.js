import UserModel from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/error/errorHandler.js";
import { verifyToken } from "../utils/Token/verifyToken.js";

export const roles = {
  admin: "admin",
  user: "user",
  superAdmin: "superAdmin",
};
export const tokenTypes = {
  access: "access",
  refresh: "refresh",
};

export const decodedToken = async ({ authorization, next }) => {
  let [perfix, token] = authorization.split(" ");
  if (!perfix || !token) {
    return next(new Error("Token not found", { cause: 400 }));
  }
  let ACCESS_SIGNATURE = undefined;
  let REFRESH_SIGNATURE = undefined;
  if (perfix == process.env.USER_PREFIX) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_USER;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_USER;
  } else if (perfix == process.env.ADMIN_PREFIX) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_ADMIN;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_ADMIN;
  }
  const decoded = await verifyToken({
    token,
    SIGNATURE: tokenTypes.access ? ACCESS_SIGNATURE : REFRESH_SIGNATURE,
  });
  const user = await UserModel.findById(decoded.id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (user?.isdeleted) {
    return next(new Error("User deleted", { cause: 401 }));
  }
  // if (parseInt(user?.passwordChangedAt?.getTime() / 1000) >= decoded.iat) {
  //     return next(new Error("token expire please login again", { cause: 401 }));
  // }//بتخلي بوست مان يضربب خلي بالكك
  return user;
};
export const authentication = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new Error("Unauthorized", { cause: 401 }));
  }
  const user = await decodedToken({ authorization, next });
  req.user = user;
  next();
});

export const authorization = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (accessRoles.length > 0 && !accessRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  });
};
export const authgraph = async ({
  authorization,
  tokenType = tokenTypes.access,
  accessrole = [],
}) => {
  const [prefix, token] = authorization.split(" ");
  if (!token || !prefix) {
    throw new Error("Invalid token", { cause: 401 });
  }
  let ACCESS_SIGNATURE = undefined;
  let REFRESH_SIGNATURE = undefined;
  if (prefix == process.env.USER_PREFIX) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_USER;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_USER;
  } else if (prefix == process.env.ADMIN_PREFIX) {
    ACCESS_SIGNATURE = process.env.ACCESS_SIGNATURE_ADMIN;
    REFRESH_SIGNATURE = process.env.REFRESH_SIGNATURE_ADMIN;
  } else {
    throw new Error("Invalid token prefix", { cause: 401 });
  }
  const decoded = await verifyToken({
    token,
    SIGNATURE:
      tokenType === tokenTypes.access ? ACCESS_SIGNATURE : REFRESH_SIGNATURE,
  });
  if (!decoded?.id) {
    throw new Error("Invalid token pay load", { cause: 403 });
  }
  const user = await UserModel.findById(decoded.id);
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  if (user?.isdeleted) {
    throw new Error("user is deleted", { cause: 403 });
  }
  if (!accessrole.includes(user.role)) {
    throw new Error("access denied", { cause: 403 });
  }
  return user;
};

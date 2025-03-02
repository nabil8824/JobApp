import companyModel from "../../../DB/models/company.model.js";
import UserModel from "../../../DB/models/user.model.js";
import { authgraph, roles } from "../../../middelware/auth.js";


export const getAllUsers = async (parent, args) => {
  const { authorization } = args;
  const user = await authgraph({ authorization, accessrole: roles.admin });

  const users = await UserModel.find({})
  const companies = await companyModel.find({});

  return {
    users,
    companies,
  };
};
  export const banUser = async (parent, args) => {
    const { userId } = args;
      const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
      const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isbanned: true },
      { new: true }
    );
    return "done";
};
  export const unBanUser = async (parent, args) => {
    const { userId } = args;
      const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
      const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isbanned: false },
      { new: true }
    );
    return "done";
};
 
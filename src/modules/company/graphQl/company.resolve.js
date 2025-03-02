import companyModel from "../../../DB/models/company.model.js";

export const bancompany = async (parent, args) => {
    const { companyId } = args;
      const company = await companyModel.findById(companyId);
    if (!company) {
      throw new Error("company not found");
    }
      const updatedcompany = await companyModel.findByIdAndUpdate(
      companyId,
      { isbanned: true },
      { new: true }
    );
    return "done";
  };
  export const unBancompany = async (parent, args) => {
    const { companyId } = args;
      const company = await companyModel.findById(companyId);
    if (!company) {
      throw new Error("company not found");
    }
      const updatedcompany = await companyModel.findByIdAndUpdate(
      companyId,
      { isbanned: false },
      { new: true }
    );
    return "done";
  };
  export const approvedcompany = async (parent, args) => {
    const { companyId } = args;
      const company = await companyModel.findById(companyId);
    if (!company) {
      throw new Error("company not found");
    }
      const updatedcompany = await companyModel.findByIdAndUpdate(
      companyId,
      { approvedByAdmin: true },
      { new: true }
    );
    return "done";
  };
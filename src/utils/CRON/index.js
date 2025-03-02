import cron from "node-cron";
import UserModel from "../../DB/models/user.model.js";

const deleteExpiredOtps = async () => {
  try {
    const now = new Date();

    await UserModel.updateMany({}, { $pull: { OTP: { expiresIn: { $lt: now } } } });

    console.log(`[cron JOB] Expired OTPs deleted at ${now.toISOString()}`);
  } catch (error) {
    console.error(`[cron JOB] Error deleting expired OTPs: ${error.message}`);
  }
};

cron.schedule("0 */6 * * *", deleteExpiredOtps, {
  scheduled: true,
  timezone: "UTC",
});

console.log("[CRON JOB] Scheduled to run every 6 hours.");  
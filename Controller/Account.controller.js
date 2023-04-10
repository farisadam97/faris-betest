const Joi = require("joi");
const accountModel = require("../Model/Account.model");
const userInfoModel = require("../Model/UserInfo.model");
const { successResponse, errorResponse } = require("../Helper/ApiResponse");
const { validateField } = require("../Helper/ValidateField");
const client = require("../Database/redis");

function ErrorMessage(res, error) {
  const message = error.message.replace(/\"/g, "").split(",");
  errorResponse(res, 400, message);
}

const getAllAccount = async (req, res) => {
  try {
    await client.connect();
    const dataCache = await client.get("accounts");
    if (dataCache) {
      successResponse(res, 200, "success", JSON.parse(dataCache));
    } else {
      try {
        const accounts = await accountModel
          .find()
          .select("-password")
          .populate("userId")
          .exec();
        await client.set("accounts", JSON.stringify(accounts));
        await client.disconnect();
        successResponse(res, 200, "success", accounts);
      } catch (error) {
        ErrorMessage(res, error);
      }
    }
  } catch (error) {
    ErrorMessage(res, error);
  }
};

const getAccountById = async (req, res) => {
  const { id } = req.params;
  try {
    const account = await accountModel
      .findById(id)
      .select("-password ")
      .populate("userId")
      .exec();

    if (account) {
      successResponse(res, 200, "success", account);
    } else {
      throw new Error("Account not found");
    }
  } catch (error) {
    ErrorMessage(res, error);
  }
};

const findAccountAndUpdate = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const schema = Joi.object({
    userName: Joi.string().alphanum().min(6),
    fullName: Joi.string().required(),
    accountNumber: Joi.string()
      .pattern(/^[a-zA-Z0-9]+$/)
      .required(),
    emailAddress: Joi.string().email(),
  });

  try {
    await validateField(body, schema);

    const account = await accountModel.findById(id);

    if (!account) {
      throw new Error("Account not found");
    }

    const userInfo = await userInfoModel.findById(account.userId);
    const { userName, ...rest } = body;
    if (userName) {
      if (userName === account.userName) {
        Object.assign(userInfo, { ...rest, updatedAt: Date.now() });
        await userInfo.save();
        successResponse(res, 200, "Account updated successfully");
      } else {
        const userNameExist = await accountModel.findOne({
          userName: body.userName,
        });
        if (userNameExist) {
          throw new Error("Username already exist");
        } else {
          account.userName = userName;
          await account.save();
          Object.assign(userInfo, { ...rest, updatedAt: Date.now() });
          await userInfo.save();
          successResponse(res, 200, "Account updated successfully");
        }
      }
    } else {
      Object.assign(userInfo, { ...rest, updatedAt: Date.now() });
      await userInfo.save();
      successResponse(res, 200, "Account updated successfully");
    }
  } catch (error) {
    ErrorMessage(res, error);
  }
};

const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await accountModel.findById(id);

    if (!account) throw new Error("Account not found");

    await userInfoModel.deleteOne({ _id: account.userId });
    await accountModel.deleteOne({ _id: id });

    successResponse(res, 200, "Account deleted successfully");
  } catch (error) {
    ErrorMessage(res, error);
  }
};

const findByRegistrationNumber = async (req, res) => {
  const { registnumber } = req.params;
  try {
    const account = await accountModel
      .findOne({})
      .populate({
        path: "userId",
        match: { registrationNumber: registnumber },
      })
      .exec();

    if (!account) throw new Error("Account not found");
    // redisMiddleware.setex(registnumber, 3600, JSON.stringify(account));
    successResponse(res, 200, "success", account);
  } catch (error) {
    ErrorMessage(res, error);
  }
};

const getLastLoginThreeDays = async (req, res) => {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  try {
    const accounts = await accountModel
      .find({
        lastLoginDateTime: {
          $lte: threeDaysAgo,
        },
      })
      .select("-password")
      .populate("userId")
      .exec();

    successResponse(res, 200, "success", accounts);
  } catch (error) {
    ErrorMessage(res, error);
  }
};

module.exports = {
  getAllAccount,
  getAccountById,
  findAccountAndUpdate,
  deleteAccount,
  findByRegistrationNumber,
  getLastLoginThreeDays,
};

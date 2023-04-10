const Joi = require("joi");
const accountModel = require("../Model/Account.model");
const userInfoModel = require("../Model/UserInfo.model");
const { successResponse, errorResponse } = require("../Helper/ApiResponse");
const { validateField } = require("../Helper/ValidateField");

function ErrorMessage(res, error) {
  const message = error.message.replace(/\"/g, "").split(",");
  errorResponse(res, 400, message);
}

const getAccountById = async (req, res) => {
  const { id } = req.params;
  try {
    const account = await accountModel
      .findById(id)
      .select("-password ")
      .populate("userId")
      .exec();

    if (account) {
      successResponse(res, 200, "", account);
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
    console.log(account);
    successResponse(res, 200, account);
  } catch (error) {
    ErrorMessage(res, error);
  }
};

module.exports = {
  getAccountById,
  findAccountAndUpdate,
  deleteAccount,
  findByRegistrationNumber,
};

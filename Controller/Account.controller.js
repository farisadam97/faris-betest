const bcrypt = require("bcrypt");
const Joi = require("joi");
const accountModel = require("../Model/Account.model");
const userInfoModel = require("../Model/UserInfo.model");
const { successResponse, errorResponse } = require("../Helper/ApiResponse");
const { validateField } = require("../Helper/ValidateField");

const registerAccount = async (req, res) => {
  const { body } = req;

  const schema = Joi.object({
    userName: Joi.string().alphanum().min(6).required(),
    password: Joi.string().alphanum().min(8).required(),
    fullName: Joi.string().required(),
    accountNumber: Joi.string()
      .pattern(/^[a-zA-Z0-9]+$/)
      .required(),
    emailAddress: Joi.string().email().required(),
  });

  try {
    await validateField(body, schema);
    const accountExist = await accountModel.findOne({
      userName: body.userName,
    });
    if (accountExist) throw new Error("User already exist!");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const accountNumberExist = await userInfoModel.findOne({
      accountNumber: body.accountNumber,
    });

    if (accountNumberExist) throw new Error("Account Number already used!");

    const userInfoBody = {
      fullName: body.fullName,
      accountNumber: body.accountNumber,
      emailAddress: body.emailAddress,
    };

    const newUserInfo = await userInfoService.createNew(userInfoBody);

    const accountBody = {
      userName: body.userName,
      password: hashedPassword,
      userId: newUserInfo.id,
    };

    const newAccount = await accountModel.create(accountBody);

    successResponse(res, 200, "Account has been created", newAccount);
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: error.message.replace(/\"/g, "").split(","),
    });
  }
};

const getAccountById = async (req, res) => {
  const { accountId } = req.params;

  const account = await accountModel.findById(accountId, {
    include: [userInfoModel],
  });

  if (account) {
    successResponse(res, 200, "", account);
  } else {
    throw new Error("Account not found");
  }
};

module.exports = {
  registerAccount,
  getAccountById,
};

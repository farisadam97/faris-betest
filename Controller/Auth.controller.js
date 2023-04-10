const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
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

    const accountNumberExist = await userInfoModel.findOne({
      accountNumber: body.accountNumber,
    });

    if (accountNumberExist) throw new Error("Account Number already used!");

    const emailAddressExist = await userInfoModel.findOne({
      emailAddress: body.emailAddress,
    });

    if (emailAddressExist) throw new Error("Email Address already used!");

    const userInfoBody = {
      fullName: body.fullName,
      accountNumber: body.accountNumber,
      emailAddress: body.emailAddress,
      registrationNumber: Math.floor(
        new Date().getTime() / 10 + Math.random() * 10
      ).toString(),
    };

    const newUserInfo = await userInfoModel.create(userInfoBody);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const accountBody = {
      userName: body.userName,
      password: hashedPassword,
      userId: newUserInfo.id,
    };

    const newAccount = await accountModel.create(accountBody);

    const resData = {
      _id: newAccount.id,
      userName: newAccount.userName,
      userInfo: {
        _id: newUserInfo.id,
        fullName: newUserInfo.fullName,
        accountNumber: newUserInfo.accountNumber,
        registrationNumber: newUserInfo.registrationNumber,
        createdAt: newUserInfo.createdAt,
      },
    };

    successResponse(res, 200, "Account has been created", resData);
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: error.message.replace(/\"/g, "").split(","),
    });
  }
};

const loginAccount = async (req, res) => {
  const { body } = req;
  const schema = Joi.object({
    userName: Joi.string().alphanum().min(6).required(),
    password: Joi.string().alphanum().min(8).required(),
  });
  try {
    await validateField(body, schema);
    const account = await accountModel
      .findOne({ userName: body.userName })
      .populate("userId")
      .exec();
    if (!account) {
      errorResponse(res, 400, "Account not found");
    }

    await accountModel.findOneAndUpdate(
      { userName: body.userName },
      {
        lastLoginDateTime: Date.now(),
      }
    );
    const isPasswordValid = await bcrypt.compare(
      body.password,
      account.password
    );

    if (!isPasswordValid) {
      errorResponse(res, 400, "Invalid password ");
    }

    const token = jwt.sign(
      {
        id: account.__id,
        userName: account.userName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    const resData = {
      userName: account.userName,
      userInfo: account.userId,
      token,
    };

    successResponse(res, 200, "Login success", resData);
  } catch (error) {
    errorResponse(res, 400, error.message);
  }
};

module.exports = {
  registerAccount,
  loginAccount,
};

const { Router } = require("express");
const authRouter = Router();

const accountController = require("../Controller/Account.controller");

authRouter.route("/register").post(accountController.registerAccount);
authRouter.route("/account/:accountId").get(accountController.getAccountById);

module.exports = authRouter;

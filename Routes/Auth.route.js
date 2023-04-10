const { Router } = require("express");
const authRouter = Router();

const authController = require("../Controller/Auth.controller");

authRouter.route("/register").post(authController.registerAccount);
authRouter.route("/login").post(authController.loginAccount);

module.exports = authRouter;

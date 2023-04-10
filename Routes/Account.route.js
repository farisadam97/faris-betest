const { Router } = require("express");
const accountRouter = Router();

const accountController = require("../Controller/Account.controller");

accountRouter.route("/").get(accountController.getAllAccount);
accountRouter
  .route("/last-login-history")
  .get(accountController.getLastLoginThreeDays);
accountRouter.route("/:id").get(accountController.getAccountById);
accountRouter.route("/:id").put(accountController.findAccountAndUpdate);
accountRouter.route("/:id").delete(accountController.deleteAccount);
accountRouter
  .route("/search/registration/:registnumber")
  .get(accountController.findByRegistrationNumber);

module.exports = accountRouter;

const { Router } = require("express");
const accountRouter = Router();

const accountController = require("../Controller/Account.controller");

accountRouter.route("/:id").get(accountController.getAccountById);
accountRouter.route("/:id").put(accountController.findAccountAndUpdate);
accountRouter.route("/:id").delete(accountController.deleteAccount);
accountRouter
  .route("/search/registration/:registnumber")
  .get(accountController.findByRegistrationNumber);

module.exports = accountRouter;

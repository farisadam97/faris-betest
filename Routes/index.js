var express = require("express");
var router = express.Router();

const authRouter = require("./Auth.route");
const accountRouter = require("./Account.route");
const authMiddleware = require("../Middleware/Auth");

/* GET home page. */
router.get("/welcome", function (req, res, next) {
  res.status(200).send({ title: "Welcome to Faris Be Test" });
});

// Api route for authentication
router.use("/auth", authRouter);

// Api route for account
router.use("/account", authMiddleware, accountRouter);

module.exports = router;

var express = require("express");
var router = express.Router();

const authRouter = require("./Auth.route");

/* GET home page. */
router.get("/welcome", function (req, res, next) {
  res.status(200).send({ title: "Welcome to Faris Be Test" });
});

// Api route for authentication
router.use("/auth", authRouter);

module.exports = router;

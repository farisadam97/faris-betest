const mongoose = require("mongoose");
const { mongodbUrl } = require("../Config");

mongoose
  .connect(mongodbUrl)
  .then(() => console.log("db connect"))
  .catch((err) => console.log(err));

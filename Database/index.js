const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => console.log("db connect"))
  .catch((err) => console.log(err));

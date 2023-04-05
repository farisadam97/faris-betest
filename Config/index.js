require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  mongodbUrl: process.env.MONGODB_URL,
};

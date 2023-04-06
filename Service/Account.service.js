const accountModel = require("../Model/Account.model");

const createNew = async (data) => {
  return await accountModel.create(data);
};

const findOneBy = async (username) => {
  return await accountModel.findOne({
    userName: username,
  });
};

module.exports = {
  findOneBy,
  createNew,
};

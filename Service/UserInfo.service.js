const userInfoModel = require("../Model/UserInfo.model");

const createNew = async (data) => {
  return await userInfoModel.create(data);
};

module.exports = {
  createNew,
};

const mongoose = require("mongoose");

const { ObjectId } = monggose.Schema;

const accountSchema = mongoose.Schema({
  userName: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
    minLength: 6,
  },
  password: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  lastLoginDateTime: {
    type: mongoose.SchemaTypes.Date,
  },
  userId: {
    type: ObjectId,
    ref: "UserInfo",
  },
});

module.exports = mongoose.model("Account", accountSchema);

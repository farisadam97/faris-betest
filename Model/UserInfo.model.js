const mongoose = require("mongoose");

const userInfoSchema = mongoose.Schema({
  fullName: {
    type: mongoose.SchemaTypes.String,
    required: true,
    minLength: 6,
  },
  accountNumber: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
    minLength: 8,
  },
  emailAddress: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Email address is not valid!",
    },
  },
  registrationNumber: {
    type: mongoose.SchemaTypes.String,
    default: Math.round(new Date().now / 1000) + Math.random() * 10,
  },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: new Date(),
  },
  updatedAt: {
    type: mongoose.SchemaTypes.Date,
  },
});

module.exports = mongoose.model("UserInfo", userInfoSchema);

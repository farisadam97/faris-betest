const Joi = require("joi");
const { successResponse } = require("../Helper/ApiResponse");
const validateField = async (object, schema) => {
  const { error } = schema.validate(object, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    throw new Error(errors);
  }
};

module.exports = {
  validateField,
};

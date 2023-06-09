const successResponse = async (res, status, message, data) => {
  return res.status(status).json({
    status: "success",
    message,
    data: data,
  });
};

const errorResponse = async (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: "error",
    message,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};

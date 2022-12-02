const response = (success, status, message, result) => {
  return {
    success: Boolean(success),
    status: Number(status),
    message: String(message),
    result: result,
  };
};

module.exports = response;

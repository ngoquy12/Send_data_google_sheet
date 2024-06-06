module.exports.handleResponse = (res, status, userMessage, devMessage) => {
  const response = { status };

  if (userMessage) {
    response.message = userMessage;
  }

  if (devMessage) {
    response.devMessage = devMessage;
  }

  return res.status(status).json(response);
};

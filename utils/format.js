const httpError = (statusCode, errorMsg) => {
  let message = errorMsg;
  if (!message) {
    if (statusCode === 401) {
      message = "Not authorized";
    } else if (statusCode === 404) {
      message = "404 not found";
    } else if (statusCode === 500) {
      message = "Server error";
    }
  }

  return {
    status: statusCode,
    message,
  };
};

export default {
  httpError,
};

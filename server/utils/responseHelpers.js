// Helper function to send consistent error responses
function sendErrorResponse(res, statusCode, errorMessage) {
  res.statusCode = statusCode;
  res.end(JSON.stringify({ error: errorMessage }));
}

// Helper function to send consistent success responses
function sendSuccessResponse(res, statusCode, successMessage) {
  res.statusCode = statusCode;
  res.end(JSON.stringify({ message: successMessage }));
}

export { sendErrorResponse, sendSuccessResponse };

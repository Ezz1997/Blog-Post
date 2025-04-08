import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_ACCESS_SECRET) {
  console.error("FATAL ERROR: JWT_ACCESS_SECRET is not defined.");
  process.exit(1);
}

// JWT authentication middleware
export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // No authorization header provided
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Access denied. No token provided." }));
    return;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    // Header format is incorrect
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Access denied. Invalid token format." }));
    return;
  }

  const token = parts[1];

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    req.user = decoded;

    next(req, res);
  } catch (err) {
    console.error("JWT Verification Error:", err.message || err);

    let errorMessage = "Unauthorized. Invalid token.";
    if (err instanceof jwt.TokenExpiredError) {
      errorMessage = "Unathorized. Access Token expired";
    }

    res.statusCode = 401;
    res.end(JSON.stringify({ error: errorMessage }));
  }
};

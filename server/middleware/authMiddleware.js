import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// JWT authentication middleware
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Access denied" }));
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);

    next(req, res);
  } catch (err) {
    console.error(err);
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Invalid token" }));
  }
};

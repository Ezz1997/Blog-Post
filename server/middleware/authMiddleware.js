import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// JWT authentication middleware
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (authHeader) {
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      next(req, res);
    } else {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Access denied" }));
      return;
    }
  } catch (err) {
    console.error(err);
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Invalid token" }));
  }
};

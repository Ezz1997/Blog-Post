import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id }, JWT_ACCESS_SECRET, {
    expiresIn: 60,
  });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: 60 * 2,
  });
};

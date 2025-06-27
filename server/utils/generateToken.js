import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_TOKEN_EXPIRATION = 60 * 15;
const REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24;

export const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, firstname: user.firstname, lastname: user.lastname },
    JWT_ACCESS_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRATION, // 15 minutes
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ _id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION, // 24 hours
  });
};

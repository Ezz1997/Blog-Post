import {
  getUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  userLoginHandler,
  deleteUserByIdHandler,
  refreshToken,
} from "../controllers/userController.js";
import { verifyAccessToken } from "../middleware/authMiddleware.js";

const userRoutes = {
  "/api/users": {
    GET: (req, res) => {
      verifyAccessToken(req, res, getUsersHandler);
    },
  },
  "/api/users/signup": {
    POST: createUserHandler,
  },
  "/api/users/login": {
    POST: userLoginHandler,
  },
  "/api/users/:id": {
    GET: (req, res) => {
      verifyAccessToken(req, res, getUserByIdHandler);
    },
    DELETE: (req, res) => {
      verifyAccessToken(req, res, deleteUserByIdHandler);
    },
  },
  "/api/users/refresh": {
    POST: refreshToken,
  },
  notFound: (req, res) => {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Invalid URL" }));
  },
};

export default userRoutes;

import {
  getUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  userLoginHandler,
  deleteUserByIdHandler,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const userRoutes = {
  "/api/users": {
    GET: (req, res) => {
      verifyToken(req, res, getUsersHandler);
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
      verifyToken(req, res, getUserByIdHandler);
    },
    DELETE: (req, res) => {
      verifyToken(req, res, deleteUserByIdHandler);
    },
  },
  notFound: (req, res) => {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Invalid URL" }));
  },
};

export default userRoutes;

import { createServer } from "http";
import db from "./config/db_connection.js";
import bcrypt from "bcryptjs";

const PORT = process.env.PORT;
const HOST_NAME = process.env.HOST_NAME;

// Logger middleware
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Json middleware
const jsonMiddleware = (req, res, next) => {
  res.setHeader("Content-Type", "json/application");
  next();
};

// Route handler for GET /api/users
// Get list of all users
const getUsersHandler = async (req, res) => {
  const coll = db.collection("users");
  const users = await coll.find().project({ _id: 0, password: 0 }).toArray();
  console.log(users);

  try {
    res.statusCode = 200;
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error(error);
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid Request" }));
  }
};

// Route handler for GET /api/users/:id
// Get user by id
const getUserByIdHandler = async (req, res) => {};

// Route handler for POST /api/users/signup
// Create New User
const createUserHandler = (req, res) => {
  let body = "";

  // Listen for data
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      // Parse JSON
      const newUser = JSON.parse(body);

      // Validate input
      const { firstname, lastname, email, password } = newUser;
      if (!firstname || !lastname || !email || !password) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "All fields are required" }));
        return;
      }

      const coll = db.collection("users");

      // Check if user exists
      const existingUser = await coll.findOne({ email });
      if (!existingUser) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new password
        const result = await coll.insertOne({
          ...newUser,
          password: hashedPassword,
        });

        console.log(result);

        res.statusCode = 201;
        res.end(JSON.stringify({ message: "User Created Successfully" }));
      } else {
        // User already exists
        res.statusCode = 409;
        res.end(JSON.stringify({ error: "User Already exists!" }));
      }
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
};

// Route handler for PATCH /api/users/:id
// Update user by id
const updateUserHandler = async (req, res) => {};

// Route handler for DELETE /api/users/:id
// Delete user by id
const deleteUserHandler = async (req, res) => {};

const server = createServer((req, res) => {
  logger(req, res, () => {
    jsonMiddleware(req, res, () => {
      if (req.url === "/api/users/signup" && req.method === "POST") {
        createUserHandler(req, res);
      } else if (req.url === "/api/users" && req.method === "GET") {
        getUsersHandler(req, res);
      } else {
        res.statusCode = 404;
        res.write(JSON.stringify({ message: "idk man you got an error" }));
        res.end();
      }
    });
  });
});

server.listen(PORT, HOST_NAME, () => {
  console.log(`Server running at http:/${HOST_NAME}:${PORT}`);
});

import { createServer } from "http";
import db from "./config/db_connection.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

const PORT = process.env.PORT;
const HOST_NAME = process.env.HOST_NAME;

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
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

// Route handler for GET /api/users/:id
// Get user by id
const getUserByIdHandler = async (req, res) => {
  try {
    const id = req.url.split("/")[3];
    const coll = db.collection("users");

    const user = await coll.findOne(
      {
        _id: ObjectId.createFromHexString(id),
      },
      { projection: { password: 0 } }
    );

    /* Print a message that indicates whether the operation deleted a
      document */
    if (user) {
      res.statusCode = 200;
      res.end(JSON.stringify(user));
    } else {
      console.log("User not found");
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "User not found" }));
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

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

// Route handler for POST /api/users/login
// User login
const userLoginHandler = async (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      // Parse Json
      let user = JSON.parse(body);
      const { email, password } = user;

      // Validate input
      if (!email || !password) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "All fields are required" }));
        return;
      }

      const coll = db.collection("users");
      const existingUser = await coll.findOne({ email });

      if (existingUser) {
        const result = await bcrypt.compare(password, existingUser.password);

        if (result) {
          res.statusCode = 200;
          res.end(JSON.stringify({ message: "Successful Login" }));
          return;
        }
      }

      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Unauthorized Access" }));
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
const deleteUserByIdHandler = async (req, res) => {
  try {
    const id = req.url.split("/")[3];
    const coll = db.collection("users");

    const result = await coll.deleteOne({
      _id: ObjectId.createFromHexString(id),
    });

    /* Print a message that indicates whether the operation deleted a
      document */
    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
      res.statusCode = 200;
      res.end(
        JSON.stringify({ message: "Successfully deleted one document." })
      );
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
      res.statusCode = 204;
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

const server = createServer((req, res) => {
  jsonMiddleware(req, res, () => {
    if (req.url === "/api/users/signup" && req.method === "POST") {
      createUserHandler(req, res);
    } else if (req.url === "/api/users" && req.method === "GET") {
      getUsersHandler(req, res);
    } else if (req.url === "/api/users/login" && req.method === "POST") {
      userLoginHandler(req, res);
    } else if (
      req.url.match(/\/api\/users\/([0-9a-fA-F]{24})/) &&
      req.method === "DELETE"
    ) {
      deleteUserByIdHandler(req, res);
    } else if (
      req.url.match(/\/api\/users\/([0-9a-fA-F]{24})/) &&
      req.method === "GET"
    ) {
      getUserByIdHandler(req, res);
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Invalid URL" }));
    }
  });
});

server.listen(PORT, HOST_NAME, () => {
  console.log(`Server running at http:/${HOST_NAME}:${PORT}`);
});

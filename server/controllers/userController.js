import db from "../config/db_connection.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Route handler for GET /api/users
// Get list of all users
const getUsersHandler = async (req, res) => {
  const coll = db.collection("users");
  const users = await coll.find().project({ password: 0 }).toArray();
  // console.log(users);

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
    let id = req.url.split("/")[3];
    const coll = db.collection("users");

    if (!id.match(/([0-9a-fA-F]{24})/)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid User ID format" }));
      return;
    }

    const user = await coll.findOne(
      {
        _id: ObjectId.createFromHexString(id),
      },
      { projection: { password: 0 } }
    );

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

        if (newUser._id) {
          await coll.insertOne({
            ...newUser,
            password: hashedPassword,
            _id: ObjectId.createFromHexString(newUser._id),
          });
        } else {
          await coll.insertOne({
            ...newUser,
            password: hashedPassword,
          });
        }

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
        res.end(
          JSON.stringify({ login: false, error: "All fields are required" })
        );
        return;
      }

      const coll = db.collection("users");
      const existingUser = await coll.findOne({ email });

      if (existingUser) {
        const result = await bcrypt.compare(password, existingUser.password);

        if (result) {
          const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, {
            expiresIn: 60,
          });
          res.statusCode = 200;
          res.end(JSON.stringify({ login: true, token: token }));
          return;
        }
      }

      res.statusCode = 401;
      res.end(JSON.stringify({ login: false, error: "Unauthorized Access" }));
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
};

// Route handler for DELETE /api/users/:id
// Delete user by id
const deleteUserByIdHandler = async (req, res) => {
  try {
    const id = req.url.split("/")[3];
    const coll = db.collection("users");

    if (!id.match(/([0-9a-fA-F]{24})/)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Invalid User ID format" }));
      return;
    }

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
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "User not found" }));
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

export {
  getUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  userLoginHandler,
  deleteUserByIdHandler,
};

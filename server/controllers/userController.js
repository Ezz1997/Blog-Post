import db from "../config/db_connection.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Route handler for GET /api/users
// Get list of all users
const getUsersHandler = async (req, res) => {
  const coll = db.collection("users");
  const users = await coll
    .find()
    .project({ password: 0, refreshToken: 0 })
    .toArray();
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
      // empty request body
      if (!body) {
        res.statusCode = 400;
        res.end(JSON.stringify({ login: false, error: "Invalid request" }));
        return;
      }

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
          const accessToken = generateAccessToken(existingUser);
          const refreshToken = generateRefreshToken(existingUser);

          // save refresh token in db
          const filter = { _id: existingUser._id };

          // Specify the update to set a value for the plot field
          const updateDoc = {
            $set: {
              refreshToken: refreshToken,
            },
          };

          // update document with the specific id
          const updated_res = await coll.updateOne(filter, updateDoc);

          console.log(updated_res.modifiedCount);

          res.statusCode = 200;
          res.end(
            JSON.stringify({
              login: true,
              accessToken: accessToken,
              refreshToken: refreshToken,
            })
          );
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

const refreshToken = async (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      if (!body) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid request" }));
        return;
      }

      const data = JSON.parse(body);

      // Take the refresh token from the user
      const refreshToken = data.refreshToken;

      // Token isn't in the request body
      if (!refreshToken) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Not Authenticated" }));
        return;
      }

      // Check if token is in db
      const users = db.collection("users");
      const user_with_token = await users.findOne({ refreshToken });

      // Send error if token isn't in the db
      if (!user_with_token) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: "Refresh token is not valid" }));
        return;
      }

      jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, user) => {
        if (err) {
          console.log(err);
          res.statusCode = 401;

          let errorMessage = "Unauthorized. Invalid token.";
          if (err instanceof jwt.TokenExpiredError) {
            errorMessage = "Unathorized. Token expired";
          }
          res.end(JSON.stringify({ error: errorMessage }));
          return;
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Update refresh token in db
        const filter = { _id: ObjectId.createFromHexString(user._id) };

        // Specify the update to set a value for the plot field
        const updateDoc = {
          $set: {
            refreshToken: newRefreshToken,
          },
        };

        console.log(user._id);

        // update document with the specific id
        const updated_res = await users.updateOne(filter, updateDoc);

        console.log(updated_res.modifiedCount);

        res.statusCode = 200;
        res.end(
          JSON.stringify({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        );
      });
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
};

const logoutHandler = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      if (!body) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid request" }));
        return;
      }

      const data = JSON.parse(body);

      // Take the refresh token from the user
      const refreshToken = data.refreshToken;

      // Token isn't in the request body
      if (!refreshToken) {
        res.statusCode = 401;
        res.end(JSON.stringify({ error: "Not Authenticated" }));
        return;
      }

      // Check if token is in db
      const users = db.collection("users");
      const user_with_token = await users.findOne({ refreshToken });

      // Send error if token isn't in the db
      if (!user_with_token) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: "Refresh token is not valid" }));
        return;
      }

      jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, user) => {
        if (err) {
          console.log(err);
          res.statusCode = 401;

          let errorMessage = "Unauthorized. Invalid token.";
          if (err instanceof jwt.TokenExpiredError) {
            errorMessage = "Unathorized. Token expired";
          }
          res.end(JSON.stringify({ error: errorMessage }));
          return;
        }

        // Update refresh token in db
        const filter = { _id: ObjectId.createFromHexString(user._id) };

        // Specify the update to set a value for the plot field
        const updateDoc = {
          $set: {
            refreshToken: null,
          },
        };

        // update document with the specific id
        const updated_res = await users.updateOne(filter, updateDoc);

        console.log(updated_res.modifiedCount);

        res.statusCode = 200;
        res.end(JSON.stringify({ message: "User logged out successfully!" }));
      });
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
};

export {
  getUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  userLoginHandler,
  deleteUserByIdHandler,
  refreshToken,
  logoutHandler,
};

import db from "../config/db_connection.js";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseHelpers.js";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const MAX_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 254;
const MAX_PASSWORD_LENGTH = 64;
const MIN_PASSWORD_LENGTH = 8;

// Route handler for GET /api/users
// Get list of all users
const getUsersHandler = async (req, res) => {
  const coll = db.collection("users");
  const users = await coll
    .find()
    .project({ password: 0, refreshToken: 0 })
    .toArray();

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

      // Validate that all fields are present
      const { firstname, lastname, email, password } = newUser;
      if (!firstname || !lastname || !email || !password) {
        sendErrorResponse(res, 400, "All fields are required");
        return;
      }

      // Validate types
      if (
        typeof firstname !== "string" ||
        typeof lastname != "string" ||
        typeof email != "string" ||
        typeof password != "string"
      ) {
        sendErrorResponse(res, 422, "Invalid data types");
        return;
      }

      // Validate lengths
      if (
        firstname.length > MAX_NAME_LENGTH ||
        lastname.length > MAX_NAME_LENGTH ||
        email.length > MAX_EMAIL_LENGTH ||
        !(
          password.length >= MIN_PASSWORD_LENGTH &&
          password.length <= MAX_PASSWORD_LENGTH
        )
      ) {
        sendErrorResponse(res, 422, "Invalid data lengths");
        return;
      }

      // Validate that first name and lastname contains only letters
      if (!validator.isAlpha(firstname) || !validator.isAlpha(lastname)) {
        sendErrorResponse(
          res,
          422,
          "first name and last name must contain only letters"
        );
        return;
      }

      // Validate email
      if (!validator.isEmail(email)) {
        sendErrorResponse(res, 422, "Invalid Email");
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

        sendSuccessResponse(res, 201, "User Created Successfully");
      } else {
        // User already exists
        sendErrorResponse(res, 409, "User Already exists!");
      }
    } catch (error) {
      console.error(error);
      sendErrorResponse(res, 500, "Internal Server Error");
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
      const { email, password, rememberMe } = user;

      // Validate input
      if (!email || !password || !typeof rememberMe == "boolean") {
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
          await coll.updateOne(filter, updateDoc);

          // Set the Refresh Token Cookie
          const cookieOptions = [
            `refreshToken=${refreshToken}`,
            `HttpOnly`, // Makes it inaccessiable to client-side JS
            `Secure`, // Ensures cookie is sent over https
            `Path=/`,
            `Max-Age=${rememberMe ? 60 * 60 * 24 : 60 * 60 * 6}`,
            `SameSite=Strict`,
          ];
          res.setHeader("Set-Cookie", cookieOptions.join("; "));
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              message: "Login successful",
              accessToken: accessToken,
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
  try {
    const cookie = req.headers?.cookie;

    // cookie isn't in the headers
    if (!cookie) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Not Authenticated" }));
      return;
    }

    // Take the refresh token from the user
    const refreshToken = cookie.split("refreshToken=")[1];

    // Token isn't in the request body
    if (!refreshToken) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Not Authenticated" }));
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

      const users = db.collection("users");
      const user_with_token = await users.findOne({ refreshToken });

      // Send error if token isn't in the db
      if (!user_with_token) {
        res.statusCode = 403;
        res.end(JSON.stringify({ error: "Refresh token is not valid" }));
        return;
      }

      const newAccessToken = generateAccessToken(user_with_token);

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          accessToken: newAccessToken,
        })
      );
    });
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

const logoutHandler = async (req, res) => {
  try {
    const cookie = req.headers?.cookie;

    // cookie isn't in the headers
    if (!cookie) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Not Authenticated" }));
      return;
    }

    // Take the refresh token from the user
    const refreshToken = cookie.split("refreshToken=")[1];

    // Token isn't in the request body
    if (!refreshToken) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Not Authenticated" }));
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

      const users = db.collection("users");

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

      // Set the Refresh Token Cookie with Max-Age 0
      const cookieOptions = [
        `refreshToken=${refreshToken}`,
        `HttpOnly`, // Makes it inaccessiable to client-side JS
        `Secure`, // Ensures cookie is sent over https
        `Path=/`,
        `Max-Age=${0}`,
        `SameSite=Strict`,
      ];
      res.setHeader("Set-Cookie", cookieOptions.join("; "));

      res.statusCode = 200;
      res.end(JSON.stringify({ message: "User logged out successfully!" }));
    });
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
  refreshToken,
  logoutHandler,
};

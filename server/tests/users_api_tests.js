import request from "supertest";
import dotenv from "dotenv";
import assert from "assert";

dotenv.config({ path: "../.env" });

const PORT = process.env.PORT;
const HOST_NAME = process.env.HOST_NAME;
const URL = `http://${HOST_NAME}:${PORT}`;

// Test for GET /api/users
// Description: Get a list of all users
request(URL)
  .get("/api/users")
  .expect(200)
  .expect("Content-Type", "application/json")
  .expect((res) => {
    assert(Array.isArray(res.body), "Response should be an array");
    assert(res.body.length > 0, "User list should not be empty");

    res.body.forEach((user) => {
      // Existing fields
      assert(user.hasOwnProperty("firstname"), "User should have a firstname");
      assert(user.hasOwnProperty("lastname"), "User should have a lastname");
      assert(user.hasOwnProperty("email"), "User should have an email");
      assert(user.hasOwnProperty("_id"), "User should have an id");

      // Non existing fields
      assert(!user.hasOwnProperty("password"), "User should not have password");

      // Number of fields
      assert.equal(Object.keys(user).length, 4, "User Must have only 4 fields");
    });
  })
  .then(() => console.log("Test Passed!"))
  .catch((err) => console.error("Test failed: ", err));

// Test for GET /api/users/:id
// Description: Get user by id
// Testcase: User Exists
request(URL)
  .get("/api/users/67dabfe854ce33216e2a12ad")
  .expect(200)
  .expect("Content-Type", "application/json")
  .expect((res) => {
    let user = res.body;

    assert(typeof user === "object", "A User object must be returned");

    // Existing fields
    assert.equal(
      user._id,
      "67dabfe854ce33216e2a12ad",
      "_id must be equal to: 67dabfe854ce33216e2a12ad"
    );
    assert.equal(user.firstname, "Jack", "firstname must by equal to: Jack");
    assert.equal(
      user.lastname,
      "Dempsey",
      "lastname must be equal to: Dempsey"
    );
    assert.equal(
      user.email,
      "test5@gmail.com",
      "email must be equal to test5@gmail.com"
    );

    // Non existing fields
    assert(!("password" in user), "User should not have password");

    // Number of fields
    assert.equal(Object.keys(user).length, 4, "User Must have only 4 fields");
  })
  .then(() => console.log("Test Passed!"))
  .catch((err) => console.error("Test failed: ", err));

// Test for GET /api/users/:id
// Description: Get user by id
// Testcase: User Doesn't Exist
request(URL)
  .get("/api/users/67dabfe854ce33216e2a12af")
  .expect(404)
  .expect("Content-Type", "application/json")
  .expect((res) => {
    assert(res.body.hasOwnProperty("error"), "Body must contain error message");
    assert.equal(
      res.body.error,
      "User not found",
      "Error Message must be equal to: User not found"
    );
  })
  .then(() => console.log("Test Passed!"))
  .catch((err) => console.error("Test failed: ", err));

// a function template for testing signup api with different inputs
function test_signup(payload, statusCode, message) {
  request(URL)
    .post("/api/users/signup")
    .send(payload)
    .set("Accept", "application/json")
    .expect(statusCode)
    .expect("Content-Type", "application/json")
    .expect((res) => {
      assert(
        res.body.hasOwnProperty(message.type),
        `Body must contain ${message.type}`
      );
      assert.equal(
        message.type === "message" ? res.body.message : res.body.error,
        message.text,
        `Message must be equal to: ${message.text}`
      );
    })
    .then(() => console.log("Test Passed!"))
    .catch((err) => console.error("Test failed: ", err));
}

// Test for POST /api/users/signup
// Description: Create new user.
// Fields: firstname, lastname, email, password
// Testcase: User created successfully
test_signup(
  {
    firstname: "D",
    lastname: "D",
    email: "D@gmail.com",
    password: "D",
  },
  201,
  { text: "User Created Successfully", type: "message" }
);

// Test for POST /api/users/signup
// Description: Create new user.
// Fields: firstname, lastname, email, password
// Testcase: User already exists Error
test_signup(
  {
    firstname: "C",
    lastname: "C",
    email: "C@gmail.com",
    password: "C",
  },
  409,
  { text: "User Already exists!", type: "error" }
);

// Test for POST /api/users/signup
// Description: Create new user.
// Fields: firstname, lastname, email, password
// Testcase: All fields are required Error
test_signup(
  {
    firstname: "",
    lastname: "C",
    email: "C@gmail.com",
    password: "C",
  },
  400,
  { text: "All fields are required", type: "error" }
);

// a function template for testing signin api with different inputs
function test_login(payload, statusCode, message) {
  request(URL)
    .post("/api/users/login")
    .send(payload)
    .set("Accept", "application/json")
    .expect(statusCode)
    .expect("Content-Type", "application/json")
    .expect((res) => {
      assert(
        res.body.hasOwnProperty(message.type),
        `Body must contain ${message.type}`
      );
      assert.equal(
        message.type === "message" ? res.body.message : res.body.error,
        message.text,
        `Message must be equal to: ${message.text}`
      );
    })
    .then(() => console.log("Test Passed!"))
    .catch((err) => console.error("Test failed: ", err));
}

// Test for POST /api/users/login
// Description: login by email and password
// Testcase: login Successfull
test_login({ email: "test10@gmail.com", password: "1231231231" }, 200, {
  text: "Successful Login",
  type: "message",
});

// Test for POST /api/users/login
// Description: login by email and password
// Testcase: Missing fields
test_login({ email: "test10@gmail.com", password: "" }, 400, {
  text: "All fields are required",
  type: "error",
});

// Test for POST /api/users/login
// Description: login by email and password
// Testcase: Unauthorized access
test_login({ email: "test10@gmail.com", password: "123456" }, 401, {
  text: "Unauthorized Access",
  type: "error",
});

// Test for DELETE /api/users/:id
// Description: delete user by id
// Testcase: User Exists
request(URL)
  .delete("/api/users/67deb406a8ebaf1660fcad55")
  .expect(200)
  .expect("Content-Type", "application/json")
  .expect((res) => {
    assert(res.body.hasOwnProperty("message"), "Body must contain message");
    assert.equal(
      res.body.message,
      "Successfully deleted one document.",
      "Message must be equal to: Successfully deleted one document."
    );
  })
  .then(() => console.log("Test Passed!"))
  .catch((err) => console.error("Test failed: ", err));

// Test for DELETE /api/users/:id
// Description: delete user by id
// Testcase: User Exists
request(URL)
  .delete("/api/users/67deb406a8ebaf1660fcad53")
  .expect(204)
  .expect("Content-Type", "application/json")
  .then(() => console.log("Test Passed!"))
  .catch((err) => console.error("Test failed: ", err));

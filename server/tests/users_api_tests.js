import request from "supertest";
import dotenv from "dotenv";
import assert from "assert";
import randomString from "../utils/randomStringGenerator.js";

dotenv.config({ path: "../.env" });

const PORT = process.env.PORT;
const HOST_NAME = process.env.HOST_NAME;
const URL = `http://${HOST_NAME}:${PORT}`;

let loginToken = "";

// Test for /api/users/login
// Description: Login to get a jwt token before running other tests
// Testcase: Successful login, Response: object {login: true, token: {24 characters hexadicmal string}}
await request(URL)
  .post("/api/users/login")
  .send({ email: "test10@gmail.com", password: "1231231231" })
  .expect(200)
  .expect((res) => {
    assert(
      res.body.hasOwnProperty("token"),
      "Login response should contain a token field"
    );
    assert(
      res.body.hasOwnProperty(
        "login",
        "Login response should contain a login field"
      )
    );
    assert.equal(typeof res.body, "object", "Response must be an object");
  })
  .then((res) => {
    loginToken = res.body.token;
    console.log("Test Passed - POST /api/users/login: Generate jwt token");
  })
  .catch((err) =>
    console.error(
      "Test Failed - POST /api/users/login: Generate jwt token ",
      err
    )
  );

// Test for GET /api/users
// Description: Get a list of all users
// Testcase: A non empty list of users must be returned
request(URL)
  .get("/api/users")
  .set("Authorization", loginToken)
  .set("Content-Type", "application/json")
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
  .then(() => console.log("Test Passed - GET /api/users: Get all users"))
  .catch((err) =>
    console.error("Test Failed - GET /api/users: Get all users ", err)
  );

// Test for GET /api/users/:id
// Description: Get user by id
// Testcase: User Exists
request(URL)
  .get("/api/users/67e276bc8442b52f828f15b1")
  .set("Authorization", loginToken)
  .set("Content-Type", "application/json")
  .expect(200)
  .expect("Content-Type", "application/json")
  .expect((res) => {
    let user = res.body;

    assert.equal(typeof user, "object", "A User object must be returned");

    // Existing fields
    assert.equal(
      user._id,
      "67e276bc8442b52f828f15b1",
      "_id must be equal to: 67e276bc8442b52f828f15b1"
    );
    assert.equal(
      user.firstname,
      "testdontdelete",
      "firstname must by equal to: testdontdelete"
    );
    assert.equal(
      user.lastname,
      "testdontdelete",
      "lastname must be equal to: testdontdelete"
    );
    assert.equal(
      user.email,
      "testdontdelete@gmail.com",
      "email must be equal to testdontdelete@gmail.com"
    );

    // Non existing fields
    assert(!("password" in user), "User should not have password");

    // Number of fields
    assert.equal(Object.keys(user).length, 4, "User Must have only 4 fields");
  })
  .then(() => console.log("Test Passed - GET /api/users/:id"))
  .catch((err) => console.error("Test Failed - GET /api/users/:id ", err));

// Test for GET /api/users/:id
// Description: Get user by id
// Testcase: User Doesn't Exist
request(URL)
  .get("/api/users/67dabfe854ce33216e2a12af")
  .set("Authorization", loginToken)
  .set("Content-Type", "application/json")
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
  .then(() => console.log("Test Passed - GET /api/users/:id"))
  .catch((err) => console.error("Test Failed - GET /api/users/:id ", err));

// Test for GET /api/users/:id
// Description: Get user by id
// Testcase: Invalid id
request(URL)
  .get("/api/users/123")
  .set("Authorization", loginToken)
  .set("Content-Type", "application/json")
  .expect(400)
  .expect("Content-Type", "application/json")
  .expect((res) => {
    assert(res.body.hasOwnProperty("error"), "Body must contain error message");
    assert.equal(
      res.body.error,
      "Invalid User ID format",
      "Error Message must be equal to: Invalid User ID format"
    );
  })
  .then(() => console.log("Test Passed - GET /api/users/:id"))
  .catch((err) => console.error("Test Failed - GET /api/users/:id ", err));

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
    .then(() => console.log("Test Passed - POST /api/users/signup"))
    .catch((err) =>
      console.error("Test Failed - POST /api/users/signup ", err)
    );
}

// Test for POST /api/users/signup
// Description: Create new user.
// Fields: firstname, lastname, email, password
// Testcase: User created successfully
test_signup(
  {
    firstname: randomString(7),
    lastname: randomString(7),
    email: `${randomString(7)}@gmail.com`,
    password: randomString(8),
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
    firstname: "testdontdelete",
    lastname: "testdontdelete",
    email: "testdontdelete@gmail.com",
    password: "testdontdelete",
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

// a function template for testing login api with different inputs
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
    .then(() => console.log("Test Passed - POST /api/users/login"))
    .catch((err) => console.error("Test failed - POST /api/users/login ", err));
}

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
// Testcase: User doesnt exist
request(URL)
  .delete("/api/users/67deb406a8ebaf1660fcad53")
  .set("Authorization", loginToken)
  .set("Content-Type", "application/json")
  .expect(404)
  .expect("Content-Type", "application/json")
  .expect((response) => {
    let res = response.body;

    assert.equal(typeof res, "object", "Response must contain an object");
    assert(res.hasOwnProperty("error"), "Response must contain an error field");
    assert.equal(
      res.error,
      "User not found",
      "Error Message must be equal to: User not found"
    );
  })
  .then(() => console.log("Test Passed - DELETE /api/users/:id"))
  .catch((err) => console.error("Test Failed - DELETE /api/users/:id ", err));

// Test for DELETE /api/users/:id
// Description: delete user by id
// Testcase: Invalid id
request(URL)
  .delete("/api/users/123")
  .set("Authorization", loginToken)
  .set("Content-Type", "application/json")
  .expect(400)
  .expect("Content-Type", "application/json")
  .expect((response) => {
    let res = response.body;

    assert.equal(typeof res, "object", "Response must contain an object");
    assert(res.hasOwnProperty("error"), "Response must contain an error field");
    assert.equal(
      res.error,
      "Invalid User ID format",
      "Error Message must be equal to: Invalid User ID format"
    );
  })
  .then(() => console.log("Test Passed - DELETE /api/users/:id"))
  .catch((err) => console.error("Test Failed - DELETE /api/users/:id ", err));

// Test for DELETE /api/users/:id
// Description: delete user by id
// Testcase: User Exists
request(URL)
  .delete("/api/users/67e2a5200f308865f384accc")
  .set("Authorization", loginToken)
  .set("Content-Type", "application/json")
  .expect(200)
  .expect("Content-Type", "application/json")
  .expect((res) => {
    assert.equal(typeof res.body, "object", "Response must contain an object");
    assert(res.body.hasOwnProperty("message"), "Body must contain message");
    assert.equal(
      res.body.message,
      "Successfully deleted one document.",
      "Message must be equal to: Successfully deleted one document."
    );
  })
  .then(() => {
    test_signup(
      {
        _id: "67e2a5200f308865f384accc",
        firstname: "deleteReadd",
        lastname: "deleteReadd",
        email: "deleteReadd@gmail.com",
        password: "deleteReadd",
      },
      201,
      { text: "User Created Successfully", type: "message" }
    );
  })
  .then(() => console.log("Test Passed - DELETE /api/users/:id"))
  .catch((err) => console.error("Test Failed - DELETE /api/users/:id ", err));

import { MongoClient } from "mongodb";

const URI = process.env.DB_URI || "";
const DB_NAME = process.env.DB_NAME;

const client = new MongoClient(URI);

try {
  // Connect the client to the server
  await client.connect();
  console.log(`Connected to the ${DB_NAME} database`);
} catch (err) {
  console.error(`Error connecting to the database: ${err}`);
}

const db = client.db(DB_NAME);

// 🛠 Handle graceful shutdown
process.on("SIGINT", async () => {
  await client.close();
  console.log("Database connection closed.");
  process.exit(0);
});

export default db;

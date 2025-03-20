import { MongoClient } from "mongodb";

const URI = process.env.DB_URI || "";
const dbname = process.env.DB_NAME;

const client = new MongoClient(URI);

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to the ${dbname} database`);
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  }
};

const insertOneDocument = async (db, obj, collectionName) => {
  try {
    const coll = db.collection(collectionName);
    const result = await coll.insertOne(obj);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  try {
    await connectToDatabase();

    const db = client.db(dbname);

    // await insertOneDocument(db, { name: "Fuck", email: "Fuck" }, "idk");
    const coll = db.collection("idk");
    const result = await coll.find().toArray();
    console.log(result);
  } catch (err) {
    console.error(`Error connecting to the database: ${err}`);
  } finally {
    await client.close();
  }
};

// Run the main function
main();

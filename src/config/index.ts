import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;
const database_url = process.env.DATABASE_URL;

export { port, database_url };

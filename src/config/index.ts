import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;
const database_url = process.env.DATABASE_URL;
const node_env = process.env.NODE_ENV;

export { port, database_url, node_env };

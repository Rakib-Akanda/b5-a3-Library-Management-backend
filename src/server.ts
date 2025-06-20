import { database_url, port } from "./config";
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";

let server: Server;

const bootstrap = async () => {
  try {
    await mongoose.connect(database_url!);
    console.log("✅ Connected to mongodb using mongoose");
    server = app.listen(port, () => {
      console.log(`✅ Library Server is Running on Port ${port}`);
    });
  } catch (error) {
    if (error) {
      console.log(console.log("❌ Error from bootstrap"));
    }
    console.log(error);
  }
};
bootstrap();

import { Server } from "http";
import app from "./app";
import { port } from "./config";

let server: Server;

const bootstrap = async () => {
  try {
    server = app.listen(port, () => {
      console.log(`✅ Mango Server is running on port ${port}`);
    });
  } catch (error) {
    if (error) {
      console.log(console.log("❌ Error from bootstrap"));
    }
    console.log(error);
  }
};
bootstrap();

import { database_url, port } from "./config";
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";

let server: Server;

const bootstrap = async () => {
  try {
    // DB Connect
    await mongoose.connect(database_url!);
    console.log("✅ Connected to mongodb using mongoose");
    // Start Server
    server = app.listen(port, () => {
      console.log(`✅ Library Server is Running on Port ${port}`);
    });

    // os signal handlers
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    if (error) {
      console.log("❌ Error from bootstrap");
    }
    console.log(error);
  }
};

export let isShuttingDown = false;

const gracefulShutdown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log("🚨 Shutting down gracefully…");

  try {
    /* --- HTTP server --- */
    if (server) {
      // Log active connections before closing
      server.getConnections((err, count) => {
        if (!err) {
          console.log(`🧪 Active connections before shutdown: ${count}`);
        }
      });
      const closeServer = new Promise<void>((res, rej) =>
        server.close((err) => (err ? rej(err) : res())),
      );

      await Promise.race([
        closeServer,
        new Promise<void>((_, rej) =>
          setTimeout(() => rej(new Error("HTTP close timeout")), 10000),
        ),
      ]);
      console.log("✅ HTTP server closed");
    }
    /* --- Mongo --- */
    console.log("⏳ Closing Mongo connection…");

    switch (mongoose.connection.readyState) {
      case 0:
        console.log("🔴 DB: Disconnected");
        break;
      case 1:
        console.log("🟢 DB: Connected");
        break;
      case 2:
        console.log("🟡 DB: Connecting...");
        break;
      case 3:
        console.log("🔵 DB: Disconnecting...");
        break;
    }
    if (mongoose.connection.readyState !== 0) {
      await Promise.race([
        mongoose.connection.close(false), // don't force close
        new Promise<void>((_, rej) =>
          setTimeout(() => rej(new Error("MongoDB close timeout")), 10000),
        ),
      ]);
      console.log("✅ MongoDB connection closed");
    } else {
      console.log("⚠️ MongoDB already disconnected");
    }

    // —— এখনই exit না করে exitCode সেট করুন ——
    process.exitCode = 0; // <-- key change
  } catch (err) {
    console.error("❌ Error during graceful shutdown:", err);
    process.exitCode = 1;
  }
};

// Start the application
bootstrap();

// extra safety net for unhandled errors
// async error holeo process বাঁচানোর জন্য
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  gracefulShutdown();
});
// extra safety net for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown();
});

// async function shutdown() {
//   await gracefulShutdown();
// }
// // shutdown();

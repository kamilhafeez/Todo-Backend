import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import cors from "cors";

import connectDB from "./db";
import todoRoutes from "./routes/todoRoutes";

async function main() {
  await connectDB();

  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(cors({ origin: true, credentials: true }));
  app.use(bodyParser.json());

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
      }),
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    })
  );

  app.use("/api/todos", todoRoutes);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();

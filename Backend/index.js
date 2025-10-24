import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import db from "./config/database.js";
import "./models/UserModel.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(userRoute);

const startServer = async () => {
  try {
    await db.sync();
    console.log("Database synced successfully.");
    app.listen(5000, () => console.log("Server up"));
  } catch (error) {
    console.error("Failed to sync database:", error);
  }
};

startServer();

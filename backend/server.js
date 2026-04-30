import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import { inngestMiddleware } from "./inngest/index.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/inngest", inngestMiddleware);
app.use("/api", routes);

app.get("/", (_, res) => res.send("EMS API Running"));

const PORT = process.env.PORT || 5000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
);

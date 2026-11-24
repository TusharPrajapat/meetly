import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api", router);

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
        status: "ok",
        message: "Meetly API running"
    });
});

export default app;
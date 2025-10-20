import express, { Request, Response } from "express";
import cors from "cors";
import { createClient } from "pexels";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const client = createClient("V7N9EKJSDh4K8SqpS9SB19WGoGmgA9BiaBa3ddUHwbe7wBBW3hQlLrfp");

/** Rutas */
app.get("/", (_req, res) => res.send("Server running on Vercel"));

app.get("/videos/popular", async (_req: Request, res: Response) => {
  try {
    const data = await client.videos.popular({ per_page: 3 });
    res.json(data.videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch popular videos" });
  }
});

/** Exporta el handler para Vercel */
export default app;

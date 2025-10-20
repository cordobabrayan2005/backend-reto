import express, { Request, Response } from "express";
import cors from "cors";
import { createClient } from "pexels";
import serverless from "serverless-http";

const app = express();
const client = createClient("V7N9EKJSDh4K8SqpS9SB19WGoGmgA9BiaBa3ddUHwbe7wBBW3hQlLrfp");

app.use(cors());
app.use(express.json());

app.get("/videos/popular", async (_req: Request, res: Response) => {
  try {
    const data = await client.videos.popular({ per_page: 3 });
    res.json(data.videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch popular videos" });
  }
});

app.get("/", (_req, res) => {
  res.send("✅ Backend corriendo correctamente en Vercel");
});

export const handler = serverless(app);
export default handler;

import express, { Request, Response } from "express";
import cors from "cors";
import { createClient } from "pexels";
import "dotenv/config";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const client = createClient("V7N9EKJSDh4K8SqpS9SB19WGoGmgA9BiaBa3ddUHwbe7wBBW3hQlLrfp");

app.use(cors());
app.use(express.json());

/** GET /videos/popular */
app.get("/videos/popular", async (_req: Request, res: Response) => {
  try {
    const data = await client.videos.popular({ per_page: 3 });
    res.json(data.videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch popular videos" });
  }
});

/** GET /peliculas - Alias for popular videos in Spanish */
app.get("/peliculas", async (_req: Request, res: Response) => {
  try {
    const data = await client.videos.popular({ per_page: 3 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch popular videos" });
  }
});

/** GET /videos/search?query=word&terms=term1,term2,term3 */
app.get("/videos/search", async (req: Request, res: Response) => {
  const query = req.query.query as string;
  const terms = req.query.terms as string;
  const per_page = Number(req.query.per_page) || 3;

  // Validate that at least one parameter is present
  if (!query && !terms) {
    return res.status(400).json({ 
      error: "Either 'query' or 'terms' parameter is required" 
    });
  }

  try {
    let searchQuery = "";

    if (query && terms) {
      // If both are present, combine them
      const termsArray = terms.split(",").map(term => term.trim()).filter(Boolean);
      searchQuery = `${query} ${termsArray.join(" ")}`;
    } else if (terms) {
      // Multiple terms only
      const termsArray = terms.split(",").map(term => term.trim()).filter(Boolean);
      if (termsArray.length === 0) {
        return res.status(400).json({ error: "Invalid terms format" });
      }
      searchQuery = termsArray.join(" ");
    } else {
      // Simple query only
      searchQuery = query;
    }

    const data = await client.videos.search({ 
      query: searchQuery, 
      per_page: Math.min(per_page, 80) // Limit to maximum 80 as allowed by Pexels
    });
    
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search videos" });
  }
});

/** GET /videos/:id */
app.get("/videos/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid video ID" });

  try {
    const video = await client.videos.show({ id });
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch video by ID" });
  }
});

/** Healthcheck */
app.get("/", (_req, res) => {
  res.send("Server running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

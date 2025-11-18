import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import NodeCache from "node-cache";

const app = express();
const cache = new NodeCache({ stdTTL: 60 }); // cache 60s

app.use(cors()); // permite CORS para frontend local

app.get("/api/coingecko", async (req, res) => {
  try {
    const { path, ...params } = req.query;

    if (!path || typeof path !== "string") {
      return res.status(400).json({ error: "Missing 'path' query param" });
    }

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === "string") query.append(key, value);
    });

    const finalURL = `https://api.coingecko.com/api/v3/${path}${
      query.toString() ? `?${query.toString()}` : ""
    }`;

    // Revisar cache
    const cached = cache.get(finalURL);
    if (cached) return res.json(cached);

    const response = await fetch(finalURL, { headers: { accept: "application/json" } });
    const text = await response.text();

    if (!text.startsWith("{") && !text.startsWith("[")) {
      return res.status(500).json({ error: "Upstream returned non-JSON", upstream: text.slice(0, 200) });
    }

    const data = JSON.parse(text);
    cache.set(finalURL, data); // guardar en cache
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err?.toString() });
  }
});

app.listen(5000, () => console.log("API proxy running on http://localhost:5000"));

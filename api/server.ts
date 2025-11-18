import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { path, ...params } = req.query;

    if (!path || typeof path !== 'string') {
      return res.status(400).json({ error: "Missing required 'path' query param" });
    }

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'string') query.append(key, value);
    });

    const finalURL = `https://api.coingecko.com/api/v3/${path}${query.toString() ? `?${query}` : ''}`;

    const response = await fetch(finalURL, { headers: { accept: 'application/json' } });
    const text = await response.text();

    if (!text.startsWith('{') && !text.startsWith('[')) {
      return res.status(500).json({ error: 'CoinGecko returned non-JSON', upstream: text.slice(0, 200) });
    }

    const data = JSON.parse(text);
    return res.status(response.status).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.toString() });
  }
}

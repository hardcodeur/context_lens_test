import express, { Request, Response } from 'express';
import {searchWithTavily} from "./api/tavilyApi";
import path from 'path';
import cache from "memory-cache";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";


const app = express();
const PORT = 3000;

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 100, // 100 req
  message: "Trop de requêtes, réessayez plus tard"
});

app.use(cors());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "img-src": ["'self'", "data:", "https://daryl-ai.com"]
    }
  }
}));
app.use(rateLimiter);

app.use(express.static('public'));

app.get('/',(req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/api/graph', async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string;
        
        if (!q) {
            res.status(400).json({ error:'Paramètre "q" obligatoire'});
            return;
        }

        const query = q.trim();
        const cached = cache.get(query);

        if (cached) {
            res.json(cached);
            return;
        }

        const data = await searchWithTavily(query);
        cache.put(query, data, 900000); // 15 min de cache
        res.json(data);

    } catch (err) {
        console.error('Erreur API:', err);
        res.status(500).send({ error:'Erreur interne du serveur'});
    }
});


app.listen(PORT);
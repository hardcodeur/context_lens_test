"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tavilyApi_1 = require("./api/tavilyApi");
const path_1 = __importDefault(require("path"));
const memory_cache_1 = __importDefault(require("memory-cache"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
const PORT = 3000;
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 min
    limit: 100, // 100 req
    message: "Trop de requêtes, réessayez plus tard"
});
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            "img-src": ["'self'", "data:", "https://daryl-ai.com"]
        }
    }
}));
app.use(rateLimiter);
app.use(express_1.default.static('public'));
app.get('/', (res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
app.get('/api/graph', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const q = req.query.q;
        if (!q) {
            res.status(400).json({ error: 'Paramètre "q" obligatoire' });
            return;
        }
        const query = q.trim();
        const cached = memory_cache_1.default.get(query);
        if (cached) {
            res.json(cached);
            return;
        }
        const data = yield (0, tavilyApi_1.searchWithTavily)(query);
        memory_cache_1.default.put(query, data, 900000); // 15 min de cache
        res.json(data);
    }
    catch (err) {
        console.error('Erreur API:', err);
        res.status(500).send({ error: 'Erreur interne du serveur' });
    }
}));
app.listen(PORT);

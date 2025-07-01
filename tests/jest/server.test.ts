import request from 'supertest';
import express from 'express';
import { searchWithTavily } from '../../src/api/tavilyApi';
import cache from 'memory-cache';

// Mock des dépendances
jest.mock('../../src/api/tavilyApi', () => ({
  searchWithTavily: jest.fn(),
  parseTavilyToGraphResponse: jest.fn()
}));

jest.mock('memory-cache', () => ({
  get: jest.fn(),
  put: jest.fn()
}));

const mockedSearchWithTavily = searchWithTavily as jest.MockedFunction<typeof searchWithTavily>;
const mockedCache = cache as jest.Mocked<typeof cache>;

function createTestApp() {
  const app = express();
  
  app.get('/api/graph', async (req, res) => {
    try {
      const q = req.query.q as string;
      
      if (!q) {
        res.status(400).json({ error: 'Paramètre "q" obligatoire' });
        return;
      }

      const query = q.trim();
      const cached = mockedCache.get(query);

      if (cached) {
        res.json(cached);
        return;
      }

      const data = await mockedSearchWithTavily(query);
      if (!data) {
        throw new Error('No data from Tavily');
      }
      
      mockedCache.put(query, data, 900000);
      res.json(data);
    } catch (err) {
      console.error('Erreur API:', err);
      res.status(500).send({ error: 'Erreur interne du serveur' });
    }
  });

  return app;
}

describe('API Graph Endpoint', () => {
  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = createTestApp();
  });

  test('should return 400 when q parameter is missing', async () => {
    const response = await request(app).get('/api/graph');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Paramètre "q" obligatoire' });
  });

  test('should return cached data when available', async () => {
    const testQuery = 'cached query';
    const cachedData = {
      main_node: { id: 0, label: testQuery },
      nodes: []
    };
    
    mockedCache.get.mockReturnValueOnce(cachedData);
    
    const response = await request(app).get(`/api/graph?q=${testQuery}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(cachedData);
    expect(mockedCache.get).toHaveBeenCalledWith(testQuery);
    expect(mockedSearchWithTavily).not.toHaveBeenCalled();
  });

  test('should call Tavily API when no cache is available', async () => {
    const testQuery = 'new query';
    const apiResponse = {
      main_node: { id: 0, label: testQuery },
      nodes: [
        { id: 1, label: 'Test', url: 'https://test.com', content: 'Test content' }
      ]
    };
    
    mockedCache.get.mockReturnValueOnce(null);
    mockedSearchWithTavily.mockResolvedValueOnce(apiResponse);
    
    const response = await request(app).get(`/api/graph?q=${testQuery}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(apiResponse);
    expect(mockedCache.get).toHaveBeenCalledWith(testQuery);
    expect(mockedSearchWithTavily).toHaveBeenCalledWith(testQuery);
    expect(mockedCache.put).toHaveBeenCalledWith(testQuery, apiResponse, 900000);
  });

});
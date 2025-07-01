import { searchWithTavily } from '../../src/api/tavilyApi';
import { tavily } from '@tavily/core';

jest.mock('@tavily/core', () => ({
  tavily: jest.fn().mockReturnValue({
    search: jest.fn(),
  }),
}));


const mockTvlyInstance = {
  search: jest.fn(),
};
const mockedTavily = tavily as jest.Mock;
mockedTavily.mockReturnValue(mockTvlyInstance);


describe('Tavily API Functions', () => {

  // Clear 
  beforeEach(() => {
    mockTvlyInstance.search.mockClear();
    mockedTavily.mockClear();
    mockedTavily.mockReturnValue(mockTvlyInstance);
  });

  describe('searchWithTavily', () => {
    it('should call the Tavily search and parse the response', async () => {
      const query = 'test query';
      const mockApiResponse = {
        query: query,
        results: [
          { title: 'Result 1', url: 'http://example.com/1', content: 'Content 1' },
          { title: 'Result 2', url: 'http://example.com/2', content: 'Content 2' },
        ],
      };
      
      mockTvlyInstance.search.mockResolvedValue(mockApiResponse);

      const result = await searchWithTavily(query);

      expect(mockedTavily).toHaveBeenCalledWith({ apiKey: process.env.TAVILY_API_KEY });
      expect(mockTvlyInstance.search).toHaveBeenCalledWith(query);

      expect(result).toEqual({
        main_node: {
          id: 0,
          label: query,
        },
        nodes: [
          { id: 1, label: 'Result 1', url: 'http://example.com/1', content: 'Content 1' },
          { id: 2, label: 'Result 2', url: 'http://example.com/2', content: 'Content 2' },
        ],
      });
    });
  });
});
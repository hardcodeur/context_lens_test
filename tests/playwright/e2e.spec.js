import { test, expect } from '@playwright/test';

test.describe('Live Search Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test('should display the graph with API data', async ({ page }) => {
    const searchQuery = 'what is artificial intelligence?';

    // 1. Fill the search input and click the search button
    await page.fill('input[name="search"]', searchQuery);
    await page.click('#btnSearch');

    // 2. Wait for the graph component to be visible
    const graphComponent = page.locator('#graphComponent');
    await expect(graphComponent).toBeVisible({ timeout: 15000 }); // Increased timeout for live API call

    // 3. Verify that the graph component has received data
    // We check that the 'data-graphe' attribute is not empty.
    const graphData = await graphComponent.getAttribute('data-graphe');
    expect(graphData).not.toBeNull();
    expect(graphData).not.toBe('');

    // 4. Parse the data and perform some basic checks
    if (graphData) {
      const parsedData = JSON.parse(graphData);
      
      // Check that the main node's label matches the query
      expect(parsedData.main_node.label).toBe(searchQuery);
      
      // Check that there are result nodes
      expect(parsedData.nodes.length).toBeGreaterThan(0);

      // Optional: Check for a specific node's properties
      const firstNode = parsedData.nodes[0];
      expect(firstNode).toHaveProperty('id');
      expect(firstNode).toHaveProperty('label');
      expect(firstNode).toHaveProperty('url');
      expect(firstNode).toHaveProperty('content');
    }
  });
});
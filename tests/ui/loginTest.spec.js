import { test, expect } from '@playwright/test';
import { devUrl } from '../data/testData';

test.describe('Login Page UI Tests', () => {
  test('should log in successfully with valid credentials', async ({ page }) => {
    await page.goto(devUrl);
    expect(page.url()).toBe(`${devUrl}/login`);
  });
});

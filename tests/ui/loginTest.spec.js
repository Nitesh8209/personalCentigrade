import { test, expect } from '@playwright/test';
import { API_BASE_URL } from '../data/testData';

test.describe('Login Page UI Tests', () => {
  test('should log in successfully with valid credentials', async ({ page }) => {
    await page.goto(API_BASE_URL);
    expect(page.url()).toBe(`${API_BASE_URL}/login`);
  });
});

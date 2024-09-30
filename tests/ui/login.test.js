const { test, expect } = require('@foundryTest/tests');
const LoginPage = require('../pages/loginPage');

test.describe('Login Page UI Tests', () => {
  test('should log in successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto('https://devfoundry.centigrade.earth');
    await loginPage.enterUsername('prithika.sujith@kreeti.com');
    await loginPage.enterPassword('Welcome@123');
    await loginPage.submitLogin();
    expect(await page.url()).toBe('https://devfoundry.centigrade.earth/projects');
  });

  test('should show an error message with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto('https://devfoundry.centigrade.earth/login');
    await loginPage.enterUsername('invalid_user');
    await loginPage.enterPassword('wrong_password');
    await loginPage.submitLogin();
    expect(await page.textContent('.error')).toContain('Invalid credentials');
  });

  test('should have a visible "Forgot Password" link', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto('https://devfoundry.centigrade.earth/login');
    expect(await page.isVisible('a.forgot-password')).toBe(true);
  });
});

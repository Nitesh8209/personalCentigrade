import { test, expect } from '@playwright/test';
import { Credentials } from '../../data/testData';
import { LoginPage } from "../../../pages/loginPage";

test.describe('Login Page UI Tests', { tag: ['@loginUi', '@UI'] }, () => {

  let loginPage;
  let page;

  test.beforeAll(async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page, baseURL);

    // Navigate to the login page
    await loginPage.navigate();
  });

  // Close the browser page after all tests are complete
  test.afterAll(async () => {
    await page.close();
  });

  // Test for checking if login page elements are displayed correctly
  test('should display login page elements correctly', async () => {

    // Check various sections of the login page
    await expect.soft(loginPage.heroSection).toBeVisible();
    await expect.soft(loginPage.contentSection).toBeVisible();
    await expect.soft(loginPage.firstImage).toBeVisible();
    await expect.soft(loginPage.centigradeLogoImage).toBeVisible();
    await expect.soft(loginPage.welcomeHeading).toBeVisible();
    await expect.soft(loginPage.loginInstruction).toBeVisible();
    await expect.soft(loginPage.agreementText).toBeVisible();
    await expect.soft(loginPage.emailInput).toBeVisible();
    await expect.soft(loginPage.passwordInput).toBeVisible();

    await expect.soft(loginPage.forgotPasswordLink).toBeVisible();
    await expect.soft(loginPage.tosLinkInLogin).toBeVisible();
    await expect.soft(loginPage.privacyLinkInLogin).toBeVisible();
    await expect.soft(loginPage.loginButton).toBeVisible();
    await expect.soft(loginPage.createAccountLink).toBeVisible();
    await expect.soft(loginPage.forgotPasswordLink).toBeEnabled();
    await expect.soft(loginPage.tosLinkInLogin).toBeEnabled();
    await expect.soft(loginPage.privacyLinkInLogin).toBeEnabled();
    await expect.soft(loginPage.loginButton).toBeEnabled();
    await expect.soft(loginPage.createAccountLink).toBeEnabled();

    expect.soft(page.url()).toBe(`${loginPage.baseURL}/login`);
    expect.soft(await page.title()).toBe('Centigrade');

    expect(await page.screenshot()).toMatchSnapshot({
      name: 'Login.png',
      omitPlatformRegex: true,
      maxDiffPixelRatio: 0.02
    });
  });

  test('should navigate to Terms of Service in new tab', async () => {

    // Verify navigation for Terms of Service link
    const [newTab] = await Promise.all([
      page.waitForEvent('popup'),
      await loginPage.clickTos(),
    ]);
    await expect.soft(newTab).toHaveURL(/\/terms-of-service/);

    await newTab.close();
  });

  test('should navigate to Privacy Policy in new tab', async () => {
    
    // Verify navigation for Privacy Policy link
    const [newTab] = await Promise.all([
      page.waitForEvent('popup'),
      await loginPage.clickPrivacyPolicy(),
    ]);
    await expect.soft(newTab).toHaveURL(/\/privacy/);
    await newTab.close();
  });

  test('Login with Invalid Password Credential', async () => {

    // Use the login method to attempt logging in with invalid Password
    await loginPage.login(Credentials.username, Credentials.invalidPassword)

    // Validate that the error message is displayed for invalid login
    const getErrorMessage = await loginPage.getErrorMessage();
    expect(getErrorMessage).toBe('Unable to log in because the email or password is not correct');
    expect(page.url()).toBe(`${loginPage.baseURL}/login`);

    // Capture a screenshot for visual verification of the invalid login attempt
    expect(await page.screenshot()).toMatchSnapshot({
      name: 'invalidLogin.png',
      omitPlatformRegex: true,
      maxDiffPixelRatio: 0.02
    });
  });

  test('Login with Invalid username Credential', async () => {

    // Use the login method to attempt logging in with invalid userName
    await loginPage.login(Credentials.invalidUsername, Credentials.password)

    // Validate that the error message is displayed for invalid login
    const getErrorMessage = await loginPage.getErrorMessage();
    expect(getErrorMessage).toBe('Unable to log in because the email or password is not correct');
    expect(page.url()).toBe(`${loginPage.baseURL}/login`);
  })

  test('Should Successfully Login with valid Credentials', { tag: '@SMOKE' }, async () => {

    // Use the login method to attempt logging in with valid credentials
    await loginPage.login(Credentials.username, Credentials.password)

    // Validate that the URL is redirected to the projects page after a successful login
    await page.waitForURL('**/projects');
    await expect(page).toHaveURL(`${loginPage.baseURL}/projects`);
  })

});

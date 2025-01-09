import { test, expect } from '@playwright/test';
import { Credentials } from '../../data/testData';
import { LoginPage } from "../../../pages/loginPage";

test.describe('Login Page UI Tests', () => {

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
    await loginPage.leftSidebar();
    await loginPage.rightSidebar();
    await loginPage.images();
    await loginPage.text();
    await loginPage.input();
    await loginPage.loginbutton();

    // Verify the login page elements and their content
    const forgotPassword = await loginPage.forgotPassword();
    const createAccount = await loginPage.createAccount();
    const loginButton = await loginPage.loginbutton();
    const toS = await loginPage.toS();
    const privacyPolicy = await loginPage.privacyPolicy();

    // validate the visibility of login page
    expect(forgotPassword).toBeVisible();
    expect(createAccount).toBeVisible();
    expect(loginButton).toBeVisible();
    expect(toS).toBeVisible();
    expect(privacyPolicy).toBeVisible();
    expect(page.url()).toBe(`${loginPage.baseURL}/login`);

    // Verify navigation for Terms of Service link
    const [newTab1] = await Promise.all([
      page.waitForEvent('popup'),
      toS.click(),
    ]);
    await expect(newTab1).toHaveURL(/\/terms-of-service/);

    // Verify navigation for Privacy Policy link
    const [newTab2] = await Promise.all([
      page.waitForEvent('popup'),
      privacyPolicy.click(),
    ]);
    await expect(newTab2).toHaveURL(/\/privacy/);

    expect(await page.screenshot()).toMatchSnapshot({
      name: 'Login.png',
      omitPlatformRegex: true,
      maxDiffPixelRatio: 0.02
    });
  });

  test('Login with Invalid Credentials', async () => {

    // Use the login method to attempt logging in with invalid credentials
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
  })


  test('Should Successfully Login with vaild Credentials', async () => {

    // Use the login method to attempt logging in with valid credentials
    await loginPage.login(Credentials.username, Credentials.password)

    // Validate that the URL is redirected to the projects page after a successful login
    await page.waitForURL('**/projects');
    await expect(page).toHaveURL(`${loginPage.baseURL}/projects`);
  })

});

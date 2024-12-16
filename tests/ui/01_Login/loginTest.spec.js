import { test, expect } from '@playwright/test';
import { API_BASE_URL, Credentials } from '../../data/testData';
import { LoginPage } from "../../../pages/loginPage";

test.describe('Login Page UI Tests', () => {

  // Test for checking if login page elements are displayed correctly
  test('should display login page elements correctly', async ({ page, baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);
    await loginPage.navigate();
    await loginPage.leftSidebar();
    await loginPage.rightSidebar();
    await loginPage.images();
    await loginPage.text();
    await loginPage.input();
    await loginPage.loginbutton();

    // Verify the login page elements and their content
    const forgotPassword = await loginPage.forgotPassword();
    const createAccount = await loginPage.forgotPassword();
    const loginButton = await loginPage.loginbutton();
    const toS = await loginPage.toS();
    const privacyPolicy = await loginPage.privacyPolicy();

    // validate the visibility of login page
    expect(forgotPassword).toBeVisible();
    expect(createAccount).toBeVisible();
    expect(loginButton).toBeVisible();
    expect(toS).toBeVisible();
    expect(privacyPolicy).toBeVisible();
    expect(page.url()).toBe(`${baseURL}/login`);

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

  test('Login with Invalid Creadential', async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.enterEmail(Credentials.username);
    await loginPage.enterPassword(Credentials.invalidPassword);
    await loginPage.submit();

    // Validate that the error message is displayed for invalid login
    const getErrorMessage = await loginPage.getErrorMessage();
    expect(getErrorMessage).toBe('Unable to log in because the email or password is not correct');
    expect(page.url()).toBe(`${baseURL}/login`);

    // Capture a screenshot for visual verification of the invalid login attempt
    expect(await page.screenshot()).toMatchSnapshot({
      name: 'invalidLogin.png',
      omitPlatformRegex: true,
      maxDiffPixelRatio: 0.02
    });
  })


  test('Should Successfully Login with vaild creadential', async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.enterEmail(Credentials.username);
    await loginPage.enterPassword(Credentials.password);
    await loginPage.submit();

    // Validate that the URL is redirected to the projects page after a successful login
    await expect(page).toHaveURL(`${baseURL}/projects`);
  })

});

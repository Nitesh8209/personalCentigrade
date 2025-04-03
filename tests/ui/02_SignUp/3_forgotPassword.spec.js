import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import { SignUpPage } from '../../../pages/signUpPage';
import { inValidTestData } from '../../data/SignUpData';
import API_ENDPOINTS from '../../../api/apiEndpoints';
 
test.describe('Forgot password Page UI Tests', {tag: '@UI'}, () => {
  let page;

  // Setup: Generate a new email before all tests
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    });

   // Close the browser page after all tests are complete
   test.afterAll(async () => {
    await page.close();
  });

  test('Should display Forgot Password page elements and validate functionality', async ({ baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);

    // Navigate to the login page
    await loginPage.navigate();

    const forgotPassword = await loginPage.forgotPassword();
    await forgotPassword.click();

    // Verify the modal and content elements on the Forgot Password page
    await loginPage.forgotPasswordModal();
    await loginPage.forgotPasswordHeading();

    const forgotPasswordContent = await loginPage.forgotPasswordcontent();
    const forgotPasswordContentText = await forgotPasswordContent.innerText();
    const forgotPasswordInput = await loginPage.forgotPasswordInput();
    const forgotPasswordhelper = await loginPage.forgotPasswordhelper();
    const forgotPasswordhelperText = await forgotPasswordhelper.innerText();
    const forgotPasswordSend = await loginPage.forgotPasswordSend();
    const forgotPasswordBack = await loginPage.forgotPasswordBack();

    // Assert the elements' visibility and their text/content
    expect(forgotPasswordContent).toBeVisible();
    expect(forgotPasswordContentText).toBe("Enter the email address associated with your account and we'll send you an email with instructions and a link to create a new password")
    expect(forgotPasswordInput).toBeVisible();
    expect(forgotPasswordhelper).toBeVisible();
    expect(forgotPasswordhelperText).toBe("Enter the email you use to log in to Centigrade");
    expect(forgotPasswordSend).toBeVisible();
    expect(forgotPasswordBack).toBeVisible();

    // Verify the URL after navigating to the Forgot Password page
    expect(page.url()).toBe(`${baseURL}/send-email-link`);

    // Take a screenshot to compare the UI visually
    expect(await page.screenshot()).toMatchSnapshot({
      name: 'ForgotPassword.png',
      omitPlatformRegex: true,
      maxDiffPixelRatio: 0.02
    });

  })

  // Test for requesting a password reset with an invalid email format
  test('Request Password Reset with Invalid Email Format', async ({ baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);
    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to login page and perform forgot password flow
    await loginPage.navigate();
    await signUpPage.forgotPassword();
    await signUpPage.forgotPasswordEmail(inValidTestData.InvalidEmail);
    await signUpPage.forgotPasswordSend();

    // Wait for the response and verify email message elements
    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.resetEmail) && response.status() === 404
    );

    const CheckEmail = await signUpPage.checkEmail();
    const checkEmailMessage = await signUpPage.checkEmailMessage();
    const loginButton = await signUpPage.backToLoginButton();

    // Assert email message content
    await expect(CheckEmail).toBe('Check your email');
    await expect(checkEmailMessage).toBe(`If ${inValidTestData.InvalidEmail} is registered with Centigrade, we will send an email with instructions on how to reset your password`);
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    await expect(page).toHaveURL(`${baseURL}/login`);
  })

});

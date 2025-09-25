import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import { SignUpPage } from '../../../pages/signUpPage';
import { inValidTestData } from '../../data/SignUpData';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { ForgotPasswordPage } from '../../../pages/forgotPasswordPage';
 
test.describe('Forgot password Page UI Tests', { tag: '@UI' }, () => {
    let page;
    let loginPage;
    let forgotPasswordPage;
    let signUpPage;

  // Setup: Generate a new email before all tests
  test.beforeAll(async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    
    page = await context.newPage();
    loginPage = new LoginPage(page, baseURL);
    forgotPasswordPage = new ForgotPasswordPage(page, baseURL);
    signUpPage = new SignUpPage(page, baseURL);

    await loginPage.navigate();
    await loginPage.acceptAll();  
    });

   // Close the browser page after all tests are complete
   test.afterAll(async () => {
    await page.close();
  });

  test('Should display Forgot Password page elements and validate functionality', async ({ baseURL }) => {

    await loginPage.clickForgotPassword()

    // Verify the modal and content elements on the Forgot Password page
    await expect.soft(forgotPasswordPage.forgotPasswordModal).toBeVisible();
    await expect.soft(forgotPasswordPage.forgotPasswordHeading).toBeVisible();

    // Assert the elements' visibility and their text/content
    await expect.soft(forgotPasswordPage.forgotPasswordContent).toBeVisible();
    await expect.soft(forgotPasswordPage.forgotPasswordContent).toHaveText("Enter the email address associated with your account and we'll send you an email with instructions and a link to create a new password")
    await expect.soft(forgotPasswordPage.forgotPasswordEmailInput).toBeVisible();
    await expect.soft(forgotPasswordPage.forgotPasswordHelper).toBeVisible();
    await expect.soft(forgotPasswordPage.forgotPasswordHelper).toHaveText("Enter the email you use to log in to Centigrade");
    await expect.soft(forgotPasswordPage.forgotPasswordSendButton).toBeVisible();
    await expect.soft(forgotPasswordPage.forgotPasswordBackLink).toBeVisible();

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

    await loginPage.clickForgotPassword();
    await forgotPasswordPage.resetPassword(inValidTestData.InvalidEmail);

    // Wait for the response and verify email message elements
    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.resetEmail) && response.status() === 404
    );

    const CheckEmail = await signUpPage.checkEmail();
    const checkEmailMessage = await signUpPage.checkEmailMessage();

    // Assert email message content
    await expect(CheckEmail).toBe('Check your email');
    await expect(checkEmailMessage).toBe(`If ${inValidTestData.InvalidEmail} is registered with Centigrade, we will send an email with instructions on how to reset your password`);
    await expect(forgotPasswordPage.backToLoginAfterReset).toBeVisible();
    await forgotPasswordPage.clickBackToLogin();
    await expect(page).toHaveURL(`${baseURL}/login`);
  });

});

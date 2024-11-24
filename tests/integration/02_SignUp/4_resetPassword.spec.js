import { test, expect } from "@playwright/test";
import { SignUpPage } from "../../../pages/signUpPage";
import { getData } from "../../utils/apiHelper";
import { getGmailMessages } from "../../utils/signUpHelper";
import API_ENDPOINTS from "../../../api/apiEndpoints";
import { inValidTestData, ValidTestData } from "../../data/SignUpData";
import { LoginPage } from "../../../pages/loginPage";
import { Credentials } from "../../data/testData";


test.describe('Password Reset Flow', () => {
  const { newEmail } = getData('Integration');
  let temporaryPassword;
  let resetPasswordLink;

  // Test for Request password reset with a valid registered email
  test('Request password reset with a valid registered email', async ({ page }) => {

    const signUpPage = new SignUpPage(page);
    const loginPage = new LoginPage(page);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await signUpPage.forgotPassword();
    await signUpPage.forgotPasswordEmail(newEmail);
    await signUpPage.forgotPasswordSend();

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.resetEmail)
    );
    const responseBody = await response.json();
    expect(response.status()).toBe(200);
    expect(responseBody).toHaveProperty('message', `password reset email sent to member ${newEmail} status set to COGNITO_CONFIRMED`);

    const CheckEmail = await signUpPage.checkEmail();
    await expect(CheckEmail).toBe('Check your email');
    const checkEmailMessage = await signUpPage.checkEmailMessage();
    await expect(checkEmailMessage).toBe(`If ${newEmail} is registered with Centigrade, we will send an email with instructions on how to reset your password`)
    const loginButton = await signUpPage.backToLoginButton();
    await expect(loginButton).toBeVisible();

    const { body, subject } = await getGmailMessages();
    expect(subject).toBe('Centigrade password reset request');

    // Extract temporary password and reset link using regex
    const tempPasswordMatch = body.match(/Your temporary password:\s+([^\s]+)/);
    const resetLinkMatch = body.match(/Reset password \[(https:\/\/[^\]]+)\]/);
    const tempPassword = tempPasswordMatch[1];
    resetPasswordLink = resetLinkMatch[1];  //store the resetPasswordLink
    expect(tempPassword).toBeDefined();
    expect(resetPasswordLink).toContain('https://devfoundry.centigrade.earth/reset');

    temporaryPassword = tempPassword;    //store the temporary password
  })


  // Test for Request Password Reset with Invalid Email Format
  test(`Request Password Reset with Invalid Email Format`, async ({ page }) => {

    const signUpPage = new SignUpPage(page);
    const loginPage = new LoginPage(page);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await signUpPage.forgotPassword();
    await signUpPage.forgotPasswordEmail(inValidTestData.InvalidEmail);
    await signUpPage.forgotPasswordSend();

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.resetEmail)
    );
    const responseBody = await response.json();

    // Validate response for detailed error response Member not found
    expect(response.status()).toBe(404);
    expect(responseBody).toHaveProperty('errorType', 'MODEL_NOT_FOUND');
    expect(responseBody).toHaveProperty('errorMessage', 'member with email not found');

    const CheckEmail = await signUpPage.checkEmail();
    await expect(CheckEmail).toBe('Check your email');
    const checkEmailMessage = await signUpPage.checkEmailMessage();
    await expect(checkEmailMessage).toBe(`If ${inValidTestData.InvalidEmail} is registered with Centigrade, we will send an email with instructions on how to reset your password`)
    const loginButton = await signUpPage.backToLoginButton();
    await expect(loginButton).toBeVisible();
  })

  // Test for Successful Password Reset with Mandatory Fields
  test('Successful Password Reset with Mandatory Fields', async ({ page }) => {
    const signUpPage = new SignUpPage(page);

    await page.goto(resetPasswordLink);
    await signUpPage.tempPasswordInput(temporaryPassword);
    await signUpPage.newPasswordInput(ValidTestData.newPassword);
    await signUpPage.submit();

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.resetPassword)
    );
    const responseBody = await response.json();

    // Validate response for successful password reset
    expect(response.status()).toBe(200);
    expect(responseBody).toHaveProperty('message', `password updated for member ${newEmail}`);

    const SuccessMessage = await signUpPage.passordSuccessMessage();
    await expect(SuccessMessage).toBe('Your password was reset successfully');
    const SuccessLoginMessage = await signUpPage.passordSuccessLoginMessage();
    await expect(SuccessLoginMessage).toBe('Use your new password to log in to your Centigrade account')
    const loginButton = await signUpPage.login();
    await expect(loginButton).toBeVisible();
  })

  // Test for password reset with an invalid temporary password
  test('Password Reset with Invalid Temporary Password', async ({ page }) => {
    const signUpPage = new SignUpPage(page);

    await page.goto(resetPasswordLink);
    await signUpPage.tempPasswordInput(ValidTestData.InvalidPassword);
    await signUpPage.newPasswordInput(ValidTestData.newPassword);
    await signUpPage.submit();


    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.resetPassword)
    );
    const responseBody = await response.json();

    // Validate response for incorrect old password
    expect(response.status()).toBe(401);
    expect(responseBody).toHaveProperty('statusCode', 401);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', 'password not correct');

    const errorMessage = await signUpPage.getErrorMessage();
    expect(errorMessage).toBe('Unable to complete this request due to an issue. Try again later.');
  })

  // Test for password reset with mismatched username and temporary password
  test('Password Reset with Mismatched Username and Temporary Password', async ({ page }) => {

    const signUpPage = new SignUpPage(page);

    await page.goto(resetPasswordLink);
    await signUpPage.tempPasswordInput(Credentials.password);
    await signUpPage.newPasswordInput(ValidTestData.newPassword);
    await signUpPage.submit();


    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.resetPassword)
    );
    const responseBody = await response.json();

    // Validate response for incorrect old password
    expect(response.status()).toBe(401);
    expect(responseBody).toHaveProperty('statusCode', 401);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', 'password not correct');

    const errorMessage = await signUpPage.getErrorMessage();
    expect(errorMessage).toBe('Unable to complete this request due to an issue. Try again later.');
  })

  // Test for Password Reset with Expired Temporary Password
  test('Password Reset with Expired Temporary Password', async ({ page }) => {

    const signUpPage = new SignUpPage(page);

    await page.goto(resetPasswordLink);
    await signUpPage.tempPasswordInput(temporaryPassword);
    await signUpPage.newPasswordInput(ValidTestData.Password);
    await signUpPage.submit();


    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.resetPassword)
    );
    const responseBody = await response.json();

    // Validate response for incorrect old password
    expect(response.status()).toBe(401);
    expect(responseBody).toHaveProperty('statusCode', 401);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', 'password not correct');

    const errorMessage = await signUpPage.getErrorMessage();
    expect(errorMessage).toBe('Unable to complete this request due to an issue. Try again later.');
  })


})
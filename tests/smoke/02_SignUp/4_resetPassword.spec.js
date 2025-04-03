import { test, expect } from "@playwright/test";
import { SignUpPage } from "../../../pages/signUpPage";
import { getData } from "../../utils/apiHelper";
import { getGmailMessages } from "../../utils/signUpHelper";
import API_ENDPOINTS from "../../../api/apiEndpoints";
import { ValidTestData } from "../../data/SignUpData";
import { LoginPage } from "../../../pages/loginPage";


test.describe('Password Reset Flow', () => {
  const { newEmail } = getData('Smoke');
  let temporaryPassword;
  let resetPasswordLink;

  // Test for Request password reset with a valid registered email
  test('Request Password Reset for Valid Registered Email', async ({ page, baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);
    const loginPage = new LoginPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await signUpPage.forgotPassword();
    await signUpPage.forgotPasswordEmail(newEmail);
    await signUpPage.forgotPasswordSend();

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.resetEmail)
    );
    expect(response.status()).toBe(200);

    const CheckEmail = await signUpPage.checkEmail();
    await expect(CheckEmail).toBe('Check your email');
    const checkEmailMessage = await signUpPage.checkEmailMessage();
    await expect(checkEmailMessage).toBe(`If ${newEmail} is registered with Centigrade, we will send an email with instructions on how to reset your password`)
    const loginButton = await signUpPage.backToLoginButton();
    await expect(loginButton).toBeVisible();

    const { body, subject } = await getGmailMessages(newEmail);
    expect(subject).toBe('Centigrade password reset request');

    // Extract temporary password and reset link using regex
    const tempPasswordMatch = body.match(/Your temporary password:\s+([^\s]+)/);
    const resetLinkMatch = body.match(/Reset password \[(https:\/\/[^\]]+)\]/);
    const tempPassword = tempPasswordMatch[1];
    resetPasswordLink = resetLinkMatch[1];  //store the resetPasswordLink
    expect(tempPassword).toBeDefined();
    expect(resetPasswordLink).toContain(`${baseURL}/reset`);

    temporaryPassword = tempPassword;    //store the temporary password
  })


  // Test for Successful Password Reset with Mandatory Fields
  test('Successful Password Reset with Valid Temporary Password', async ({ page, baseURL }) => {
    const signUpPage = new SignUpPage(page, baseURL);

    await page.goto(resetPasswordLink);
    await signUpPage.tempPasswordInput(temporaryPassword);
    await signUpPage.newPasswordInput(ValidTestData.newPassword);
    await signUpPage.submit();

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.resetPassword)
    );

    // Validate response for successful password reset
    expect(response.status()).toBe(200);

    const SuccessMessage = await signUpPage.passordSuccessMessage();
    await expect(SuccessMessage).toBe('Your password was reset successfully');
    const SuccessLoginMessage = await signUpPage.passordSuccessLoginMessage();
    await expect(SuccessLoginMessage).toBe('Use your new password to log in to your Centigrade account')
    const loginButton = await signUpPage.login();
    await expect(loginButton).toBeVisible();
  })

})
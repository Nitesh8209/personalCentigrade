import { test, expect } from "@playwright/test";
import { SignUpPage } from "../../../pages/signUpPage";
import { getData } from "../../utils/apiHelper";
import API_ENDPOINTS from "../../../api/apiEndpoints";
import { inValidTestData, ValidTestData } from "../../data/SignUpData";


test.describe('Account Verification Flow', () => {
  const { newEmail, verificationCode } = getData('Smoke');

  // Test for verification is correct and given password
  test('Successful verification with correct code and password', async ({ page, baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);
    await signUpPage.navigateVerification(newEmail);
    await signUpPage.codeInput(verificationCode);
    await signUpPage.Password(inValidTestData.Verify.Password);
    await signUpPage.createAccount();

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.onboardVerify)
    );
    const responseBody = await response.json();

    // Validate that the response
    expect(response.status()).toBe(200);
    expect(responseBody).toMatchObject({
      email: newEmail
    });
  })

  // Test case for attempting signup with an already verified email
  test('Attempt signup with already verified email', async ({ page, baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);
    await signUpPage.completeSignUpProcess(inValidTestData.firstName, inValidTestData.lastName, ValidTestData.organizationName, newEmail);

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.onboardSignup)
    );
    
    expect(response.status()).toBe(409);
    expect(await signUpPage.forgotPassworderrortitle()).toHaveText('This email is already registered');
    expect(await signUpPage.resetPasswordsuccesserrormsg()).toHaveText('Log in below or reset your password using the “Forgot password” option');

  })

})
import { test, expect } from "@playwright/test";
import { SignUpPage } from "../../../pages/signUpPage";
import { getData } from "../../utils/apiHelper";
import API_ENDPOINTS from "../../../api/apiEndpoints";
import { inValidTestData, ValidTestData } from "../../data/SignUpData";


test.describe('Account Verification Flow', () => {
  const { newEmail, verificationCode } = getData('Integration');

  // Test case to verify response when the password is less than 8 characters
  test('Verification with password less than 8 characters', async ({ page }) => {

    const signUpPage = new SignUpPage(page);
    await signUpPage.navigateVerification(newEmail);
    await signUpPage.codeInput(verificationCode);
    await signUpPage.Password(inValidTestData.Verify.InvalidLengthPassword);
    await signUpPage.createAccount();

    // Validate the passwordErrorMessage 
    const passwordErrorMessage = await signUpPage.passwordErrorMessage();
    expect(passwordErrorMessage).toBe('Password should be at least 8 characters and contain an uppercase, a lowercase, and a special character.')
  })

  // Test case for incorrect verification code
  test('Verification with incorrect code', async ({ page }) => {

    const signUpPage = new SignUpPage(page);
    await signUpPage.navigateVerification(newEmail);
    await signUpPage.codeInput(inValidTestData.Verify.incorrectverifiationCode);
    await signUpPage.Password(inValidTestData.Verify.Password);
    await signUpPage.createAccount();

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.onboardVerify)
    );
    const errorMessage = await signUpPage.getErrorMessage();
    expect(errorMessage).toBe('Unable to complete this request due to an issue. Try again later.');

    const responseBody = await response.json();

    // Validate the status and error messages for incorrect verification code
    expect(response.status()).toBe(401);
    expect(responseBody).toHaveProperty('errorType', 'UNAUTHORIZED');
    expect(responseBody).toHaveProperty('errorMessage', 'Verification code not correct');
  })

  // Test case to verify response when attempting to verify a non-existent member
  test('Verification for non-existent member', async ({ page }) => {

    const signUpPage = new SignUpPage(page);
    await signUpPage.navigateVerification(inValidTestData.InvalidEmail);
    await signUpPage.codeInput(verificationCode);
    await signUpPage.Password(inValidTestData.Verify.Password);
    await signUpPage.createAccount();

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.onboardVerify)
    );
    const errorMessage = await signUpPage.getErrorMessage();
    expect(errorMessage).toBe('Unable to complete this request due to an issue. Try again later.');

    const responseBody = await response.json();

    // Validate the status and error messages
    expect(response.status()).toBe(404);
    expect(responseBody).toHaveProperty('statusCode', 404);
    expect(responseBody).toHaveProperty('errorType', 'MODEL_NOT_FOUND');
    expect(responseBody).toHaveProperty('errorMessage', 'Member not found');
  })

  // Test for verification is correct and given password
  test('Successful verification with correct code and password', async ({ page }) => {

    const signUpPage = new SignUpPage(page);
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
  test('Attempt signup with already verified email', async ({ page }) => {

    const signUpPage = new SignUpPage(page);

    await signUpPage.navigate();
    await signUpPage.firstName(inValidTestData.firstName);
    await signUpPage.lastName(inValidTestData.lastName);
    await signUpPage.organizationName(ValidTestData.organizationName);
    await signUpPage.email(newEmail);
    await signUpPage.checkBox();
    await signUpPage.signUp();

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.onboardSignup)
    );

    const responseBody = await response.json();

    expect(response.status()).toBe(409);
    expect(responseBody).toHaveProperty('statusCode', 409);
    expect(responseBody).toHaveProperty('errorType', "CONFLICT");
    expect(responseBody).toHaveProperty('errorMessage', "Member already exists and has been verified, please login instead");
    expect(responseBody).toHaveProperty('context.member');

  })

  // Test case for resending verification to an already verified member
  test('Resend verification to already verified member', async ({ page }) => {

    const signUpPage = new SignUpPage(page);
    await signUpPage.navigateVerification(newEmail);
    await signUpPage.resend();

    const response = await page.waitForResponse(
      response => response.url().includes(`${API_ENDPOINTS.onboardResend}?email=${encodeURIComponent(newEmail)}`)
    );
    const errorMessage = await signUpPage.getErrorMessage();
    expect(errorMessage).toBe('Unable to complete this request due to an issue. Try again later.');

    const responseBody = await response.json();

    expect(response.status()).toBe(409);

    expect(responseBody).toHaveProperty('statusCode', 409);
    expect(responseBody).toHaveProperty('errorType', 'CONFLICT');
    expect(responseBody).toHaveProperty('errorMessage', 'Member already exists and has been verified, please login instead');
    expect(responseBody.context.member).toHaveProperty('email', newEmail);
    expect(responseBody.context.member).toHaveProperty('verificationStatus', 'VERIFIED');
  })

  // Test case for resending verification to non-existent member
  test('Resend verification to non-existent member', async ({ page }) => {

    const signUpPage = new SignUpPage(page);
    await signUpPage.navigateVerification(inValidTestData.InvalidEmail);
    await signUpPage.resend();

    const response = await page.waitForResponse(
      response => response.url().includes(`${API_ENDPOINTS.onboardResend}?email=${encodeURIComponent(inValidTestData.InvalidEmail)}`)
    );
    const errorMessage = await signUpPage.getErrorMessage();
    expect(errorMessage).toBe('Unable to complete this request due to an issue. Try again later.');

    const responseBody = await response.json();

    expect(response.status()).toBe(404);

    expect(responseBody).toMatchObject({
      statusCode: 404,
      errorType: "MODEL_NOT_FOUND",
      errorMessage: "Member not found",
      context: {
        email: inValidTestData.InvalidEmail
      },
      timestamp: expect.any(String),
      requestId: expect.any(String),
    });
  })
})
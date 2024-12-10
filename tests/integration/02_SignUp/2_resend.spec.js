import { test, expect } from "@playwright/test";
import { SignUpPage } from "../../../pages/signUpPage";
import { getData, saveData } from "../../utils/apiHelper";
import { getGmailMessages } from "../../utils/signUpHelper";
import API_ENDPOINTS from "../../../api/apiEndpoints";
import { inValidTestData } from "../../data/SignUpData";


test.describe('Verification Code Flow', () => {
  const { newEmail } = getData('Integration');

  // Test case: Successful resend verification code
  test('Successful resend verification code', async ({ page, baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to the verification page and trigger resend action
    await signUpPage.navigateVerification(newEmail);
    await signUpPage.resend();

    // Wait for the resend verification API response
    const response = await page.waitForResponse(
      response => response.url().includes(`${API_ENDPOINTS.onboardResend}?email=${encodeURIComponent(newEmail)}`)
    );
    const responseBody = await response.json();

    expect(response.status()).toBe(200);

    // Assert that the API response includes the expected verification code and email
    const { receivedVerificationCode } = await getGmailMessages(newEmail);
    expect(responseBody).toMatchObject({
      verificationCode: receivedVerificationCode,
      email: newEmail
    });

    await saveData({ verificationCode: receivedVerificationCode }, 'Integration');
  })

  // Test case: Resend verification for a non-existent member
  test('Resend verification to non-existent member', async ({ page, baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);

    // Attempt to navigate and resend for an invalid email
    await signUpPage.navigateVerification(inValidTestData.InvalidEmail);
    await signUpPage.resend();

    const response = await page.waitForResponse(
      response => response.url().includes(`${API_ENDPOINTS.onboardResend}?email=${encodeURIComponent(inValidTestData.InvalidEmail)}`)
    );
    const responseBody = await response.json();

    const errorMessage = await signUpPage.getErrorMessage();
    expect(errorMessage).toBe('Unable to complete this request due to an issue. Try again later.');

    // Verify the response status is 404 Not Found
    expect(response.status()).toBe(404);
    expect(responseBody).toHaveProperty('errorType', 'MODEL_NOT_FOUND');
    expect(responseBody).toHaveProperty('errorMessage', 'Member not found');

  })
})
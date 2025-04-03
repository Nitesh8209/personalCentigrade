import { test, expect } from "@playwright/test";
import { SignUpPage } from "../../../pages/signUpPage";
import { getData, saveData } from "../../utils/apiHelper";
import { getGmailMessages } from "../../utils/signUpHelper";
import API_ENDPOINTS from "../../../api/apiEndpoints";


test.describe('Verification Code Flow', () => {
  const { newEmail } = getData('Smoke');

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
    expect(response.status()).toBe(200);

    // Assert that the API response includes the expected verification code and email
    const { receivedVerificationCode } = await getGmailMessages(newEmail);
    expect(receivedVerificationCode).toBe(Number);
    expect(subject).toHaveText(/Your Centigrade verification code:/);
    expect(await signUpPage.getSuccessMessage()).toBe('Email has been sent');
    await saveData({ verificationCode: receivedVerificationCode }, 'Smoke');
  })

})
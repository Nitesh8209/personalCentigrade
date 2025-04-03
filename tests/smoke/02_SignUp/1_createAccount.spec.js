import { test, expect } from "@playwright/test";
import { SignUpPage } from "../../../pages/signUpPage";
import { saveData } from "../../utils/apiHelper";
import { generateTestEmail, getGmailMessages } from "../../utils/signUpHelper";
import API_ENDPOINTS from "../../../api/apiEndpoints";
import { ValidTestData } from "../../data/SignUpData";


test.describe('Intial sign up integration test', () => {

  let newEmail;

  // Generate email and set default headers before all tests
  test.beforeAll(async () => {
    newEmail = generateTestEmail();
  });

  // Test for successful signup and email verification status
  test('Successful Sign-Up with a New Email', async ({ page, baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);
    await signUpPage.completeSignUpProcess(ValidTestData.firstName, ValidTestData.lastName, ValidTestData.organizationName, newEmail);

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.onboardSignup)
    );
    expect(response.status()).toBe(200);

    const { subject, receivedVerificationCode } = await getGmailMessages(newEmail);
    expect(receivedVerificationCode).toBe(Number);
    expect(subject).toHaveText(/Your Centigrade verification code:/)

    expect(page.url()).toContain(`verification?email=${encodeURIComponent(newEmail)}`);
    await saveData({ newEmail: newEmail }, 'Smoke');
  })
})
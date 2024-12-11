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
  test('Successful sign up with new email', async ({ page, baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);

    await signUpPage.navigate();
    await signUpPage.firstName(ValidTestData.firstName);
    await signUpPage.lastName(ValidTestData.lastName);
    await signUpPage.organizationName(ValidTestData.organizationName);
    await signUpPage.email(newEmail);
    await signUpPage.checkBox();
    await signUpPage.signUp();

    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.onboardSignup)
    );

    const responseBody = await response.json();

    expect(response.status()).toBe(200);

    const { receivedVerificationCode } = await getGmailMessages(newEmail);
    expect(responseBody).toMatchObject({
      verificationCode: receivedVerificationCode,
      email: newEmail
    });

    expect(page.url()).toContain(`verification?email=${encodeURIComponent(newEmail)}`);
    await saveData({ newEmail: newEmail }, 'Integration');
  })
})
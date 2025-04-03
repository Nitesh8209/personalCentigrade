import { test, expect } from '@playwright/test';
import { SignUpPage } from '../../../pages/signUpPage';
import { inValidTestData } from '../../data/SignUpData';

test.describe('Verification Code Page UI Tests', () => {

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

  // Test case: Resend verification code to an invalid user
  test('resend verification code to invalid user', async ({ baseURL }) => {
    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to the verification page using an invalid email
    await signUpPage.navigateVerification(inValidTestData.InvalidEmail);

    // Trigger resend verification code and verify the error message
    const verificationCoderesendlink = await signUpPage.verificationCoderesendlink();
    await verificationCoderesendlink.click();

    const errorMessage = await signUpPage.getErrorMessage();
    expect(errorMessage).toBe('Unable to complete this request due to an issue. Try again later.');
  })

});

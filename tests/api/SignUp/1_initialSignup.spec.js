import { test, expect } from '@playwright/test';
import { generateTestEmail, getGmailMessages } from '../../utils/signUpHelper';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { ValidTestData } from '../../data/SignUpData';
import { postRequest, saveData } from '../../utils/apiHelper';

test.describe.serial("Initial Sign Up Flow", () => {
  let headers;
  let newEmail;

  // Generate email and set default headers before all tests
  test.beforeAll(async () => {

    newEmail = generateTestEmail();
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  });

    // Test for successful signup and email verification status
    test('Successful sign up with new email', async () => {
      const data = new URLSearchParams({
        firstName: ValidTestData.firstName,
        lastName: ValidTestData.lastName,
        organizationName: ValidTestData.organizationName,
        email: newEmail,
      });
      const response = await postRequest(API_ENDPOINTS.onboardSignup, data, headers);

      const { receivedVerificationCode } = await getGmailMessages(newEmail);  // Fetch Gmail message for verification code
      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('verificationCode', receivedVerificationCode);
      expect(responseBody).toHaveProperty('email', newEmail);

      await saveData({ newEmail: newEmail }, 'Api');
    })


})
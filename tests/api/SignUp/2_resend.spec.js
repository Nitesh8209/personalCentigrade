import { test, expect } from '@playwright/test';
import { getData, postRequest, saveData } from '../../utils/apiHelper';
import { getGmailMessages } from '../../utils/signUpHelper';
import { inValidTestData } from '../../data/SignUpData';
import API_ENDPOINTS from '../../../api/apiEndpoints';

test.describe.serial('Verification Code Flow', () => {
const { newEmail } = getData(); 
  let headers;

  // set default headers before all tests
  test.beforeAll(async () => {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  });

  // Resend the Verification code 
  test('Successful resend verification code', async () => {

    const resendParams = new URLSearchParams({ email: newEmail })
    const ResendUrl = `${API_ENDPOINTS.onboardResend}?${resendParams.toString()}`;
    const data = new URLSearchParams({});
    const response = await postRequest(ResendUrl, data, headers);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    const { receivedVerificationCode } = await getGmailMessages();  // Fetch Gmail message for verification code

    expect(responseBody).toHaveProperty('verificationCode', receivedVerificationCode);
    expect(responseBody).toHaveProperty('email', newEmail);
    expect(responseBody).toMatchObject({
      verificationCode: receivedVerificationCode,
      email: newEmail,
    });
   
    await saveData({ verificationCode: receivedVerificationCode }) // Storing verification code for next steps
  })

  // Resend the Verification code to non-existent member
  test('Resend verification to non-existent member', async () => {

    // Define request parameters using an invalid email
    const resendParams = new URLSearchParams({ email: inValidTestData.InvalidEmail });
    const resendUrl = `${API_ENDPOINTS.onboardResend}?${resendParams.toString()}`;
    const data = new URLSearchParams({});
    const response = await postRequest(resendUrl, data, headers);
    const responseBody = await response.json();

     // Validate specific error properties
    expect(response.status).toBe(404);
    expect(responseBody).toHaveProperty('statusCode', 404);
    expect(responseBody).toHaveProperty('errorType', 'MODEL_NOT_FOUND');
    expect(responseBody).toHaveProperty('errorMessage', 'Member not found');
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
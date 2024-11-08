import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { inValidTestData, ValidTestData } from '../../data/SignUpData';
import { getData, postRequest } from '../../utils/apiHelper';
import { Credentials } from '../../data/testData';
import { getGmailMessages } from '../../utils/signUpHelper';

test.describe.serial("Password Reset Flow", () => {
  const { newEmail } = getData('Api');
  let headers;
  let temporaryPassword;

  // Set headers before all tests
  test.beforeAll(async () => {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  });

  // Test for Request password reset with a valid registered email
  test(`Request password reset with a valid registered email`, async () => {
    const resetEmailData = new URLSearchParams({
      email: newEmail,
    });
    const response = await postRequest(API_ENDPOINTS.resetEmail, resetEmailData, headers);
    const responseBody = await response.json();

    // Validate response for successful reset Email
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('message', `password reset email sent to member ${newEmail} status set to COGNITO_CONFIRMED`);

    const { body, subject } = await getGmailMessages();
    expect(subject).toBe('Centigrade password reset request');

    // Extract temporary password and reset link using regex
    const tempPasswordMatch = body.match(/Your temporary password:\s+([^\s]+)/);
    const resetLinkMatch = body.match(/Reset password \[(https:\/\/[^\]]+)\]/);
    const tempPassword = tempPasswordMatch[1];
    const resetPasswordLink = resetLinkMatch[1];
    expect(tempPassword).toBeDefined();
    expect(resetPasswordLink).toContain('https://devfoundry.centigrade.earth/reset');
    temporaryPassword = tempPassword;    //store the temporary password 
  })

  // Test for Request Password Reset with Invalid Email Format
  test(`Request Password Reset with Invalid Email Format`, async () => {
    const resetInvalidEmailData = new URLSearchParams({
      email: inValidTestData.InvalidEmail,
    });
    const response = await postRequest(API_ENDPOINTS.resetEmail, resetInvalidEmailData, headers);
    const responseBody = await response.json();

    // Validate response for detailed error response Member not found
    expect(response.status).toBe(404);
    expect(responseBody).toHaveProperty('errorType', 'MODEL_NOT_FOUND');
    expect(responseBody).toHaveProperty('errorMessage', 'member with email not found');
    expect(responseBody).toMatchObject({
      statusCode: 404,
      errorType: "MODEL_NOT_FOUND",
      errorMessage: "member with email not found",
      context: {
        email: inValidTestData.InvalidEmail,
      },
      timestamp: expect.any(String),    // timestamp should be a string in the format YYYY-MM-DDTHH:MM:SSZ
      requestId: expect.any(String),     // requestId should be a unique string identifier for the request
    });
  })


  // Test for Successful Password Reset with Mandatory Fields
  test('Successful Password Reset with Mandatory Fields', async () => {
    const resetData = new URLSearchParams({
      username: newEmail,
      oldPassword: temporaryPassword,
      newPassword: ValidTestData.newPassword,
    });
    const response = await postRequest(API_ENDPOINTS.resetPassword, resetData, headers);
    const responseBody = await response.json();

    // Validate response for successful password reset
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('message', `password updated for member ${newEmail}`);
  })


  // Test for Successful Password Reset with Optional First Name and Last Name
  test('Password Reset with Optional First Name and Last Name', async () => {
    const resetOptionalData = new URLSearchParams({
      username: newEmail,
      firstName: ValidTestData.firstName,
      lastName: ValidTestData.lastName,
      oldPassword: ValidTestData.newPassword,
      newPassword: ValidTestData.Password,
    });
    const response = await postRequest(API_ENDPOINTS.resetPassword, resetOptionalData, headers);
    const responseBody = await response.json();

    // Validate response for successful password reset
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('message', `password updated for member ${newEmail}`);
  })

  // Test for password reset with an invalid temporary password
  test('Password Reset with Invalid Temporary Password', async () => {
    const invalidResetPayload = new URLSearchParams({
      username: newEmail,
      oldPassword: ValidTestData.InvalidPassword,
      newPassword: ValidTestData.Password,
    });
    const response = await postRequest(API_ENDPOINTS.resetPassword, invalidResetPayload, headers);
    const responseBody = await response.json();

    // Validate response for incorrect old password
    expect(response.status).toBe(401);
    expect(responseBody).toHaveProperty('statusCode', 401);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', 'password not correct');

    // Match structure for detailed error response
    expect(responseBody).toMatchObject({
      statusCode: 401,
      errorType: "HTTP_ERROR",
      errorMessage: "password not correct",
      context: {
        exception: '401: password not correct'
      },
      timestamp: expect.any(String),   // timestamp should be a string in the format YYYY-MM-DDTHH:MM:SSZ
      requestId: expect.any(String),   // requestId should be a unique string identifier for the request
    });
  })

  // Test for password reset with mismatched username and temporary password
  test('Password Reset with Mismatched Username and Temporary Password', async () => {
    const mismatchedResetPayload = new URLSearchParams({
      username: newEmail,
      oldPassword: Credentials.password,
      newPassword: ValidTestData.Password,
    });
    const response = await postRequest(API_ENDPOINTS.resetPassword, mismatchedResetPayload, headers);
    const responseBody = await response.json();

    // Validate response for mismatched username and password
    expect(response.status).toBe(401);
    expect(responseBody).toHaveProperty('statusCode', 401);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', 'password not correct');

    // Match structure for detailed error response
    expect(responseBody).toMatchObject({
      statusCode: 401,
      errorType: "HTTP_ERROR",
      errorMessage: "password not correct",
      context: {
        exception: '401: password not correct'
      },
      timestamp: expect.any(String),    // timestamp should be a string in the format YYYY-MM-DDTHH:MM:SSZ
      requestId: expect.any(String),    // requestId should be a unique string identifier for the request
    });
  })

 // Test for Password Reset with Expired Temporary Password
 test('Password Reset with Expired Temporary Password', async () => {
  const ExpiredResetPayload = new URLSearchParams({
    username: newEmail,
    oldPassword: temporaryPassword,
    newPassword: ValidTestData.Password,
  });
  const response = await postRequest(API_ENDPOINTS.resetPassword, ExpiredResetPayload, headers);
  const responseBody = await response.json();

  // Validate response for mismatched username and password
  expect(response.status).toBe(401);
  expect(responseBody).toHaveProperty('statusCode', 401);
  expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
  expect(responseBody).toHaveProperty('errorMessage', 'password not correct');

  // Match structure for detailed error response
  expect(responseBody).toMatchObject({
    statusCode: 401,
    errorType: "HTTP_ERROR",
    errorMessage: "password not correct",
    context: {
      exception: '401: password not correct'
    },
    timestamp: expect.any(String),    // timestamp should be a string in the format YYYY-MM-DDTHH:MM:SSZ
    requestId: expect.any(String),    // requestId should be a unique string identifier for the request
  });
})

})
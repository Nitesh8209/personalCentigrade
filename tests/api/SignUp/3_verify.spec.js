import { test, expect } from '@playwright/test';
import { getData, postRequest } from '../../utils/apiHelper';
import { inValidTestData, ValidTestData } from '../../data/SignUpData';
import API_ENDPOINTS from '../../../api/apiEndpoints';

test.describe.serial('Account Verification Flow', () => {
  const { newEmail, verificationCode } = getData('Api');

  let headers;

  // set default headers before all tests
  test.beforeAll(async () => {

    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  });

  // Test case to verify response when the password is less than 8 characters
  test('Verification with password less than 8 characters', async () => {
    const data = new URLSearchParams({
      verificationCode: verificationCode,
      email: newEmail,
      password: inValidTestData.Verify.InvalidLengthPassword
    });

    // Send POST request for account verification
    const response = await postRequest(API_ENDPOINTS.onboardVerify, data, headers);
    const responseBody = await response.json();

    // Validate the status and response properties
    expect(response.status).toBe(400);
    expect(responseBody).toHaveProperty('statusCode', 400);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', 'Password must be between 8 and 16 characters');
    expect(responseBody).toMatchObject({
      statusCode: 400,
      errorType: "HTTP_ERROR",
      errorMessage: "Password must be between 8 and 16 characters",
      context: {
        exception: "400: Password must be between 8 and 16 characters"
      },
      timestamp: expect.any(String),
      requestId: expect.any(String),
    });
  })

  // Test case to verify response for an invalid password format
  test('Verification with invalid password format', async () => {

    const data = new URLSearchParams({
      verificationCode: inValidTestData.Verify.verifiationCode,
      email: inValidTestData.Verify.UnverfiedEmail,
      password: inValidTestData.Verify.InvalidPassword
    });
    const response = await postRequest(API_ENDPOINTS.onboardVerify, data, headers);
    const responseBody = await response.json();

    // Validate the status and error messages for incorrect password format
    expect(response.status).toBe(400);
    expect(responseBody).toHaveProperty('statusCode', 400);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');
    expect(responseBody).toMatchObject({
      statusCode: 400,
      errorType: "HTTP_ERROR",
      errorMessage: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      context: {
        exception: "400: Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      },
      timestamp: expect.any(String),
      requestId: expect.any(String),
    });

  })

  // Test case to verify response when attempting to verify a non-existent member
  test('Verification for non-existent member', async () => {
    const data = new URLSearchParams({
      verificationCode: inValidTestData.Verify.verifiationCode,
      email: inValidTestData.InvalidEmail,
      password: inValidTestData.Verify.Password
    });
    const response = await postRequest(API_ENDPOINTS.onboardVerify, data, headers);
    const responseBody = await response.json();

    // Validate the status and error messages for non-existent member
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

  // Test case for incorrect verification code
  test('Verification with incorrect code', async () => {
    const data = new URLSearchParams({
      verificationCode: inValidTestData.Verify.incorrectverifiationCode,
      email: inValidTestData.Verify.UnverfiedEmail,
      password: inValidTestData.Verify.Password
    });
    const response = await postRequest(API_ENDPOINTS.onboardVerify, data, headers);
    const responseBody = await response.json();

    // Validate the status and error messages for incorrect verification code
    expect(response.status).toBe(401);
    expect(responseBody).toHaveProperty('statusCode', 401);
    expect(responseBody).toHaveProperty('errorType', 'UNAUTHORIZED');
    expect(responseBody).toHaveProperty('errorMessage', 'Verification code not correct');
    expect(responseBody).toMatchObject({
      statusCode: 401,
      errorType: "UNAUTHORIZED",
      errorMessage: "Verification code not correct",
      context: {
        email: inValidTestData.Verify.UnverfiedEmail,
        verification_code: inValidTestData.Verify.incorrectverifiationCode
      },
      timestamp: expect.any(String),
      requestId: expect.any(String),
    });
  })


  // Test for verification is correct and given password
  test('Successful verification with correct code and password', async () => {
    const data = new URLSearchParams({
      verificationCode: verificationCode,
      email: newEmail,
      password: ValidTestData.Password
    });

    // Send the Post Request for verify verificationCode, email, password
    const response = await postRequest(API_ENDPOINTS.onboardVerify, data, headers);
    const responseBody = await response.json();

    // Validate that the response status is 200, indicating success
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('email', newEmail);
  })

  // Test case for attempting signup with an already verified email
  test('Attempt signup with already verified email', async () => {
    const data = new URLSearchParams({
      firstName: inValidTestData.firstName,
      lastName: inValidTestData.lastName,
      organizationName: inValidTestData.organizationName,
      email: newEmail,
    });

    const response = await postRequest(API_ENDPOINTS.onboardSignup, data, headers);
    const responseBody = await response.json();

    // Validate the conflict error response for already verified email
    expect(response.status).toBe(409);
    expect(responseBody).toHaveProperty('statusCode', 409);
    expect(responseBody).toHaveProperty('errorType', "CONFLICT");
    expect(responseBody).toHaveProperty('errorMessage', "Member already exists and has been verified, please login instead");
    expect(responseBody).toHaveProperty('context.member');
    expect(responseBody.context.member).toMatchObject({
      id: expect.any(Number),
      email: newEmail,
      username: expect.any(String),
      firstName: inValidTestData.firstName,
      lastName: inValidTestData.lastName,
      verificationStatus: 'VERIFIED',
    });
  })

  // Test case for resending verification to an already verified member
  test('Resend verification to already verified member', async () => {
    const resendParams = new URLSearchParams({ email: newEmail });
    const resendUrl = `${API_ENDPOINTS.onboardResend}?${resendParams.toString()}`;
    const data = new URLSearchParams({});
    const response = await postRequest(resendUrl, data, headers);
    const responseBody = await response.json();

    // Validate the conflict error response for already verified member
    expect(response.status).toBe(409);
    expect(responseBody).toHaveProperty('statusCode', 409);
    expect(responseBody).toHaveProperty('errorType', 'CONFLICT');
    expect(responseBody).toHaveProperty('errorMessage', 'Member already exists and has been verified, please login instead');
    expect(responseBody.context.member).toHaveProperty('email', newEmail);
    expect(responseBody.context.member).toHaveProperty('verificationStatus', 'VERIFIED');

  })

})

import { test, expect } from '@playwright/test';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { ValidTestData } from '../../data/SignUpData';
import { getData, postRequest } from '../../utils/apiHelper';
import { Credentials } from '../../data/testData';

test.describe.serial("Password Reset Flow", () => {
  const { newEmail } = getData();
  let headers;

  // Set headers before all tests
  test.beforeAll(async () => {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  });

  // Test for Successful Password Reset with Mandatory Fields
  test('Successful Password Reset with Mandatory Fields', async () => {
    const data = new URLSearchParams({
      username: newEmail,
      oldPassword: ValidTestData.Password,
      newPassword: ValidTestData.newPassword,
    });

    const response = await postRequest(API_ENDPOINTS.resetPassword, data, headers);

    // Validate response for successful password reset
    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('message', `password updated for member ${newEmail}`);
  })

  // Test for password reset with an invalid temporary password
  test('Password Reset with Invalid Temporary Password', async () => {

    const data = new URLSearchParams({
      username: newEmail,
      oldPassword: ValidTestData.InvalidPassword,
      newPassword: ValidTestData.Password,
    });

    const response = await postRequest(API_ENDPOINTS.resetPassword, data, headers);
    const responseBody = await response.json();

    // Validate response for incorrect old password
    expect(response.status).toBe(401);
    expect(responseBody).toHaveProperty('statusCode', 401);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', 'password not correct');
    expect(responseBody).toMatchObject({
      statusCode: 401,
      errorType: "HTTP_ERROR",
      errorMessage: "password not correct",
      context: {
        exception: '401: password not correct'
      },
      timestamp: expect.any(String),
      requestId: expect.any(String),
    });
  })

  // Test for password reset with mismatched username and temporary password
  test('Password Reset with Mismatched Username and Temporary Password', async () => {

    const data = new URLSearchParams({
      username: newEmail,
      oldPassword: Credentials.password,
      newPassword: ValidTestData.Password,
    });

    const response = await postRequest(API_ENDPOINTS.resetPassword, data, headers);
    const responseBody = await response.json();

    // Validate response for mismatched username and password
    expect(response.status).toBe(401);
    expect(responseBody).toHaveProperty('statusCode', 401);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', 'password not correct');
    expect(responseBody).toMatchObject({
      statusCode: 401,
      errorType: "HTTP_ERROR",
      errorMessage: "password not correct",
      context: {
        exception: '401: password not correct'
      },
      timestamp: expect.any(String),
      requestId: expect.any(String),
    });
  })

})
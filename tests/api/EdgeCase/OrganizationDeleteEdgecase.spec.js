import { test, expect } from '@playwright/test';
import { generateTestEmail } from '../../utils/signUpHelper';
import { postRequest, deleteRequest, getData } from '../../utils/apiHelper';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { ValidTestData } from '../../data/SignUpData';

test.describe.serial('Edge Cases and Organization Deletion Scenarios', () => {
  // Destructure organization-related details from retrieved data
  const { organizationId, InviteaccessToken, approveEmail } = getData('Api');

  let headers;
  let resendEmail;

  test.beforeAll(async () => {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  });

  // Test case for inviting a user to an organization
  test('Add test email for organization deletion scenarios', async () => {
    resendEmail = generateTestEmail();
    const inviteSignUpData = new URLSearchParams({
      firstName: ValidTestData.Invite.firstName,
      lastName: ValidTestData.Invite.lastName,
      organizationName: ValidTestData.Invite.organizationName,
      email: resendEmail,
      reason: '',
    });

    // Send POST request to onboard signup API with invitation details
    const inviteSignUpResponse = await postRequest(API_ENDPOINTS.onboardSignup, inviteSignUpData, headers);
    expect(inviteSignUpResponse.status).toBe(200);
  })


  // Test case for inviting a user after deleting an organization
  test('Invite after organization deletion', async () => {

    const deleteOrganizationUrl = `${API_ENDPOINTS.organization}/${organizationId}`;
    const deleteOrganizationHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${InviteaccessToken}`
    };

    // Send DELETE request to delete the organization
    const deleteOrganizationresponse = await deleteRequest(deleteOrganizationUrl, deleteOrganizationHeaders);
    expect(deleteOrganizationresponse.status).toBe(200);
    const data = {
      organizationId: organizationId,
      email: 'nitesh.agarwalautomation+test13@gmail.com',
      projectId: 0
    };
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${InviteaccessToken}`
    };

    // Send POST request to onboard invite API after organization deletion
    const response = await postRequest(API_ENDPOINTS.onboardInvite, JSON.stringify(data), headers);
    const responseBody = await response.json();

    // Expect a 500 error due to the organization being deleted
    expect(response.status).toBe(500);
    expect(responseBody).toHaveProperty('statusCode', 500);
    expect(responseBody).toHaveProperty('errorType', 'HTTP_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', 'DataDomainError: MODEL_NOT_FOUND');
    expect(responseBody).toMatchObject({
      statusCode: 500,
      errorType: "HTTP_ERROR",
      errorMessage: "DataDomainError: MODEL_NOT_FOUND",
      context: {
        exception: "500: DataDomainError: MODEL_NOT_FOUND"
      },
      timestamp: expect.any(String),
      requestId: expect.any(String),
    });

  })

  // Test case for resending verification after organization deletion
  test('Resend verification after organization deletion', async () => {

    const resendParams = new URLSearchParams({ email: resendEmail });
    const resendUrl = `${API_ENDPOINTS.onboardResend}?${resendParams.toString()}`;
    const data = new URLSearchParams({});

    // Send POST request to resend verification after organization deletion
    const response = await postRequest(resendUrl, data, headers);
    const responseBody = await response.json();

    // Expect a 500 error due to the organization being deleted
    expect(response.status).toBe(500);
    expect(responseBody).toHaveProperty('statusCode', 500);
    expect(responseBody).toHaveProperty('errorType', 'INTERNAL_SERVER_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', "'NoneType' object has no attribute 'organization_name'");
    expect(responseBody).toMatchObject({
      statusCode: 500,
      errorType: "INTERNAL_SERVER_ERROR",
      errorMessage: "'NoneType' object has no attribute 'organization_name'",
      context: {},
      timestamp: expect.any(String),
      requestId: expect.any(String),
    });

  })

  // Test case for approving a member after organization deletion
  test('Approve member after organization deletion', async () => {

    const approveInviteData = new URLSearchParams({
      email: approveEmail,
    });

    const approveInviteHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${InviteaccessToken}`
    };

    // Send POST request to approve the member after organization deletion
    const response = await postRequest(API_ENDPOINTS.onboardApprove, approveInviteData, approveInviteHeaders);
    const responseBody = await response.json();

    // Expect a 500 error due to the organization being deleted
    expect(response.status).toBe(500);
    expect(responseBody).toHaveProperty('statusCode', 500);
    expect(responseBody).toHaveProperty('errorType', 'INTERNAL_SERVER_ERROR');
    expect(responseBody).toHaveProperty('errorMessage', "'NoneType' object has no attribute 'organization_name'");
    expect(responseBody).toMatchObject({
      statusCode: 500,
      errorType: "INTERNAL_SERVER_ERROR",
      errorMessage: "'NoneType' object has no attribute 'organization_name'",
      context: {},
      timestamp: expect.any(String),
      requestId: expect.any(String),
    });

  })

})

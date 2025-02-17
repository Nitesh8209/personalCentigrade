import { test, expect } from '@playwright/test';
import { inValidTestData, ValidTestData } from '../../data/SignUpData';
import { generateTestEmail, getGmailMessages } from '../../utils/signUpHelper';
import { postRequest, getRequest, putRequest, getData, saveData } from '../../utils/apiHelper';
import API_ENDPOINTS from '../../../api/apiEndpoints';

test.describe.serial(`Member Invitation and Approval Flow`, () => {
  const { newEmail, admin_access_token } = getData('Api');

  let headers;
  let InviteEmail;
  let organizationId;
  let accessToken;
  let memberEmail;
  let approveEmail;

  test.beforeAll(async () => {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  });

  // before Invite the new member set the new member as an Admin
  test('Set member to Admin role', async () => {
    const authHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${admin_access_token}`
    };

    // Fetch the member by email for organizationId and memberOrganizationsId
    const memberSearchParams = new URLSearchParams({ email: newEmail });
    const getMemberUrl = `${API_ENDPOINTS.getMember}?${memberSearchParams.toString()}`;
    const memberResponse = await getRequest(getMemberUrl, authHeaders);
    const memberData = await memberResponse.json();
    expect(memberResponse.status).toBe(200);
    organizationId = memberData[0].roles[0].resourceId;
    const memberOrganizationsId = memberData[0].roles[1].resourceId;

    // Fetch organization role types and filter by memberOrganizationsId and save ID
    const roleResponse = await getRequest(API_ENDPOINTS.getMemberOrganizationTypes, authHeaders);
    const roleData = await roleResponse.json();
    expect(roleResponse.status).toBe(200);
    const filteredRoles = roleData.filter(item => item.memberOrganizationsId === memberOrganizationsId);
    const id = filteredRoles[0].id;

    // send the put request for update the member as an Admin
    const updateRoleUrl = `${API_ENDPOINTS.getMemberOrganizationTypes}/${id}`;
    const updateRoleData = {
      name: "ORG_ADMIN",
      roleTypeId: 18
    }
    const updateRoleheaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${admin_access_token}`
    };
    const updateResponse = await putRequest(updateRoleUrl, JSON.stringify(updateRoleData), updateRoleheaders)
    const updateResponseBody = await updateResponse.json();
    expect(updateResponse.status).toBe(200);
    expect(updateResponseBody.roleType).toHaveProperty('id', 18);
    expect(updateResponseBody.roleType).toHaveProperty('name', 'ORG_ADMIN');
    await saveData({ organizationId: organizationId }, 'Api')
  })


  // Test for inviting a new user to an organization and verifying the invite process
  ValidTestData.Approve.forEach(({ description, reject, expectedSubject }) => {


    test(`Invite a new user to the organization for ${description}`, async ({baseURL}) => {

      // Authenticate the admin member and Store token for inviting process
      const authdata = new URLSearchParams({
        username: newEmail,
        password: ValidTestData.Password,
      });
      const authResponse = await postRequest(API_ENDPOINTS.authTOken, authdata, headers);
      expect(authResponse.status).toBe(200);
      const authResponseBody = await authResponse.json();
      accessToken = authResponseBody.access_token;
      await saveData({ InviteaccessToken: accessToken }, 'Api');

      // Generate random email for invite and send the post request for Invite
      InviteEmail = generateTestEmail();
      if (reject === false) {
        memberEmail = InviteEmail;
      }
      const inviteData = {
        organizationId: organizationId,
        email: InviteEmail,
        projectId: 0
      };
      const inviteHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      };
      const inviteResponse = await postRequest(API_ENDPOINTS.onboardInvite, JSON.stringify(inviteData), inviteHeaders);
      const inviteResponseBody = await inviteResponse.json();
      expect(inviteResponse.status).toBe(200);
      expect(inviteResponseBody).toBe(200);

      // Fetch Gmail invite email
      const { subject, body } = await getGmailMessages();
      expect(subject).toBe(`${ValidTestData.organizationName} has invited you to Centigrade`);
      const expectedLinkPattern = /Accept invitation \[(https?:\/\/[^\]]+)\]/;
      const invitationLink = body.match(expectedLinkPattern)[1];
      expect(invitationLink).toContain(`${baseURL}/create-account`);

      // Proceed with invitee signup
      const inviteSignUpData = new URLSearchParams({
        firstName: ValidTestData.Invite.firstName,
        lastName: ValidTestData.Invite.lastName,
        organizationName: ValidTestData.Invite.organizationName,
        email: InviteEmail,
        reason: '',
      });
      const inviteSignUpResponse = await postRequest(API_ENDPOINTS.onboardSignup, inviteSignUpData, headers);
      expect(inviteSignUpResponse.status).toBe(200);
      const { receivedVerificationCode : inviteVerificationCode } = await getGmailMessages(InviteEmail);  // Fetch Gmail message for verification code

      // Verify invitee account
      const verifyInviteeData = new URLSearchParams({
        verificationCode: inviteVerificationCode,
        email: InviteEmail,
        password: ValidTestData.Password
      });
      const verifyInviteeResponse = await postRequest(API_ENDPOINTS.onboardVerify, verifyInviteeData, headers);
      const verifyInviteeBody = await verifyInviteeResponse.json();
      expect(verifyInviteeResponse.status).toBe(200);
      expect(verifyInviteeBody).toHaveProperty('email', InviteEmail);
    })

    // Test for approving or rejecting the invite
    test(`${description} the invite request`, async () => {

      // send the post request for approval to admin
      const approvalParams = new URLSearchParams({ reject });
      const approveInviteUrl = `${API_ENDPOINTS.onboardApprove}?${approvalParams.toString()}`;
      const approveInviteData = new URLSearchParams({
        email: InviteEmail,
      });
      const approveInviteHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`
      };
      const approveResponse = await postRequest(approveInviteUrl, approveInviteData, approveInviteHeaders);
      const approveResponseBody = await approveResponse.json();
      // expect(approveResponse.status).toBe(200);
      // expect(approveResponseBody).toHaveProperty('email', InviteEmail);

      // Fetch Gmail approval email  
      const { subject } = await getGmailMessages();
      // expect(subject).toBe(expectedSubject);
    })

  })

  test.describe.serial('Invalid Approval Cases', () => {
    // Test: Attempt to approve as a non-admin member
    test('Member Approve by non-admin privileges', async () => {
      approveEmail = generateTestEmail();
      await saveData({ approveEmail: approveEmail }, 'Api')

      // Invitee signs up and verifies their account
      const inviteSignUpData = new URLSearchParams({
        firstName: ValidTestData.Invite.firstName,
        lastName: ValidTestData.Invite.lastName,
        organizationName: ValidTestData.Invite.organizationName,
        email: approveEmail,
        reason: '',
      });
      const inviteSignUpResponse = await postRequest(API_ENDPOINTS.onboardSignup, inviteSignUpData, headers);
      expect(inviteSignUpResponse.status).toBe(200);
      const { receivedVerificationCode : inviteVerificationCode } = await getGmailMessages(InviteEmail);  // Fetch Gmail message for verification code

      // Verify invitee account using the verification code
      const verifyInviteeData = new URLSearchParams({
        verificationCode: inviteVerificationCode,
        email: approveEmail,
        password: ValidTestData.Password
      });
      const verifyInviteeResponse = await postRequest(API_ENDPOINTS.onboardVerify, verifyInviteeData, headers);
      expect(verifyInviteeResponse.status).toBe(200);

      // Authenticate non-admin member
      const authdata = new URLSearchParams({
        username: memberEmail,
        password: ValidTestData.Password,
      });
      const authResponse = await postRequest(API_ENDPOINTS.authTOken, authdata, headers);
      expect(authResponse.status).toBe(200);
      const authResponseBody = await authResponse.json();
      const memberAccessToken = authResponseBody.access_token;

      // Attempt approval by non-admin and validate error response
      const approveInviteData = new URLSearchParams({
        email: approveEmail,
      });

      const approveInviteHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${memberAccessToken}`
      };
      const response = await postRequest(API_ENDPOINTS.onboardApprove, approveInviteData, approveInviteHeaders);
      const responseBody = await response.json();
      expect(response.status).toBe(401);
      expect(responseBody).toHaveProperty('statusCode', 401);
      expect(responseBody).toHaveProperty('errorType', 'UNAUTHORIZED');
      expect(responseBody).toHaveProperty('errorMessage', 'You are not authorized to approve members');
      expect(responseBody.context.approving_member).toHaveProperty('email', memberEmail);
    })

    // Test: Approving a non-existent member
    test('Approve non-existent member', async () => {
      const approveInviteData = new URLSearchParams({
        email: inValidTestData.InvalidEmail,
      });

      const approveInviteHeaders = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`
      };
      const response = await postRequest(API_ENDPOINTS.onboardApprove, approveInviteData, approveInviteHeaders);
      const responseBody = await response.json();
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

});
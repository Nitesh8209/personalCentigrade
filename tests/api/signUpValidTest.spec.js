import { test, expect } from '@playwright/test';
import { getGmailMessages, generateTestEmail } from '../utils/signUpHelper'
import { postRequest, getRequest, putRequest } from '../utils/apiHelper'
import { ValidTestData } from '../data/SignUpData';
import { API_ENDPOINTS } from '../../api/apiEndpoints'
import { getToken } from '../utils/apiHelper'

test.describe.serial("valid Sign Up Api Test", () => {
  let headers;
  let newEmail;
  let verificationCode;
  let InviteEmail;
  let organizationId;
  let accessToken;
  let admin_access_token;

  // Generate email and set default headers before all tests
  test.beforeAll(async () => {
    admin_access_token = await getToken();

    newEmail = generateTestEmail();
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  });

  // Test for successful signup and email verification status
  test('If member.verification_status is in Unverified or SingUp', async () => {
    const data = new URLSearchParams({
      firstName: ValidTestData.firstName,
      lastName: ValidTestData.lastName,
      organizationName: ValidTestData.organizationName,
      email: newEmail,
    });
    const response = await postRequest(API_ENDPOINTS.onboardSignup, data, headers);

    const { receivedVerificationCode } = await getGmailMessages();  // Fetch Gmail message for verification code
    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('verificationCode', receivedVerificationCode);
    expect(responseBody).toHaveProperty('email', newEmail);
  })

  // Resend the Verification code 
  test('Send the ONBOARDING_SIGNUP with the existing verification code', async () => {

    const resendParams = new URLSearchParams({email: newEmail})
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
    verificationCode = receivedVerificationCode; // Storing verification code for next steps
  
  })

   // Test for verification is correct and given password
  test('If the member exists and verification is correct', async () => {
    const data = new URLSearchParams({
      verificationCode: verificationCode,
      email: newEmail,
      password: ValidTestData.Password
    });

    const response = await postRequest(API_ENDPOINTS.onboardVerify, data, headers);    // Send the Post Request for verify verificationCode, email, password
    const responseBody = await response.json();
    expect(response.status).toBe(200);
    expect(responseBody).toHaveProperty('email', newEmail);
  })

  // before Invite the new member set the new member as an Admin
  test('Set the member to Admin', async () => {
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
  })

  // Test for inviting a new user to an organization and verifying the invite process
  ValidTestData.Approve.forEach(({ description, reject, expectedSubject }) => {

    test.describe.serial(`Approval Case: ${description}`, () => {

    test(`Invite a new user to the organization for ${description}`, async () => {

      // Authenticate the admin member and Store token for inviting process
      const authdata = new URLSearchParams({
        username: newEmail,
        password: ValidTestData.Password,
      });
      const authResponse = await postRequest(API_ENDPOINTS.authTOken, authdata, headers);
      expect(authResponse.status).toBe(200);
      const authResponseBody = await authResponse.json();
      accessToken = authResponseBody.access_token;

      // Generate random email for invite and send the post request for Invite
      InviteEmail = generateTestEmail();  
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
      const {  subject, body } = await getGmailMessages();
      expect(subject).toBe(`${ValidTestData.organizationName} has invited you to Centigrade`);
      const expectedLinkPattern = /Accept invitation \[(https?:\/\/[^\]]+)\]/;
      const invitationLink = body.match(expectedLinkPattern)[1];
      expect(invitationLink).toContain(`https://devfoundry.centigrade.earth/create-account`);

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
      const inviteSignUpBody = await inviteSignUpResponse.json();
      const inviteVerificationCode = inviteSignUpBody.verificationCode;

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
      expect(subject).toBe(expectedSubject);
    })

  })
});
})
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/loginPage";
import { ProjectsPage } from "../../../pages/projectsPage"
import { getData } from "../../utils/apiHelper";
import { generateTestEmail, getGmailMessages } from "../../utils/signUpHelper";
import API_ENDPOINTS from "../../../api/apiEndpoints";
import { inValidTestData, ValidTestData } from "../../data/SignUpData";
import { Credentials } from "../../data/testData";
import { SignUpPage } from "../../../pages/signUpPage";

test.describe('Member Invitation and Approval Flow', () => {

  const { newEmail } = getData('Integration');

  let InviteEmail;

  // before Invite the new member set the new member as an Admin
  test('Set member to Admin role', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const projectsPage = new ProjectsPage(page);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.enterEmail(Credentials.username);
    await loginPage.enterPassword(Credentials.password);
    await loginPage.submit();
    await page.waitForLoadState('networkidle');

    // Navigate to the setting page
    await projectsPage.selectOrg(ValidTestData.organizationName);
    await projectsPage.setting();
    await projectsPage.teamButton();

    // Update the member Role
    await projectsPage.UpdateinAdmin();

    //Wait for response member
    await page.waitForResponse(response =>
      response.url() === 'https://devapi.centigrade.earth/member' && response.status() === 200
    );
    await page.waitForTimeout(2000);

    const admin = await projectsPage.adminrole();
    expect(admin).toBe('Admin');
  })

  // Test for Invite the member and after sign up auto approved
  test('invite Member and auto approved', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const projectsPage = new ProjectsPage(page);
    InviteEmail = generateTestEmail();

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.enterEmail(newEmail);
    await loginPage.enterPassword(ValidTestData.newPassword);
    await loginPage.submit();

    await projectsPage.setting();
    await projectsPage.teamButton();

    await projectsPage.inviteUser(InviteEmail);
    await projectsPage.sendInvitation();
    await page.waitForResponse(response =>
      response.url() === API_ENDPOINTS.onboardInvite && response.status() === 200
    );
    await page.waitForTimeout(3000);
    const inviteSuccessMessage = await projectsPage.inviteSuccessMessage();
    expect(inviteSuccessMessage).toBe(`An invitation with instructions on how to join ${ValidTestData.organizationName} on Centigrade has been sent to`)

    const inviteSuccessEmail = await projectsPage.inviteSuccessEmail();
    expect(inviteSuccessEmail).toBe(InviteEmail);

    // Fetch Gmail invite email
    const { subject, body } = await getGmailMessages();
    expect(subject).toBe(`${ValidTestData.organizationName} has invited you to Centigrade`);
    const expectedLinkPattern = /Accept invitation \[(https?:\/\/[^\]]+)\]/;
    const invitationLink = body.match(expectedLinkPattern)[1];
    expect(invitationLink).toContain(`https://devfoundry.centigrade.earth/create-account`);

    await page.goto(invitationLink);
    await page.waitForResponse(response =>
      response.url() === API_ENDPOINTS.organization && response.status() === 200
    );
    await page.waitForTimeout(2000);
    const signUpPage = new SignUpPage(page);

    await signUpPage.firstName(ValidTestData.Invite.firstName);
    await signUpPage.lastName(ValidTestData.Invite.lastName);
    await signUpPage.checkBox();
    await signUpPage.signUp();
    const { receivedVerificationCode } = await getGmailMessages();
    await signUpPage.codeInput(receivedVerificationCode);
    await signUpPage.Password(ValidTestData.Password);
    await signUpPage.createAccount();
    await page.waitForResponse(response =>
      response.url().includes('https://devapi.centigrade.earth/public/projects') && response.status() === 200
    );
    expect(page.url()).toContain('/listings');
  })


  // Test for inviting a new user to an organization and verifying the invite process
  ValidTestData.Approve.forEach(({ description, expectedSubject }) => {

    // Test for Inviting the user 
    test(`Invite a new user to the organization for ${description}`, async ({ page }) => {
      InviteEmail = generateTestEmail();
      const signUpPage = new SignUpPage(page);

      await signUpPage.navigate();
      await signUpPage.firstName(inValidTestData.firstName);
      await signUpPage.lastName(inValidTestData.lastName);
      await signUpPage.organizationName(ValidTestData.organizationName);
      await signUpPage.email(InviteEmail);
      await signUpPage.checkBox();
      await signUpPage.signUp();
      const { receivedVerificationCode } = await getGmailMessages(InviteEmail);
      await signUpPage.codeInput(receivedVerificationCode);
      await signUpPage.Password(ValidTestData.Password);
      await signUpPage.createAccount();
      await page.waitForResponse(response =>
        response.url().includes('/organization/') && response.status() === 200
      );
      await page.waitForURL('**/awaiting-approval');
      expect(page.url()).toContain('/awaiting-approval');
    })

    // Test for approving or rejecting the invite
    test(`${description} the invite request`, async ({ page }) => {

      const loginPage = new LoginPage(page);
      const projectsPage = new ProjectsPage(page);

      // Navigate to login page and perform login
      await loginPage.navigate();
      await loginPage.enterEmail(newEmail);
      await loginPage.enterPassword(ValidTestData.newPassword);
      await loginPage.submit();

      await projectsPage.setting();
      await projectsPage.teamButton();
      await projectsPage.rejectApproveButton(description, InviteEmail);

      const approveResponse = await page.waitForResponse(
        response => response.url().includes(API_ENDPOINTS.onboardApprove)
      );

      const approveResponseBody = await approveResponse.json();

      expect(approveResponse.status()).toBe(200);
      expect(approveResponseBody).toHaveProperty('email', InviteEmail);

      // Fetch Gmail approval email  
      const { subject } = await getGmailMessages();
      expect(subject).toBe(expectedSubject);

    })

  })

})
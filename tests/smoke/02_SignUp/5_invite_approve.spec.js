import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../pages/loginPage";
import { ProjectsPage } from "../../../pages/projectsPage";
import { SettingsPage } from "../../../pages/settingsPage"
import { getData } from "../../utils/apiHelper";
import { generateTestEmail, getGmailMessages } from "../../utils/signUpHelper";
import API_ENDPOINTS from "../../../api/apiEndpoints";
import { inValidTestData, ValidTestData } from "../../data/SignUpData";
import { Credentials } from "../../data/testData";
import { SignUpPage } from "../../../pages/signUpPage";

test.describe('Member Invitation and Approval Flow', () => {

  const { newEmail } = getData('Smoke');
  let InviteEmail;

  test('Verify user with member role cannot access organization and team pages', async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);

    const settingsPage = new SettingsPage(page, baseURL);

    // Click on the settings button
    const settingButton = await settingsPage.settingButton();
    await settingButton.click();

    // Verify organization and team tabs are disabled for member role
    await expect(await settingsPage.organizationTab()).not.toBeVisible();
    await expect(await settingsPage.teamTab()).not.toBeVisible();
  })

  // before Invite the new member set the new member as an Admin
  test('Set member to Admin role', async ({ page, baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(Credentials.username, Credentials.password);
    await page.waitForLoadState('networkidle');

    // Navigate to the setting page
    await projectsPage.selectOrg(ValidTestData.organizationName);
    await projectsPage.setting();
    await projectsPage.teamButton();

    // Update the member Role
    await projectsPage.UpdateinAdmin(newEmail);

    //Wait for response member
    await page.waitForResponse(response =>
      response.url() === API_ENDPOINTS.getMember && response.status() === 200
    );
    await page.waitForTimeout(2000);

    const admin = await projectsPage.adminrole(newEmail);
    expect(admin).toBe('Admin');

    const resetButton = await projectsPage.resetButton();
    await resetButton.click();
    await projectsPage.setting();
  })

  test('Verify user with Admin role can access organization and team pages', async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);
    
    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);
  
    const settingsPage = new SettingsPage(page, baseURL);
    
    // Click on the settings button
    const settingButton = await settingsPage.settingButton();
    await settingButton.click();
  
    // Verify organization and team tabs are disabled for member role
    await expect(await settingsPage.organizationTab()).toBeVisible();
    await expect(await settingsPage.organizationTab()).toBeEnabled();
    await expect(await settingsPage.teamTab()).toBeVisible();
    await expect(await settingsPage.teamTab()).toBeEnabled();
  });
  

  // Test for Invite the member and after sign up auto approved
  test('Invite a user to join the organization and auto-approve the invite', async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page);
    InviteEmail = generateTestEmail();

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);

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
    const { subject, body } = await getGmailMessages(InviteEmail);
    expect(subject).toBe(`${ValidTestData.organizationName} has invited you to Centigrade`);
    const expectedLinkPattern = /Accept invitation \[(https?:\/\/[^\]]+)\]/;
    const invitationLink = body.match(expectedLinkPattern)[1];
    expect(invitationLink).toContain(`${baseURL}/create-account`);

    await page.goto(invitationLink);
    await page.waitForResponse(response =>
      response.url() === API_ENDPOINTS.organization && response.status() === 200
    );
    await page.waitForTimeout(2000);
    const signUpPage = new SignUpPage(page, baseURL);

    await signUpPage.firstName(ValidTestData.Invite.firstName);
    await signUpPage.lastName(ValidTestData.Invite.lastName);
    await signUpPage.checkBox();
    await signUpPage.signUp();
    const { receivedVerificationCode } = await getGmailMessages(InviteEmail);
    await signUpPage.codeInput(receivedVerificationCode);
    await signUpPage.Password(ValidTestData.Password);
    await signUpPage.createAccount();
    await page.waitForResponse(response =>
      response.url().includes(API_ENDPOINTS.publicProject) && response.status() === 200
    );
    expect(page.url()).toContain('/listings');
  })


  // Test for inviting a new user to an organization and verifying the invite process
  ValidTestData.Approve.forEach(({ description, expectedSubject }) => {

    // Test for Inviting the user 
    test(`Sign up a new user to join the existing organization for ${description}`, async ({ page, baseURL }) => {
      InviteEmail = generateTestEmail();
      const signUpPage = new SignUpPage(page, baseURL);

      await signUpPage.completeSignUpProcess(inValidTestData.firstName, inValidTestData.lastName, ValidTestData.organizationName, InviteEmail);
      
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

    // Test for approving or rejecting the request
    test(`Admin ${description} the request`, async ({ page, baseURL }) => {

      const loginPage = new LoginPage(page, baseURL);
      const projectsPage = new ProjectsPage(page);

      // Navigate to login page and perform login
      await loginPage.navigate();
      await loginPage.login(newEmail, ValidTestData.newPassword);

      await projectsPage.setting();
      await projectsPage.teamButton();
      await projectsPage.rejectApproveButton(description, InviteEmail);

      const approveResponse = await page.waitForResponse(
        response => response.url().includes(API_ENDPOINTS.onboardApprove)
      );
      expect(approveResponse.status()).toBe(200);

      // Fetch Gmail approval email  
      const { subject } = await getGmailMessages(InviteEmail);
      expect(subject).toBe(expectedSubject);
    })

  })

})
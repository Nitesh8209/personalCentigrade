import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import { SignUpPage } from '../../../pages/signUpPage';
import { generateTestEmail, getGmailMessages } from '../../utils/signUpHelper';
import { ValidTestData } from '../../data/SignUpData';
import { getData, saveData } from '../../utils/apiHelper';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { ProjectsPage } from '../../../pages/projectsPage';
import { Credentials } from '../../data/testData';

// Describe the test suite for awaiting-approval Page UI Tests
test.describe('awaiting-approval Page UI Tests', () => {
  const { newEmail } = getData('UI');

  // Function to login and navigate to the settings page
  async function loginAndNavigateToSettings(page, baseURL) {
    const loginPage = new LoginPage(page, baseURL);
    const projectsPage = new ProjectsPage(page, baseURL);

    // Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(Credentials.username, Credentials.password);
    await page.waitForLoadState('networkidle');

    // Navigate to the settings page
    await projectsPage.selectOrg(ValidTestData.organizationName);
    await projectsPage.setting();
    await projectsPage.teamButton();

    return projectsPage;
  }

  // Test to set a member to Admin role
  test('Set member to Admin role', async ({ page, baseURL }) => {
    const projectsPage = await loginAndNavigateToSettings(page, baseURL);

    // Update the member role to Admin
    await projectsPage.UpdateinAdmin(newEmail);
    await page.waitForResponse(response =>
      response.url() === API_ENDPOINTS.getMember && response.status() === 200
    );
    await page.waitForTimeout(2000);

    // Verify the member role is updated to Admin
    await expect(await projectsPage.adminrole(newEmail)).toBe('Admin');

    // Reset the settings
    const resetButton = await projectsPage.resetButton();
    await resetButton.click();
    await projectsPage.setting();
  });

  // Test to verify sign-up in an existing organization and navigation to the awaiting-approval page
  test('Verify sign-up in an existing organization and navigation to the awaiting-approval page', async ({ page, baseURL }) => {
    const InviteEmail = generateTestEmail();
    const signUpPage = new SignUpPage(page, baseURL);

    // Complete the sign-up process
    await signUpPage.completeSignUpProcess(ValidTestData.firstName, ValidTestData.lastName, ValidTestData.organizationName, InviteEmail);

    // Get the verification code from email and complete the sign-up
    const { receivedVerificationCode } = await getGmailMessages(InviteEmail);
    await signUpPage.codeInput(receivedVerificationCode);
    await signUpPage.Password(ValidTestData.Password);
    await signUpPage.createAccount();

    await saveData({ InviteEmail: InviteEmail }, 'UI');

    // Wait for the URL to change to the "awaiting-approval" page and verify the URL
    await page.waitForURL('**/awaiting-approval');
    expect(page.url()).toContain('/awaiting-approval');

    // Verify the presence and correctness of various UI elements on the awaiting-approval page
    const elements = await Promise.all([
      signUpPage.awaitingApprovalleft(),
      signUpPage.logo(),
      signUpPage.awaitingApprovalheading(),
      signUpPage.awaitingApprovalnotificationText(),
      signUpPage.awaitingApprovalbackToProjectsLink(),
      signUpPage.awaitingApprovalcontactSupportLink()
    ]);

    const [
      awaitingApprovalleft,
      logo,
      awaitingApprovalheading,
      awaitingApprovalnotificationText,
      awaitingApprovalbackToProjectsLink,
      awaitingApprovalcontactSupportLink
    ] = elements;

    await expect(awaitingApprovalleft).toBeVisible();
    await expect(logo).toBeVisible();
    await expect(awaitingApprovalheading).toBeVisible();
    await expect(awaitingApprovalheading).toHaveText('Awaiting approval');

    // Verify the notification text content
    await expect(awaitingApprovalnotificationText.nth(0)).toBeVisible();
    await expect(awaitingApprovalnotificationText.nth(0)).toHaveText(
      `The administrator has been notified about your request to join ${ValidTestData.organizationName} on Centigrade.`
    );
    await expect(awaitingApprovalnotificationText.nth(1)).toBeVisible();
    await expect(awaitingApprovalnotificationText.nth(1)).toHaveText(
      'You will be notified by email once your request has been approved, after which you will be able to log in and collaborate on projects.'
    );

    // Verify the "Back to projects" link
    await expect(awaitingApprovalbackToProjectsLink).toBeVisible();
    await expect(awaitingApprovalbackToProjectsLink).toHaveText('Back to projects');
    await expect(awaitingApprovalbackToProjectsLink).toHaveAttribute('href', '/listings');

    // Verify the "Contact support" link
    await expect(awaitingApprovalcontactSupportLink).toBeVisible();
    await expect(awaitingApprovalcontactSupportLink).toHaveText('Contact support');
    await expect(awaitingApprovalcontactSupportLink).toHaveAttribute('href', 'mailto:support@centigrade.earth');
  });
});
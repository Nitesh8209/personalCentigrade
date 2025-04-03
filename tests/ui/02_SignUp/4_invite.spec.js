import { test, expect } from '@playwright/test';
import { SignUpPage } from '../../../pages/signUpPage';
import { generateTestEmail, getGmailMessages } from '../../utils/signUpHelper';
import { ValidTestData } from '../../data/SignUpData';
import { getData, saveData } from '../../utils/apiHelper';

// Describe the test suite for awaiting-approval Page UI Tests
test.describe('awaiting-approval Page UI Tests', {tag: '@UI'}, () => {

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
import { test, expect } from '@playwright/test';
import { SignUpPage } from '../../../pages/signUpPage';
import { getGmailMessages } from '../../utils/signUpHelper';
import { inValidTestData, ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';

test.describe('Verification Code Page UI Tests', () => {
  const { newEmail } = getData('UI');
  let receivedVerificationCode;

  // Test case: Successful resend of the verification code
  test('Successful resend verification code', async ({ page, baseURL }) => {
    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to the verification page using the provided email
    await signUpPage.navigateVerification(newEmail);
    const verificationCoderesendlink = await signUpPage.verificationCoderesendlink();
    await verificationCoderesendlink.click();
    const getSuccessMessage = await signUpPage.getSuccessMessage();
    expect(getSuccessMessage).toBe('Email has been sent');

    // Retrieve the verification code from the email inbox
    const result = await getGmailMessages(newEmail);
    receivedVerificationCode = result.receivedVerificationCode;
  })

  // Test case: Resend verification code to an invalid user
  test('resend verification code to invalid user', async ({ page, baseURL }) => {
    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to the verification page using an invalid email
    await signUpPage.navigateVerification(inValidTestData.InvalidEmail);

    // Trigger resend verification code and verify the error message
    const verificationCoderesendlink = await signUpPage.verificationCoderesendlink();
    await verificationCoderesendlink.click();

    const errorMessage = await signUpPage.getErrorMessage();
    expect(errorMessage).toBe('Unable to complete this request due to an issue. Try again later.');
  })

  // Test case: Successful verification with correct code and password
  // and landing on the "awaiting-approval" page
  test('Successful verification with correct code and password and land on the awaiting-approval approval page', async ({ page, baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to the verification page using the provided email
    await signUpPage.navigateVerification(newEmail);
    await signUpPage.codeInput(receivedVerificationCode);
    await signUpPage.Password(ValidTestData.Password);
    await signUpPage.createAccount();

    // Wait for the URL to change to the "awaiting-approval" page and verify the URL
    await page.waitForURL('**/awaiting-approval');
    expect(page.url()).toContain('/awaiting-approval');

    // Verify the presence and correctness of various UI elements on the awaiting-approval page
    const awaitingApprovalleft = await signUpPage.awaitingApprovalleft();
    const logo = await signUpPage.logo();
    const awaitingApprovalheading = await signUpPage.awaitingApprovalheading();
    const awaitingApprovalnotificationText = await signUpPage.awaitingApprovalnotificationText();
    const awaitingApprovalbackToProjectsLink = await signUpPage.awaitingApprovalbackToProjectsLink();
    const awaitingApprovalcontactSupportLink = await signUpPage.awaitingApprovalcontactSupportLink();

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
  })


});
import { test, expect } from '@playwright/test';
import { SignUpPage } from '../../../pages/signUpPage';
import { getGmailMessages } from '../../utils/signUpHelper';
import { inValidTestData, ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';
import { SettingsPage } from '../../../pages/settingsPage';

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
    const settingsPage = new SettingsPage(page, baseURL);

    // Navigate to the verification page using the provided email
    await signUpPage.navigateVerification(newEmail);
    await signUpPage.codeInput(receivedVerificationCode);
    await signUpPage.Password(ValidTestData.Password);
    await signUpPage.createAccount();


    await page.waitForURL('**/listings');
    expect(page.url()).toContain('/listings');
    
    const settingButton = await settingsPage.settingButton();
    await settingButton.click();

    await expect(await settingsPage.tabList()).toBeVisible();
    await expect(await settingsPage.myAccountTab()).toBeVisible();
    await expect(await settingsPage.myAccountTab()).toHaveAttribute('aria-selected', 'true');
    await expect(await settingsPage.organizationTab()).not.toBeVisible();
    await expect(await settingsPage.teamTab()).not.toBeVisible();

   })


});
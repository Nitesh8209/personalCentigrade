import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import { SettingsPage } from "../../../pages/settingsPage";
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';

test.describe('Settings - My Account Page UI Tests', () => {
  const { newEmail } = getData('UI');

  let loginPage;
  let settingsPage;
  let page;

  test.beforeAll(async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page, baseURL);
    settingsPage = new SettingsPage(page, baseURL);

    // Navigate to the login page and Login
    await loginPage.navigate();
    await loginPage.login(newEmail, ValidTestData.newPassword);
  });

  // Close the browser page after all tests are complete
  test.afterAll(async () => {
    await page.close();
  });

  test('Verify Settings - My Account page elements are displayed correctly', async ({ }) => {

    const settingButton = await settingsPage.settingButton();
    await settingButton.click();

    // Verify that various elements are displayed correctly on the Settings - My Account page
    await expect(page).toHaveURL(`${loginPage.baseURL}/settings/account`)
    await expect(await settingsPage.breadcrumb()).toBeVisible();
    await expect(await settingsPage.breadcrumb()).toHaveText('Settings');
    await expect(await settingsPage.settingsHeader()).toBeVisible();
    await expect(await settingsPage.headerTitle()).toBeVisible();
    await expect(await settingsPage.headerTitle()).toHaveText('Settings');
    await expect(await settingsPage.headerDescription()).toBeVisible();
    await expect(await settingsPage.headerDescription()).toHaveText('Manage account and organizational settings');

    // Verify tabs are visible and selected correctly
    await expect(await settingsPage.tabList()).toBeVisible();
    await expect(await settingsPage.myAccountTab()).toBeVisible();
    await expect(await settingsPage.myAccountTab()).toHaveAttribute('aria-selected', 'true');
    await expect(await settingsPage.organizationTab()).toBeVisible();
    await expect(await settingsPage.organizationTab()).toHaveAttribute('aria-selected', 'false');
    await expect(await settingsPage.teamTab()).toBeVisible();
    await expect(await settingsPage.teamTab()).toHaveAttribute('aria-selected', 'false');

    // Verify input fields are displayed correctly
    await expect(await settingsPage.firstName()).toBeVisible();
    await expect(await settingsPage.firstName()).toHaveText('First name');
    await expect(await settingsPage.firstNameInput()).toBeVisible();
    await expect(await settingsPage.lastName()).toBeVisible();
    await expect(await settingsPage.lastName()).toHaveText('Last name');
    await expect(await settingsPage.lastNameInput()).toBeVisible();
    await expect(await settingsPage.email()).toBeVisible();
    await expect(await settingsPage.email()).toHaveText('Email');
    await expect(await settingsPage.emailInput()).toBeVisible();
    await expect(await settingsPage.emailInput()).toHaveValue(newEmail);
    await expect(await settingsPage.phoneNumber()).toBeVisible();
    await expect(await settingsPage.phoneNumber()).toHaveText('Phone number');
    await expect(await settingsPage.phoneNumberInput()).toBeVisible();
    await expect(await settingsPage.phoneNumberText()).toBeVisible();
    await expect(await settingsPage.phoneNumberText()).toHaveText('Used for two-factor authentication (2FA). SMS rates may apply.');
    await expect(await settingsPage.passwordText()).toBeVisible();
    await expect(await settingsPage.passwordText()).toHaveText('Password');
    await expect(await settingsPage.passwordButton()).toBeVisible();
    await expect(await settingsPage.passwordButton()).toBeEnabled();
    await expect(await settingsPage.cancelButton()).toBeVisible();
    await expect(await settingsPage.cancelButton()).toBeDisabled();
    await expect(await settingsPage.saveButton()).toBeVisible();
    await expect(await settingsPage.saveButton()).toBeDisabled();
  })

  test('Verify cancel button functionality on Settings - My Account page', async () => {

    const firstName = await settingsPage.firstNameInput()

    // Fill in the new first name and check that the cancel button and save button are enabled
    await firstName.fill(ValidTestData.newFirstName);
    await expect(await settingsPage.cancelButton()).toBeEnabled();
    await expect(await settingsPage.saveButton()).toBeEnabled();

    // Click the cancel button and verify that the unsaved changes modal appears
    const cancelButton = await settingsPage.cancelButton();
    await cancelButton.click();
    await expect(await settingsPage.unsavedChangeModal()).toBeVisible();
    await expect(await settingsPage.unsavedChangeheading()).toBeVisible();
    await expect(await settingsPage.unsavedChangeheading()).toHaveText('Unsaved changes');
    await expect(await settingsPage.unsavedChangediscription()).toBeVisible();
    await expect(await settingsPage.unsavedChangediscription()).toHaveText("Are you sure you want to discard the changes you've made?");
    await expect(await settingsPage.unsavedChangetext()).toBeVisible();
    await expect(await settingsPage.unsavedChangetext()).toHaveText('You cannot undo this action.');
    await expect(await settingsPage.cancelButton()).toBeVisible();
    await expect(await settingsPage.cancelButton()).toBeEnabled();
    await expect(await settingsPage.discardButton()).toBeVisible();
    await expect(await settingsPage.discardButton()).toBeEnabled();

    // Click cancel button multiple times to go back to the original state
    await cancelButton.click();
    expect(firstName).toHaveValue(ValidTestData.newFirstName);
    await expect(await settingsPage.cancelButton()).toBeEnabled();
    await expect(await settingsPage.saveButton()).toBeEnabled();

    await cancelButton.click();
    const discardButton = await settingsPage.discardButton();
    await discardButton.click();
    expect(firstName).toHaveValue(ValidTestData.firstName);
    await expect(await settingsPage.cancelButton()).toBeDisabled();
    await expect(await settingsPage.saveButton()).toBeDisabled();
  })

  test('Verify Save changes button on Settings - My Account page functionality', async () => {

    // Fill in the new first name and click the save button
    const firstName = await settingsPage.firstNameInput();
    await firstName.fill(ValidTestData.newFirstName);
    const saveButton = await settingsPage.saveButton();
    await saveButton.click();

    // Check that the save message is displayed and the changes are saved
    const saveMessage = await settingsPage.saveMessage();
    await expect(await settingsPage.saveMessage()).toBeVisible();
    await expect(saveMessage).toHaveText('Your changes have been saved.');
    expect(firstName).toHaveValue(ValidTestData.newFirstName);
    await expect(await settingsPage.cancelButton()).toBeDisabled();
    await expect(await settingsPage.saveButton()).toBeDisabled();
  })

  test('Verify change password functionality on Settings - My Account page', async () => {

    // Click the change password button and check if it redirects to the appropriate URL
    const passwordButton = await settingsPage.passwordButton();
    await passwordButton.click();
    await expect(page).toHaveURL(`${loginPage.baseURL}/send-email-link`);
  })


});
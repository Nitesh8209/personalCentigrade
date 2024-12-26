import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import { SettingsPage } from "../../../pages/settingsPage";
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';

test.describe('Settings - organization Page UI Tests', () => {
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
    
    // Navigate to Settings and organization Tab
    const settingButton = await settingsPage.settingButton();
    await settingButton.click();
    const orgTab = await settingsPage.organizationTab();
    await orgTab.click();
  });

  // Close the browser page after all tests are complete
  test.afterAll(async () => {
    await page.close();
  });

  test('Verify Settings - organization page elements are displayed correctly', async () => {

    

    // Verify that various elements are displayed correctly on the Settings - organization page
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
    await expect(await settingsPage.myAccountTab()).toHaveAttribute('aria-selected', 'false');;
    await expect(await settingsPage.organizationTab()).toBeVisible();
    await expect(await settingsPage.organizationTab()).toHaveAttribute('aria-selected', 'true');;
    await expect(await settingsPage.teamTab()).toBeVisible();
    await expect(await settingsPage.teamTab()).toHaveAttribute('aria-selected', 'false');;

    // Verify input fields are displayed correctly
    await expect(await settingsPage.orgfunctions()).toBeVisible();
    await expect(await settingsPage.orgfunctions()).toHaveText('Organization functions');
    await expect(await settingsPage.orgfunctiondropdown()).toBeVisible();
    await expect(await settingsPage.orgfunctionhelperText()).toBeVisible();
    await expect(await settingsPage.orgfunctionhelperText()).toHaveText('Your organization can be assigned as these functions on a project');
    await expect(await settingsPage.orgName()).toBeVisible();
    await expect(await settingsPage.orgName()).toHaveText('Organization name');
    await expect(await settingsPage.orgNameInput()).toBeVisible();
    await expect(await settingsPage.orgNameInput()).toHaveValue(ValidTestData.organizationName);
    await expect(await settingsPage.orgNamehelpertext()).toBeVisible();
    await expect(await settingsPage.orgNamehelpertext()).toHaveText('NOTE: Changes made here will be reflected in all projects that this organization is involved with');
    await expect(await settingsPage.orgAddress()).toBeVisible();
    await expect(await settingsPage.orgAddress()).toHaveText('Address');
    await expect(await settingsPage.orgstreetAddress()).toBeVisible();
    await expect(await settingsPage.orgstreetAddress()).toHaveText('Street address');
    await expect(await settingsPage.orgstreetAddressInput()).toBeVisible();
    await expect(await settingsPage.orgcity()).toBeVisible();
    await expect(await settingsPage.orgcity()).toHaveText('City');
    await expect(await settingsPage.orgcityInput()).toBeVisible();
    await expect(await settingsPage.orgCountry()).toBeVisible();
    await expect(await settingsPage.orgCountry()).toHaveText('Country');
    await expect(await settingsPage.orgcountryInput()).toBeVisible();

    // Validate Cancel and Save buttons
    await expect(await settingsPage.cancelButton()).toBeVisible();
    await expect(await settingsPage.cancelButton()).toBeDisabled();
    await expect(await settingsPage.saveButton()).toBeVisible();
    await expect(await settingsPage.saveButton()).toBeDisabled();
  })


  test('Verify cancel button functionality on Settings - Organization page', async () => {

    // open and Select organization functions
    const orgfunctionDropdown = await settingsPage.orgfunctiondropdown();
    await orgfunctionDropdown.click();
    await page.getByLabel('Organization', { exact: true }).getByText('Sponsor').click();
    await page.getByLabel('Organization', { exact: true }).getByText('Registry').click();
    await page.getByLabel('Organization', { exact: true }).getByText('Auditor').click();
    const selectedValues = await settingsPage.orgfunctiondropdownsaelected();
    await expect(selectedValues).toContainText(['Sponsor', 'Registry', 'Auditor']);
    await orgfunctionDropdown.locator('div.select-indicator').click();

    // Validate Cancel and Save buttons are Enabled
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
    await expect(selectedValues).toContainText(['Sponsor', 'Registry', 'Auditor']);
    await expect(await settingsPage.cancelButton()).toBeEnabled();
    await expect(await settingsPage.saveButton()).toBeEnabled();

    await cancelButton.click();
    const discardButton = await settingsPage.discardButton();
    await discardButton.click();
    await expect(selectedValues).toContainText([]);
    await expect(await settingsPage.cancelButton()).toBeDisabled();
    await expect(await settingsPage.saveButton()).toBeDisabled();
  })

  test('Verify Save changes button on Settings - organization page functionality', async () => {

    // Select an organization function and click the save button
    const orgfunctionDropdown = await settingsPage.orgfunctiondropdown();
    await orgfunctionDropdown.click();
    await page.getByLabel('Organization', { exact: true }).getByText('Sponsor').click();
    await orgfunctionDropdown.locator('div.select-indicator').click();

    const saveButton = await settingsPage.saveButton();
    await saveButton.click();
    const saveMessage = await settingsPage.saveMessage();

    // Verify save message and state after saving
    await expect(await settingsPage.saveMessage()).toBeVisible();
    await expect(saveMessage).toHaveText('Your changes have been saved.');
    const selectedValues = await settingsPage.orgfunctiondropdownsaelected();
    await expect(selectedValues).toContainText(['Sponsor']);
    await expect(await settingsPage.cancelButton()).toBeDisabled();
    await expect(await settingsPage.saveButton()).toBeDisabled();

    // Remove an option and verify save message again
    const removeOption = await settingsPage.orgfunctionremoveoption();
    await removeOption.click();
    await expect(await settingsPage.saveMessage()).toBeVisible();
    await expect(saveMessage).toHaveText('Your changes have been saved.');
    await expect(selectedValues).toContainText([]);
  })

});
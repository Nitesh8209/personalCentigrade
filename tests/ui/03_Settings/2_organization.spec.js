import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import { SettingsPage } from "../../../pages/settingsPage";
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';
import { safeExpect } from '../../utils/authHelper';


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

  test('Verify Settings - Header and Tabs are displayed correctly', async () => {
    const errors = [];
  
    // Header section verification
    await safeExpect('Header section elements', async () => {
      await expect(await settingsPage.breadcrumb()).toBeVisible();
      await expect(await settingsPage.breadcrumb()).toHaveText('Settings');
      await expect(await settingsPage.settingsHeader()).toBeVisible();
      await expect(await settingsPage.headerTitle()).toBeVisible();
      await expect(await settingsPage.headerTitle()).toHaveText('Settings');
      await expect(await settingsPage.headerDescription()).toBeVisible();
      await expect(await settingsPage.headerDescription()).toHaveText('Manage account and organizational settings');
    }, errors);
  
    // Tab verification
    await safeExpect('Tab elements and states', async () => {
      await expect(await settingsPage.tabList()).toBeVisible();
      await expect(await settingsPage.myAccountTab()).toBeVisible();
      await expect(await settingsPage.myAccountTab()).toHaveAttribute('aria-selected', 'false');
      await expect(await settingsPage.organizationTab()).toBeVisible();
      await expect(await settingsPage.organizationTab()).toHaveAttribute('aria-selected', 'true');
      await expect(await settingsPage.teamTab()).toBeVisible();
      await expect(await settingsPage.teamTab()).toHaveAttribute('aria-selected', 'false');
    }, errors);
  
    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('Settings - Header and Tabs UI verification failed:\n' + errors.join('\n'));
    }
  });
  

  test('Verify Settings - Organization Details and Action Buttons are displayed correctly', async () => {
    const errors = [];

     // Organization functions section
     await safeExpect('Organization functions section', async () => {
      await expect(await settingsPage.orgfunctions()).toBeVisible();
      await expect(await settingsPage.orgfunctions()).toHaveText('Organization functions');
      await expect(await settingsPage.orgfunctiondropdown()).toBeVisible();
      await expect(await settingsPage.orgfunctionhelperText()).toBeVisible();
      await expect(await settingsPage.orgfunctionhelperText()).toHaveText('Your organization can be assigned as these functions on a project');
    }, errors);

    // Organization name section
    await safeExpect('Organization name section', async () => {
      await expect(await settingsPage.orgName()).toBeVisible();
      await expect(await settingsPage.orgName()).toHaveText('Organization name');
      await expect(await settingsPage.orgNameInput()).toBeVisible();
      await expect(await settingsPage.orgNameInput()).toHaveValue(ValidTestData.organizationName);
      await expect(await settingsPage.orgNamehelpertext()).toBeVisible();
      await expect(await settingsPage.orgNamehelpertext()).toHaveText('NOTE: Changes made here will be reflected in all projects that this organization is involved with');
    }, errors);

    // Organization address section
    await safeExpect('Organization address section', async () => {
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
    }, errors);

    // Action buttons verification
    await safeExpect('Action buttons state', async () => {
      await expect(await settingsPage.cancelButton()).toBeVisible();
      await expect(await settingsPage.cancelButton()).toBeDisabled();
      await expect(await settingsPage.saveButton()).toBeVisible();
      await expect(await settingsPage.saveButton()).toBeDisabled();
    }, errors);

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('Settings - organization Details and Action Buttons UI verification failed:\n' + errors.join('\n'));
    }

  })

  test('Verify organization functions dropdown selection functionality', async () => {

    // Open dropdown and select organization functions
    const optionsToSelect = ['Sponsor'];
    await settingsPage.selectOrganizationFunctions(optionsToSelect);
    
    // Verify selected values
    const selectedValues = await settingsPage.orgfunctiondropdownsaelected();
    await expect(selectedValues).toContainText(['Sponsor']);

    // close dropdown
    const orgfunctionDropdown = await settingsPage.orgfunctiondropdown();
    await orgfunctionDropdown.locator('div.select-indicator').click();
    
    // Remove one selected option and verify
    const removeOption = await settingsPage.orgfunctionremoveoption();
    await removeOption.nth(0).click();
    await expect(selectedValues).toContainText([]);
});


test('Verify unsaved changes modal on Settings - Organization page', async () => {
  const errors = [];
    const optionsToSelect = ['Sponsor', 'Registry', 'Auditor'];
    await settingsPage.selectOrganizationFunctions(optionsToSelect);

   // Verify button states after selection
   await safeExpect('Button states after selection', async () => {
    await expect(await settingsPage.cancelButton()).toBeEnabled();
    await expect(await settingsPage.saveButton()).toBeEnabled();
  }, errors);

  // Click the cancel button on the org page and verify that the unsaved changes modal appears
  const cancelButton = await settingsPage.cancelButton();
  await safeExpect('Unsaved changes modal content', async () => {
    await cancelButton.click();
    await expect(await settingsPage.unsavedChangeModal()).toBeVisible();
    await expect(await settingsPage.unsavedChangeheading()).toBeVisible();
    await expect(await settingsPage.unsavedChangeheading()).toHaveText('Unsaved changes');
    await expect(await settingsPage.unsavedChangediscription()).toBeVisible();
    await expect(await settingsPage.unsavedChangediscription()).toHaveText("Are you sure you want to discard the changes you've made?");
    await expect(await settingsPage.unsavedChangetext()).toBeVisible();
    await expect(await settingsPage.unsavedChangetext()).toHaveText('You cannot undo this action.');
  }, errors);

  // Verify button states after modal appears
  await safeExpect('Modal button states', async () => {
    await expect(await settingsPage.cancelButton()).toBeVisible();
    await expect(await settingsPage.cancelButton()).toBeEnabled();
    await expect(await settingsPage.discardButton()).toBeVisible();
    await expect(await settingsPage.discardButton()).toBeEnabled();
    await cancelButton.click();
  }, errors);


  // If there are any errors, fail the test with all collected errors
  if (errors.length > 0) {
    throw new Error('Settings - organization unsaved changes modal verification failed:\n' + errors.join('\n'));
  }
});


  test('Verify cancel and discard functionality in the unsaved changes modal on Settings - Organization page', async () => {

    const errors = [];
    const cancelButton = await settingsPage.cancelButton();
    const selectedValues = await settingsPage.orgfunctiondropdownsaelected();

    // Click the cancel button on the org page 
    await cancelButton.click();

    // click the cancel button in the unsaved changes modal
    await safeExpect('State after click on cancel button in the unsaved changes modal', async () => {
      await cancelButton.click();
      await expect(selectedValues).toContainText(['Sponsor', 'Registry', 'Auditor']);
      await expect(await settingsPage.cancelButton()).toBeEnabled();
      await expect(await settingsPage.saveButton()).toBeEnabled();
    }, errors);

    // Click on the cancel button in the org page and click on the Discard button in the unsaved changes modal
    await safeExpect('State after click on Discard button in the unsaved changes modal', async () => {
      await cancelButton.click();
      const discardButton = await settingsPage.discardButton();
      await discardButton.click();
      await expect(selectedValues).toContainText([]);
      await expect(await settingsPage.cancelButton()).toBeDisabled();
      await expect(await settingsPage.saveButton()).toBeDisabled();
    }, errors);

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('Settings - Organization page cancel and discard functionality in the unsaved changes modal verification failed:\n' + errors.join('\n'));
    }

  })

  test('Verify Save changes button on Settings - organization page functionality', async () => {

    // Select an organization function and click the save button
    const optionsToSelect = ['Sponsor'];
    await settingsPage.selectOrganizationFunctions(optionsToSelect);

    const orgfunctionDropdown = await settingsPage.orgfunctiondropdown();
    await orgfunctionDropdown.locator('div.select-indicator').click();

    // Click the save button 
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
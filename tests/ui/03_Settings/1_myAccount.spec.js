import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import { SettingsPage } from "../../../pages/settingsPage";
import { ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';
import { safeExpect } from '../../utils/authHelper';


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

    const settingButton = await settingsPage.settingButton();
    await settingButton.click();
  });

  // Close the browser page after all tests are complete
  test.afterAll(async () => {
    await page.close();
  });

  test('Verify navigation, header and Tab UI elements on the Settings - My Account page', async ({ }) => {
    const errors = [];

    // URL verification
    await safeExpect('URL is correct',
      async () => expect(page).toHaveURL(`${loginPage.baseURL}/settings/account`),
      errors
    );

    // Breadcrumb verification
    await safeExpect('Breadcrumb visibility and text',
      async () => {
        await expect(await settingsPage.breadcrumb()).toBeVisible();
        await expect(await settingsPage.breadcrumb()).toHaveText('Settings');
      },
      errors
    );

    // Header section verification
    await safeExpect('Header elements',
      async () => {
        await expect(await settingsPage.settingsHeader()).toBeVisible();
        await expect(await settingsPage.headerTitle()).toBeVisible();
        await expect(await settingsPage.headerTitle()).toHaveText('Settings');
        await expect(await settingsPage.headerDescription()).toBeVisible();
        await expect(await settingsPage.headerDescription()).toHaveText('Manage account and organizational settings');
      },
      errors
    );

    // Tab verification
    await safeExpect('Tab elements and states',
      async () => {
        await expect(await settingsPage.tabList()).toBeVisible();
        await expect(await settingsPage.myAccountTab()).toBeVisible();
        await expect(await settingsPage.myAccountTab()).toHaveAttribute('aria-selected', 'true');
        await expect(await settingsPage.organizationTab()).toBeVisible();
        await expect(await settingsPage.organizationTab()).toHaveAttribute('aria-selected', 'false');
        await expect(await settingsPage.teamTab()).toBeVisible();
        await expect(await settingsPage.teamTab()).toHaveAttribute('aria-selected', 'false');
      },
      errors
    );

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('Settings - My Account page UI verification failed:\n' + errors.join('\n'));
    }
  })


  test('Verify Name, Email, Phone Number and Password fields on the Settings - My Account page', async () => {
    const errors = [];

    // First Name and Last Name verification
    await safeExpect('Name fields',
      async () => {
        await expect(await settingsPage.firstName()).toBeVisible();
        await expect(await settingsPage.firstName()).toHaveText('First name');
        await expect(await settingsPage.firstNameInput()).toBeVisible();
        await expect(await settingsPage.lastName()).toBeVisible();
        await expect(await settingsPage.lastName()).toHaveText('Last name');
        await expect(await settingsPage.lastNameInput()).toBeVisible();
      },
      errors
    );

    // Email verification
    await safeExpect('Email field',
      async () => {
        await expect(await settingsPage.email()).toBeVisible();
        await expect(await settingsPage.email()).toHaveText('Email');
        await expect(await settingsPage.emailInput()).toBeVisible();
        await expect(await settingsPage.emailInput()).toHaveValue(newEmail);
      },
      errors
    );

    // Phone number verification
    await safeExpect('Phone number field',
      async () => {
        await expect(await settingsPage.phoneNumber()).toBeVisible();
        await expect(await settingsPage.phoneNumber()).toHaveText('Phone number');
        await expect(await settingsPage.phoneNumberInput()).toBeVisible();
        await expect(await settingsPage.phoneNumberText()).toBeVisible();
        await expect(await settingsPage.phoneNumberText()).toHaveText('Used for two-factor authentication (2FA). SMS rates may apply.');
      },
      errors
    );

    // Password verification
    await safeExpect('Password section',
      async () => {
        await expect(await settingsPage.passwordText()).toBeVisible();
        await expect(await settingsPage.passwordText()).toHaveText('Password');
        await expect(await settingsPage.passwordButton()).toBeVisible();
        await expect(await settingsPage.passwordButton()).toBeEnabled();
      },
      errors
    );

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('Settings - My Account Fields verification failed:\n' + errors.join('\n'));
    }
  });

  test('Verify Action buttons and states on Settings - My Account page', async () => {
    const errors = [];

    // cancel ans save buttons verification
    await safeExpect('Action buttons',
      async () => {
        await expect(await settingsPage.cancelButton()).toBeVisible();
        await expect(await settingsPage.cancelButton()).toBeDisabled();
        await expect(await settingsPage.saveButton()).toBeVisible();
        await expect(await settingsPage.saveButton()).toBeDisabled();
      },
      errors
    );

    const firstName = await settingsPage.firstNameInput()

    // Fill in the new first name and check that the cancel button and save button are enabled
    await firstName.fill(ValidTestData.newFirstName);
    await safeExpect('Initial button states after input', async () => {
      await expect(await settingsPage.cancelButton()).toBeEnabled();
      await expect(await settingsPage.saveButton()).toBeEnabled();
    },
      errors
    );

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('Settings - My Account buttons verification failed:\n' + errors.join('\n'));
    }
  });

  test('Verify unsaved changes modal on Settings - My Account page', async () => {
    const errors = [];

    const firstName = await settingsPage.firstNameInput()
    await firstName.fill(ValidTestData.newFirstName);

    // Click the cancel button and verify that the unsaved changes modal appears
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
    },
      errors
    );

    // Check that the modal buttons are visible and enabled
    await safeExpect('Modal button states', async () => {
      await expect(await settingsPage.cancelButton()).toBeVisible();
      await expect(await settingsPage.cancelButton()).toBeEnabled();
      await expect(await settingsPage.discardButton()).toBeVisible();
      await expect(await settingsPage.discardButton()).toBeEnabled();
      await cancelButton.click();
    },
      errors
    );

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('Settings - My Account unsaved changes modal verification failed:\n' + errors.join('\n'));
    }
  });

  test('Verify cancel and discard functionality in the unsaved changes modal on Settings - My Account page', async () => {
    const errors = [];
    const cancelButton = await settingsPage.cancelButton();
    const firstName = await settingsPage.firstNameInput();
    await firstName.fill(ValidTestData.newFirstName);

    // click on the cancel button in the My Account page 
    await cancelButton.click();

    // click the button in the unsaved changes modal
    await cancelButton.click();
    await safeExpect('State after click on cancel button in the unsaved changes modal', async () => {
      await expect(await settingsPage.unsavedChangeModal()).not.toBeVisible();
      await expect(firstName).toHaveValue(ValidTestData.newFirstName);
      await expect(await settingsPage.cancelButton()).toBeEnabled();
      await expect(await settingsPage.saveButton()).toBeEnabled();
    },
      errors
    );

    // Click on the cancel button in the My Account page and click on the Discard button in the unsaved changes modal
    await cancelButton.click();
    const discardButton = await settingsPage.discardButton();
    await discardButton.click();

    // Check that the first name is reset to the original value and the buttons are disabled
    await safeExpect('State after click on discard button in the unsaved changes modal', async () => {
      await expect(await settingsPage.unsavedChangeModal()).not.toBeVisible();
      await expect(firstName).toHaveValue(ValidTestData.firstName);
      await expect(await settingsPage.cancelButton()).toBeDisabled();
      await expect(await settingsPage.saveButton()).toBeDisabled();
    },
      errors
    );

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('Settings - My Account cancel and deiscard button on unsaved changes modal verification failed:\n' + errors.join('\n'));
    }
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
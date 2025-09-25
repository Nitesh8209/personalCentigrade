import { test, expect } from '@playwright/test';
import { Credentials } from '../../data/testData';
import { LoginPage } from "../../../pages/loginPage";
import { SignUpPage } from '../../../pages/signUpPage';
import { generateTestEmail } from '../../utils/signUpHelper';
import { ValidTestData } from '../../data/SignUpData';
import { saveData } from '../../utils/apiHelper';
import { CreateAccountPage } from '../../../pages/createAccountPage';

test.describe('Create Account Page UI Tests', { tag: '@UI' }, () => {
  let page;
  let loginPage;
  let createAccountPage;
  let signUpPage;

  const RADIO_OPTIONS = [
        'Listing projects on Centigrade',
        'Providing a service to projects (e.g., dMRV, VVB, rater)',
        'Finding and evaluating projects',
        'Other',
    ];

  // Setup: Generate a new email before all tests
  test.beforeAll(async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    loginPage = new LoginPage(page, baseURL);
    createAccountPage = new CreateAccountPage(page, baseURL);
    signUpPage = new SignUpPage(page, baseURL);

    await loginPage.navigate();
    await loginPage.acceptAll();
  });

  // Close the browser page after all tests are complete
  test.afterAll(async () => {
    await page?.close();
  });

  // Test 1: Verify UI elements and functionality of the Create Account page
  test('should display all create account page elements correctly', async ({ baseURL }) => {
    // Navigate to create account page
    await loginPage.clickCreateAccount();

    // Wait for page to load completely
    await page.waitForLoadState('domcontentloaded');

    await test.step('Validate main page structure', async () => {
      await expect.soft(createAccountPage.createAccountNavigation).toBeVisible({ timeout: 5000 });
      await expect.soft(createAccountPage.createAccountLogo).toBeVisible();
      await expect.soft(createAccountPage.createAccountCard).toBeVisible();
    });

    await test.step('Validate headings and labels', async () => {
      // Main heading validation
      await expect.soft(createAccountPage.createAccountHeading).toBeVisible();
      await expect.soft(createAccountPage.createAccountHeading).toHaveText('Join Centigrade');

      // Subheading validation
      await expect.soft(createAccountPage.createAccountSubheading).toBeVisible();
      await expect.soft(createAccountPage.createAccountSubheading).toHaveText('Enter details to create your account');

      // Radio group label validation
      await expect.soft(createAccountPage.createAccountLabel).toBeVisible();
      await expect.soft(createAccountPage.createAccountLabel).toHaveText('I am primarily interested in');
    });

    await test.step('Validate radio group structure', async () => {
      await expect.soft(createAccountPage.createAccountRadioGroup).toBeVisible();

      // Validate each radio option exists and has correct text
      for (const option of RADIO_OPTIONS) {
        const labelOption = await createAccountPage.createAccountLabelOption(option);
        const radioButton = await createAccountPage.createAccountLabelButton(option);

        await expect.soft(labelOption).toBeVisible();
        await expect.soft(labelOption).toHaveText(option);
        await expect.soft(radioButton).not.toBeChecked();
      }
    });

    await test.step('Validate form input fields', async () => {
      const formFields = [
        { field: createAccountPage.createAccountFirstName, type: 'text', label: 'First Name' },
        { field: createAccountPage.createAccountLastName, type: 'text', label: 'Last Name' },
        { field: createAccountPage.createAccountOrgName, type: 'text', label: 'Organization Name' },
        { field: createAccountPage.createAccountEmailName, type: 'text', name: 'email', label: 'Email' }
      ];

      for (const { field, type, name, label } of formFields) {
        await expect.soft(field).toBeVisible();
        await expect.soft(field).toHaveAttribute('type', type);
        await expect.soft(field).toHaveValue('');

        if (name) {
          await expect.soft(field).toHaveAttribute('name', name);
        }
      }
    });

    await test.step('Validate terms and conditions checkbox', async () => {
      await expect.soft(createAccountPage.createAccountCheckboxLabel).toBeVisible();
      await expect.soft(createAccountPage.createAccountCheckboxLabel)
        .toHaveText(/I agree to Centigrade's User Terms of Service and acknowledge the Privacy Policy\./);
      await expect.soft(createAccountPage.createAccountCheckboxInput).toBeVisible();
      await expect.soft(createAccountPage.createAccountCheckboxInput).not.toBeChecked();
    });

    await test.step('Validate action buttons and links', async () => {
      // Sign up button
      await expect.soft(createAccountPage.createAccountSignupButton).toBeVisible();

      // Login link
      await expect.soft(createAccountPage.createAccountLoginLink).toBeVisible();
      await expect.soft(createAccountPage.createAccountLoginLink).toHaveAttribute('href', '/login');

      // External links
      await expect.soft(createAccountPage.tosLink).toBeVisible();
      await expect.soft(createAccountPage.tosLink).toHaveAttribute('target', '_blank');

      await expect.soft(createAccountPage.privacyPolicyLink).toBeVisible();
      await expect.soft(createAccountPage.privacyPolicyLink).toHaveAttribute('target', '_blank');
    });

    // Visual regression test
    await test.step('Take screenshot for visual regression', async () => {
      expect(await page.screenshot({ fullPage: true })).toMatchSnapshot({
        name: 'create-account-page-layout.png',
        omitPlatformRegex: true,
        maxDiffPixelRatio: 0.02
      });
    });
  });

  test('should navigate to Terms of Service in new tab', async () => {
            await loginPage.clickCreateAccount();
            await page.waitForLoadState('domcontentloaded');

            const [newTab] = await Promise.all([
                page.waitForEvent('popup'),
                createAccountPage.clickTos()
            ]);

            await expect(newTab).toHaveURL(/\/terms-of-service/);
            await newTab.close();
        });

    test('should navigate to Privacy Policy in new tab', async () => {
            await loginPage.clickCreateAccount();
            await page.waitForLoadState('domcontentloaded');

            const [newTab] = await Promise.all([
                page.waitForEvent('popup'),
                createAccountPage.clickPrivacyPolicy()
            ]);

            await expect(newTab).toHaveURL(/\/privacy/);
            await newTab.close();
        });     

  // Test 3: Attempt to create an account with an already existing user
  test('Create an account with an already existing user', async ({ baseURL }) => {

    // Navigate to the sign-up page and fill in the required fields

    await signUpPage.completeSignUpProcess(ValidTestData.firstName, ValidTestData.lastName, ValidTestData.organizationName, Credentials.username);


    const resetPassworderrorBanner = await signUpPage.resetPassworderrorBanner();
    const forgotPassworderrortitle = await signUpPage.forgotPassworderrortitle();
    const resetPasswordsuccesserrormsg = await signUpPage.resetPasswordsuccesserrormsg();

    // Validate error messages for existing user
    await expect(page).toHaveURL(`${baseURL}/login?emailExpired=true&email=${encodeURIComponent(Credentials.username)}`);
    await expect(resetPassworderrorBanner).toBeVisible();
    await expect(forgotPassworderrortitle).toBeVisible();
    await expect(forgotPassworderrortitle).toHaveText('This email is already registered');
    await expect(resetPasswordsuccesserrormsg).toBeVisible();
    await expect(resetPasswordsuccesserrormsg).toHaveText('Log in below or reset your password using the "Forgot password" option');
  })

});

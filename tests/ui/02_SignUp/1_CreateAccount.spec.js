import { test, expect } from '@playwright/test';
import { Credentials } from '../../data/testData';
import { LoginPage } from "../../../pages/loginPage";
import { SignUpPage } from '../../../pages/signUpPage';
import { generateTestEmail } from '../../utils/signUpHelper';
import { ValidTestData } from '../../data/SignUpData';
import { saveData } from '../../utils/apiHelper';

test.describe('Create Account Page UI Tests', { tag: '@UI' }, () => {
  let newEmail;
  let page;

  // Setup: Generate a new email before all tests
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    newEmail = generateTestEmail();
  });

   // Close the browser page after all tests are complete
   test.afterAll(async () => {
    await page.close();
  });

  // Test 1: Verify UI elements and functionality of the Create Account page
  test('Should display Create Account page elements and validate functionality', async ({ baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);
    await page.setViewportSize({ width: 1280, height: 884 });

    // Navigate to the login page and click on "Create Account"
    await loginPage.navigate();
    const createAccount = await loginPage.createAccount();
    await createAccount.click();

    // Check the presence of key UI elements
    await loginPage.createAccountNavigation();
    await loginPage.createAccountLogo();
    await loginPage.createAccountCard();
    await loginPage.createAccountradiogroup();

    // List of radio options to validate
    const radioOptions = [
      'Listing projects on Centigrade',
      'Providing a service to projects (e.g., dMRV, VVB, rater)',
      'Finding and evaluating projects',
      'Other',
    ];

    const createAccountheading = await loginPage.createAccountheading();
    const createAccountSubheading = await loginPage.createAccountSubheading();
    const createAccountlabel = await loginPage.createAccountlabel();
    const createAccountfirstname = await loginPage.createAccountfirstname();
    const createAccountlastname = await loginPage.createAccountlastname();
    const createAccountOrgname = await loginPage.createAccountOrgname();
    const createAccountemailname = await loginPage.createAccountemailname();
    const createAccountcheckboxInput = await loginPage.createAccountcheckboxInput();
    const createAccountcheckboxLabel = await loginPage.createAccountcheckboxLabel();
    const createAccountSignup = await loginPage.createAccountSignup();
    const createAccountlogin = await loginPage.createAccountlogin();
    const toS = await loginPage.toS();
    const privacyPolicy = await loginPage.privacyPolicy();

    // Validate headings, subheadings, and labels
    await expect(createAccountheading).toBeVisible();
    await expect(createAccountheading).toHaveText('Join Centigrade');
    await expect(createAccountSubheading).toBeVisible();
    await expect(createAccountSubheading).toHaveText('Enter details to create your account');
    await expect(createAccountlabel).toBeVisible();
    await expect(createAccountlabel).toHaveText('I am primarily interested in');

    // Validate radio buttons and their functionality
    for (const option of radioOptions) {
      const createAccountlabelbutton = await loginPage.createAccountlabelbutton(option);
      const createAccountlabeloption = await loginPage.createAccountlabeloption(option);
      await expect(createAccountlabeloption).toBeVisible();
      await expect(createAccountlabeloption).toHaveText(option);
      await expect(createAccountlabelbutton).not.toBeChecked();
    }

    for (const option of radioOptions) {
      const createAccountlabelbutton = await loginPage.createAccountlabelbutton(option);
      await createAccountlabelbutton.click({ force: true });
      await expect(createAccountlabelbutton).toBeChecked();
      await createAccountlabelbutton.click({ force: true });
    }

    // Validate text input fields
    await expect(createAccountfirstname).toBeVisible();
    await expect(createAccountfirstname).toHaveAttribute('type', 'text');
    await expect(createAccountfirstname).toHaveValue('');

    await expect(createAccountlastname).toBeVisible();
    await expect(createAccountlastname).toHaveAttribute('type', 'text');
    await expect(createAccountlastname).toHaveValue('');

    await expect(createAccountOrgname).toBeVisible();
    await expect(createAccountOrgname).toHaveAttribute('type', 'text');
    await expect(createAccountOrgname).toHaveValue('');

    await expect(createAccountemailname).toBeVisible();
    await expect(createAccountemailname).toHaveAttribute('name', 'email');
    await expect(createAccountemailname).toHaveAttribute('type', 'text');
    await expect(createAccountemailname).toHaveValue('');

    // Validate checkbox for Terms and Conditions
    await expect(createAccountcheckboxLabel).toBeVisible();
    await expect(createAccountcheckboxLabel).toHaveText(/I agree to Centigrade’s User.*Terms of Service.*Privacy Policy/);
    await expect(createAccountcheckboxInput).toBeVisible();
    await expect(createAccountcheckboxInput).not.toBeChecked();
    await createAccountcheckboxInput.check();
    await expect(createAccountcheckboxInput).toBeChecked();
    await createAccountcheckboxInput.click({ force: true });

    // Validate "Sign Up" and "Login" buttons
    await expect(createAccountSignup).toBeVisible();
    await expect(createAccountlogin).toBeVisible();
    await expect(createAccountlogin).toHaveAttribute('href', '/login');

    await expect(toS).toBeVisible();
    await expect(toS).toHaveAttribute('target', '_blank');

    expect(privacyPolicy).toBeVisible();
    await expect(privacyPolicy).toHaveAttribute('target', '_blank');

    // Verify navigation for Terms of Service link
    const [newTab1] = await Promise.all([
      page.waitForEvent('popup'),
      toS.click(),
    ]);
    await expect(newTab1).toHaveURL(/\/terms-of-service/);

    // Verify navigation for Privacy Policy link
    const [newTab2] = await Promise.all([
      page.waitForEvent('popup'),
      privacyPolicy.click(),
    ]);
    await expect(newTab2).toHaveURL(/\/privacy/);

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot({
      name: 'CreateAccount.png',
      omitPlatformRegex: true,
      maxDiffPixelRatio: 0.02
    });
  })

  // Test 3: Attempt to create an account with an already existing user
  test('Create an account with an already existing user', async ({ baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);

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
    await expect(resetPasswordsuccesserrormsg).toHaveText('Log in below or reset your password using the “Forgot password” option');

  })

});

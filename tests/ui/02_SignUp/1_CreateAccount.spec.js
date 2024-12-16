import { test, expect } from '@playwright/test';
import { Credentials } from '../../data/testData';
import { LoginPage } from "../../../pages/loginPage";
import { SignUpPage } from '../../../pages/signUpPage';
import { generateTestEmail } from '../../utils/signUpHelper';
import { ValidTestData } from '../../data/SignUpData';
import { saveData } from '../../utils/apiHelper';

test.describe('Create Account Page UI Tests', () => {
  let newEmail;

  // Setup: Generate a new email before all tests
  test.beforeAll(async () => {
    newEmail = generateTestEmail();
  });

  // Test 1: Verify UI elements and functionality of the Create Account page
  test('Should display Create Account page elements and validate functionality', async ({ page, baseURL }) => {
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
    await createAccountcheckboxInput.click({ force: true });
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

  // Test 2: Create a new account with a non-existing user
  test('Create an Account with a Non existing user', async ({ page, baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to the sign-up page and fill in the required fields
    await signUpPage.navigate();
    await signUpPage.firstName(ValidTestData.firstName);
    await signUpPage.lastName(ValidTestData.lastName);
    await signUpPage.organizationName(ValidTestData.organizationName);
    await signUpPage.email(newEmail);
    await signUpPage.checkBox();
    await signUpPage.signUp();

    // Save the email data for later validation
    await saveData({ newEmail: newEmail }, 'UI');

    // Verify redirection to the verification page
    await expect(page).toHaveURL(`${baseURL}/verification?email=${encodeURIComponent(newEmail)}`);
    await signUpPage.verificationCodecard();

    const verificationCodeheading = await signUpPage.verificationCodeheading();
    const verificationCodeEmail = await signUpPage.verificationCodeEmail();
    const verificationCodeinput = await signUpPage.verificationCodeinput();
    const verificationCodepasswordInput = await signUpPage.verificationCodepasswordInput();
    const verificationCodesubmit = await signUpPage.verificationCodesubmit();
    const verificationCoderesendlink = await signUpPage.verificationCoderesendlink();
    const verificationCodehelpertext = await signUpPage.verificationCodehelpertext();

    // Validate UI elements on the verification page
    await expect(verificationCodeheading).toBeVisible();
    await expect(verificationCodeheading).toHaveText('Verify your email');
    await expect(verificationCodeEmail).toBeVisible();
    await expect(verificationCodeEmail).toHaveText(newEmail);
    await expect(verificationCodeinput).toHaveCount(6);

    for (let i = 0; i < 6; i++) {
      await expect(verificationCodeinput.nth(i)).toBeVisible();
    }

    await expect(verificationCodepasswordInput).toBeVisible();
    await expect(verificationCodehelpertext).toBeVisible();
    await expect(verificationCodehelpertext).toHaveText('Password must be at least 8 characters and contain an uppercase, a lowercase, a number, and a special character');

    await expect(verificationCodesubmit).toBeVisible();
    await expect(verificationCodesubmit).toHaveText('Create account');

    await expect(verificationCoderesendlink).toBeVisible();
    await expect(verificationCoderesendlink).toHaveText('resend it');
    await expect(verificationCoderesendlink).toBeEnabled();
  })

  // Test 3: Attempt to create an account with an already existing user
  test('Create an account with an already existing user', async ({ page, baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to the sign-up page and fill in the required fields
    await signUpPage.navigate();
    await signUpPage.firstName(ValidTestData.firstName);
    await signUpPage.lastName(ValidTestData.lastName);
    await signUpPage.organizationName(ValidTestData.organizationName);
    await signUpPage.email(Credentials.username);
    await signUpPage.checkBox();
    await signUpPage.signUp();

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

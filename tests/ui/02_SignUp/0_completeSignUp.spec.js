import { test, expect } from '@playwright/test';
import { Credentials } from '../../data/testData';
import { LoginPage } from "../../../pages/loginPage";
import { SignUpPage } from '../../../pages/signUpPage';
import { generateTestEmail } from '../../utils/signUpHelper';
import { ValidTestData } from '../../data/SignUpData';
import { getData, saveData } from '../../utils/apiHelper';
import { SettingsPage } from '../../../pages/settingsPage';
import { getGmailMessages } from '../../utils/signUpHelper';
import API_ENDPOINTS from '../../../api/apiEndpoints';
import { ProjectsPage } from '../../../pages/projectsPage';

test.describe('Create Account Page UI Tests', {tag: '@UI'}, () => {
  let newEmail;
  let page;
  let receivedVerificationCode;
  let temporaryPassword;

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

  // Test 2: Create a new account with a non-existing user
  test('Create an Account with a Non existing user', async ({ baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to the sign-up page and fill in the required fields
    await signUpPage.completeSignUpProcess(ValidTestData.firstName, ValidTestData.lastName, ValidTestData.organizationName, newEmail);

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

  // Test case: Successful resend of the verification code
    test('Successful resend verification code', async ({ baseURL }) => {
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


     test('Successful verification with correct code and password and land on the awaiting-approval approval page', async ({ baseURL }) => {
    
      const loginPage = new LoginPage(page, baseURL);
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
        await expect(settingButton).toBeVisible();
        await settingButton.click();
    
        await expect(await settingsPage.tabList()).toBeVisible();
        await expect(await settingsPage.myAccountTab()).toBeVisible();
        await expect(await settingsPage.myAccountTab()).toHaveAttribute('aria-selected', 'true');
        await expect(await settingsPage.organizationTab()).not.toBeVisible();
        await expect(await settingsPage.teamTab()).not.toBeVisible();
        await loginPage.logOut();
        expect(page).toHaveURL(`${baseURL}/login`);
       })


  // Test for requesting a password reset with a valid registered email
  test('Request password reset with a valid registered email', async ({ baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);
    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to login page and perform forgot password flow
    await loginPage.navigate();
    await signUpPage.forgotPassword();
    await signUpPage.forgotPasswordEmail(newEmail);
    await signUpPage.forgotPasswordSend();

    // Wait for the response and verify email message elements
    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.resetEmail) && response.status() === 200
    );

    // Assert email message content
    const CheckEmail = await signUpPage.checkEmail();
    const checkEmailMessage = await signUpPage.checkEmailMessage();
    const loginButton = await signUpPage.backToLoginButton();

    await expect(CheckEmail).toBe('Check your email');
    await expect(checkEmailMessage).toBe(`If ${newEmail} is registered with Centigrade, we will send an email with instructions on how to reset your password`);
    await expect(loginButton).toBeVisible();

    // Fetch Gmail message to verify the reset link
    const { body, subject } = await getGmailMessages(newEmail);
    expect(subject).toBe('Centigrade password reset request');

    // Extract temporary password and reset link using regex
    const tempPasswordMatch = body.match(/Your temporary password:\s+([^\s]+)/);
    const tempPassword = tempPasswordMatch[1];
    expect(tempPassword).toBeDefined();

    temporaryPassword = tempPassword;
  })

  
  test('Successful Password Reset with Mandatory Fields', async ({ baseURL }) => {
    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to reset password page
    await signUpPage.navigateResetPassword(newEmail);

    // Verify the reset password page elements and their content
    const resetPasswordheading = await signUpPage.resetPasswordheading();
    const resetPasswordmsg = await signUpPage.resetPasswordmsg();
    const resetPasswordemail = await signUpPage.resetPasswordemail();
    const resetPasswordtempPassword = await signUpPage.resetPasswordtempPassword();
    const resetPasswordtempPasswordbtn = await signUpPage.resetPasswordtempPasswordbtn();
    const resetPasswordtempHelperText = await signUpPage.resetPasswordtempHelperText();
    const resetPasswordnewPassword = await signUpPage.resetPasswordnewPassword();
    const resetPasswordnewPasswordbtn = await signUpPage.resetPasswordnewPasswordbtn();
    const resetPasswordHelperText = await signUpPage.resetPasswordHelperText();
    const resetPasswordSubmit = await signUpPage.resetPasswordSubmit();

    // Assert visibility and text of reset password elements
    expect(resetPasswordheading).toHaveText('Reset Password');
    expect(resetPasswordmsg).toHaveText('Use the form below to reset your password and recover your account');
    expect(resetPasswordemail).toHaveAttribute('readonly', '');
    expect(resetPasswordemail).toHaveValue(newEmail);
    expect(resetPasswordtempPassword).toBeVisible();
    expect(resetPasswordtempPasswordbtn).toBeVisible();
    expect(resetPasswordtempHelperText).toHaveText('This is found in the reset password email that was sent to you');
    expect(resetPasswordnewPassword).toBeVisible();
    expect(resetPasswordnewPasswordbtn).toBeVisible();
    expect(resetPasswordHelperText).toHaveText('Password must be at least 8 characters and contain an uppercase, a lowercase, a number, and a special character');
    expect(resetPasswordSubmit).toBeVisible();

    // Fill in the form and submit
    await resetPasswordtempPassword.fill(temporaryPassword);
    await resetPasswordtempPasswordbtn.click();
    expect(resetPasswordtempPassword).toHaveAttribute('type', 'text');

    await resetPasswordnewPassword.fill(ValidTestData.newPassword);
    await resetPasswordtempPasswordbtn.click();
    expect(resetPasswordnewPassword).toHaveAttribute('type', 'text');

    await resetPasswordSubmit.click();

    // Verify success message after reset
    const resetPasswordsuccesserrormsg = await signUpPage.resetPasswordsuccesserrormsg();
    await expect(resetPasswordsuccesserrormsg).toBeVisible();
    await expect(resetPasswordsuccesserrormsg).toHaveText('Password reset successful');

    // Verify that the confirmation page is shown
    await expect(page).toHaveURL(`${baseURL}/reset-confirmation`);
    const resetPasswordsucessheader = await signUpPage.resetPasswordsucessheader();
    const resetPasswordsucesssubText = await signUpPage.resetPasswordsucesssubText();
    const backToLoginButton = await signUpPage.backToLoginButton();

    expect(resetPasswordsucessheader).toHaveText('Your password was reset successfully');
    expect(resetPasswordsucesssubText).toHaveText('Use your new password to log in to your Centigrade account');
    expect(backToLoginButton).toBeVisible();
    await backToLoginButton.click();
    await expect(page).toHaveURL(`${baseURL}/login`);
  })

  test('Password Reset with Invalid Temporary Password', async ({ baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to reset password page with invalid email
    await signUpPage.navigateResetPassword(newEmail);

    // Fill in the invalid temporary password and submit
    const resetPasswordtempPassword = await signUpPage.resetPasswordtempPassword();
    const resetPasswordnewPassword = await signUpPage.resetPasswordnewPassword();
    const resetPasswordSubmit = await signUpPage.resetPasswordSubmit();

    await resetPasswordtempPassword.fill(ValidTestData.Password);
    await resetPasswordnewPassword.fill(ValidTestData.newPassword);
    await resetPasswordSubmit.click();

    // Verify that the error message is shown
    const resetPasswordsuccesserrormsg = await signUpPage.resetPasswordsuccesserrormsg();
    await expect(resetPasswordsuccesserrormsg).toBeVisible();
    await expect(resetPasswordsuccesserrormsg).toHaveText('Unable to complete this request due to an issue. Try again later.');
  })

});

test.describe('Set Member to Admin', () => {
  const data = getData('UI');

  // Function to login and navigate to the settings page
  async function loginAndNavigateToSettings(page, baseURL) {
   const loginPage = new LoginPage(page, baseURL);
   const projectsPage = new ProjectsPage(page, baseURL);
 
   // Navigate to login page and perform login
   await loginPage.navigate();
   await loginPage.login(Credentials.username, Credentials.password);
   await page.waitForLoadState('networkidle');
 
   // Navigate to the settings page
   await projectsPage.selectOrg(ValidTestData.organizationName);
   await projectsPage.setting();
   await projectsPage.teamButton();
 
   return projectsPage;
 }
 
 // Test to set a member to Admin role
 test('Set member to Admin role', async ({ page, baseURL }) => {
   const projectsPage = await loginAndNavigateToSettings(page, baseURL);
 
   // Update the member role to Admin
   await projectsPage.UpdateinAdmin(data.newEmail);
   await page.waitForResponse(response =>
     response.url() === API_ENDPOINTS.getMember && response.status() === 200
   );
   await page.waitForTimeout(2000);
 
   // Verify the member role is updated to Admin
   await expect(await projectsPage.adminrole(data.newEmail)).toBe('Admin');
 
   // Reset the settings
   const resetButton = await projectsPage.resetButton();
   await resetButton.click();
   await projectsPage.setting();
 });
 })
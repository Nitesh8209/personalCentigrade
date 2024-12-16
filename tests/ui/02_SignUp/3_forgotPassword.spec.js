import { test, expect } from '@playwright/test';
import { LoginPage } from "../../../pages/loginPage";
import { SignUpPage } from '../../../pages/signUpPage';
import { getGmailMessages } from '../../utils/signUpHelper';
import { inValidTestData, ValidTestData } from '../../data/SignUpData';
import { getData } from '../../utils/apiHelper';
import API_ENDPOINTS from '../../../api/apiEndpoints';

test.describe('Forgot password Page UI Tests', () => {
  const { newEmail } = getData('UI');
  let temporaryPassword;

  test('Should display Forgot Password page elements and validate functionality', async ({ page, baseURL }) => {
    const loginPage = new LoginPage(page, baseURL);

    // Navigate to the login page
    await loginPage.navigate();

    const forgotPassword = await loginPage.forgotPassword();
    await forgotPassword.click();

    // Verify the modal and content elements on the Forgot Password page
    await loginPage.forgotPasswordModal();
    await loginPage.forgotPasswordHeading();

    const forgotPasswordContent = await loginPage.forgotPasswordcontent();
    const forgotPasswordContentText = await forgotPasswordContent.innerText();
    const forgotPasswordInput = await loginPage.forgotPasswordInput();
    const forgotPasswordhelper = await loginPage.forgotPasswordhelper();
    const forgotPasswordhelperText = await forgotPasswordhelper.innerText();
    const forgotPasswordSend = await loginPage.forgotPasswordSend();
    const forgotPasswordBack = await loginPage.forgotPasswordBack();

    // Assert the elements' visibility and their text/content
    expect(forgotPasswordContent).toBeVisible();
    expect(forgotPasswordContentText).toBe("Enter the email address associated with your account and we'll send you an email with instructions and a link to create a new password")
    expect(forgotPasswordInput).toBeVisible();
    expect(forgotPasswordhelper).toBeVisible();
    expect(forgotPasswordhelperText).toBe("Enter the email you use to log in to Centigrade");
    expect(forgotPasswordSend).toBeVisible();
    expect(forgotPasswordBack).toBeVisible();

    // Verify the URL after navigating to the Forgot Password page
    expect(page.url()).toBe(`${baseURL}/send-email-link`);

    // Take a screenshot to compare the UI visually
    expect(await page.screenshot()).toMatchSnapshot({
      name: 'ForgotPassword.png',
      omitPlatformRegex: true,
      maxDiffPixelRatio: 0.02
    });

  })

  // Test for requesting a password reset with a valid registered email
  test('Request password reset with a valid registered email', async ({ page, baseURL }) => {

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

  // Test for requesting a password reset with an invalid email format
  test('Request Password Reset with Invalid Email Format', async ({ page, baseURL }) => {

    const loginPage = new LoginPage(page, baseURL);
    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to login page and perform forgot password flow
    await loginPage.navigate();
    await signUpPage.forgotPassword();
    await signUpPage.forgotPasswordEmail(inValidTestData.InvalidEmail);
    await signUpPage.forgotPasswordSend();

    // Wait for the response and verify email message elements
    const response = await page.waitForResponse(
      response => response.url().includes(API_ENDPOINTS.resetEmail) && response.status() === 404
    );

    const CheckEmail = await signUpPage.checkEmail();
    const checkEmailMessage = await signUpPage.checkEmailMessage();
    const loginButton = await signUpPage.backToLoginButton();

    // Assert email message content
    await expect(CheckEmail).toBe('Check your email');
    await expect(checkEmailMessage).toBe(`If ${inValidTestData.InvalidEmail} is registered with Centigrade, we will send an email with instructions on how to reset your password`);
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    await expect(page).toHaveURL(`${baseURL}/login`);
  })


  test('Successful Password Reset with Mandatory Fields', async ({ page, baseURL }) => {
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

  // Test for password reset with an invalid temporary password
  test('Password Reset with Invalid Temporary Password', async ({ page, baseURL }) => {

    const signUpPage = new SignUpPage(page, baseURL);

    // Navigate to reset password page with invalid email
    await signUpPage.navigateResetPassword(inValidTestData.InvalidEmail);

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
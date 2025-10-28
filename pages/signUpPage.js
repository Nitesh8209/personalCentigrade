import { expect } from '@playwright/test';
class SignUpPage {
  constructor(page, baseURL) {
    this.page = page;
    this.baseURL = baseURL;
  }

  async navigate() {
    await this.page.goto(`${this.baseURL}/create-account`);
  }

  async firstName(firstName) {
    await this.page.locator('input[name="firstName"]').fill(firstName);
  }

  async lastName(lastName) {
    await this.page.locator('input[name="lastName"]').fill(lastName);
  }

  async organizationName(organizationName) {
    await this.page.locator('input[name="orgName"]').fill(organizationName);
    // await this.page.locator('.autocomplete-option').click();
  }

  async email(email) {
    await this.page.getByLabel('Work email').fill(email);
  }

  async checkBox() {
    await this.page.locator('.checkbox-container').click();
  }

  async signUp() {
    await this.page.getByRole('button', { name: 'Sign up' }).click();
  }

  async navigateVerification(newEmail) {
    await this.page.goto(`${this.baseURL}/verification?email=${encodeURIComponent(newEmail)}`);
  }

  async codeInput(verificationCode) {
    const codeInputs = await this.page.$$('.pin-input-box');

    for (let i = 0; i < verificationCode.length; i++) {
      await codeInputs[i].fill(verificationCode[i]);
    }
  }

  async Password(password) {
    await this.page.locator('.input-wrapper > input').fill(password);
  }

  async createAccount() {
    await this.page.getByRole('button', { name: 'Create account' }).click();
  }

  async resend() {
    await this.page.locator('.cursor-pointer').click();
  }

  async getSuccessMessage() {
    return await this.page.locator('.toast-content').innerText();
  }

  async getErrorMessage() {
    return await this.page.locator('.banner-content').innerText();
  }

  async passwordErrorMessage() {
    return await this.page.locator('.helper-text').innerText();
  }

  async forgotPassword() {
    await this.page.getByRole('link', { name: 'Forgot Password' }).click();
  }

  async forgotPasswordEmail(email) {
    await this.page.locator('.input > .input-control > .input-wrapper > input').fill(email);
  }

  async forgotPasswordSend() {
    await this.page.getByRole('button', { name: 'Send' }).click();
  }

  async checkEmail() {
    return await this.page.locator('.SendEmail > h1').innerText()
  }

  async checkEmailMessage() {
    return await this.page.locator('.SendEmail > p').innerText()
  }

  async backToLoginButton() {
    return await this.page.locator('.btn.btn-solid.btn-primary.btn-md');
  }

  async tempPasswordInput(temporaryPassword) {
    await this.page.locator('input[name="temporaryPassword"]').fill(temporaryPassword);
  }

  async newPasswordInput(newPassword) {
    await this.page.locator('input[name="newPassword"]').fill(newPassword);
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async passordSuccessMessage() {
    return await this.page.locator('.reset-confirmation > h1').innerText()
  }

  async passordSuccessLoginMessage() {
    return await this.page.locator('.reset-confirmation > p').innerText()
  }

  async login() {
    return await this.page.getByRole('button', { name: 'Log in' });
  }

  async forgotPassworderrortitle() {
    return await this.page.locator('.banner-title');
  }

  async verificationCodecard() {
    await expect(await this.page.locator('.verification')).toBeVisible();
  }

  async verificationCodeheading() {
   return await this.page.getByRole('heading', { name: 'Verify your email' });
  }

  async verificationCodeEmail() {
    return await this.page.locator('b.font-semibold');
  }

  async verificationCodeinput() {
    return await this.page.locator('.pin-input-box');
   }

   async verificationCodepasswordInput() {
    return await this.page.locator('input[type="password"]');
   }

   async verificationCodesubmit() {
    return await this.page.locator('button[type="submit"]');
  }

  async verificationCoderesendlink() {
    return await this.page.locator('a', { hasText: 'resend it' });;
  }

  async verificationCodehelpertext() {
    return await this.page.locator('.helper-text');
  }

  async awaitingApprovalleft() {
    return await this.page.locator('.hero-section');
  }
  
  async logo() {
    return await this.page.getByRole('img', { name: 'Centigrade Logo' });
  }
  
  async awaitingApprovalheading() {
    return await this.page.locator('.awaiting-approval h1');
  }

  async awaitingApprovalnotificationText() {
    return await this.page.locator('.awaiting-approval p');
  }

  async awaitingApprovalbackToProjectsLink() {
    return await this.page.locator('a.text-link.body-semibold').first();
  }

  async awaitingApprovalcontactSupportLink() {
    return await this.page.locator('a.text-link.body-semibold').last();
  }

  async navigateResetPassword(newEmail) {
    await this.page.goto(`${this.baseURL}/reset?email=${encodeURIComponent(newEmail)}`);
  }

  async resetPasswordheading() {
    return await this.page.locator('h1');
  }

  async resetPasswordmsg() {
    return await this.page.locator('.Reset > p');
  }

  async resetPasswordemail() {
    return await this.page.locator('input[name="email"]');
  }

  async resetPasswordtempPassword() {
    return await this.page.locator('input[name="temporaryPassword"]');
  }

  async resetPasswordtempPasswordbtn() {
    return await this.page.locator('button[aria-label="Show password"]').nth(0);
  }

  async resetPasswordtempHelperText() {
    return await this.page.locator(".password-input").first().locator('div.helper-text');
  }

  async resetPasswordnewPassword() {
    return await this.page.locator('input[name="newPassword"]');
  }

  async resetPasswordnewPasswordbtn() {
    return await this.page.locator('button[aria-label="Show password"]').nth(1);
  }

  async resetPasswordHelperText() {
    return await this.page.locator('div.helper-text').nth(1);
  }

  async resetPasswordSubmit() {
    return await this.page.locator('button[type="submit"]');
  }

  async resetPassworderrorBanner() {
    return await this.page.locator('.banner-danger');
  }

  async resetPasswordsuccesserrormsg() {
    return await this.page.locator('.banner-content');
  }

  async resetPasswordsucessheader() {
    return await this.page.locator('.reset-confirmation h1');
  }

  async resetPasswordsucesssubText() {
    return await this.page.locator('.reset-confirmation p');
  }

  async completeSignUpProcess(firstName, lastName, organizationName, email) {
    await this.navigate();
    await this.firstName(firstName);
    await this.lastName(lastName);
    await this.organizationName(organizationName);
    await this.email(email);
    await this.checkBox();
    await this.signUp();
  }

}

module.exports = { SignUpPage };
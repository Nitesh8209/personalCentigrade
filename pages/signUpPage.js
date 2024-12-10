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
    await this.page.locator('input[name="email"]').fill(email);
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
    const codeInputs = await this.page.$$('.code-input');

    for (let i = 0; i < verificationCode.length; i++) {
      await codeInputs[i].fill(verificationCode[i]);
    }
  }

  async Password(password) {
    await this.page.locator('.input').fill(password);
  }

  async createAccount() {
    await this.page.getByRole('button', { name: 'Create account' }).click();
  }

  async resend() {
    await this.page.locator('.cursor-pointer').click();
  }

  async getSuccessMessage() {
    return await this.page.locator('toast-content').innerText();
  }

  async getErrorMessage() {
    return await this.page.locator('.banner-content').innerText();
  }

  async passwordErrorMessage() {
    return await this.page.locator('.helper-text').innerText();
  }

  async forgotPassword() {
    await this.page.locator('.forgot-password-link').click();
  }

  async forgotPasswordEmail(email) {
    await this.page.locator('.input').fill(email);
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

}

module.exports = { SignUpPage };
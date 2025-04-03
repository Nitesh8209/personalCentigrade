import { expect } from '@playwright/test';

class LoginPage {
    constructor(page, baseURL) {
        this.page = page;
        this.baseURL = baseURL;
    }

    async navigate() {
        await this.page.goto(this.baseURL);
    }

    async enterEmail(email) {
        await this.page.getByLabel('Email').fill(email);
    }

    async enterPassword(password) {
        await this.page.getByLabel('Password', { exact: true }).fill(password);
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async getErrorMessage() {
        return await this.page.locator('.banner-content').innerText();
    }

    async logOut() {
        await this.page.locator('.dropdown-trigger > .avatar > span').click();
        await this.page.locator('.dropdown-item').click();
    }
 

    async leftSidebar() {
        await expect(this.page.locator('.hero-section')).toBeVisible();
    }

    async rightSidebar() {
        await expect(this.page.locator('.content-section')).toBeVisible();
    }

    async images() {
        await expect(this.page.getByRole('img').first()).toBeVisible();
        await expect(this.page.getByRole('img', { name: 'Centigrade Logo' })).toBeVisible();
    }

    async text() {
        await expect(this.page.getByRole('heading', { name: 'Welcome to Centigrade' })).toBeVisible();
        await expect(this.page.getByText('Log in to continue')).toBeVisible();
        await expect(this.page.getByText('By continuing, you agree to')).toBeVisible();
    }

    async input() {
        await expect(this.page.getByLabel('Email')).toBeVisible();
        await expect(this.page.getByLabel('Password', { exact: true })).toBeVisible();
    }

    async loginbutton() {
        return await this.page.getByRole('button', { name: 'Login' });
    }

    async forgotPassword() {
        return await this.page.getByRole('link', { name: 'Forgot Password' });
    }

    async createAccount() {
        return await this.page.getByRole('link', { name: 'Create Account' });
    }

    async toS() {
       return await this.page.getByRole('link', { name: 'Terms of Service' });
    }

    async privacyPolicy() {
       return await this.page.getByRole('link', { name: 'Privacy Policy' });
    }

    async forgotPasswordModal() {
        await expect(this.page.locator('div').filter({ hasText: 'Forgot PasswordEnter the' }).nth(2)).toBeVisible();
    }

    async forgotPasswordHeading() {
        await expect(this.page.getByRole('heading', { name: 'Forgot Password' })).toBeVisible();
    }

    async forgotPasswordcontent() {
        return await this.page.locator('.SendEmail > p');
    }

    async forgotPasswordInput() {
        return await this.page.getByLabel('Email');
    }

    async forgotPasswordhelper() {
        return await this.page.locator('.helper-text');
    }

    async forgotPasswordSend() {
        return await this.page.getByRole('button', { name: 'Send' });
    }

    async forgotPasswordBack() {
        return await this.page.locator('.login-link');
    }

    async createAccountNavigation() {
        await expect(this.page.getByRole('navigation')).toBeVisible();
    }

    async createAccountLogo() {
        await expect(this.page.getByRole('img')).toBeVisible();
    }

    async createAccountCard() {
        await expect(this.page.locator('.card.elevate.create-account-container')).toBeVisible();
    }

    async createAccountheading() {
       return await this.page.getByRole('heading', { name: 'Join Centigrade' });
    }

    async createAccountSubheading() {
       return await this.page.locator('.title.flex.flex-col.gap-2xl > p');
    } 

    async createAccountradiogroup() {
       await expect(this.page.locator('.radio-group')).toBeVisible();
    } 

    async createAccountlabel() {
       return await this.page.getByText('I am primarily interested in');
    }

    async createAccountlabeloption(option) {
       return await this.page.locator(`.radio:has-text("${option}") span`);
    }

    async createAccountlabelbutton(option) {
       return await this.page.locator(`.radio:has-text("${option}") input[type="radio"]`);
    }

    async createAccountfirstname() {
       return await this.page.getByLabel('First name');
    }

    async createAccountlastname() {
       return await this.page.getByLabel('Last name');
    }

    async createAccountOrgname() {
       return await this.page.getByLabel('Organization name');
    }

    async createAccountemailname() {
       return await this.page.getByLabel('Work email');
    }

    async createAccountcheckboxInput() {
       return await this.page.locator('.checkbox-control');
    }

    async createAccountcheckboxLabel() {
       return await this.page.locator('.checkbox-label');
    }

    async createAccountSignup() {
       return await this.page.getByRole('button', { name: 'Sign up' });
    }

    async createAccountlogin() {
       return await this.page.getByRole('link', { name: 'Log in' });
    }

    async login(email, password) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.submit();
      }
    
}

module.exports = { LoginPage };
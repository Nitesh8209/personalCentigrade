
export class ForgotPasswordPage {
    constructor(page, baseURL) {
        this.page = page;
        this.baseURL = baseURL;
   
        // Forgot password elements
        this.forgotPasswordModal = page.locator('div').filter({ hasText: 'Forgot PasswordEnter the' }).nth(2);
        this.forgotPasswordHeading = page.getByRole('heading', { name: 'Forgot Password' });
        this.forgotPasswordContent = page.locator('.SendEmail > p');
        this.forgotPasswordEmailInput = page.getByLabel('Email');
        this.forgotPasswordHelper = page.locator('.helper-text');
        this.forgotPasswordSendButton = page.getByRole('button', { name: 'Send' });
        this.forgotPasswordBackLink = page.locator('.login-link');
        this.backToLoginAfterReset = page.getByRole('button', { name: 'Back to login' });
    }

    async resetPassword(email) {
        await this.forgotPasswordEmailInput.fill(email);
        await this.forgotPasswordSendButton.click();
    }

    async clickBackToLogin() {
        await this.backToLoginAfterReset.click();
    }
    
}

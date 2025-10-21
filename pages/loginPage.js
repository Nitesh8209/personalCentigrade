
class LoginPage {
    constructor(page, baseURL) {
        this.page = page;
        this.baseURL = baseURL;

        
        this.loginForm = page.locator('.login');
        this.emailInput = page.getByLabel('Email');
        this.passwordInput = page.getByLabel('Password', { exact: true });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorBanner = page.locator('.banner-content');

        this.logoutDropdown = page.locator('.dropdown-trigger > .avatar > span');
        this.logoutButton = page.locator('.dropdown-item');
        this.acceptAllButton = page.getByRole('button', { name: 'Accept All' });
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' });
        this.createAccountLink = page.getByRole('link', { name: 'Create Account' });
        this.tosLink = page.getByRole('link', { name: 'Terms of Service' });
        this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });

        // Additional links for validation
        this.tosLinkInLogin = this.loginForm.getByRole('link', { name: 'Terms of Service' });
        this.privacyLinkInLogin = this.loginForm.getByRole('link', { name: 'Privacy Policy' });
        
        // Layout sections
        this.heroSection = page.locator('.hero-section');
        this.contentSection = page.locator('.content-section');

        // Page elements for validation
        this.welcomeHeading = page.getByRole('heading', { name: 'Welcome to Centigrade' });
        this.loginInstruction = page.getByText('Log in to continue');
        this.agreementText = page.getByText('By continuing, you agree to');
        this.firstImage = page.getByRole('img').first();
        this.centigradeLogoImage = page.getByRole('img', { name: 'Centigrade Logo' });
        
        this.iframeContent = page.locator('iframe').contentFrame();
        this.superUserLogoutDropdown = this.iframeContent.locator('.dropdown-trigger > .avatar > span');
        this.superUserLogoutButton = this.iframeContent.locator('.dropdown-item');
    }

    async navigate() {
        await this.page.goto(this.baseURL);
    }

    async enterEmail(email) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async submit() {
        await this.loginButton.click();
    }

    async getErrorMessage() {
        return await this.errorBanner.innerText();
    }

    async superUserLogout() {
        await this.superUserLogoutDropdown.click();
        await this.superUserLogoutButton.click();
    }

    async logOut() {
        await this.logoutDropdown.click();
        await this.logoutButton.click();
    }

    async clickTos() {
        await this.tosLinkInLogin.click();
    }

    async clickPrivacyPolicy() {
        await this.privacyLinkInLogin.click();
    }

    async clickForgotPassword() {
        await this.forgotPasswordLink.click();
    }

    async clickCreateAccount() {
        await this.createAccountLink.click();
    }

    async login(email, password) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.acceptAll();
        await this.submit();
      }

    async acceptAll() {
        if((await (await this.acceptAllButton).isVisible())){
      const acceptAll = await this.acceptAllButton;
      await acceptAll.click();
    }
    }  
    
}

module.exports = { LoginPage };
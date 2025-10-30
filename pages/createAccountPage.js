import { expect } from '@playwright/test';

export class CreateAccountPage {
    constructor(page, baseURL) {
        this.page = page;
        this.baseURL = baseURL;

        this.createAccountNavigation = page.getByRole('navigation');
        this.createAccountLogo = page.getByRole('img');
        this.createAccountCard = page.locator('.create-account');
        this.createAccountHeading = page.getByRole('heading', { name: 'Join Centigrade' });
        this.createAccountSubheading = page.locator('.create-account-form > p');
        this.createAccountRadioGroup = page.locator('.radio-group');
        this.createAccountLabel = page.getByText('I am primarily interested in');
        this.createAccountFirstName = page.getByLabel('First name');
        this.createAccountLastName = page.getByLabel('Last name');
        this.createAccountOrgName = page.getByLabel('Organization name');
        this.createAccountEmailName = page.getByLabel('Work email');
        this.createAccountCheckboxInput = page.locator('.checkbox-control');
        this.createAccountCheckboxLabel = page.locator('.checkbox-label');
        this.createAccountSignupButton = page.getByRole('button', { name: 'Sign up' });
        this.createAccountLoginLink = page.getByRole('link', { name: 'Log in' });
        this.tosLink = this.createAccountCard.getByRole('link', { name: 'Terms of Service' });
        this.privacyPolicyLink = this.createAccountCard.getByRole('link', { name: 'Privacy Policy' });
    }

    async clickTos() {
        await this.tosLink.click();
    }

    async clickPrivacyPolicy() {
        await this.privacyPolicyLink.click();
    }

    async createAccountLabelOption(option) {
        return await this.page.locator(`.radio:has-text("${option}") span`);
    }

    async createAccountLabelButton(option) {
        return await this.page.locator(`.radio:has-text("${option}") input[type="radio"]`);
    }

}

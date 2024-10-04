import { devUrl } from "../tests/data/testData";
class LoginPage {
    constructor(page) {
        this.page = page;

    }

    async navigate() {
        await this.page.goto(devUrl);
    }
   
    async enterEmail(email) {
        await this.page.getByLabel('Email').fill(email);
    }

    async enterPassword(password){
        await this.page.getByLabel('Password', { exact: true }).fill(password);
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async getErrorMessage() {
        return await this.page.locator('.banner-content').innerText('Unable to log in because the email or password is not correct');
    }
}

module.exports = { LoginPage };
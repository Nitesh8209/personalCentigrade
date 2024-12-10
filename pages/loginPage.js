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

    async enterPassword(password){
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
}

module.exports = { LoginPage };
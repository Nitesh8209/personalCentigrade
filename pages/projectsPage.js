import { devUrl } from "../tests/data/testData";
class ProjectsPage {
    constructor(page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto(`${devUrl}/projects`);
    }

    async selectOrg(organization) {
        await this.page.locator('input.autocomplete-input[data-part="input"]').fill(organization);
        await this.page.locator('.autocomplete-option').click();
    }

    async setting() {
        await this.page.locator(".nav-items > a:last-child").click();
    }

    async teamButton() {
        await this.page.locator('button.tab-item[data-value="team"]').click();
    }

    async UpdateinAdmin() {
        await this.page.locator('.settings > div:nth-child(2) > div:nth-child(4) > .team-tab > .editable-table > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1)').hover();
        await this.page.locator(".settings > div:nth-child(2) > div:nth-child(4) > .team-tab > .editable-table > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(4) > div:nth-child(1) > div:first-child").click();
        await this.page.locator(".select-value").click();
        await this.page.locator("(//span[@class='select-option-text'])[1]").click();
        await this.page.getByRole('button', { name: 'Save' }).click();
    }

    async adminrole() {
        return await this.page.locator(".settings > div:nth-child(2) > div:nth-child(4) > .team-tab > .editable-table > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(2) > div:nth-child(1)").innerText();
    }

    async inviteUser(email) {
        await this.page.getByRole('button', { name: '+ Invite user' }).click();
        await this.page.locator('.input-box > input').fill(email);
    }

    async sendInvitation() {
        await this.page.getByRole('button', { name: 'Send invitation' }).click();
    }

    async inviteSuccessMessage() {
        return await this.page.locator('.flex.flex-col.gap-sm > p').innerText()
    }

    async inviteSuccessEmail() {
        return await this.page.locator('.flex.flex-col.gap-sm > ul > li').innerText()
    }

    async rejectApproveButton(name, email) {
        const row = await this.page.locator(`.settings > div:nth-child(2) > div:nth-child(4) > .team-tab > .editable-table > table > tbody > tr:has(div.substring:has-text("${email}"))`);
        await row.locator(`button:has-text("${name}")`).click();
    }

}

module.exports = { ProjectsPage };
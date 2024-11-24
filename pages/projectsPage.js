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

    async createProject(ProjectName){
        await this.page.getByRole('button', {name: '+ Create Project'});
        await this.page.locator('.input').fill(ProjectName);
        await this.page.locator('.create-project-form > form > div:nth-child(2) > div:nth-child(2) > .select-control > button').click();
        await this.page.locator('text=VM0045 Methodology for Improved Forest Management v1.1').click();
        await this.page.locator('.create-project-form > form > div:nth-child(3) > div:nth-child(2) > .select-control > button').click();
        await this.page.locator('text=Micro (less than 1000 tCO2e)').click();
        await this.page.locator('.create-project-form > form > div:nth-child(4) > div:nth-child(2) > .select-control > button').click();
        await this.page.locator('text=Carbon avoidance').click();
        await this.page.locator('.create-project-form > form > div:nth-child(5) > div:nth-child(2) > .select-control > button').click();
        await this.page.locator('text=Natural - The activity claim uses natural methods (e.g. IFM)').click();
        await this.page.getByRole('button', {name: 'Create'});
    }

    async porjectTitle(){
        return await this.page.locator('.project-title').innerText();
    }

    async proveneceStartGuide(){
        await this.page.locator('button[class="btn btn-solid btn-primary btn-md"][fdprocessedid="qouzn"]').click();
    }

    async uploadfile(){
        await this.page.locator('.file-upload-dropzone').click();
    }

    async viewProject(){
        await this.page.locator('.project-list > div:nth-child(1) > .actions > .btn').click();
    }

    async projectDetails(){
        await this.page.locator('.menu.menu-root > div:nth-child(2)').click();
        await this.page.locator('.menu.menu-root > div:nth-child(2) > .collapsible-content > .menu> a:has-text("Project details")').click();
        await this.page.locator('.fields > div:nth-child(2)>:nth-child(2)').fill(projectSummary);
        await this.page.locator('.fields > div:nth-child(3)>:nth-child(2)').fill(projectMission);
        await this.page.locator('.fields > div:nth-child(4)>:nth-child(2)').fill(projectWebsite);
        await this.page.locator('.fields > div:nth-child(5)>:nth-child(2)').fill(medialink);
        await this.page.locator('.fields > div:nth-child(7)>:nth-child(2)').fill(projectStartYear);
        await this.page.locator('.fields > div:nth-child(8)>:nth-child(2)').fill(projectEndYear);
        await this.page.locator('.fields > div:nth-child(9)>:nth-child(2)').fill(CreditingStartYear);
        await this.page.locator('.fields > div:nth-child(10)>:nth-child(2)').fill(CreditingEndYear);
        await this.page.locator('.fields > div:nth-child(11)>:nth-child(2)').fill(AdditionalDetails);
        await this.page.getByRole('button', {name: 'Continue'});
    }

    async projectApproach(){
        await this.page.locator('.menu.menu-root > div:nth-child(2)').click();
        await this.page.locator('.menu.menu-root > div:nth-child(2) > .collapsible-content > .menu> a:has-text("Project approach")').click();
        await this.page.locator('.fields > div:nth-child(3) > :nth-child(2)').click();
        await this.page.locator('text=Energy distribution').click();
        await this.page.locator('.fields > div:nth-child(7)>:nth-child(2)').click();
        await this.page.locator('span.select-option-text span:has-text("Verra")').click();
        await this.page.locator('.fields > div:nth-child(8)>:nth-child(2)').fill(standardVersion);
        await this.page.locator('.fields > div:nth-child(9)>:nth-child(2)').fill(projectRegistryLink);
        await this.page.locator('.fields > div:nth-child(10)>:nth-child(2)').fill(projectRegistryID);
        await this.page.locator('.fields > div:nth-child(11)>:nth-child(2)').click();
        await this.page.locator('text = Validated').click();
        await this.page.locator('.fields > div:nth-child(12)>:nth-child(2)').fill(approachComments);
        await this.page.getByRole('button', {name: 'Save'});
    }

    async locationDetails(){
        await this.page.locator('.menu.menu-root > div:nth-child(2)').click();
        await this.page.locator('.menu.menu-root > div:nth-child(2) > .collapsible-content > .menu> a:has-text("Location details")').click();
        await this.page.locator('.fields > div:nth-child(1) > :nth-child(2)').click();
        await this.page.locator('text = United States of America').click();
        await this.page.locator('.fields > div:nth-child(2)>:nth-child(2) > div:nth-child(1) > .radio > .radio-control').check();
        await this.page.locator('.fields > div:nth-child(3)>:nth-child(2)').fill(conflictMoreInfo);
        await this.page.locator('.fields > div:nth-child(5)>:nth-child(2)').fill(locationComments);
        await this.page.locator('.fields > div:nth-child(6)>:nth-child(2)').click();
        await this.page.locator('text = Single location or installation').click();
        await this.page.getByRole('button', {name: 'Save'});
    }

    async laborUploadfile(){
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(4) > .file-upload > .file-upload-dropzone ').click();
    }

    async disclosures(){
        await this.page.locator('.menu.menu-root > div:nth-child(2)').click();
        await this.page.locator('.menu.menu-root > div:nth-child(2) > .collapsible-content > .menu> a:has-text("Disclosures")').click();
        await this.page.locator('.radio-group.field.half-width > .radio-group-options > div:nth-child(1) > .radio > .radio-control').check();
        await this.page.locator('.checkbox-group-options > div:nth-child(2)').click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(3) > .radio-group-options > div:nth-child(1) > .radio > .radio-control').check();
        await this.page.locator('[name="laborComments-nameValue-nameValue"]').fill(laborComments);

        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(1) > .radio-group-options > div:nth-child(1) > .radio > .radio-control').check();
        await this.page.locator('[name="nationalLawsDescription-nameValue-nameValue"]').fill(laborComments);
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(3) > .radio-group-options > div:nth-child(1) > .radio > .radio-control').check();
    }

}

module.exports = { ProjectsPage };
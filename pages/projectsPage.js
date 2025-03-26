import { actualsData, forcastData, projectApproach } from "../tests/data/projectData";
import { API_BASE_URL } from "../tests/data/testData";
import { expect } from '@playwright/test';

async function getprojectdetails(keyName, data) {
    const item = data.items.find(item => item.keyName === keyName);
    return item.value;
}
class ProjectsPage {
    constructor(page, baseURL) {
        this.page = page;
        this.baseURL = baseURL;
        this.disableFeedbackWidget();
    }

    async disableFeedbackWidget() {
        await this.page.addStyleTag({
            content: `
            #zsfeedbackwidgetdiv {
              pointer-events: none !important;
            }
          `
        });
    }

    async navigate() {
        await this.page.goto(`${this.baseURL}/projects`);
    }

    async selectOrg(organization) {
        await this.page.getByRole('combobox', { name: 'Select org' }).click();
        await this.page.getByRole('combobox', { name: 'Select org' }).fill('');
        await this.page.getByRole('combobox', { name: 'Select org' }).fill(organization);
        await this.page.locator('.autocomplete-option').first().click();
    }

    async setting() {
        await this.page.locator(".nav-items > a:last-child").click();
    }

    async teamButton() {
        await this.page.locator('button.tab-item[data-value="team"]').click();
    }

    async organizationButton() {
        await this.page.locator('button.tab-item[data-value="organization"]').click();
    }

    async updateroleType() {
        await this.page.getByRole('combobox', { name: 'Organization role' }).click();
        await this.page.getByText('Form - Basic').click();
        await this.page.getByText('Form - Creator').click();
        await this.page.getByRole('button', { name: 'Save changes' }).click();
    }

    async updateMessage() {
        return await this.page.locator('.toast-content > div:nth-child(1)').innerText();
    }

    async UpdateinAdmin(targetEmail) {
        const row = this.page.getByRole('row', { name: targetEmail });
        await row.hover();
        await row.locator('.ag-action-cell').click();
        await this.page.getByRole('menuitem', { name: 'Edit' }).click();
        await this.page.getByRole('combobox', { name: 'Member type' }).click();
        await this.page.getByLabel('Edit Member').getByText('Admin').click();
        await this.page.getByRole('button', { name: 'Save' }).click();
    }

    async adminrole(targetEmail) {
        const row = this.page.getByRole('row', { name: targetEmail });
        return await row.locator('[col-id="memberType"]').innerText();
    }

    async inviteUser(email) {
        await this.page.getByRole('button', { name: '+ Invite user' }).click();
        await this.page.locator('.input-control > input').fill(email);
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
        if (name == "Approve") {
            return await this.page.getByRole('row', { name: email }).locator('.approve-request .btn-solid.btn-primary.btn-sm').click();
        } else {
            return await this.page.getByRole('row', { name: email }).locator('.approve-request .btn-outline.btn-primary.btn-sm').click();
        }
    }

    async createProject(ProjectName) {
        await this.page.getByRole('button', { name: '+ Create Project' }).click();
        await this.page.getByLabel('Project name').fill(ProjectName);
        await this.page.locator('.create-project-form > form > div:nth-child(2) > div:nth-child(2) > .select-control > button').click();
        await this.page.locator('text=QA use only frozen ACR 1.3 test methodology').click();
        await this.page.locator('.create-project-form > form > div:nth-child(3) > div:nth-child(2) > .select-control > button').click();
        await this.page.locator('text=Micro (less than 1000 tCO2e)').click();
        await this.page.locator('.create-project-form > form > div:nth-child(4) > div:nth-child(2) > .select-control > button').click();
        await this.page.locator('text=Carbon avoidance').click();
        await this.page.locator('.create-project-form > form > div:nth-child(5) > div:nth-child(2) > .select-control > button').click();
        await this.page.locator('text=Natural - The activity claim uses natural methods (e.g. IFM)').click();
        await this.page.getByRole('button', { name: 'Create' }).click();
    }

    async projectTitle() {
        return await this.page.locator('.project-name').innerText();
    }

    async listingprojectTitle() {
        return await this.page.locator('.content-header-title');
    }

    async proveneceStartGuide() {
        await this.page.locator('button[class="btn btn-solid btn-primary btn-md"][fdprocessedid="qouzn"]').click();
    }

    async uploadfile(filePath) {
        await this.page.locator('.file-upload > input').setInputFiles(filePath);
    }

    async uploadfileSuccessMsg() {
        return this.page.locator('.selected-files > :nth-child(1) > .file-name-container > .file-name').innerText();
    }

    async viewProject() {
        await this.page.locator('.project-list > div:nth-child(1) > .actions > .btn').click();
    }

    async projectDetails() {
        await this.page.locator('.menu.menu-root > div:nth-child(2)').click();
        await this.page.locator('.menu.menu-root > div:nth-child(2) > .collapsible-content > .menu> a:has-text("Project details")').click();
        await this.page.getByLabel('Project summary').fill(await getprojectdetails('projectSummaryVerra', projectApproach));
        await this.page.getByLabel('Project elevator pitch').fill(await getprojectdetails('projectSummaryVerra', projectApproach));
        await this.page.getByLabel('Project mission').fill(await getprojectdetails('projectMission', projectApproach));
        await this.page.getByLabel('Description of activities').fill('description');
        await this.page.getByLabel('Project website').fill('project website')
        await this.page.getByLabel('Media links').fill(await getprojectdetails('links', projectApproach));
        await this.page.locator("[name = 'projectStartYear-nameValue-nameValue']").fill(await getprojectdetails('projectStartYear', projectApproach));
        await this.page.locator("[name = 'projectEndYear-nameValue-nameValue']").fill(await getprojectdetails('projectEndYear', projectApproach));
        await this.page.getByLabel('Project term commitment (in').fill('5');
        await this.page.locator("[name = 'creditStart-nameValue-nameValue']").fill(await getprojectdetails('creditStart', projectApproach));
        await this.page.locator("[name = 'creditEnd-nameValue-nameValue']").fill(await getprojectdetails('creditEnd', projectApproach));
        await this.page.getByLabel('Additional details on project').fill(await getprojectdetails('projectTimeline', projectApproach));
    }

    async projectApproach() {
        await this.page.locator('.menu.menu-root > div:nth-child(2)').click();
        await this.page.locator('.menu.menu-root > div:nth-child(2) > .collapsible-content > .menu> a:has-text("Project approach")').click();
        await this.page.getByRole('combobox', { name: 'Project type Information icon' }).click({ force: true });
        await this.page.getByText('Agricultural Land Management').click();
        await this.page.getByRole('combobox', { name: 'Credit issuer Information icon' }).click();
        await this.page.getByRole('option', { name: 'Verra' }).click();
        await this.page.getByLabel('Registry standard version used').fill(await getprojectdetails('standardVersion', projectApproach));
        await this.page.getByLabel('Project registry link').fill(await getprojectdetails('projectRegistryLink', projectApproach));
        await this.page.getByLabel('Project registry ID').fill(await getprojectdetails('projectRegistryID', projectApproach));
        await this.page.getByRole('combobox', { name: 'Project status' }).click();
        await this.page.getByRole('option', { name: 'Validated' }).click();
        await this.page.getByLabel('Additional comments about').fill(await getprojectdetails('approachComments', projectApproach));
    }

    async locationDetails() {
        await this.page.locator('.menu.menu-root > div:nth-child(2)').click();
        await this.page.locator('.menu.menu-root > div:nth-child(2) > .collapsible-content > .menu> a:has-text("Location details")').click();
        await this.page.waitForLoadState('networkidle');
        await this.page.getByRole('combobox', { name: 'Country or countries of' }).click();
        await this.page.getByText('United States of America').click();
        await this.page.locator('h1').click();
        await this.page.locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Additional information about').fill(await getprojectdetails('conflictMoreInfo', projectApproach));
        await this.page.getByLabel('Location details').fill(await getprojectdetails('locationComments', projectApproach));
        await this.page.getByRole('combobox', { name: 'Project location type' }).click();
        await this.page.getByText('Single location or installation').click();
    }

    async laborUploadfile() {
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(4) > .file-upload > .file-upload-dropzone ').click();
    }

    async disclosures() {
        await this.page.locator('.menu.menu-root > div:nth-child(2)').click();
        await this.page.locator('.menu.menu-root > div:nth-child(2) > .collapsible-content > .menu> a:has-text("Disclosures")').click();
        await this.page.waitForLoadState('networkidle');
        await this.page.locator('.radio-group.field.half-width > .radio-group-options > div:nth-child(1) > .radio > .radio-control').check({ force: true });
        await this.page.locator('.checkbox-group-options > div:nth-child(2)').click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(3) > .radio-group-options > div:nth-child(1) > .radio > .radio-control').check();
        await this.page.getByLabel('Additional comments on labor').fill(await getprojectdetails('laborComments', projectApproach));
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(1) > .radio-group-options > div:nth-child(1) > .radio > .radio-control').check();
        await this.page.getByLabel('Compliance with laws,').fill(await getprojectdetails('nationalLawsDescription', projectApproach));
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(3) > .radio-group-options > div:nth-child(1) > .radio > .radio-control').check();
        await this.page.getByLabel('Measures taken to comply with').fill(await getprojectdetails('communityFrameworks', projectApproach));
        await this.page.getByRole('combobox', { name: 'Project is authorized for' }).click();
        await this.page.getByText('Yes, I have a government').click();
        await this.page.getByLabel('Concession contract is at').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByRole('combobox', { name: 'Land ownership class' }).click();
        await this.page.getByText('Private industrial').click();
        await this.page.getByLabel('Project is receiving or').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('If "yes", evidence of no').fill(await getprojectdetails('carbonIssuingYes', projectApproach));
        await this.page.getByLabel('Project has registered under').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('If "yes", registration number').fill(await getprojectdetails('carbonRegistration', projectApproach));
        await this.page.getByLabel('Project has been rejected by').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('If "yes", program name(s),').fill(await getprojectdetails('carbonRegistrationYes', projectApproach));
        await this.page.getByLabel('Project activity does not').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Project plans to identify').locator('label').filter({ hasText: /^No$/ }).locator('div').click();
        await this.page.getByLabel('Project plans to consult').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Project plans to regularly').locator('label').filter({ hasText: 'No' }).locator('div').click();
        await this.page.getByLabel('Project plans to engage in a').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Project plans to disproportionately benefit women or minority groups').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Project plans to monitor project activity impacts on biodiversity').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Project plans to monitor project activity impacts on water resources').locator('label').filter({ hasText: 'No' }).locator('div').click();
        await this.page.getByLabel('Project plans to monitor project activity impacts on air quality').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByRole('combobox', { name: 'Compliance with Paris' }).click();
        await this.page.getByText('Fully compliant').click();
    }


    async organizationOverview() {
        await this.page.locator('.menu.menu-root > div:nth-child(2)').click();
        await this.page.locator('.menu.menu-root > div:nth-child(2) > .collapsible-content > .menu> a:has-text("Organization overview")').click();
        await this.page.waitForLoadState('networkidle');
        await this.page.getByRole('combobox', { name: 'Organization classification' }).click();
        await this.page.getByRole('option', { name: '(c)(3)' }).click();
        await this.page.getByLabel('Organization founding year').fill(await getprojectdetails('organizationFoundingYear', projectApproach));
        await this.page.getByLabel('Ownership structure').fill(await getprojectdetails('ownershipStructure', projectApproach));
        await this.page.getByLabel('Governance structure', { exact: true }).fill(await getprojectdetails('governanceStructure', projectApproach));
        await this.page.getByLabel('Incorporation', { exact: true }).fill(await getprojectdetails('organizationIncorporation', projectApproach));
        await this.page.getByRole('combobox', { name: 'Incorporation country' }).click();
        await this.page.getByText('India', { exact: true }).click();
        await this.page.locator('h1').click();
        await this.page.getByLabel('Number of employees').fill(await getprojectdetails('projectEmployees', projectApproach));
        await this.page.getByLabel('Number of landowners').fill(await getprojectdetails('projectLandowners', projectApproach));
        await this.page.getByLabel('Number of projects within').fill(await getprojectdetails('organizationExperiencePathway', projectApproach));
        await this.page.getByLabel('Number of total projects').fill(await getprojectdetails('organizationExperienceProjects', projectApproach));
        await this.page.getByLabel('Number of projects with issued credits').fill('5');
        await this.page.getByLabel('Organization history and').fill('org history');
        await this.page.getByLabel('Years of experience developing carbon projects').fill(await getprojectdetails('organizationOperationYears', projectApproach));
    }

    async Generaleligibilityrequirements() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'General eligibility requirements' }).click();
        await this.page.waitForLoadState('networkidle');
        await this.page.getByLabel('Project occurs on eligible').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Project area meets the').fill('test');
        await this.page.getByLabel('Project land can be legally').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Summary of ownership').fill('summary');
        await this.page.getByLabel('Increase in onsite stocking levels above the baseline scenario', { exact: true }).locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Increase in onsite stocking levels above the baseline scenario explanation').click();
        await this.page.getByLabel('Increase in onsite stocking levels above the baseline scenario explanation').fill('increase');
        await this.page.getByLabel('There is no use of non-native').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('There is no manipulation of').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Commercial harvesting at').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByRole('combobox', { name: 'Commercial harvesting' }).click();
        await this.page.getByText('Be certified by FSC, SFI, or').click();
        await this.page.locator('.select-indicator svg').click();
        await this.page.getByLabel('Later occurrence of').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
    }

    async baselineScenario() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Baseline scenario' }).click();
        await this.page.getByLabel('Inventory development overview').fill('inventory');
        await this.page.getByLabel('Inventory analysis and results').fill('inverntory');
        await this.page.getByLabel('Inventory QA/QC procedure').fill('QA');
        await this.page.locator('.radio-group-options > div:nth-child(1) > .radio > .radio-control').check({ force: true });
        await this.page.getByLabel('Stratification procedure and').fill(await getprojectdetails('stratificationProcedure', forcastData));
        await this.page.getByLabel('Growth model overview').fill('groth');
        await this.page.getByLabel('Baseline quantification').fill('baseline');
        await this.page.getByLabel('Baseline harvest schedule').fill('harvest');
        await this.page.getByLabel('Baseline legal constraints').fill('legel');
        await this.page.getByLabel('Baseline management scenario').fill('management');
    }

    async netPresentValue() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Net present value' }).click();
        await this.page.getByRole('combobox', { name: 'Annual discount rate' }).click({ force: true });
        await this.page.getByRole('option', { name: '6%' }).click();
        await this.page.getByLabel('Cost assumptions').fill('test');
        await this.page.getByLabel('Revenue assumptions').fill('test');
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 1000).toString());
        }
        await this.page.getByLabel('NPV calculation overview and').fill('npv');
    }

    async Npvresult() {

        await this.page.locator('input[data-scope="number-input"]').fill();
        await this.page.getByRole('button', { name: 'Save' });
    }

    async projectDesign() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Project design' }).click();
        await this.page.getByLabel('Description of the project').fill(await getprojectdetails('projectActivityVerra', forcastData));
        await this.page.getByLabel('Project harvest schedule').fill(await getprojectdetails('stratificationProcedure', forcastData));
        await this.page.getByLabel('Methodology deviations').fill(await getprojectdetails('deviations', forcastData));
        await this.page.getByLabel('Commercially sensitive').fill(await getprojectdetails('sensitiveInformation', forcastData));
        await this.page.getByLabel('Technology manufacturer or').fill(await getprojectdetails('technologyManufacturer', forcastData));
        await this.page.getByLabel('Project technology and equipment overview').fill(await getprojectdetails('projectDescriptionVerra', forcastData));
    }

    async spatialBoundaries() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Spatial boundaries' }).click();
        await this.page.getByLabel('Prior physical conditions').fill(await getprojectdetails('projectActivityVerra', forcastData));
        await this.page.getByLabel('Detailed description of the').fill(await getprojectdetails('projectActivityVerra', forcastData));
    }

    async systemBoundaries() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'System boundaries' }).click();
        await this.page.getByText('Aboveground live biomass').click();
        await this.page.getByText('Belowground live biomass').click();
        await this.page.getByLabel('Greenhouse gas sources').fill(await getprojectdetails('projectActivityVerra', forcastData));
    }

    async carbonStockSummary() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Carbon stock summary' }).click();
        await this.page.waitForSelector('.ag-center-cols-container');
        const cells = await this.page.$$('.ag-center-cols-container .ag-cell');
        for (let i = 0; i < cells.length; i++) {
            const value = ((i + 1) * 100).toString();
            await cells[i].click();
            await this.page.keyboard.type(value);
        }
        await this.page.getByRole('combobox', { name: 'Biomass estimation technique' }).click({ force: true });
        await this.page.getByText('Generalized allometric').click();
        await this.page.getByLabel('Forecasted baseline and').fill(await getprojectdetails('baselineComments', forcastData));
    }

    async leakageEstimates() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Leakage estimates' }).click();
        await this.page.locator('.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({ force: true });
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 50).toString());
        }
        await this.page.getByLabel('Leakage sources').fill(await getprojectdetails('leakageDescription', forcastData));
        await this.page.getByLabel('Additional comments on').fill(await getprojectdetails('leakageComments', forcastData));
    }

    async uncertaintyDeductionEstimates() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Uncertainty deduction estimates' }).click();
        await this.page.locator('.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 60).toString());
        }
        await this.page.getByLabel('Additional comments on').fill(await getprojectdetails('uncertaintyComments', forcastData));
    }

    async bufferEstimates() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Buffer estimates' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 60).toString());
        }
        await this.page.getByLabel('Project uses an approved risk').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Additional comments on').fill(await getprojectdetails('bufferComments', forcastData));
        await this.page.getByRole('combobox', { name: 'Buffer and risk category' }).click();
        await this.page.getByText('Version 1').click();
    }

    async forecastedCredits() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Forecasted credits' }).click();
        await this.page.locator('.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Total credit forecast').fill(await getprojectdetails('projectActivityVerra', forcastData));
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 40).toString());
        }
        await this.page.getByLabel('Additional comments on').fill(await getprojectdetails('forecastComments', forcastData));
    }

    async monitoringplan() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Monitoring plan' }).click();
        await this.page.getByLabel('MRV protocol and monitoring').fill(await getprojectdetails('monitoringPlan', forcastData));
        await this.page.getByLabel('Parameters monitored').fill(await getprojectdetails('dataParameters', forcastData));
        await this.page.getByLabel('Data processing and storage').fill(await getprojectdetails('dataProcess', forcastData));
        await this.page.getByLabel('Assessment of environmental').fill(await getprojectdetails('projectActivityVerra', forcastData));
    }

    async durability() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Durability' }).click();
        await this.page.getByRole('combobox', { name: 'Unintentional or unavoidable' }).click();
        await this.page.getByText('Fire', { exact: true }).click();
        await this.page.getByText('Drought').click();
        await this.page.getByText('Pest and disease', { exact: true }).click();
        await this.page.getByRole('heading', { name: 'Durability' }).click();
        await this.page.getByLabel('Reversal risk assessment').fill(await getprojectdetails('reversalRiskOther', forcastData));
        await this.page.getByLabel('Risk assessment summary').fill(await getprojectdetails('projectActivityVerra', forcastData));
        await this.page.locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Risk management plan', { exact: true }).fill(await getprojectdetails('riskPlan', forcastData));
        await this.page.getByRole('combobox', { name: 'Reversal risk mitigation' }).click();
        await this.page.getByText('Pooled buffer reserves', { exact: true }).click();
        await this.page.getByRole('heading', { name: 'Durability' }).click();
        await this.page.getByLabel('Mitigation strategy for intentional/avoidable reversal risk').fill(await getprojectdetails('projectActivityVerra', forcastData));
        await this.page.getByLabel('Mitigation strategy for unintentional/unavoidable reversal risk').fill(await getprojectdetails('projectActivityVerra', forcastData));
        // await this.page.getByLabel('Insurance policy issuer and').fill(await getprojectdetails('insuranceOwner', forcastData));
    }

    async Additionality() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Additionality' }).click();
        await this.page.getByRole('combobox', { name: 'Additionality approaches used' }).click();
        await this.page.getByText('Common practice / penetration', { exact: true }).click();
        await this.page.getByText('Prior consideration of carbon credits').click();
        await this.page.getByRole('heading', { name: 'Additionality', exact: true }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(2) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').check();
        await this.page.getByLabel('Additionality validation body').click();
        await this.page.getByLabel('Additionality validation body').fill(await getprojectdetails('projectActivityVerra', forcastData));
        await this.page.getByLabel('The project demonstrates a').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Threshold or maximum adoption').click();
        await this.page.getByLabel('Threshold or maximum adoption').fill(await getprojectdetails('projectActivityVerra', forcastData));
        await this.page.getByLabel('Common practice test details').click();
        await this.page.getByLabel('Common practice test details').fill(await getprojectdetails('projectActivityVerra', forcastData));
        await this.page.getByLabel('Carbon credits considered').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Details of prior').click();
        await this.page.getByLabel('Details of prior').fill(await getprojectdetails('projectActivityVerra', forcastData));
    }

    async Validation() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Validation' }).click();
        await this.page.locator('.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Validation body').fill(await getprojectdetails('validationBody', forcastData));
        await this.page.getByLabel('Last validation date').fill(await getprojectdetails('validationDate', forcastData));
    }

    async ProjectandMRUpdates() {
        await this.page.locator('.menu.menu-root > div:nth-child(4)').click();
        await this.page.getByRole('link', { name: 'Project and MRV updates' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(3) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Stratification comments and').fill(await getprojectdetails('mrvResultsLinks', actualsData));
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('MRV results external links').fill(await getprojectdetails('mrvResultsLinks', actualsData));
        await this.page.getByLabel('MRV provider(s)').fill(await getprojectdetails('mrvProvider', actualsData));
    }

    async actualsDurability() {
        await this.page.locator('.menu.menu-root > div:nth-child(4)').click();
        await this.page.getByRole('link', { name: 'Durability' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Description of risk').fill(await getprojectdetails('compensationMechanismDescription', actualsData));
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(4) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByRole('combobox', { name: 'Type of reversal event(s)' }).click();
        await this.page.getByText('Natural causes').click();
        await this.page.getByText('Human causes').click();
        await this.page.getByRole('heading', { name: 'Durability' }).click();
        await this.page.getByLabel('Additional details on').click();
        await this.page.getByLabel('Additional details on').fill(await getprojectdetails('reversalEventTypeOther', actualsData));
        await this.page.getByLabel('Reversals reported and').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.locator('label').filter({ hasText: 'In process' }).locator('div').click();
    }

    async actualscarbonStockSummary() {
        await this.page.locator('.menu.menu-root > div:nth-child(4)').click();
        await this.page.getByRole('link', { name: 'Carbon stock summary' }).click();
        await this.page.waitForSelector('input[id^="number-input::r"]:visible');
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 40).toString());
        }
    }

    async actualsLeakageactuals() {
        await this.page.locator('.menu.menu-root > div:nth-child(4)').click();
        await this.page.getByRole('link', { name: 'Leakage actuals' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByRole('combobox', { name: 'Market leakage approach' }).click();
        await this.page.getByRole('option', { name: 'Default values' }).click();
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 40).toString());
        }
        await this.page.getByLabel('Project exhibits activity-').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Activity-shifting leakage quantification approach').fill(await getprojectdetails('mrvResultsLinks', actualsData));
    }

    async actualsUncertaintyactuals() {
        await this.page.locator('.menu.menu-root > div:nth-child(4)').click();
        await this.page.getByRole('link', { name: 'Uncertainty actuals' }).click();
        await this.page.waitForSelector('.ag-center-cols-container');
        const cells = await this.page.$$('.ag-center-cols-container .ag-cell');
        for (let i = 0; i < cells.length; i++) {
            const value = ((i + 1) * 100).toString();
            await cells[i].click();
            await this.page.keyboard.type(value);
        }
        await this.page.getByLabel('Overview of uncertainty calculation').fill(await getprojectdetails('mrvResultsLinks', actualsData));
    }

    async Bufferactuals() {
        await this.page.locator('.menu.menu-root > div:nth-child(4)').click();
        await this.page.getByRole('link', { name: 'Buffer actuals' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 70).toString());
        }
        await this.page.getByLabel('Overview of buffer determination').fill(await getprojectdetails('additionalCommentsBuffer', actualsData));
        await this.page.getByRole('combobox', { name: 'Buffer and risk category' }).click();
        await this.page.getByText('Version 1').click();
    }

    async actuals() {
        await this.page.locator('.menu.menu-root > div:nth-child(4)').click();
        await this.page.getByRole('link', { name: 'Actuals', exact: true }).click();
        await this.page.waitForSelector('input[id^="number-input::r"]:visible');
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 50).toString());
        }
    }

    async actualsVerification() {
        await this.page.locator('.menu.menu-root > div:nth-child(4)').click();
        await this.page.getByRole('link', { name: 'Verification' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Verification body').fill(await getprojectdetails('verificationBody', actualsData));
        await this.page.getByLabel('Last verification date').fill(await getprojectdetails('verificationDate', actualsData));
        await this.page.getByLabel('Reporting periods').fill(await getprojectdetails('reportingPeriod', actualsData));
        await this.page.getByLabel('Credits issued per reporting').fill(await getprojectdetails('creditsIssuedPeriod', actualsData));
        await this.page.getByLabel('Verification field visit').fill(await getprojectdetails('verificationResampling', actualsData));
    }

    async actualsCreditsales() {
        await this.page.locator('.menu.menu-root > div:nth-child(4)').click();
        await this.page.getByRole('link', { name: 'Credit sales' }).click();
        await this.page.waitForSelector('.ag-center-cols-container');
        const cells = await this.page.$$('.ag-center-cols-container .ag-cell');
        for (let i = 0; i < cells.length; i++) {
            const value = ((i + 1) * 100).toString();
            await cells[i].click();
            await this.page.keyboard.type(value);
        }
        await this.page.getByLabel('Estimated minimum price').fill(await getprojectdetails('estimatedPriceMin', actualsData));
        await this.page.getByLabel('Estimated maximum price').fill(await getprojectdetails('estimatedPriceMax', actualsData));
        await this.page.getByRole('combobox', { name: 'Credit sales type' }).click();
        await this.page.getByText('Spot', { exact: true }).click();
        await this.page.getByRole('heading', { name: 'Credit sales' }).click();
        await this.page.getByLabel('Carbon credit buyers').fill(await getprojectdetails('carbonCreditBuyer', actualsData));
    }

    async Involuntarydisplacement() {
        await this.page.locator('.menu.menu-root > div:nth-child(6)').click();
        await this.page.getByRole('link', { name: 'Involuntary displacement' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('If "Yes", potential economic').fill(await getprojectdetails('economicDisplacementExplain', projectApproach));
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(3) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Expected physical').fill(await getprojectdetails('physicalDisplacementExplain', projectApproach));
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(3) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({ force: true });
        await this.page.getByLabel('Details of mitigation plan to').fill(await getprojectdetails('physicalMitigationDetails', projectApproach));
    }

    async StakeholderIdentification() {
        await this.page.locator('.menu.menu-root > div:nth-child(6)').click();
        await this.page.getByRole('link', { name: 'Stakeholder identification' }).click();
        await this.page.getByLabel('Communities and other').fill(await getprojectdetails('communityDescription', projectApproach));
        await this.page.getByLabel('Stakeholder identification').fill(await getprojectdetails('stakeholderIdentificationProcess', projectApproach));
        await this.page.getByLabel('Details on expected impacts').fill(await getprojectdetails('communityImpactDetails', projectApproach));
    }

    async StakeholderConsultation() {
        await this.page.locator('.menu.menu-root > div:nth-child(6)').click();
        await this.page.getByRole('link', { name: 'Stakeholder consultation' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Stakeholder consultation details').fill(await getprojectdetails('consultationDetails', projectApproach));
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(2) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Date by which grievance').fill(await getprojectdetails('grievanceDate', projectApproach));
        await this.page.getByLabel('Details and evidence of').fill(await getprojectdetails('economicDisplacementGrievanceUpload', projectApproach));
    }

    async StakeholderEngagement() {
        await this.page.locator('.menu.menu-root > div:nth-child(6)').click();
        await this.page.getByRole('link', { name: 'Stakeholder engagement' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({ force: true });
        await this.page.getByLabel('Stakeholder engagement details').click({ force: true });
        await this.page.getByLabel('Stakeholder engagement details').fill(await getprojectdetails('stakeholderEngagementDetails', projectApproach));
    }

    async BenefitSharing() {
        await this.page.locator('.menu.menu-root > div:nth-child(6)').click();
        await this.page.getByRole('link', { name: 'Benefit sharing' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({ force: true });
        await this.page.getByLabel('Benefit sharing model explanation').fill(await getprojectdetails('benefitSharingExplanation', projectApproach));
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(3) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Details on money sharing').fill(await getprojectdetails('moneySharing', projectApproach));
        await this.page.getByLabel('Payments made to date').fill(await getprojectdetails('payementsMade', projectApproach));
        await this.page.getByLabel('Payment method').fill(await getprojectdetails('paymentsMethod', projectApproach));
        await this.page.getByLabel('Fair trade minimum price').fill(await getprojectdetails('fairTradeMinimumPrice', projectApproach));
        await this.page.getByLabel('Transaction is enabled by').locator('label').filter({ hasText: 'No' }).locator('div').click();
    }

    async EquityAndsocialInclusion() {
        await this.page.locator('.menu.menu-root > div:nth-child(6)').click();
        await this.page.getByRole('link', { name: 'Equity and social inclusion' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({ force: true });
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(2) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({ force: true });
        await this.page.getByLabel('Project impacts on the identified social groups').fill(await getprojectdetails('deiDetails', projectApproach));
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(4) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Equality and inclusion').fill(await getprojectdetails('deiBenefitSharing', projectApproach))
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(3) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Project mitigation of women').fill(await getprojectdetails('deiMonitoringPlan', projectApproach))
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(5) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(6) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(7) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(5) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Indigenous, tribal, and/or local community stewards have been identified for').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Indigenous people and/or').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Project contains explicit').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Length of project contract').fill(await getprojectdetails('carbonContractLength', projectApproach));
        await this.page.getByLabel('Publicly available').fill(await getprojectdetails('contractPublic', projectApproach));
        await this.page.getByLabel('Penalty clauses on the').fill(await getprojectdetails('contractPenalty', projectApproach));
        await this.page.getByLabel('Data collection does not').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Data integration into free,').fill(await getprojectdetails('specialMeasureDetails', projectApproach));
        await this.page.getByLabel('Benefit sharing agreement in').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByRole('combobox', { name: 'Benefit sharing type offered' }).click();
        await this.page.getByText('Monetary incentives - Community funds').click();
        await this.page.getByRole('heading', { name: 'Equity and social inclusion' }).click();
        await this.page.getByLabel('Current or projected % of').fill(await getprojectdetails('iplcOwnershipPercent', projectApproach));
        await this.page.getByLabel('Projected % sale price going').fill(await getprojectdetails('compensationPercent', projectApproach));
        await this.page.getByRole('combobox', { name: 'Frequency of payments to' }).click();
        await this.page.getByText('Weekly').click();
    }

    async Air() {
        await this.page.locator('.menu.menu-root > div:nth-child(7)').click();
        await this.page.getByRole('link', { name: 'Air' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({ force: true });
        await this.page.getByRole('combobox', { name: 'Domains included in the air' }).click();
        await this.page.getByText('Indoor air pollution', { exact: true }).click();
        await this.page.getByRole('heading', { name: 'Air' }).click();
        await this.page.getByLabel('Description of air pollution').fill(await getprojectdetails('airMonitoringDescription', projectApproach));
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(4) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Description of baseline air').fill(await getprojectdetails('airBaselineDescription', projectApproach));
        await this.page.getByRole('combobox', { name: 'Project pollutants monitored' }).click();
        await this.page.getByText('Ozone').click();
        await this.page.getByText('NOx', { exact: true }).click();
        await this.page.getByRole('heading', { name: 'Air' }).click();
        await this.page.getByLabel('Project monitors human').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Monitoring frequency of').fill(await getprojectdetails('airMonitoringBaselineFrequency', projectApproach));
        await this.page.getByLabel('Pollutant monitoring mechanism').fill(await getprojectdetails('airMonitoringMechanism', projectApproach));
        await this.page.getByLabel('Human exposure monitoring').fill(await getprojectdetails('exposureMonitoringMechanism', projectApproach));
        await this.page.getByLabel('Project impacts on indoor air').fill(await getprojectdetails('indoorAirDetails', projectApproach));
        await this.page.getByLabel('Ambient and/or indoor air impacts claimed are third-party verified').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Verification body for claimed').fill(await getprojectdetails('airVerificationBody', projectApproach));
    }

    async Biodiversityandsoil() {
        await this.page.locator('.menu.menu-root > div:nth-child(7)').click();
        await this.page.getByRole('link', { name: 'Biodiversity and soil' }).click();
        await this.page.getByRole('combobox', { name: 'Biome type Information icon' }).click({ force: true });
        await this.page.getByText('Tropical and subtropical moist broadleaf forests').click();
        await this.page.getByRole('heading', { name: 'Biodiversity and soil' }).click();
        await this.page.getByRole('combobox', { name: 'Ecosystem categorization' }).click();
        await this.page.getByText('Collapsed').click();
        await this.page.getByRole('heading', { name: 'Biodiversity and soil' }).click();
        await this.page.getByLabel('Description of the biome in').fill(await getprojectdetails('biomeDescription', projectApproach));
        await this.page.getByLabel('Description of the biome risk').fill(await getprojectdetails('biomeRiskCategory', projectApproach));
        await this.page.getByLabel('Project identifies and').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Biodiversity monitoring plan').fill(await getprojectdetails('biodiversityMonitoringProcess', projectApproach));
        await this.page.getByLabel('Details on expected ecosystem').fill(await getprojectdetails('biodiversityImpactDrivers', projectApproach));
        await this.page.getByLabel('Details on expected soil').fill(await getprojectdetails('soilEffects', projectApproach));
        await this.page.getByLabel('Number of species within').fill(await getprojectdetails('speciesNumber', projectApproach));
        await this.page.getByLabel('IUCN threatened and').fill(await getprojectdetails('threatenedSpecies', projectApproach));
        await this.page.getByLabel('Legal framework governing the').fill(await getprojectdetails('biodiversityLegal', projectApproach));
        await this.page.getByLabel('Threatened species data').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByRole('combobox', { name: 'Species selected for tracking' }).click();
        await this.page.getByText('Sentinel species').click();
        await this.page.getByText('Rare species').click();
        await this.page.getByRole('heading', { name: 'Biodiversity and soil' }).click();
        await this.page.getByRole('combobox', { name: 'Species monitoring frequency' }).click();
        await this.page.getByText('Annually', { exact: true }).click();
        await this.page.getByRole('combobox', { name: 'Sampling density (per hectare)' }).click();
        await this.page.getByText('50%').click();
        await this.page.getByLabel('Data is digital and can be').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByRole('combobox', { name: 'Digital collection method' }).click();
        await this.page.getByRole('option', { name: 'Cell phones' }).click();
        await this.page.getByRole('heading', { name: 'Biodiversity and soil' }).click();
        await this.page.getByLabel('Details on species').fill(await getprojectdetails('specieisCollectionMethodDetails', projectApproach));
        await this.page.getByLabel('Reporting timeline and').fill(await getprojectdetails('speciesCollectionResults', projectApproach));
        await this.page.getByLabel('Biodiversity data audit').fill(await getprojectdetails('biodiversityAudit', projectApproach));
    }

    async water() {
        await this.page.locator('.menu.menu-root > div:nth-child(7)').click();
        await this.page.getByRole('link', { name: 'Water' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({ force: true });
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(2) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({ force: true });
        await this.page.getByLabel('Description of water resources monitoring plan').fill(await getprojectdetails('waterMonitorIntention', projectApproach));
        await this.page.getByRole('combobox', { name: 'Expected water impacts as a' }).click();
        await this.page.getByText('Project impacts water quality').click();
        await this.page.getByRole('heading', { name: 'Water' }).click();
        await this.page.getByLabel('Description of expected water').fill(await getprojectdetails('waterLocalDetails', projectApproach));
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(6) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        await this.page.getByLabel('Description of baseline water').fill(await getprojectdetails('waterBaselineDescription', projectApproach));
        await this.page.getByLabel('Monitoring frequency of water').fill(await getprojectdetails('waterMonitoringFrequency', projectApproach));
        await this.page.getByRole('combobox', { name: 'Project-related water' }).click();
        await this.page.getByText('Land conservation and restoration - Land cover restoration').click();
        await this.page.getByText('Water supply reliability - Leak repair').click();
        await this.page.getByRole('heading', { name: 'Water' }).click();
        await this.page.getByLabel('Project uses volumetric water').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByRole('combobox', { name: 'Volumetric Water Benefit (VWB' }).click();
        await this.page.getByText('Avoided runoff').click();
        await this.page.getByText('Increased recharge').click();
        await this.page.getByRole('heading', { name: 'Water' }).click();
        await this.page.getByRole('combobox', { name: 'Applicable complimentary' }).click();
        await this.page.getByText('Crop yield - Mass per area').click();
        await this.page.getByRole('heading', { name: 'Water' }).click();
        await this.page.getByLabel('Rationale for the selected').fill(await getprojectdetails('waterMonitoringIndicatorDetails', projectApproach));
        await this.page.getByLabel('Water benefits claimed are').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Verification body for claimed').fill(await getprojectdetails('waterVerificationBody', projectApproach));
    }

    async saveProjectDetails() {
        const saveButton = this.page.getByRole('button', { name: 'Save' });
        await expect(saveButton).toBeVisible();
        await expect(saveButton).toBeEnabled();
        await saveButton.click({ force: true });
    }

    async Keydifferentiators() {
        await this.page.getByText('Tier 3 - Enhancements').click();
        await this.page.getByRole('link', { name: 'Key differentiators' }).click();
        await this.page.getByLabel('First key differentiator title').fill('test');
        await this.page.getByLabel('Details about the first').fill('test');
        await this.page.getByLabel('Second key differentiator').fill('test');
        await this.page.getByLabel('Details about the second').fill('test');
        await this.page.getByLabel('Third key differentiator title').fill('test');
        await this.page.getByLabel('Details about the third').fill('test');
    }

    async Sustainabledevelopmentgoals() {
        await this.page.getByText('Tier 3 - Enhancements').click();
        await this.page.getByRole('link', { name: 'Sustainable development goals' }).click();
        await this.page.getByRole('combobox', { name: 'Sustainable development goals' }).click();
        await this.page.getByText('SDG 1: No poverty').click();
        await this.page.getByText('SDG 2: Zero hunger').click();
        await this.page.getByRole('heading', { name: 'Sustainable development goals' }).click();
        await this.page.getByLabel('SDG details').fill('test');
        await this.page.locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('SDG verification body').fill('test');
    }

    async completemessage() {
        return await this.page.locator('.btn.btn-solid.btn-primary.btn-md.disabled').innerText();
    }

    async publishButton() {
        return await this.page.getByRole('button', { name: 'Publish', exact: true });
    }

    async draftPublishButton() {
        return await this.page.getByLabel('Current draft').getByRole('button', { name: 'Publish' });
    }

    async shareButton() {
        return await this.page.getByRole('button', { name: 'Share' });
    }

    async unpublishTrigger(){
        return await this.page.locator("button.dropdown-trigger")
    }

    async unPublishButton() {
        return await this.page.getByRole('menuitem', { name: 'Unpublish' });
    }

    async confirmButton() {
        await this.page.getByRole('button', { name: 'Confirm' }).click();
    }

    async removeRoletype() {
        await this.page.getByLabel('Organization', { exact: true }).locator('div').filter({ hasText: /^Form - Basic$/ }).getByRole('button').click();
        await this.page.getByLabel('Organization', { exact: true }).locator('div').filter({ hasText: /^Form - Creator$/ }).getByRole('button').click();
        await this.page.getByRole('button', { name: 'Save changes' }).click({ force: true });
    }

    async resetButton() {
        return await this.page.getByRole('button', { name: 'Reset' });
    }

    async organizationrole() {
        return await this.page.getByRole('combobox', { name: 'Organization role' }).locator('.select-indicator');
    }

    async ViewBasicrole() {
        return await this.page.getByText('View - Basic'); 
    }

   async removeViewBasicrole() {
    return await this.page.getByLabel('Organization', { exact: true }).locator('div').filter({ hasText: /^View - Basic$/ }).getByRole('button');
    }

    async ViewProrole() {
        return await this.page.getByText('View - Pro'); 
    }

   async removeViewProrole() {
    return await this.page.getByLabel('Organization', { exact: true }).locator('div').filter({ hasText: /^View - pro$/ }).getByRole('button');
    }

    async FormBasicrole() {
        return await this.page.getByText('Form - Basic'); 
    }

   async removeFormBasicrole() {
    return await this.page.getByLabel('Organization', { exact: true }).locator('div').filter({ hasText: /^Form - Basic$/ }).getByRole('button');
    }

    async FormProrole() {
        return await this.page.getByText('Form - Pro'); 
    }

   async removeFormProrole() {
    return await this.page.getByLabel('Organization', { exact: true }).locator('div').filter({ hasText: /^Form - Pro$/ }).getByRole('button');
    }

    async FromCreateorrole() {
        return await this.page.getByText('Form - Creator');
    }

    async removefromCreateorrole() {
        return await this.page.getByLabel('Organization', { exact: true }).locator('div').filter({ hasText: /^Form - Creator$/ }).getByRole('button');
    }

    async SaveChanges() {
        return await this.page.getByRole('button', { name: 'Save changes' });
    }

    async projectsHomeButton() {
        return await this.page.locator('a.nav-link[href="/projects"]');
    }

    async listingsButton() {
        return await this.page.locator('a.nav-link[href="/listings"]');
    }

    async SettingsButton() {
        return await this.page.locator('a.nav-link[href="/settings"]');
    }

    async ErrorBoundryPage() {
        return await this.page.locator('.error-boundary');
    }

    async errorContainer() {
        return await this.page.locator('.error-container');
    }

    async Errorbgcontainer() {
        return await this.page.locator('.bg-container');
    }

    async errorContainerHeading() {
        return await this.page.locator('.error-container > h1');
    }

    async errorContainerText() {
        return await this.page.locator('.error-container > p');
    }

    async backToProjectsButton() {
        return await this.page.locator('.actions > button');
    }

    async leftSideBar() {
        return await this.page.locator('.navbar');
    }

    async avatar() {
        return await this.page.locator('.dropdown-trigger');
    }

    async ProjectEmptyState() {
        return await this.page.locator('.projects.empty-state');
    }

    async ProjectEmptyStateTitle() {
        return await this.page.locator('.empty-state-title');
    }

    async ProjectEmptyStateContent() {
        return await this.page.locator('.empty-state-content');
    }

    async createProjectButton() {
        return await this.page.getByRole('button', { name: '+ Create Project' });
    }

    async needHelpButton() {
        return await this.page.getByRole('button', { name: 'Need help' });
    }

    async modal() {
        return await this.page.locator('.modal');
    }

    async modalHeading() {
        return await this.page.getByRole('heading', { name: 'Create new project' });
    }

    async modalClose() {
        return await this.page.locator('.modal-header > button');
    }

    async modalcontent() {
        return await this.page.locator('.modal-content');
    }

    async createProjectForm() {
        return await this.page.locator('.create-project-form');
    }

    async projectName() {
        return await this.page.getByLabel('Project name');
    }

    async projectNameLabel() {
        return await this.page.getByText('Project name');
    }

    async projectNameInput() {
        return await this.page.locator('.input')
    }

    async helperText() {
        return await this.page.locator('.helper-text')
    }

    async methodologyLabel() {
        return await this.page.locator('.label').getByText('Methodology');
    }

    async methodologytrigger() {
        return await this.page.getByRole('combobox', { name: 'Methodology' }).locator('.select-indicator');
    }

    async methodologymenu() {
        return await this.page.locator('.create-project-form > form > :nth-child(2)').locator('.select-menu');
    }

    async methodologymenutext() {
        return await this.page.locator('.create-project-form > form > :nth-child(2)').locator('.select-option-text span');
    }

    async methodologyDropdown() {
        return this.page.getByRole('listbox', { name: 'Methodology' })
    }

    async methodologyselectOption(option) {
        const methodologyDropdown = await this.methodologyDropdown();
        return await methodologyDropdown.getByText(option);
    }

    async projectScaleDropdown() {
        return this.page.getByRole('listbox', { name: 'Project scale' })
    }

    async projectScaleselectOption(option) {
        const projectScaleDropdown = await this.projectScaleDropdown();
        return await projectScaleDropdown.getByText(option);
    }

    async classificationCategoryDropdown() {
        return this.page.getByRole('listbox', { name: 'Classification category' })
    }

    async classificationCategoryselectOption(option) {
        const classificationCategoryDropdown = await this.classificationCategoryDropdown();
        return await classificationCategoryDropdown.getByText(option);
    }

    async classificationMethodDropdown() {
        return this.page.getByRole('listbox', { name: 'Classification Method' })
    }

    async classificationMethodselectOption(option) {
        const classificationMethodDropdown = await this.classificationMethodDropdown();
        return await classificationMethodDropdown.getByText(option);
    }

    async selectedMethodology() {
        return await this.page.locator('.create-project-form > form > :nth-child(2)').locator('.select-value');
    }


    async pojectScaleLabel() {
        return await this.page.locator('.create-project-form > form > :nth-child(3) > .select-label')
    }

    async pojectScaletrigger() {
        return await this.page.locator('.create-project-form > form > :nth-child(3)').locator('.select-trigger');
    }

    async pojectScalemenu() {
        return await this.page.locator('.create-project-form > form > :nth-child(3)').locator('.select-menu');
    }

    async pojectScalemenutext() {
        return await this.page.locator('.create-project-form > form > :nth-child(3)').locator('.select-option-text span');
    }

    async selectedpojectScale() {
        return await this.page.locator('.create-project-form > form > :nth-child(3)').locator('.select-value');
    }

    async classificationCategoryLabel() {
        return await this.page.locator('.create-project-form > form > :nth-child(4) > .select-label')
    }

    async classificationCategorytrigger() {
        return await this.page.locator('.create-project-form > form > :nth-child(4)').locator('.select-trigger');
    }

    async classificationCategorymenu() {
        return await this.page.locator('.create-project-form > form > :nth-child(4)').locator('.select-menu');
    }

    async classificationCategorymenutext() {
        return await this.page.locator('.create-project-form > form > :nth-child(4)').locator('.select-option-text span');
    }

    async selectedclassificationCategory() {
        return await this.page.locator('.create-project-form > form > :nth-child(4)').locator('.select-value');
    }

    async classificationMethodLabel() {
        return await this.page.locator('.create-project-form > form > :nth-child(5) > .select-label')
    }

    async classificationMethodtrigger() {
        return await this.page.locator('.create-project-form > form > :nth-child(5)').locator('.select-trigger');
    }

    async classificationMethodemenu() {
        return await this.page.locator('.create-project-form > form > :nth-child(5)').locator('.select-menu');
    }

    async classificationMethodmenutext() {
        return await this.page.locator('.create-project-form > form > :nth-child(5)').locator('.select-option-text span');
    }

    async selectedclassificationMethod() {
        return await this.page.locator('.create-project-form > form > :nth-child(5)').locator('.select-value');
    }

    async noOption() {
        return await this.page.locator('.no-options');
    }

    async removeCategory() {
        return await this.page.locator('.badge-delete-btn');
    }

    async cancelButton() {
        return await this.page.getByRole('button', { name: 'Cancel' });
    }

    async createButton() {
        return await this.page.getByRole('button', { name: 'Create', exact: true });
    }


    async overviewProject() {
        return await this.page.locator('.project');
    }

    async overviewHeader() {
        return await this.page.locator('.overview-header');
    }

    async overviewtitle() {
        return await this.page.locator('.project-name');
    }

    async projectBreadcrumb() {
        return await this.page.locator('.breadcrumb');
    }

    async projectlist() {
        return await this.page.locator('.project-list')
    }

    async projectCard() {
        return await this.page.locator('.project-card');
    }

    async projectInfo() {
        return await this.page.locator('.project-info');
    }

    async viewProjectButton() {
        return await this.page.getByRole('button', { name: 'View Project' });
    }

    async projectHeading() {
        return await this.page.locator('.header > h1');
    }

    async leftSideBarHeading() {
        return await this.page.locator('.nav-menu > h6');
    }

    async projectOverview() {
        return await this.page.getByRole('link', { name: 'Project overview' });
    }

    async projectOverviewicon() {
        return await this.page.getByRole('link', { name: 'Project overview' }).locator('.menu-item-icon');
    }

    async Provenance() {
        return await this.page.locator('.menu.menu-root > :nth-child(2) > :first-child');
    }

    async ProvenanceText() {
        return await this.page.locator('.menu.menu-root > :nth-child(2) > :first-child').locator('.menu-item-label');
    }

    async Provenanceicon() {
        return await this.page.locator('.menu.menu-root > :nth-child(2) > :first-child').locator('.menu-item-icon');
    }

    async Provenanceindicatoricon() {
        return await this.page.locator('.menu.menu-root > :nth-child(2) > :first-child').locator('.indicator-icon');
    }

    async Provenancecollapsible() {
        return await this.page.locator('.menu.menu-root > :nth-child(2) > :nth-child(2)');
    }

    async Provenancemenu() {
        return await this.page.locator('.menu.menu-root > :nth-child(2) > :nth-child(2) > .menu');
    }

    async ProjectdetailsLink() {
        return await this.page.getByRole('link', { name: 'Project details' });
    }

    async ProjectapproachLink() {
        return await this.page.getByRole('link', { name: 'Project approach' });
    }

    async LocationdetailsLink() {
        return await this.page.getByRole('link', { name: 'Location details' });
    }

    async DisclosuresLink() {
        return await this.page.getByRole('link', { name: 'Disclosures' });
    }

    async SocioeconomicduediligenceLink() {
        return await this.page.getByRole('link', { name: 'Socioeconomic due diligence' });
    }

    async EcologicalduediligenceLink() {
        return await this.page.getByRole('link', { name: 'Ecological due diligence' });
    }

    async OrganizationoverviewLink() {
        return await this.page.getByRole('link', { name: 'Organization overview' });
    }

    async EntitiesinvolvedLink() {
        return await this.page.getByRole('link', { name: 'Entities involved' });
    }


    async Forecast() {
        return await this.page.locator('.menu.menu-root > :nth-child(3) > :first-child');
    }

    async ForecastText() {
        return await this.page.locator('.menu.menu-root > :nth-child(3) > :first-child').locator('.menu-item-label');
    }

    async Forecasticon() {
        return await this.page.locator('.menu.menu-root > :nth-child(3) > :first-child').locator('.menu-item-icon');
    }

    async Forecastindicatoricon() {
        return await this.page.locator('.menu.menu-root > :nth-child(3) > :first-child').locator('.indicator-icon');
    }

    async Forecastcollapsible() {
        return await this.page.locator('.menu.menu-root > :nth-child(3) > :nth-child(2)');
    }

    async Forecastmenu() {
        return await this.page.locator('.menu.menu-root > :nth-child(3) > :nth-child(2) > .menu');
    }

    async GeneraleligibilityrequirementsLink() {
        return await this.page.getByRole('link', { name: 'General eligibility requirements' });
    }

    async BaselinescenarioLink() {
        return await this.page.getByRole('link', { name: 'Baseline scenario' });
    }

    async NetpresentvalueLink() {
        return await this.page.getByRole('link', { name: 'Net present value' });
    }

    async ProjectdesignLink() {
        return await this.page.getByRole('link', { name: 'Project design' });
    }

    async SpatialboundariesLink() {
        return await this.page.getByRole('link', { name: 'Spatial boundaries' });
    }

    async SystemboundariesLink() {
        return await this.page.getByRole('link', { name: 'System boundaries' });
    }

    async CarbonstocksummaryLink() {
        return await this.page.getByRole('link', { name: 'Carbon stock summary' });
    }

    async LeakageestimatesLink() {
        return await this.page.getByRole('link', { name: 'Leakage estimates' });
    }

    async UncertaintyestimatesLink() {
        return await this.page.getByRole('link', { name: 'Uncertainty estimates' });
    }

    async BufferestimatesLink() {
        return await this.page.getByRole('link', { name: 'Buffer estimates' });
    }

    async ForecastedcreditsLink() {
        return await this.page.getByRole('link', { name: 'Forecasted credits' });
    }

    async MonitoringplanLink() {
        return await this.page.getByRole('link', { name: 'Monitoring approach' });
    }

    async DurabilityLink() {
        return await this.page.getByRole('link', { name: 'Durability' });
    }

    async AdditionalityLink() {
        return await this.page.getByRole('link', { name: 'Additionality' });
    }

    async ValidationLink() {
        return await this.page.getByRole('link', { name: 'Validation' });
    }

    async ActualsSection() {
        return await this.page.locator('.menu.menu-root > :nth-child(4) > :first-child');
    }

    async ActualsText() {
        return await this.page.locator('.menu.menu-root > :nth-child(4) > :first-child').locator('.menu-item-label');
    }

    async Actualsicon() {
        return await this.page.locator('.menu.menu-root > :nth-child(4) > :first-child').locator('.menu-item-icon');
    }

    async Actualsindicatoricon() {
        return await this.page.locator('.menu.menu-root > :nth-child(4) > :first-child').locator('.indicator-icon');
    }

    async Actualscollapsible() {
        return await this.page.locator('.menu.menu-root > :nth-child(4) > :nth-child(2)');
    }

    async Actualsmenu() {
        return await this.page.locator('.menu.menu-root > :nth-child(4) > :nth-child(2) > .menu');
    }

    async ProjectandMRVupdatesLink() {
        return await this.page.getByRole('link', { name: 'Project and MRV updates' });
    }

    async LeakageActualsLink() {
        return await this.page.getByRole('link', { name: 'Leakage actuals' });
    }

    async UncertaintyActualsLink() {
        return await this.page.getByRole('link', { name: 'Uncertainty actuals' });
    }

    async BufferActualsLink() {
        return await this.page.getByRole('link', { name: 'Buffer actuals' });
    }

    async ActualsLink() {
        return await this.page.getByRole('link', { name: 'Actuals', exact: true });
    }

    async VerificationLink() {
        return await this.page.getByRole('link', { name: 'Verification' });
    }

    async CreditSalesLink() {
        return await this.page.getByRole('link', { name: 'Credit sales' });
    }

    async SocioeconomicimpactsLink() {
        return await this.page.getByRole('link', { name: 'Socioeconomic impacts' });
    }

    async EcologicalimpactsLink() {
        return await this.page.getByRole('link', { name: 'Ecological impacts' });
    }

    async Enhancements() {
        return await this.page.locator('.menu.menu-root > :nth-child(5) > :first-child');
    }

    async EnhancementsText() {
        return await this.page.locator('.menu.menu-root > :nth-child(5) > :first-child').locator('.menu-item-label');
    }

    async Enhancementsicon() {
        return await this.page.locator('.menu.menu-root > :nth-child(5) > :first-child').locator('.menu-item-icon');
    }

    async Enhancementsindicatoricon() {
        return await this.page.locator('.menu.menu-root > :nth-child(5) > :first-child').locator('.indicator-icon');
    }

    async Enhancementscollapsible() {
        return await this.page.locator('.menu.menu-root > :nth-child(5) > :nth-child(2)');
    }

    async Enhancementsmenu() {
        return await this.page.locator('.menu.menu-root > :nth-child(5) > :nth-child(2) > .menu');
    }

    async KeyDifferentiatorsLink() {
        return await this.page.getByRole('link', { name: 'Key differentiators' });
    }

    async SustainableDevelopmentGoalsLink() {
        return await this.page.getByRole('link', { name: 'Sustainable development goals' });
    }

    async Communityimpacts() {
        return await this.page.locator('.menu.menu-root > :nth-child(6) > :first-child');
    }

    async CommunityimpactsText() {
        return await this.page.locator('.menu.menu-root > :nth-child(6) > :first-child').locator('.menu-item-label');
    }

    async Communityimpactsicon() {
        return await this.page.locator('.menu.menu-root > :nth-child(6) > :first-child').locator('.menu-item-icon');
    }

    async Communityimpactsindicatoricon() {
        return await this.page.locator('.menu.menu-root > :nth-child(6) > :first-child').locator('.indicator-icon');
    }

    async Communityimpactscollapsible() {
        return await this.page.locator('.menu.menu-root > :nth-child(6) > :nth-child(2)');
    }

    async Communityimpactsmenu() {
        return await this.page.locator('.menu.menu-root > :nth-child(6) > :nth-child(2) > .menu');
    }

    async InvoluntaryDisplacementLink() {
        return await this.page.getByRole('link', { name: 'Involuntary displacement' });
    }

    async StakeholderIdentificationLink() {
        return await this.page.getByRole('link', { name: 'Stakeholder identification' });
    }

    async StakeholderConsultationLink() {
        return await this.page.getByRole('link', { name: 'Stakeholder consultation' });
    }

    async StakeholderEngagementLink() {
        return await this.page.getByRole('link', { name: 'Stakeholder engagement' });
    }

    async BenefitSharingLink() {
        return await this.page.getByRole('link', { name: 'Benefit sharing' });
    }

    async EquityAndSocialInclusionLink() {
        return await this.page.getByRole('link', { name: 'Equity and social inclusion' });
    }


    async Ecologicalimpacts() {
        return await this.page.locator('.menu.menu-root > :nth-child(7) > :first-child');
    }

    async EcologicalimpactsText() {
        return await this.page.locator('.menu.menu-root > :nth-child(7) > :first-child').locator('.menu-item-label');
    }

    async Ecologicalimpactsicon() {
        return await this.page.locator('.menu.menu-root > :nth-child(7) > :first-child').locator('.menu-item-icon');
    }

    async Ecologicalimpactsindicatoricon() {
        return await this.page.locator('.menu.menu-root > :nth-child(7) > :first-child').locator('.indicator-icon');
    }

    async Ecologicalimpactscollapsible() {
        return await this.page.locator('.menu.menu-root > :nth-child(7) > :nth-child(2)');
    }

    async Ecologicalimpactsmenu() {
        return await this.page.locator('.menu.menu-root > :nth-child(7) > :nth-child(2) > .menu');
    }

    async AirLink() {
        return await this.page.getByRole('link', { name: 'Air' });
    }

    async BiodiversityAndSoilLink() {
        return await this.page.getByRole('link', { name: 'Biodiversity and soil' });
    }

    async WaterLink() {
        return await this.page.getByRole('link', { name: 'Water' });
    }

    async Supportingdocuments() {
        return await this.page.getByRole('link', { name: 'Supporting documents' });
    }

    async Supportingdocumentsicon() {
        return await this.page.getByRole('link', { name: 'Supporting documents' }).locator('.menu-item-icon');
    }

    async projectBreadcrumbs() {
        return await this.page.locator('.breadcrumbs');
    }

    async projectBreadcrumbsSeparator() {
        return await this.page.locator('.breadcrumb-separator');
    }

    async projectBreadcrumbfirst() {
        return await this.page.locator('.breadcrumbs > :nth-child(1)');
    }

    async projectBreadcrumbsecond() {
        return await this.page.locator('.breadcrumbs > :nth-child(3)');
    }

    async projectOverviewContent() {
        return await this.page.locator('.page-content');
    }

    async previewButton() {
        return await this.page.getByRole('button', { name: 'Preview' });
    }

    async projectOverviewDescription() {
        return await this.page.locator('.overview-description');
    }

    async projectOverviewAccordion() {
        return await this.page.locator('.accordion.info-accordion');
    }

    async projectOverviewAccordionLabel() {
        return await this.page.locator('.label-container');
    }

    async projectOverviewAccordionIndicator() {
        return await this.page.locator('.accordion-item-indicator');
    }

    async projectOverviewAccordionItemContent() {
        return await this.page.locator('.accordion-item-content');
    }

    async projectOverviewguideheader() {
        return await this.page.locator('.guide-header');
    }

    async projectOverviewguideheaderHeading() {
        return await this.page.locator('.guide-header > h2');
    }

    async projectOverviewguideheadercontent() {
        return await this.page.locator('.guide-header > p');
    }

    async projectOverviewguidecontent() {
        return await this.page.locator('.guide-content');
    }

    async projectOverviewguidecontentstep1() {
        return await this.page.locator('.guide-content > :nth-child(1)');
    }

    async projectOverviewguidecontentstep1num() {
        return await this.page.locator('.guide-content > :nth-child(1) > .step-num');
    }

    async projectOverviewguidecontentstep1heading() {
        return await this.page.locator('.guide-content > :nth-child(1) > h3');
    }

    async projectOverviewguidecontentstep1content() {
        return await this.page.locator('.guide-content > :nth-child(1) > p');
    }

    async projectOverviewguidecontentstep2() {
        return await this.page.locator('.guide-content > :nth-child(2)');
    }

    async projectOverviewguidecontentstep2num() {
        return await this.page.locator('.guide-content > :nth-child(2) > .step-num');
    }

    async projectOverviewguidecontentstep2heading() {
        return await this.page.locator('.guide-content > :nth-child(2) > h3');
    }

    async projectOverviewguidecontentstep2content() {
        return await this.page.locator('.guide-content > :nth-child(2) > p');
    }

    async projectOverviewguidecontentstep3() {
        return await this.page.locator('.guide-content > :nth-child(3)');
    }

    async projectOverviewguidecontentstep3num() {
        return await this.page.locator('.guide-content > :nth-child(3) > .step-num');
    }

    async projectOverviewguidecontentstep3heading() {
        return await this.page.locator('.guide-content > :nth-child(3) > h3');
    }

    async projectOverviewguidecontentstep3content() {
        return await this.page.locator('.guide-content > :nth-child(3) > p');
    }


    async projectOverviewtierprogress() {
        return await this.page.locator('.tier-progress');
    }

    async projectOverviewtierprogressheading() {
        return await this.page.locator('.tier-progress > h6');
    }

    async projectOverviewTier0Card() {
        return await this.page.locator('.tier-progress > :nth-child(2)');
    }

    async projectOverviewTier0Cardheader() {
        return await this.page.locator('.tier-progress > :nth-child(2) > .card-header');
    }

    async projectOverviewTier0Cardheading() {
        return await this.page.locator('.tier-progress > :nth-child(2) > .card-header > h3');
    }

    async projectOverviewTier0Cardheadercontent() {
        return await this.page.locator('.tier-progress > :nth-child(2) > .card-header > p');
    }

    async projectOverviewTier0Cardprogressbarcontainer() {
        return await this.page.locator('.tier-progress > :nth-child(2) > .card-body > .progressBarContainer');
    }

    async projectOverviewTier0Cardprogressbar() {
        return await this.page.locator('.tier-progress > :nth-child(2) > .card-body > .progressBarContainer > .progressBarWrapper > .progressBar');
    }

    async projectOverviewTier0CardprogressbarText() {
        return await this.page.locator('.tier-progress > :nth-child(2) > .card-body > span');
    }

    async projectOverviewTier1Card() {
        return await this.page.locator('.tier-progress > :nth-child(3)');
    }

    async projectOverviewTier1Cardheader() {
        return await this.page.locator('.tier-progress > :nth-child(3) > .card-header');
    }

    async projectOverviewTier1Cardheading() {
        return await this.page.locator('.tier-progress > :nth-child(3) > .card-header > h3');
    }

    async projectOverviewTier1Cardheadercontent() {
        return await this.page.locator('.tier-progress > :nth-child(3) > .card-header > p');
    }

    async projectOverviewTier1Cardprogressbarcontainer() {
        return await this.page.locator('.tier-progress > :nth-child(3) > .card-body > .progressBarContainer');
    }

    async projectOverviewTier1Cardprogressbar() {
        return await this.page.locator('.tier-progress > :nth-child(3) > .card-body > .progressBarContainer > .progressBarWrapper');
    }

    async projectOverviewTier1CardprogressbarText() {
        return await this.page.locator('.tier-progress > :nth-child(3) > .card-body > span');
    }

    async projectOverviewTier2Card() {
        return await this.page.locator('.tier-progress > :nth-child(4)');
    }

    async projectOverviewTier2Cardheader() {
        return await this.page.locator('.tier-progress > :nth-child(4) > .card-header');
    }

    async projectOverviewTier2Cardheading() {
        return await this.page.locator('.tier-progress > :nth-child(4) > .card-header > h3');
    }

    async projectOverviewTier2Cardheadercontent() {
        return await this.page.locator('.tier-progress > :nth-child(4) > .card-header > p');
    }

    async projectOverviewTier2Cardprogressbarcontainer() {
        return await this.page.locator('.tier-progress > :nth-child(4) > .card-body > .progressBarContainer');
    }

    async projectOverviewTier2Cardprogressbar() {
        return await this.page.locator('.tier-progress > :nth-child(4) > .card-body > .progressBarContainer > .progressBarWrapper');
    }

    async projectOverviewTier2CardprogressbarText() {
        return await this.page.locator('.tier-progress > :nth-child(4) > .card-body > span');
    }

    async projectOverviewTier3Card() {
        return await this.page.locator('.tier-progress > :nth-child(5)');
    }

    async projectOverviewTier3Cardheader() {
        return await this.page.locator('.tier-progress > :nth-child(5) > .card-header');
    }

    async projectOverviewTier3Cardheading() {
        return await this.page.locator('.tier-progress > :nth-child(5) > .card-header > h3');
    }

    async projectOverviewTier3Cardheadercontent() {
        return await this.page.locator('.tier-progress > :nth-child(5) > .card-header > p');
    }

    async projectOverviewTier3Cardprogressbarcontainer() {
        return await this.page.locator('.tier-progress > :nth-child(5) > .card-body > .progressBarContainer');
    }

    async projectOverviewTier3Cardprogressbar() {
        return await this.page.locator('.tier-progress > :nth-child(5) > .card-body > .progressBarContainer > .progressBarWrapper');
    }

    async projectOverviewTier3CardprogressbarText() {
        return await this.page.locator('.tier-progress > :nth-child(5) > .card-body > span');
    }

    async projectOverviewsupportSection() {
        return await this.page.locator('.support');
    }

    async projectOverviewsupportText() {
        return await this.page.locator('.support-text');
    }

    async projectOverviewsupportHeading() {
        return await this.page.locator('.support-text > h4');
    }

    async projectOverviewsupportParagraph() {
        return await this.page.locator('.support-text > p');
    }

    async projectOverviewhelpButton() {
        return await this.page.getByRole('button', { name: 'Help & Support' });
    }

    async summaryOfUpdates(){
        return await this.page.getByLabel('Summary of updates');
    }
}

module.exports = { ProjectsPage };
import { actualsData, forcastData, projectApproach } from "../tests/data/projectData";
import { API_BASE_URL } from "../tests/data/testData";

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
        await this.page.locator('input.autocomplete-input[data-part="input"]').fill(organization);
        await this.page.locator('.autocomplete-option').click();
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
        const rowLocator = await this.page.locator(`.tabs >div:nth-child(4)> .team-tab >.editable-table >table:nth-child(1) > tbody:nth-child(2) > tr:has(:text("${targetEmail}"))`);
        await rowLocator.locator('button').nth(0).click({force: true});
        await this.page.getByRole('combobox', { name: 'Member type' }).click();
        await this.page.getByLabel('Edit Member').getByText('Admin').click();
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
        if (name == "Approve") {
            return await this.page.getByRole('row', { name: email }).locator('.approve-request .btn-solid.btn-primary.btn-sm').click();
        } else {
            return await this.page.getByRole('row', { name: email }).locator('.approve-request .btn-outline.btn-primary.btn-sm').click();
        }
    }

    async createProject(ProjectName) {
        await this.page.getByRole('button', { name: '+ Create Project' }).click();
        await this.page.locator('.input').fill(ProjectName);
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

    async porjectTitle() {
        return await this.page.locator('.overview-title').innerText();
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
        await this.page.getByLabel('Project registry link').fill(await getprojectdetails('projectRegistryLink',projectApproach));
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
        await this.page.locator('.radio-group.field.half-width > .radio-group-options > div:nth-child(1) > .radio > .radio-control').check({force:true});
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
        await this.page.getByLabel('Years of operation').fill(await getprojectdetails('organizationOperationYears', projectApproach));
    }

    async projectEligibilityRequirements() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Project eligibility' }).click();
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
        await this.page.getByRole('heading', { name: 'Project eligibility' }).click();
        await this.page.getByLabel('Later occurrence of').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
 }

    async baselineScenario() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Baseline scenario' }).click();
        await this.page.getByLabel('Inventory development overview').fill('inventory');
        await this.page.getByLabel('Inventory analysis and results').fill('inverntory');
        await this.page.getByLabel('Inventory QA/QC procedure').fill('QA');
        await this.page.locator('.radio-group-options > div:nth-child(1) > .radio > .radio-control').check({force:true});
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
        await this.page.getByRole('combobox', { name: 'Annual discount rate' }).click({force: true});
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
        await this.page.waitForSelector('input[id^="number-input::r"]:visible');
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 100).toString()); 
        }
        await this.page.getByRole('combobox', { name: 'Biomass estimation technique' }).click({force:true});
        await this.page.getByText('Generalized allometric').click();
        await this.page.getByLabel('Forecasted baseline and').fill(await getprojectdetails('baselineComments', forcastData));
    }

    async leakageEstimates() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Leakage estimates' }).click();
        await this.page.locator('.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({force: true});
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
        await this.page.getByLabel('Crediting period forecast').fill(await getprojectdetails('projectActivityVerra', forcastData));
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 40).toString()); 
        }
        await this.page.getByLabel('Additional comments on').fill(await getprojectdetails('forecastComments', forcastData));
    }

    async monitoringApproach() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Monitoring approach' }).click();
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
        await this.page.getByLabel('Additional comments on').fill(await getprojectdetails('reversalRiskOther', forcastData));
        await this.page.getByLabel('Risk assessment summary').fill(await getprojectdetails('projectActivityVerra', forcastData));
        await this.page.locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Risk management plan', { exact: true }).fill(await getprojectdetails('riskPlan', forcastData));
        await this.page.getByRole('combobox', { name: 'Reversal risk mitigation' }).click();
        await this.page.getByText('Pooled buffer reserves', { exact: true }).click();
        await this.page.getByRole('heading', { name: 'Durability' }).click();
        await this.page.getByLabel('Mitigation strategy for intentional/avoidable reversal risk').fill(await getprojectdetails('projectActivityVerra', forcastData));
        await this.page.getByLabel('Mitigation strategy for unintentional/unavoidable reversal risk').fill(await getprojectdetails('projectActivityVerra', forcastData));
        await this.page.getByLabel('Insurance policy issuer and').fill(await getprojectdetails('insuranceOwner', forcastData));
    }

    async Additionality() {
        await this.page.locator('.menu.menu-root > div:nth-child(3)').click();
        await this.page.getByRole('link', { name: 'Additionality' }).click();
        await this.page.getByRole('combobox', { name: 'Additionality approaches used' }).click();
        await this.page.getByText('Common practice / penetration', { exact: true }).click();
        await this.page.getByText('Consideration of prior carbon').click();
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
        await this.page.waitForSelector('input[id^="number-input::r"]:visible');
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 50).toString()); 
        }
        await this.page.getByLabel('Additional comments on actual').fill(await getprojectdetails('mrvResultsLinks', actualsData));
   }

    async Bufferactuals() {
        await this.page.locator('.menu.menu-root > div:nth-child(4)').click();
        await this.page.getByRole('link', { name: 'Buffer actuals' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click();
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 70).toString()); 
        }
        await this.page.getByLabel('Additional comments on buffer').fill(await getprojectdetails('additionalCommentsBuffer', actualsData));
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
        await this.page.waitForSelector('input[id^="number-input::r"]:visible');
        const inputs = await this.page.$$('input[id^="number-input::r"]');
        for (let i = 0; i < inputs.length; i++) {
            await inputs[i].fill(((i + 1) * 60).toString()); // Example value: 1000, 2000, etc.
        }
        await this.page.getByLabel('Estimated minimum price').fill(await getprojectdetails('estimatedPriceMin', actualsData));
        await this.page.getByLabel('Estimated maximum price').fill(await getprojectdetails('estimatedPriceMax', actualsData));
        await this.page.getByRole('combobox', { name: 'Credit sales stage' }).click();
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
        await this.page.locator('.step > :nth-child(2) > :nth-child(3) > .field-group > .fields > div:nth-child(3) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({force: true});
        await this.page.getByLabel('Details of mitigation plan to').fill(await getprojectdetails('physicalMitigationDetails', projectApproach));
    }

    async StakeholderIdentification() {
        await this.page.locator('.menu.menu-root > div:nth-child(6)').click();
        await this.page.getByRole('link', { name: 'Stakeholder identification' }).click();
        await this.page.getByLabel('Communities and other').fill(await getprojectdetails('communityDescription',projectApproach));
        await this.page.getByLabel('Stakeholder identification').fill(await getprojectdetails('stakeholderIdentificationProcess', projectApproach));
        await this.page.getByLabel('Details on expected impacts').fill(await getprojectdetails('communityImpactDetails',projectApproach));
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
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({force: true});
        await this.page.getByLabel('Stakeholder engagement details').click({force:true});
        await this.page.getByLabel('Stakeholder engagement details').fill(await getprojectdetails('stakeholderEngagementDetails', projectApproach));
    }

    async BenefitSharing() {
        await this.page.locator('.menu.menu-root > div:nth-child(6)').click();
        await this.page.getByRole('link', { name: 'Benefit sharing' }).click();
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({force:true});
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
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({force:true});
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(2) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({force:true});
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
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({force:true});
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
        await this.page.getByLabel('Ambient and indoor air impacts claimed are third-party verified').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Verification body for claimed').fill(await getprojectdetails('airVerificationBody', projectApproach));
    }

    async Biodiversityandsoil() {
        await this.page.locator('.menu.menu-root > div:nth-child(7)').click();
        await this.page.getByRole('link', { name: 'Biodiversity and soil' }).click();
        await this.page.getByRole('combobox', { name: 'Biome type Information icon' }).click({force:true});
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
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(1) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({force: true});
        await this.page.locator('.step > :nth-child(2) > :nth-child(1) > .field-group > .fields > div:nth-child(2) >.radio-group-options >div:nth-child(1)> .radio > .radio-control').click({force: true});
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
        await this.page.getByLabel('Rationale for the selected').fill(await getprojectdetails('waterMonitoringIndicatorDetails',projectApproach));
        await this.page.getByLabel('Water benefits claimed are').locator('label').filter({ hasText: 'Yes' }).locator('div').click();
        await this.page.getByLabel('Verification body for claimed').fill(await getprojectdetails('waterVerificationBody', projectApproach));
    }

    async saveProjectDetails() {
        await this.page.getByRole('button', { name: 'Save' }).click({ force: true });
    }

    async Keydifferentiators(){
        await this.page.getByText('Tier 3 - Enhancements').click();
        await this.page.getByRole('link', { name: 'Key differentiators' }).click();
        await this.page.getByLabel('First key differentiator title').fill('test');
        await this.page.getByLabel('Details about the first').fill('test');
        await this.page.getByLabel('Second key differentiator').fill('test');
        await this.page.getByLabel('Details about the second').fill('test');
        await this.page.getByLabel('Third key differentiator title').fill('test');
        await this.page.getByLabel('Details about the third').fill('test');
    }

    async Sustainabledevelopmentgoals(){
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
        return await this.page.getByRole('button', { name: 'Publish' });
    }

    async shareButton() {
        return await this.page.getByRole('button', { name: 'Share' });
    }

    async unPublishButton() {
        return await this.page.getByRole('button', { name: 'Unpublish' });
    }

    async confirmButton() {
        await this.page.getByRole('button', { name: 'Confirm' }).click();
    }

    async removeRoletype() {
        await this.page.getByLabel('Organization', { exact: true }).locator('div').filter({ hasText: /^Form - Basic$/ }).getByRole('button').click();
        await this.page.getByLabel('Organization', { exact: true }).locator('div').filter({ hasText: /^Form - Creator$/ }).getByRole('button').click();
        await this.page.getByRole('button', { name: 'Save changes' }).click({force: true});
    }
  

} 

module.exports = { ProjectsPage };
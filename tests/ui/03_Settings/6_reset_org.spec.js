import { test, expect } from "@playwright/test";
import { ProjectsPage } from "../../../pages/projectsPage";
import { Credentials, projectValidationCredentials } from "../../data/testData";
import { FeatureFlags } from "../../../pages/feature_Flags";
import { LoginPage } from "../../../pages/loginPage";


test.describe('reset organization - Jedi Panel', { tag: '@UI' }, () => {

    // Test fixtures and page objects
    let page;
    let loginPage;
    let projectsPage;
    let featureFlags;

    test.beforeAll(async ({ browser, baseURL }) => {
        // Initialize browser context and page
        const context = await browser.newContext();
        page = await context.newPage();

        // Initialize page objects
        loginPage = new LoginPage(page, baseURL);
        projectsPage = new ProjectsPage(page, baseURL);
        featureFlags = new FeatureFlags(page, baseURL);

        // Perform login sequence
        await loginPage.navigate();
        await loginPage.login(Credentials.username, Credentials.password);

        // Wait for successful navigation to projects page
        await page.waitForURL('**/projects');

        // Ensure Jedi panel is accessible for settings navigation
        const jediPanel = await projectsPage.jediPanel();
        if (!(await jediPanel.isVisible())) {
            const jediPanelTrigger = await projectsPage.jediPanelTrigger();
            await expect(jediPanelTrigger).toBeVisible();
            await jediPanelTrigger.click();
        }
    });

    // Cleanup after all tests
    test.afterAll(async () => {
        await page.close();
    });


    test('Should reset organization after switch the another organization', async () => {
        let memberOrgId;
        // change the organization and navigate to the settings - organization page
        await projectsPage.selectOrg(projectValidationCredentials.organizationName);

        const response = await page.waitForResponse(response =>
            response.url().includes('/member-organizations') && response.status() === 200
        );
        const data = await response.json();
        const result = data.find(item => item.organizationId === projectValidationCredentials.organizationId);

        memberOrgId = result.id;
        console.log('Member Organization ID:', memberOrgId);

        await expect(await projectsPage.selectOrgInput()).toHaveValue(projectValidationCredentials.organizationName);

        const resetButton = await projectsPage.resetButton();
        await resetButton.click();
        await page.waitForResponse(
                res => res.url().includes(`/${memberOrgId}`) && res.status() === 204
            );
            
        // Wait for the API after reset
        const resetResponse = await page.waitForResponse(res =>
            res.url().includes('/member-organizations') && res.status() === 200
        );
        const resetData = await resetResponse.json();

        // Assert that the previous memberOrgId is NOT present in the new response
        const existsAfterReset = resetData.some(item => item.id === memberOrgId);
        expect(existsAfterReset).toBeFalsy();

        await expect(await projectsPage.selectOrgInput()).toBeVisible();
        await expect(await projectsPage.selectOrgInput()).toHaveValue('GreenTest');

    });

    test('Logout organization after switch the another organization', async () => {
        let memberOrgId;
        // change the organization and navigate to the settings - organization page
        await projectsPage.selectOrg(projectValidationCredentials.organizationName);

        const response = await page.waitForResponse(response =>
            response.url().includes('/member-organizations') && response.status() === 200
        );
        const data = await response.json();
        const result = data.find(item => item.organizationId === projectValidationCredentials.organizationId);

        memberOrgId = result.id;
        console.log('Member Organization ID:', memberOrgId);

        await expect(await projectsPage.selectOrgInput()).toHaveValue(projectValidationCredentials.organizationName);

        await loginPage.superUserLogout();
        await page.reload();

        await loginPage.login(Credentials.username, Credentials.password);

        // Wait for the API after reset
        const resetResponse = await page.waitForResponse(res =>
            res.url().includes('/member-organizations') && res.status() === 200
        );
        const resetData = await resetResponse.json();

        // Assert that the previous memberOrgId is NOT present in the new response
        const existsAfterReset = resetData.some(item => item.id === memberOrgId);
        expect(existsAfterReset).toBeFalsy();

        await expect(await projectsPage.selectOrgInput()).toBeVisible();
        await expect(await projectsPage.selectOrgInput()).toHaveValue('GreenTest');

    });
    

});
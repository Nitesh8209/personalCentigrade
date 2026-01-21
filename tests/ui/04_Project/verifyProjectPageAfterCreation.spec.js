const { test, expect } = require('@playwright/test');
import path from "path";
import { LoginPage } from "../../../pages/loginPage";
import { ProjectsPage } from "../../../pages/projectsPage";
import { project } from "../../data/projectData";
import { safeExpect } from "../../utils/authHelper";
import { projectValidationCredentials } from "../../data/testData";

test.describe('Project Page', { tag: ['@projectFormUi', '@UI'] }, () => {

  let page;

  test.beforeAll(async ({ browser, baseURL }) => {
    const context = await browser.newContext();
    page = await context.newPage();

    const loginPage = new LoginPage(page, baseURL);
    await loginPage.navigate();
    await loginPage.login(projectValidationCredentials.email, projectValidationCredentials.password);

    await page.waitForURL('**/projects');
    const authStoragePath = path.join(__dirname, '..', '..', 'data', 'project-auth-admin.json');
    await page.context().storageState({ path: authStoragePath });
  });

  test('Verify Project Page After Creating a New Project', async ({ baseURL }) => {
    const errors = [];
    const projectsPage = new ProjectsPage(page, baseURL);
    await page.goto(`${baseURL}/projects`);

    await safeExpect('Project Heading Visibility',
      async () => {
        await expect(await projectsPage.projectHeading()).toBeVisible();
        await expect(await projectsPage.projectHeading()).toHaveText('Projects');
      }, errors
    );

    await safeExpect('Create Project Visibility',
      async () => {
        await expect(await projectsPage.createProjectButton()).toBeVisible();
        await expect(await projectsPage.createProjectButton()).toHaveText('+ Create project');
      }, errors
    );

    await safeExpect('Project card Visibility',
      async () => {
        await expect(await projectsPage.projectlist()).toBeVisible();
        await expect(await projectsPage.projectCard()).toBeVisible();
        await expect(await projectsPage.projectInfo()).toBeVisible();
        await expect(await projectsPage.projectInfo()).toHaveText(project.uiProjectName);
      }, errors
    );

    await safeExpect('Project status Visibility',
      async () => {
        await expect(await projectsPage.projectStatus()).toBeVisible();
        await expect(await projectsPage.projectPublishedStatus()).toBeVisible();
        await expect(await projectsPage.projectPublishedStatus()).toHaveText('Not published');
        await expect(await projectsPage.projectMethodologystatus()).toBeVisible();
        await expect(await projectsPage.projectMethodologystatus()).toHaveText('QA-ACR1.3');
        await expect(await projectsPage.projectTimeStatus()).toBeVisible();
        await expect(await projectsPage.projectTimeStatus()).toContainText('Last updated');
      }, errors
    );

    await safeExpect('View Project Visibility',
      async () => {
        await expect(await projectsPage.viewProjectButton()).toBeVisible();
        const button = await projectsPage.viewProjectButton();
        await button.click();
        await expect(await projectsPage.overviewtitle()).toBeVisible({ timeout: 30000 });
        await expect(await projectsPage.projectHeader()).toBeVisible();
      }, errors
    );

    // If there are any errors, fail the test with all collected errors
    if (errors.length > 0) {
      throw new Error('UI verification failed:\n' + errors.join('\n'));
    }

  })

});
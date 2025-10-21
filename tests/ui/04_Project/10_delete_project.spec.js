import { test, expect } from "@playwright/test";
import { LoginPage } from '../../../pages/loginPage';
import { ProjectsPage } from '../../../pages/projectsPage';
import { methodologyOptions, project } from "../../data/projectData";
import { Credentials, projectPublishCredentials } from "../../data/testData";
import { safeExpect } from "../../utils/authHelper";

test.describe('Delete Project Test cases', () => {

  test.describe('create project and delete project by Admin', () => {
    let page;
    let projectsPage;

    test.beforeAll(async ({ browser, baseURL }) => {
      // Initialize browser and login
      const context = await browser.newContext();
      page = await context.newPage();

      const loginPage = new LoginPage(page, baseURL);
      projectsPage = new ProjectsPage(page, baseURL);

      await loginPage.navigate();
      await loginPage.acceptAll();
      await loginPage.login(projectPublishCredentials.email, projectPublishCredentials.password);
      await page.waitForLoadState("networkidle");
    });

    test("Create project and verify it appears in overview", async ({ baseURL }) => {
      const errors = [];

      await safeExpect("Open Create Project Modal", async () => {
        const createProjectButton = await projectsPage.createProjectButton();
        await expect(createProjectButton).toBeVisible();
        await createProjectButton.click();
      }, errors);

      const projectNameField = await projectsPage.projectName();
      const methodologyTrigger = await projectsPage.methodologytrigger();

      await safeExpect("Fill Project Details", async () => {
        await expect(projectNameField).toBeVisible();
        await projectNameField.fill(project.deleteProject);
        await expect(projectNameField).toHaveValue(project.deleteProject);

        await methodologyTrigger.click();
        const selectedMethodology = process.env.METHODOLOGY || methodologyOptions[11];

        const selectmethodologyOptions = await projectsPage.methodologyselectOption(selectedMethodology);
        await selectmethodologyOptions.click();
        await expect(await projectsPage.selectedMethodology()).toHaveText(selectedMethodology);
      }, errors);

      await safeExpect("Save Project and Verify Navigation", async () => {
        const createBtn = await projectsPage.createButton();
        await createBtn.click();
        await page.waitForURL("**/projects/**/overview");
      }, errors);

      if (errors.length > 0) {
        throw new Error("UI verification failed:\n" + errors.join("\n"));
      }
    });

    test('Delete the project by admin', async ({ page }) => {
      const deleteProjectButton = await projectsPage.deleteProjectButtonSuperUser();
      await expect(deleteProjectButton).not.toBeVisible({ timeout: 20000 });
    });

  });

  test.describe('verify should not be delete by member', () => {
    let page;
    let projectsPage;


    test.beforeAll(async ({ browser, baseURL }) => {

      // Initialize browser context and page objects
      const context = await browser.newContext();
      page = await context.newPage();
      const loginPage = new LoginPage(page, baseURL);
      projectsPage = new ProjectsPage(page, baseURL);

      // Perform login and navigate to the project
      await loginPage.navigate();
      await loginPage.acceptAll();

      await loginPage.login(projectPublishCredentials.memberEmail, projectPublishCredentials.password);
      await page.waitForLoadState('networkidle');

    });

    test('Delete the project by member', async ({ page }) => {

      const deleteProjectButton = await projectsPage.deleteProjectButtonSuperUser();
      await expect(deleteProjectButton).not.toBeVisible({ timeout: 20000 });
    });

  });

  test.describe('verify project delete by superUser', () => {
    let page;
    let projectsPage;


    test.beforeAll(async ({ browser, baseURL }) => {

      // Initialize browser context and page objects
      const context = await browser.newContext();
      page = await context.newPage();
      const loginPage = new LoginPage(page, baseURL);
      projectsPage = new ProjectsPage(page, baseURL);

      // Perform login and navigate to the project
      await loginPage.navigate();
      await loginPage.acceptAll();

      await loginPage.login(Credentials.username, Credentials.password);
      await page.waitForLoadState('networkidle');
      await projectsPage.selectOrg(projectPublishCredentials.organizationName);
      await expect(await page.locator('circle').nth(1)).not.toBeVisible();
    });

    test('verify delete project modal and its content', async ({ page }) => {

      const deleteProjectButton = await projectsPage.deleteProjectButtonSuperUser();

      await expect(deleteProjectButton).toBeVisible({ timeout: 20000 });
      await deleteProjectButton.click();

      await expect.soft(await projectsPage.modalInFrame()).toBeVisible();
      await expect.soft(await projectsPage.modalHeaderInFrame()).toBeVisible();
      await expect.soft(await projectsPage.modalHeaderInFrame()).toHaveText('Delete project');
      await expect.soft(await projectsPage.modalCloseInFrame()).toBeVisible();
      await expect.soft(await projectsPage.modalcontentInFrame()).toBeVisible();
      await expect.soft(await projectsPage.modalContentHeading()).toBeVisible();
      await expect.soft(await projectsPage.modalContentHeading()).toHaveText(`Are you sure you want to permanently delete "${project.deleteProject}"?`);
      await expect.soft(await projectsPage.modalContentPeraFirst()).toBeVisible();
      await expect.soft(await projectsPage.modalContentPeraFirst()).toHaveText('Deleting this project will remove it for all users in your organization and erase all project data.');
      await expect.soft(await projectsPage.modalContentPeraSecond()).toBeVisible();
      await expect.soft(await projectsPage.modalContentPeraSecond()).toHaveText('This action cannot be undone.');

      await expect.soft(await projectsPage.cancelButtonInFrame()).toBeVisible();
      await expect.soft(await projectsPage.deleteButton()).toBeVisible();

      const cancelButton = await projectsPage.cancelButtonInFrame();
      await cancelButton.click();

      await expect.soft(await projectsPage.modalInFrame()).not.toBeVisible();

    });

    test('Delete the project by superUser', async ({ page }) => {

      const deleteProjectButton = await projectsPage.deleteProjectButtonSuperUser();

      await expect(deleteProjectButton).toBeVisible({ timeout: 20000 });
      await deleteProjectButton.click();

      await expect.soft(await projectsPage.deleteButton()).toBeVisible();
      const deleteButton = await projectsPage.deleteButton();
      await deleteButton.click();

      await expect.soft(await projectsPage.modalInFrame()).not.toBeVisible();
      await expect.soft(await projectsPage.deletedProjectFromSuperUser()).not.toBeVisible();
    });


  });

})